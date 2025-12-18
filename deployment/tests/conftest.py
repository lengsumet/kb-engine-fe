# Pytest Configuration and Fixtures
# Shared test configuration and utilities for property-based testing

import os
import tempfile
import shutil
import boto3
import pytest
from pathlib import Path
from python_terraform import Terraform


@pytest.fixture(scope="session")
def terraform_dir():
    """Fixture providing path to Terraform configuration directory."""
    return Path(__file__).parent.parent / "terraform"


@pytest.fixture(scope="session")
def aws_region():
    """Fixture providing AWS region for testing."""
    return os.environ.get("AWS_DEFAULT_REGION", "us-east-1")


@pytest.fixture(scope="session")
def test_api_domain():
    """Fixture providing test API Gateway domain."""
    return os.environ.get("TEST_API_DOMAIN", "api.example.com")


@pytest.fixture
def terraform_workspace(terraform_dir):
    """
    Fixture providing a temporary Terraform workspace for testing.
    Creates a copy of terraform files in a temporary directory.
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_terraform_dir = Path(temp_dir) / "terraform"
        shutil.copytree(terraform_dir, temp_terraform_dir)
        
        # Initialize Terraform in the temporary directory
        tf = Terraform(working_dir=str(temp_terraform_dir))
        tf.init()
        
        yield temp_terraform_dir, tf


@pytest.fixture
def aws_clients(aws_region):
    """Fixture providing AWS service clients for testing."""
    return {
        's3': boto3.client('s3', region_name=aws_region),
        'cloudfront': boto3.client('cloudfront', region_name=aws_region),
        'iam': boto3.client('iam', region_name=aws_region),
    }


def pytest_configure(config):
    """Configure pytest with custom markers."""
    config.addinivalue_line(
        "markers", "property: mark test as a property-based test"
    )
    config.addinivalue_line(
        "markers", "integration: mark test as an integration test"
    )
    config.addinivalue_line(
        "markers", "slow: mark test as slow running"
    )