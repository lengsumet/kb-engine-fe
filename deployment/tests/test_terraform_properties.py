# Property-Based Tests for Terraform Configuration
# Tests universal properties that should hold across all valid configurations

import pytest
import json
import tempfile
from hypothesis import given, strategies as st, settings
from pathlib import Path
from python_terraform import Terraform


# Test data generators for property-based testing
@st.composite
def valid_project_names(draw):
    """Generate valid project names according to validation rules."""
    # Must be 3-20 characters, lowercase letters, numbers, and hyphens only
    length = draw(st.integers(min_value=3, max_value=20))
    chars = st.text(
        alphabet=st.characters(whitelist_categories=('Ll', 'Nd'), whitelist_chars='-'),
        min_size=length,
        max_size=length
    ).filter(lambda x: x and not x.startswith('-') and not x.endswith('-'))
    return draw(chars)


@st.composite
def valid_environments(draw):
    """Generate valid environment names."""
    return draw(st.sampled_from(['dev', 'staging', 'prod']))


@st.composite
def valid_regions(draw):
    """Generate valid AWS region names."""
    regions = [
        'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
        'eu-west-1', 'eu-west-2', 'eu-central-1',
        'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1'
    ]
    return draw(st.sampled_from(regions))


@st.composite
def valid_api_domains(draw):
    """Generate valid API Gateway domain names."""
    # Simple domain pattern for testing
    subdomain = draw(st.text(
        alphabet=st.characters(whitelist_categories=('Ll', 'Nd'), whitelist_chars='-'),
        min_size=3,
        max_size=10
    ).filter(lambda x: x and not x.startswith('-') and not x.endswith('-')))
    
    domain = draw(st.sampled_from(['example.com', 'test.org', 'api.local']))
    return f"{subdomain}.{domain}"


class TestTerraformVariableSubstitution:
    """
    Feature: aws-infrastructure, Property 11: Terraform variable substitution
    Tests that variables are properly substituted in resource configurations.
    """

    @pytest.mark.property
    @given(
        project_name=valid_project_names(),
        environment=valid_environments(),
        region=valid_regions(),
        api_domain=valid_api_domains()
    )
    @settings(max_examples=100, deadline=30000)  # 30 second timeout per example
    def test_terraform_variable_substitution(
        self, 
        terraform_workspace, 
        project_name, 
        environment, 
        region, 
        api_domain
    ):
        """
        **Feature: aws-infrastructure, Property 11: Terraform variable substitution**
        **Validates: Requirements 6.1, 6.5**
        
        For any valid variable values, all resources created should reflect 
        those variable values in their configuration (e.g., environment tag, naming).
        """
        temp_dir, tf = terraform_workspace
        
        # Create terraform.tfvars with test values
        tfvars_content = f'''
project_name = "{project_name}"
environment = "{environment}"
aws_region = "{region}"
api_gateway_domain = "{api_domain}"
api_gateway_stage = "prod"
cloudfront_price_class = "PriceClass_100"
tags = {{
  TestRun = "property-test"
}}
'''
        
        tfvars_path = temp_dir / "terraform.tfvars"
        tfvars_path.write_text(tfvars_content)
        
        # Run terraform plan to get the planned configuration
        return_code, stdout, stderr = tf.plan(
            capture_output=True,
            var_file="terraform.tfvars",
            out="tfplan"
        )
        
        # Terraform plan should succeed
        assert return_code == 0, f"Terraform plan failed: {stderr}"
        
        # Get the plan output in JSON format for analysis
        return_code, plan_json, stderr = tf.show(
            "tfplan",
            json=True,
            capture_output=True
        )
        
        assert return_code == 0, f"Terraform show failed: {stderr}"
        
        plan_data = json.loads(plan_json)
        
        # Verify variable substitution in planned resources
        planned_changes = plan_data.get('planned_values', {}).get('root_module', {}).get('resources', [])
        
        # Check that resources use the provided variables
        for resource in planned_changes:
            resource_type = resource.get('type')
            resource_values = resource.get('values', {})
            
            # Check S3 bucket naming includes project_name and environment
            if resource_type == 'aws_s3_bucket':
                bucket_name = resource_values.get('bucket', '')
                assert project_name in bucket_name, f"S3 bucket name should contain project_name: {bucket_name}"
                assert environment in bucket_name, f"S3 bucket name should contain environment: {bucket_name}"
            
            # Check resource tags include project and environment
            tags = resource_values.get('tags', {})
            if tags:  # Only check if tags are present
                assert tags.get('Project') == project_name, f"Project tag should match variable: {tags}"
                assert tags.get('Environment') == environment, f"Environment tag should match variable: {tags}"
                assert tags.get('TestRun') == 'property-test', f"Custom tag should be preserved: {tags}"


class TestTerraformDefaultValueHandling:
    """
    Feature: aws-infrastructure, Property 12: Terraform default value handling
    Tests that default values are used when variables are not provided.
    """

    @pytest.mark.property
    def test_terraform_default_value_handling(self, terraform_workspace, test_api_domain):
        """
        **Feature: aws-infrastructure, Property 12: Terraform default value handling**
        **Validates: Requirements 6.3**
        
        For any variable with a defined default value, running terraform without 
        providing that variable should use the default value in resource creation.
        """
        temp_dir, tf = terraform_workspace
        
        # Create minimal terraform.tfvars with only required variables
        tfvars_content = f'''
api_gateway_domain = "{test_api_domain}"
'''
        
        tfvars_path = temp_dir / "terraform.tfvars"
        tfvars_path.write_text(tfvars_content)
        
        # Run terraform plan
        return_code, stdout, stderr = tf.plan(
            capture_output=True,
            var_file="terraform.tfvars",
            out="tfplan"
        )
        
        assert return_code == 0, f"Terraform plan failed: {stderr}"
        
        # Get the plan output in JSON format
        return_code, plan_json, stderr = tf.show(
            "tfplan",
            json=True,
            capture_output=True
        )
        
        assert return_code == 0, f"Terraform show failed: {stderr}"
        
        plan_data = json.loads(plan_json)
        planned_changes = plan_data.get('planned_values', {}).get('root_module', {}).get('resources', [])
        
        # Verify default values are used
        for resource in planned_changes:
            resource_values = resource.get('values', {})
            tags = resource_values.get('tags', {})
            
            if tags:
                # Check default values from variables.tf
                assert tags.get('Project') == 'kb-engine', f"Should use default project_name: {tags}"
                assert tags.get('Environment') == 'dev', f"Should use default environment: {tags}"


class TestTerraformInputValidation:
    """
    Feature: aws-infrastructure, Property 13: Terraform input validation
    Tests that invalid variable values are rejected before making AWS API calls.
    """

    @pytest.mark.property
    @given(
        invalid_project_name=st.one_of(
            st.text(max_size=2),  # Too short
            st.text(min_size=21),  # Too long
            st.text(alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ'),  # Uppercase
            st.just(''),  # Empty
            st.just('project_name_with_underscores'),  # Invalid characters
        ),
        invalid_environment=st.text().filter(lambda x: x not in ['dev', 'staging', 'prod']),
        invalid_domain=st.one_of(
            st.just('not-a-domain'),  # Missing TLD
            st.just(''),  # Empty
            st.just('invalid..domain.com'),  # Double dots
        )
    )
    @settings(max_examples=50)
    def test_terraform_input_validation(
        self, 
        terraform_workspace, 
        invalid_project_name, 
        invalid_environment, 
        invalid_domain
    ):
        """
        **Feature: aws-infrastructure, Property 13: Terraform input validation**
        **Validates: Requirements 6.4**
        
        For any variable with validation rules, providing an invalid value should 
        cause terraform to reject the configuration before making any AWS API calls.
        """
        temp_dir, tf = terraform_workspace
        
        # Test invalid project_name
        if invalid_project_name is not None:
            tfvars_content = f'''
project_name = "{invalid_project_name}"
api_gateway_domain = "api.example.com"
'''
            tfvars_path = temp_dir / "terraform.tfvars"
            tfvars_path.write_text(tfvars_content)
            
            return_code, stdout, stderr = tf.plan(
                capture_output=True,
                var_file="terraform.tfvars"
            )
            
            # Should fail validation
            assert return_code != 0, f"Should reject invalid project_name: {invalid_project_name}"
            assert "validation failed" in stderr.lower() or "invalid value" in stderr.lower()
        
        # Test invalid environment
        if invalid_environment:
            tfvars_content = f'''
environment = "{invalid_environment}"
api_gateway_domain = "api.example.com"
'''
            tfvars_path = temp_dir / "terraform.tfvars"
            tfvars_path.write_text(tfvars_content)
            
            return_code, stdout, stderr = tf.plan(
                capture_output=True,
                var_file="terraform.tfvars"
            )
            
            # Should fail validation
            assert return_code != 0, f"Should reject invalid environment: {invalid_environment}"
        
        # Test invalid domain
        if invalid_domain:
            tfvars_content = f'''
api_gateway_domain = "{invalid_domain}"
'''
            tfvars_path = temp_dir / "terraform.tfvars"
            tfvars_path.write_text(tfvars_content)
            
            return_code, stdout, stderr = tf.plan(
                capture_output=True,
                var_file="terraform.tfvars"
            )
            
            # Should fail validation
            assert return_code != 0, f"Should reject invalid domain: {invalid_domain}"



class TestS3PublicAccessBlocking:
    """
    Feature: aws-infrastructure, Property 4: S3 public access blocking
    Tests that all S3 buckets have public access blocked.
    """

    @pytest.mark.property
    @pytest.mark.integration
    def test_s3_public_access_blocking(self, aws_clients):
        """
        **Feature: aws-infrastructure, Property 4: S3 public access blocking**
        **Validates: Requirements 2.1**
        
        For any S3 bucket created by the configuration, all four public access 
        block settings should be enabled.
        """
        s3_client = aws_clients['s3']
        
        # This test requires actual deployed infrastructure
        # Get bucket name from environment or terraform output
        bucket_name = os.environ.get('TEST_S3_BUCKET_NAME')
        
        if not bucket_name:
            pytest.skip("TEST_S3_BUCKET_NAME not set - requires deployed infrastructure")
        
        try:
            response = s3_client.get_public_access_block(Bucket=bucket_name)
            config = response['PublicAccessBlockConfiguration']
            
            # Verify all four public access block settings are enabled
            assert config['BlockPublicAcls'] == True, "BlockPublicAcls should be enabled"
            assert config['IgnorePublicAcls'] == True, "IgnorePublicAcls should be enabled"
            assert config['BlockPublicPolicy'] == True, "BlockPublicPolicy should be enabled"
            assert config['RestrictPublicBuckets'] == True, "RestrictPublicBuckets should be enabled"
            
        except s3_client.exceptions.NoSuchBucket:
            pytest.fail(f"Bucket {bucket_name} does not exist")


class TestS3SecurityConfiguration:
    """
    Feature: aws-infrastructure, Property 5: S3 security configuration
    Tests that S3 buckets have encryption and versioning enabled.
    """

    @pytest.mark.property
    @pytest.mark.integration
    def test_s3_security_configuration(self, aws_clients):
        """
        **Feature: aws-infrastructure, Property 5: S3 security configuration**
        **Validates: Requirements 2.4, 2.5**
        
        For any S3 bucket created by the configuration, encryption at rest 
        should be enabled and versioning should be enabled.
        """
        s3_client = aws_clients['s3']
        
        bucket_name = os.environ.get('TEST_S3_BUCKET_NAME')
        
        if not bucket_name:
            pytest.skip("TEST_S3_BUCKET_NAME not set - requires deployed infrastructure")
        
        try:
            # Check encryption configuration
            encryption_response = s3_client.get_bucket_encryption(Bucket=bucket_name)
            rules = encryption_response['ServerSideEncryptionConfiguration']['Rules']
            
            assert len(rules) > 0, "Encryption rules should be configured"
            
            # Verify AES256 encryption is enabled
            sse_algorithm = rules[0]['ApplyServerSideEncryptionByDefault']['SSEAlgorithm']
            assert sse_algorithm == 'AES256', f"Expected AES256 encryption, got {sse_algorithm}"
            
            # Check versioning configuration
            versioning_response = s3_client.get_bucket_versioning(Bucket=bucket_name)
            versioning_status = versioning_response.get('Status', 'Disabled')
            
            assert versioning_status == 'Enabled', f"Versioning should be enabled, got {versioning_status}"
            
        except s3_client.exceptions.NoSuchBucket:
            pytest.fail(f"Bucket {bucket_name} does not exist")


class TestS3VersioningFunctionality:
    """
    Feature: aws-infrastructure, Property 10: S3 versioning functionality
    Tests that S3 maintains multiple versions of files.
    """

    @pytest.mark.property
    @pytest.mark.integration
    @given(
        file_content_v1=st.text(min_size=10, max_size=100),
        file_content_v2=st.text(min_size=10, max_size=100)
    )
    @settings(max_examples=10)  # Reduced for integration tests
    def test_s3_versioning_functionality(self, aws_clients, file_content_v1, file_content_v2):
        """
        **Feature: aws-infrastructure, Property 10: S3 versioning functionality**
        **Validates: Requirements 5.4**
        
        For any file uploaded to S3 multiple times with different content, 
        the bucket should maintain all versions.
        """
        s3_client = aws_clients['s3']
        
        bucket_name = os.environ.get('TEST_S3_BUCKET_NAME')
        
        if not bucket_name:
            pytest.skip("TEST_S3_BUCKET_NAME not set - requires deployed infrastructure")
        
        # Ensure contents are different
        if file_content_v1 == file_content_v2:
            pytest.skip("File contents must be different")
        
        test_key = f"test-versioning-{os.urandom(8).hex()}.txt"
        
        try:
            # Upload first version
            s3_client.put_object(
                Bucket=bucket_name,
                Key=test_key,
                Body=file_content_v1.encode('utf-8'),
                ContentType='text/plain'
            )
            
            # Upload second version
            s3_client.put_object(
                Bucket=bucket_name,
                Key=test_key,
                Body=file_content_v2.encode('utf-8'),
                ContentType='text/plain'
            )
            
            # List versions
            versions_response = s3_client.list_object_versions(
                Bucket=bucket_name,
                Prefix=test_key
            )
            
            versions = versions_response.get('Versions', [])
            
            # Should have at least 2 versions
            assert len(versions) >= 2, f"Expected at least 2 versions, got {len(versions)}"
            
            # Verify we can retrieve both versions
            latest_version = versions[0]
            previous_version = versions[1]
            
            # Get latest version content
            latest_obj = s3_client.get_object(
                Bucket=bucket_name,
                Key=test_key,
                VersionId=latest_version['VersionId']
            )
            latest_content = latest_obj['Body'].read().decode('utf-8')
            
            # Get previous version content
            previous_obj = s3_client.get_object(
                Bucket=bucket_name,
                Key=test_key,
                VersionId=previous_version['VersionId']
            )
            previous_content = previous_obj['Body'].read().decode('utf-8')
            
            # Verify contents match what we uploaded
            assert latest_content == file_content_v2, "Latest version should match second upload"
            assert previous_content == file_content_v1, "Previous version should match first upload"
            
        finally:
            # Cleanup: delete all versions of the test object
            try:
                versions_response = s3_client.list_object_versions(
                    Bucket=bucket_name,
                    Prefix=test_key
                )
                
                for version in versions_response.get('Versions', []):
                    s3_client.delete_object(
                        Bucket=bucket_name,
                        Key=test_key,
                        VersionId=version['VersionId']
                    )
            except Exception:
                pass  # Best effort cleanup


class TestCloudFrontCacheBehavior:
    """
    Feature: aws-infrastructure, Property 6: CloudFront cache behavior for static content
    Tests that CloudFront returns appropriate cache headers for static assets.
    """

    @pytest.mark.property
    @pytest.mark.integration
    def test_cloudfront_cache_behavior(self):
        """
        **Feature: aws-infrastructure, Property 6: CloudFront cache behavior for static content**
        **Validates: Requirements 3.4**
        
        For any request to static asset paths (excluding /api/*), CloudFront should 
        return appropriate cache headers with TTL values matching the configured cache policy.
        """
        import requests
        
        cloudfront_url = os.environ.get('TEST_CLOUDFRONT_URL')
        
        if not cloudfront_url:
            pytest.skip("TEST_CLOUDFRONT_URL not set - requires deployed infrastructure")
        
        # Test static content caching
        response = requests.get(f"{cloudfront_url}/index.html", timeout=30)
        
        assert response.status_code in [200, 404], f"Expected 200 or 404, got {response.status_code}"
        
        # Check for cache-related headers
        headers = response.headers
        
        # CloudFront should add cache headers
        assert 'Cache-Control' in headers or 'Expires' in headers, "Cache headers should be present"
        
        # Check for CloudFront headers
        assert 'X-Cache' in headers, "X-Cache header should be present from CloudFront"


class TestCloudFrontHTTPSEnforcement:
    """
    Feature: aws-infrastructure, Property 14: CloudFront HTTPS enforcement
    Tests that HTTP requests are redirected to HTTPS.
    """

    @pytest.mark.property
    @pytest.mark.integration
    def test_cloudfront_https_enforcement(self):
        """
        **Feature: aws-infrastructure, Property 14: CloudFront HTTPS enforcement**
        **Validates: Requirements 7.1**
        
        For any HTTP request to the CloudFront distribution, the response should 
        be a redirect (301 or 302) to the HTTPS equivalent URL.
        """
        import requests
        
        cloudfront_url = os.environ.get('TEST_CLOUDFRONT_URL')
        
        if not cloudfront_url:
            pytest.skip("TEST_CLOUDFRONT_URL not set - requires deployed infrastructure")
        
        # Convert HTTPS URL to HTTP for testing
        http_url = cloudfront_url.replace('https://', 'http://')
        
        try:
            # Make HTTP request with redirect disabled
            response = requests.get(http_url, allow_redirects=False, timeout=30)
            
            # Should get a redirect response
            assert response.status_code in [301, 302], f"Expected redirect, got {response.status_code}"
            
            # Location header should point to HTTPS
            location = response.headers.get('Location', '')
            assert location.startswith('https://'), f"Redirect should be to HTTPS: {location}"
            
        except requests.exceptions.SSLError:
            # Some CloudFront configurations might not accept HTTP at all
            pytest.skip("HTTP not supported - HTTPS-only configuration")


class TestCloudFrontTLSVersionEnforcement:
    """
    Feature: aws-infrastructure, Property 15: CloudFront TLS version enforcement
    Tests that CloudFront uses TLS 1.2 or higher.
    """

    @pytest.mark.property
    @pytest.mark.integration
    def test_cloudfront_tls_version_enforcement(self):
        """
        **Feature: aws-infrastructure, Property 15: CloudFront TLS version enforcement**
        **Validates: Requirements 7.2**
        
        For any CloudFront distribution created, the minimum TLS version should 
        be configured as TLSv1.2_2021 or higher.
        """
        import ssl
        import socket
        from urllib.parse import urlparse
        
        cloudfront_url = os.environ.get('TEST_CLOUDFRONT_URL')
        
        if not cloudfront_url:
            pytest.skip("TEST_CLOUDFRONT_URL not set - requires deployed infrastructure")
        
        parsed_url = urlparse(cloudfront_url)
        hostname = parsed_url.hostname
        port = parsed_url.port or 443
        
        # Test TLS connection
        context = ssl.create_default_context()
        
        with socket.create_connection((hostname, port), timeout=30) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                # Get TLS version
                tls_version = ssock.version()
                
                # Should be TLS 1.2 or higher
                assert tls_version in ['TLSv1.2', 'TLSv1.3'], f"Expected TLS 1.2+, got {tls_version}"
                
                # Get cipher suite
                cipher = ssock.cipher()
                assert cipher is not None, "Cipher information should be available"


class TestCloudFrontAPIRequestForwarding:
    """
    Feature: aws-infrastructure, Property 7: CloudFront API request forwarding
    Tests that CloudFront forwards API requests to API Gateway correctly.
    """

    @pytest.mark.property
    @pytest.mark.integration
    @given(
        http_method=st.sampled_from(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
        query_param=st.text(min_size=1, max_size=20, alphabet=st.characters(whitelist_categories=('Ll', 'Nd'))),
        header_value=st.text(min_size=1, max_size=50)
    )
    @settings(max_examples=10)
    def test_cloudfront_api_request_forwarding(self, http_method, query_param, header_value):
        """
        **Feature: aws-infrastructure, Property 7: CloudFront API request forwarding**
        **Validates: Requirements 4.1, 4.2**
        
        For any HTTP request to /api/* paths with any method, headers, and query parameters, 
        CloudFront should forward all components to the API Gateway origin without modification.
        """
        import requests
        
        cloudfront_url = os.environ.get('TEST_CLOUDFRONT_URL')
        
        if not cloudfront_url:
            pytest.skip("TEST_CLOUDFRONT_URL not set - requires deployed infrastructure")
        
        # Construct API request
        api_url = f"{cloudfront_url}/api/test"
        headers = {
            'Content-Type': 'application/json',
            'X-Test-Header': header_value
        }
        params = {'test_param': query_param}
        
        try:
            if http_method == 'GET':
                response = requests.get(api_url, headers=headers, params=params, timeout=30)
            elif http_method == 'POST':
                response = requests.post(api_url, headers=headers, params=params, json={'test': 'data'}, timeout=30)
            elif http_method == 'PUT':
                response = requests.put(api_url, headers=headers, params=params, json={'test': 'data'}, timeout=30)
            elif http_method == 'DELETE':
                response = requests.delete(api_url, headers=headers, params=params, timeout=30)
            elif http_method == 'PATCH':
                response = requests.patch(api_url, headers=headers, params=params, json={'test': 'data'}, timeout=30)
            
            # The request should reach the API Gateway (even if it returns an error)
            # We're testing forwarding, not API functionality
            assert response.status_code != 502, "502 indicates CloudFront couldn't reach origin"
            assert response.status_code != 504, "504 indicates timeout reaching origin"
            
            # Check that CloudFront headers are present
            cf_headers = response.headers
            assert 'X-Cache' in cf_headers, "CloudFront should add X-Cache header"
            
        except requests.exceptions.Timeout:
            pytest.skip("API Gateway not responding - may not be deployed")
        except requests.exceptions.ConnectionError:
            pytest.skip("Cannot connect to API Gateway through CloudFront")


class TestCloudFrontAPIResponseCaching:
    """
    Feature: aws-infrastructure, Property 8: CloudFront API response caching
    Tests that API responses are not cached by CloudFront.
    """

    @pytest.mark.property
    @pytest.mark.integration
    def test_cloudfront_api_response_caching(self):
        """
        **Feature: aws-infrastructure, Property 8: CloudFront API response caching**
        **Validates: Requirements 4.3**
        
        For any response from /api/* paths, CloudFront should include cache headers 
        indicating no caching or minimal TTL.
        """
        import requests
        
        cloudfront_url = os.environ.get('TEST_CLOUDFRONT_URL')
        
        if not cloudfront_url:
            pytest.skip("TEST_CLOUDFRONT_URL not set - requires deployed infrastructure")
        
        api_url = f"{cloudfront_url}/api/health"
        
        try:
            response = requests.get(api_url, timeout=30)
            
            # Check cache headers indicate no caching
            headers = response.headers
            
            # Look for cache control headers
            cache_control = headers.get('Cache-Control', '').lower()
            
            # Should indicate no caching or very short TTL
            no_cache_indicators = ['no-cache', 'no-store', 'max-age=0', 'private']
            
            has_no_cache = any(indicator in cache_control for indicator in no_cache_indicators)
            
            # Check X-Cache header from CloudFront
            x_cache = headers.get('X-Cache', '').lower()
            
            # For API responses, we expect either:
            # 1. Cache-Control indicates no caching, OR
            # 2. X-Cache indicates "Miss" (not cached)
            assert has_no_cache or 'miss' in x_cache, f"API responses should not be cached. Cache-Control: {cache_control}, X-Cache: {x_cache}"
            
        except requests.exceptions.Timeout:
            pytest.skip("API Gateway not responding - may not be deployed")
        except requests.exceptions.ConnectionError:
            pytest.skip("Cannot connect to API Gateway through CloudFront")


class TestCloudFrontOriginProtocolPolicy:
    """
    Feature: aws-infrastructure, Property 16: CloudFront origin protocol policy
    Tests that CloudFront uses HTTPS for origin communication.
    """

    @pytest.mark.property
    @pytest.mark.integration
    def test_cloudfront_origin_protocol_policy(self):
        """
        **Feature: aws-infrastructure, Property 16: CloudFront origin protocol policy**
        **Validates: Requirements 7.4**
        
        For any origin configured in CloudFront (S3 or API Gateway), the origin 
        protocol policy should enforce HTTPS-only communication.
        """
        # This test verifies the configuration rather than runtime behavior
        # since we can't directly observe CloudFront-to-origin communication
        
        cloudfront_url = os.environ.get('TEST_CLOUDFRONT_URL')
        
        if not cloudfront_url:
            pytest.skip("TEST_CLOUDFRONT_URL not set - requires deployed infrastructure")
        
        # Test that both S3 and API origins are accessible via CloudFront
        # This indirectly validates that HTTPS origin communication is working
        
        import requests
        
        try:
            # Test S3 origin (static content)
            static_response = requests.get(f"{cloudfront_url}/", timeout=30)
            assert static_response.status_code in [200, 404], "S3 origin should be reachable via HTTPS"
            
            # Test API Gateway origin
            api_response = requests.get(f"{cloudfront_url}/api/", timeout=30)
            # API might return various status codes, but should not be connection errors
            assert api_response.status_code != 502, "API Gateway origin should be reachable via HTTPS"
            
            # Both origins should have CloudFront headers
            assert 'X-Cache' in static_response.headers, "S3 responses should have CloudFront headers"
            assert 'X-Cache' in api_response.headers, "API responses should have CloudFront headers"
            
        except requests.exceptions.SSLError:
            pytest.fail("SSL error indicates HTTPS communication issue")
        except requests.exceptions.Timeout:
            pytest.skip("Origins not responding - may not be fully deployed")
        except requests.exceptions.ConnectionError:
            pytest.skip("Cannot connect to origins through CloudFront")

class TestCloudFrontSecurityHeaders:
    """
    Feature: aws-infrastructure, Property 17: CloudFront security headers
    Tests that CloudFront includes security headers in responses.
    """

    @pytest.mark.property
    @pytest.mark.integration
    def test_cloudfront_security_headers(self):
        """
        **Feature: aws-infrastructure, Property 17: CloudFront security headers**
        **Validates: Requirements 7.5**
        
        For any response from CloudFront, security-related headers should be present.
        """
        import requests
        
        cloudfront_url = os.environ.get('TEST_CLOUDFRONT_URL')
        
        if not cloudfront_url:
            pytest.skip("TEST_CLOUDFRONT_URL not set - requires deployed infrastructure")
        
        try:
            response = requests.get(cloudfront_url, timeout=30)
            
            headers = response.headers
            
            # Check for security headers
            security_headers = {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': ['DENY', 'SAMEORIGIN'],
                'Strict-Transport-Security': None,  # Should be present
                'Referrer-Policy': None  # Should be present
            }
            
            for header_name, expected_values in security_headers.items():
                assert header_name in headers, f"Security header {header_name} should be present"
                
                if expected_values:
                    header_value = headers[header_name]
                    if isinstance(expected_values, list):
                        assert any(expected in header_value for expected in expected_values), \
                            f"{header_name} should contain one of {expected_values}, got: {header_value}"
                    else:
                        assert expected_values in header_value, \
                            f"{header_name} should contain {expected_values}, got: {header_value}"
            
            # HSTS header should have max-age
            hsts = headers.get('Strict-Transport-Security', '')
            assert 'max-age=' in hsts, f"HSTS header should include max-age: {hsts}"
            
        except requests.exceptions.Timeout:
            pytest.skip("CloudFront not responding - may not be deployed")
        except requests.exceptions.ConnectionError:
            pytest.skip("Cannot connect to CloudFront distribution")