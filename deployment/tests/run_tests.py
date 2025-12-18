#!/usr/bin/env python3
"""
Test Runner for AWS Infrastructure Property-Based Tests
Runs property-based tests for Terraform configuration validation.
"""

import os
import sys
import subprocess
from pathlib import Path


def setup_environment():
    """Set up test environment variables."""
    # Set default test values if not provided
    os.environ.setdefault('AWS_DEFAULT_REGION', 'us-east-1')
    os.environ.setdefault('TEST_API_DOMAIN', 'api.example.com')
    
    # Ensure AWS credentials are available
    if not any(key in os.environ for key in ['AWS_ACCESS_KEY_ID', 'AWS_PROFILE']):
        print("Warning: No AWS credentials found. Set AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY or AWS_PROFILE")


def install_dependencies():
    """Install test dependencies."""
    requirements_file = Path(__file__).parent / 'requirements.txt'
    if requirements_file.exists():
        print("Installing test dependencies...")
        subprocess.run([
            sys.executable, '-m', 'pip', 'install', '-r', str(requirements_file)
        ], check=True)


def run_property_tests():
    """Run property-based tests."""
    print("Running property-based tests...")
    
    # Run only property tests
    result = subprocess.run([
        sys.executable, '-m', 'pytest', 
        '-m', 'property',
        '--tb=short',
        '-v'
    ], cwd=Path(__file__).parent)
    
    return result.returncode


def main():
    """Main test runner."""
    print("AWS Infrastructure Property-Based Test Runner")
    print("=" * 50)
    
    setup_environment()
    
    try:
        install_dependencies()
        exit_code = run_property_tests()
        
        if exit_code == 0:
            print("\n✅ All property tests passed!")
        else:
            print(f"\n❌ Tests failed with exit code: {exit_code}")
        
        return exit_code
        
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error running tests: {e}")
        return 1
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
        return 130


if __name__ == '__main__':
    sys.exit(main())