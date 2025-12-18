#!/usr/bin/env python3
"""
Frontend Deployment Script
Quick deployment of frontend application to existing S3 bucket.
"""

import os
import sys
import subprocess
from pathlib import Path


def run_command(cmd, cwd=None, check=True):
    """Run a shell command and return the result."""
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)
    
    if check and result.returncode != 0:
        raise subprocess.CalledProcessError(result.returncode, cmd)
    
    return result


def deploy_frontend():
    """Deploy the frontend application."""
    # Auto-detect if we're in kb-engine-fe directory or parent directory
    current_dir = Path.cwd()
    
    if current_dir.name == 'kb-engine-fe':
        # We're inside kb-engine-fe directory
        frontend_dir = current_dir
        terraform_dir = current_dir / 'terraform'
    elif (current_dir / 'kb-engine-fe').exists():
        # We're in parent directory
        frontend_dir = current_dir / 'kb-engine-fe'
        terraform_dir = frontend_dir / 'terraform'
    else:
        print(f"❌ Frontend directory not found")
        print("Run this script from either:")
        print("  - The kb-engine-fe directory")
        print("  - The parent directory containing kb-engine-fe")
        return False
    
    print("📦 Building and deploying frontend application...")
    
    # Build the application
    print("Building application...")
    try:
        # Use cmd /c on Windows to find npm
        import platform
        if platform.system() == 'Windows':
            run_command(['cmd', '/c', 'npm', 'run', 'build'], cwd=frontend_dir)
        else:
            run_command(['npm', 'run', 'build'], cwd=frontend_dir)
    except subprocess.CalledProcessError:
        print("❌ Build failed")
        return False
    
    # Check if build directory exists
    build_dir = frontend_dir / 'build'
    if not build_dir.exists():
        print("❌ Build directory not found after build")
        return False
    
    # Check terraform directory
    if not terraform_dir.exists():
        print(f"❌ Terraform directory not found at {terraform_dir}")
        return False
    
    try:
        result = run_command(['terraform', 'output', '-raw', 's3_bucket_name'], cwd=terraform_dir)
        bucket_name = result.stdout.strip()
    except subprocess.CalledProcessError:
        print("❌ Could not get S3 bucket name from terraform")
        print("Make sure infrastructure is deployed first")
        return False
    
    print(f"📤 Uploading to S3 bucket: {bucket_name}")
    
    try:
        # Upload files to S3 with appropriate cache headers
        print("Uploading static assets...")
        run_command([
            'aws', 's3', 'sync', str(build_dir) + '/',
            f's3://{bucket_name}/',
            '--delete',
            '--cache-control', 'public, max-age=31536000, immutable',
            '--exclude', 'index.html',
            '--exclude', 'service-worker.js'
        ])
        
        # Upload index.html with no-cache headers
        print("Uploading index.html...")
        run_command([
            'aws', 's3', 'cp', str(build_dir / 'index.html'),
            f's3://{bucket_name}/',
            '--cache-control', 'no-cache, no-store, must-revalidate'
        ])
        
        # Upload service-worker.js if it exists
        service_worker = build_dir / 'service-worker.js'
        if service_worker.exists():
            print("Uploading service-worker.js...")
            run_command([
                'aws', 's3', 'cp', str(service_worker),
                f's3://{bucket_name}/',
                '--cache-control', 'no-cache, no-store, must-revalidate'
            ])
        
        # Create CloudFront invalidation
        try:
            result = run_command(['terraform', 'output', '-raw', 'cloudfront_distribution_id'], cwd=terraform_dir)
            distribution_id = result.stdout.strip()
            print(f"🔄 Creating CloudFront invalidation...")
            run_command([
                'aws', 'cloudfront', 'create-invalidation',
                '--distribution-id', distribution_id,
                '--paths', '/*'
            ])
            print("✅ CloudFront cache invalidated")
        except subprocess.CalledProcessError:
            print("⚠️  Could not create CloudFront invalidation")
            print("You may need to wait a few minutes for changes to appear")
        
        return True
        
    except subprocess.CalledProcessError:
        print("❌ Upload to S3 failed")
        return False


def main():
    """Main function."""
    print("Frontend Deployment Script")
    print("=" * 30)
    
    # Check AWS CLI
    try:
        run_command(['aws', '--version'])
        print("✅ AWS CLI is available")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ AWS CLI is not installed or not in PATH")
        return 1
    
    # Check AWS credentials
    try:
        run_command(['aws', 'sts', 'get-caller-identity'])
        print("✅ AWS credentials are configured")
    except subprocess.CalledProcessError:
        print("❌ AWS credentials are not configured")
        return 1
    
    # Deploy frontend
    if deploy_frontend():
        print("\n🎉 Frontend deployed successfully!")
        
        # Get CloudFront URL
        try:
            result = run_command(['terraform', 'output', '-raw', 'cloudfront_url'], cwd=terraform_dir, check=False)
            if result.returncode == 0:
                cloudfront_url = result.stdout.strip()
                print(f"\n🌐 Your application is available at: {cloudfront_url}")
        except:
            pass
        
        return 0
    else:
        print("\n❌ Frontend deployment failed")
        return 1


if __name__ == '__main__':
    sys.exit(main())