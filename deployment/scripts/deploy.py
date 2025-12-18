#!/usr/bin/env python3
"""
KB Engine Frontend Deployment Script
====================================

This script automates the deployment of the Knowledge Base Engine frontend
to AWS infrastructure using Terraform and S3/CloudFront.

Features:
- Build React application
- Deploy infrastructure with Terraform
- Upload build files to S3
- Invalidate CloudFront cache
- Comprehensive logging and error handling

Usage:
    python deployment/scripts/deploy.py [--environment dev|staging|prod] [--skip-build] [--skip-terraform]

Requirements:
    - Python 3.7+
    - Node.js and npm
    - AWS CLI configured
    - Terraform installed
"""

import os
import sys
import subprocess
import json
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Optional
import time

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('deployment/logs/deploy.log', encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class DeploymentError(Exception):
    """Custom exception for deployment errors"""
    pass

class FrontendDeployer:
    """Main deployment class for KB Engine Frontend"""
    
    def __init__(self, environment: str = "dev"):
        self.environment = environment
        self.project_root = Path(__file__).parent.parent.parent
        self.terraform_dir = self.project_root / "terraform"
        self.build_dir = self.project_root / "build"
        self.deployment_dir = self.project_root / "deployment"
        
        # Ensure logs directory exists
        (self.deployment_dir / "logs").mkdir(exist_ok=True)
        
        logger.info(f"Initializing deployment for environment: {environment}")
        logger.info(f"Project root: {self.project_root}")
    
    def run_command(self, command: List[str], cwd: Optional[Path] = None, 
                   capture_output: bool = False) -> subprocess.CompletedProcess:
        """Run shell command with error handling"""
        cwd = cwd or self.project_root
        logger.info(f"Running command: {' '.join(command)} in {cwd}")
        
        try:
            result = subprocess.run(
                command,
                cwd=cwd,
                capture_output=capture_output,
                text=True,
                check=True
            )
            if capture_output and result.stdout:
                logger.debug(f"Command output: {result.stdout}")
            return result
        except subprocess.CalledProcessError as e:
            logger.error(f"Command failed: {' '.join(command)}")
            logger.error(f"Error: {e.stderr if e.stderr else str(e)}")
            raise DeploymentError(f"Command failed: {' '.join(command)}")
    
    def check_prerequisites(self) -> None:
        """Check if all required tools are installed"""
        logger.info("Checking prerequisites...")
        
        # Windows-compatible commands
        required_commands = [
            (["node", "--version"], "Node.js"),
            (["npm", "--version"], "npm"),
            (["aws", "--version"], "AWS CLI"),
            (["terraform", "--version"], "Terraform")
        ]
        
        for command, tool_name in required_commands:
            try:
                self.run_command(command, capture_output=True)
                logger.info(f"OK {tool_name} is installed")
            except DeploymentError:
                raise DeploymentError(f"ERROR {tool_name} is not installed or not in PATH")
    
    def install_dependencies(self) -> None:
        """Install npm dependencies"""
        logger.info("Installing npm dependencies...")
        self.run_command(["npm", "ci"])
        logger.info("OK Dependencies installed")
    
    def build_frontend(self) -> None:
        """Build React application"""
        logger.info("Building React application...")
        
        # Set environment variables for build
        env = os.environ.copy()
        env["REACT_APP_ENV"] = self.environment
        env["NODE_ENV"] = "production"
        
        # Run build
        result = subprocess.run(
            ["npm", "run", "build"],
            cwd=self.project_root,
            env=env,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            logger.error(f"Build failed: {result.stderr}")
            raise DeploymentError("Frontend build failed")
        
        if not self.build_dir.exists():
            raise DeploymentError("Build directory not found after build")
        
        logger.info("OK Frontend build completed")
    
    def deploy_infrastructure(self) -> Dict[str, str]:
        """Deploy infrastructure using Terraform"""
        logger.info("Deploying infrastructure with Terraform...")
        
        # Initialize Terraform
        self.run_command(["terraform", "init"], cwd=self.terraform_dir)
        
        # Validate configuration
        self.run_command(["terraform", "validate"], cwd=self.terraform_dir)
        
        # Plan deployment
        self.run_command([
            "terraform", "plan", 
            f"-var=environment={self.environment}",
            "-out=tfplan"
        ], cwd=self.terraform_dir)
        
        # Apply changes
        self.run_command(["terraform", "apply", "tfplan"], cwd=self.terraform_dir)
        
        # Get outputs
        result = self.run_command([
            "terraform", "output", "-json"
        ], cwd=self.terraform_dir, capture_output=True)
        
        outputs = json.loads(result.stdout)
        terraform_outputs = {k: v["value"] for k, v in outputs.items()}
        
        logger.info("OK Infrastructure deployed successfully")
        return terraform_outputs
    
    def upload_to_s3(self, bucket_name: str) -> None:
        """Upload build files to S3 bucket"""
        logger.info(f"Uploading files to S3 bucket: {bucket_name}")
        
        # Upload all files except index.html with long cache
        self.run_command([
            "aws", "s3", "sync", str(self.build_dir), f"s3://{bucket_name}/",
            "--delete",
            "--cache-control", "public, max-age=31536000, immutable",
            "--exclude", "index.html",
            "--exclude", "service-worker.js"
        ])
        
        # Upload index.html with no-cache
        index_file = self.build_dir / "index.html"
        if index_file.exists():
            self.run_command([
                "aws", "s3", "cp", str(index_file), f"s3://{bucket_name}/",
                "--cache-control", "no-cache, no-store, must-revalidate"
            ])
        
        # Upload service-worker.js with no-cache if exists
        sw_file = self.build_dir / "service-worker.js"
        if sw_file.exists():
            self.run_command([
                "aws", "s3", "cp", str(sw_file), f"s3://{bucket_name}/",
                "--cache-control", "no-cache, no-store, must-revalidate"
            ])
        
        logger.info("OK Files uploaded to S3")
    
    def invalidate_cloudfront(self, distribution_id: str) -> None:
        """Invalidate CloudFront cache"""
        logger.info(f"Invalidating CloudFront cache: {distribution_id}")
        
        result = self.run_command([
            "aws", "cloudfront", "create-invalidation",
            "--distribution-id", distribution_id,
            "--paths", "/*"
        ], capture_output=True)
        
        invalidation_data = json.loads(result.stdout)
        invalidation_id = invalidation_data["Invalidation"]["Id"]
        
        logger.info(f"OK Cache invalidation created: {invalidation_id}")
        logger.info("Note: Invalidation may take 5-15 minutes to complete")
    
    def deploy(self, skip_build: bool = False, skip_terraform: bool = False) -> None:
        """Main deployment workflow"""
        start_time = time.time()
        
        try:
            logger.info("Starting KB Engine Frontend deployment...")
            
            # Check prerequisites
            self.check_prerequisites()
            
            # Install dependencies
            self.install_dependencies()
            
            # Build frontend
            if not skip_build:
                self.build_frontend()
            else:
                logger.info("SKIP Skipping frontend build")
            
            # Deploy infrastructure
            if not skip_terraform:
                terraform_outputs = self.deploy_infrastructure()
            else:
                logger.info("SKIP Skipping Terraform deployment")
                # Get existing outputs
                result = self.run_command([
                    "terraform", "output", "-json"
                ], cwd=self.terraform_dir, capture_output=True)
                outputs = json.loads(result.stdout)
                terraform_outputs = {k: v["value"] for k, v in outputs.items()}
            
            # Upload to S3
            bucket_name = terraform_outputs.get("s3_bucket_name")
            if not bucket_name:
                raise DeploymentError("S3 bucket name not found in Terraform outputs")
            
            self.upload_to_s3(bucket_name)
            
            # Invalidate CloudFront
            distribution_id = terraform_outputs.get("cloudfront_distribution_id")
            if distribution_id:
                self.invalidate_cloudfront(distribution_id)
            else:
                logger.warning("CloudFront distribution ID not found, skipping cache invalidation")
            
            # Success summary
            duration = time.time() - start_time
            logger.info("SUCCESS Deployment completed successfully!")
            logger.info(f"TIME Total time: {duration:.2f} seconds")
            
            if "cloudfront_url" in terraform_outputs:
                logger.info(f"URL Application URL: {terraform_outputs['cloudfront_url']}")
            
            # Log CloudWatch information
            if "cloudwatch_log_group_app" in terraform_outputs:
                logger.info(f"LOGS CloudWatch Logs: {terraform_outputs['cloudwatch_log_group_app']}")
            
        except Exception as e:
            logger.error(f"ERROR Deployment failed: {str(e)}")
            raise

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Deploy KB Engine Frontend")
    parser.add_argument(
        "--environment", "-e",
        choices=["dev", "staging", "prod"],
        default="dev",
        help="Deployment environment"
    )
    parser.add_argument(
        "--skip-build",
        action="store_true",
        help="Skip frontend build step"
    )
    parser.add_argument(
        "--skip-terraform",
        action="store_true",
        help="Skip Terraform deployment step"
    )
    
    args = parser.parse_args()
    
    try:
        deployer = FrontendDeployer(args.environment)
        deployer.deploy(
            skip_build=args.skip_build,
            skip_terraform=args.skip_terraform
        )
    except DeploymentError as e:
        logger.error(f"Deployment failed: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        logger.info("Deployment cancelled by user")
        sys.exit(1)

if __name__ == "__main__":
    main()