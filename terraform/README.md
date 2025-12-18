# Knowledge Base Engine - AWS Infrastructure

This Terraform configuration deploys the AWS infrastructure for the Knowledge Base Engine frontend application. The infrastructure includes a private S3 bucket for static assets, CloudFront CDN for global content delivery, and integration with an API Gateway backend.

## Architecture Overview

- **S3 Bucket**: Private bucket for storing static frontend assets
- **CloudFront Distribution**: CDN for global content delivery with two origins:
  - S3 origin for static content (default behavior)
  - API Gateway origin for backend API calls (`/api/*` path)
- **Origin Access Identity (OAI)**: Restricts S3 access to CloudFront only
- **CloudWatch Logs**: Centralized logging for application monitoring:
  - Application logs with structured log streams
  - CloudFront access logs (optional)
  - API Gateway logs (when configured)
  - Lambda function logs (when enabled)
  - Metric filters for error monitoring
- **Security**: HTTPS enforcement, security headers, and private S3 access

## Prerequisites

Before deploying this infrastructure, ensure you have:

1. **Terraform** (>= 1.0) installed
   ```bash
   # Download from https://www.terraform.io/downloads.html
   # Or use package manager:
   brew install terraform  # macOS
   choco install terraform # Windows
   ```

2. **AWS CLI** installed and configured
   ```bash
   # Install AWS CLI
   pip install awscli
   # Or download from https://aws.amazon.com/cli/
   
   # Configure credentials
   aws configure
   ```

3. **AWS Credentials** configured with appropriate permissions:
   - S3: CreateBucket, DeleteBucket, PutBucketPolicy, etc.
   - CloudFront: CreateDistribution, UpdateDistribution, etc.
   - IAM: CreateRole, AttachRolePolicy, etc.

## Quick Start

1. **Clone and Navigate**
   ```bash
   cd terraform
   ```

2. **Configure Variables**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your specific values
   ```

3. **Initialize Terraform**
   ```bash
   terraform init
   ```

4. **Plan Deployment**
   ```bash
   terraform plan
   ```

5. **Deploy Infrastructure**
   ```bash
   terraform apply
   ```

6. **Save Outputs**
   ```bash
   terraform output > ../infrastructure-outputs.txt
   ```

## Configuration

### Required Variables

Edit `terraform.tfvars` with these required values:

```hcl
# Your API Gateway domain (replace with actual domain)
api_gateway_domain = "api.yourdomain.com"

# Optional: Customize other values
project_name = "kb-engine"
environment  = "dev"
aws_region   = "us-east-1"
```

### Variable Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `project_name` | Project name for resource naming | `"kb-engine"` | No |
| `environment` | Environment (dev/staging/prod) | `"dev"` | No |
| `aws_region` | AWS region for deployment | `"us-east-1"` | No |
| `api_gateway_domain` | API Gateway domain name | - | **Yes** |
| `api_gateway_stage` | API Gateway stage name | `"prod"` | No |
| `cloudfront_price_class` | CloudFront price class | `"PriceClass_100"` | No |
| `tags` | Additional resource tags | `{}` | No |

## Deployment Workflow

### Initial Deployment

```bash
# 1. Initialize Terraform
terraform init

# 2. Validate configuration
terraform validate

# 3. Format code
terraform fmt

# 4. Plan changes
terraform plan -out=tfplan

# 5. Review plan output carefully

# 6. Apply changes
terraform apply tfplan

# 7. Note the outputs
terraform output
```

### Frontend Application Deployment

After infrastructure is deployed, deploy your React application:

```bash
# 1. Build the frontend application
cd ../kb-engine-fe
npm run build

# 2. Get S3 bucket name from Terraform output
BUCKET_NAME=$(cd ../terraform && terraform output -raw s3_bucket_name)

# 3. Upload build files to S3
aws s3 sync build/ s3://$BUCKET_NAME/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "service-worker.js"

# 4. Upload index.html with no-cache headers
aws s3 cp build/index.html s3://$BUCKET_NAME/ \
  --cache-control "no-cache, no-store, must-revalidate"

# 5. Invalidate CloudFront cache
DISTRIBUTION_ID=$(cd ../terraform && terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

### Updates and Maintenance

```bash
# Update infrastructure
terraform plan
terraform apply

# Update application
# (repeat frontend deployment steps above)
```

## Outputs

After successful deployment, Terraform provides these outputs:

- `cloudfront_url`: Complete HTTPS URL for accessing your application
- `cloudfront_domain_name`: CloudFront domain name
- `cloudfront_distribution_id`: Distribution ID for cache invalidation
- `s3_bucket_name`: S3 bucket name for uploading builds
- `s3_bucket_arn`: S3 bucket ARN for reference

## Security Features

- **Private S3 Bucket**: No direct public access
- **Origin Access Identity**: CloudFront-only S3 access
- **HTTPS Enforcement**: HTTP requests redirect to HTTPS
- **TLS 1.2+**: Minimum TLS version enforced
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, etc.
- **Resource Tagging**: Consistent tagging for compliance

## Cost Optimization

- **S3**: Pay for storage and requests (minimal via CloudFront)
- **CloudFront**: Pay for data transfer and requests
- **Price Class**: Default `PriceClass_100` covers US/Canada/Europe
- **Caching**: Optimized cache policies reduce origin requests

## Troubleshooting

### Common Issues

1. **S3 Bucket Name Conflicts**
   ```
   Error: bucket already exists
   ```
   - Solution: Change `project_name` or `environment` variable

2. **AWS Credentials**
   ```
   Error: No valid credential sources found
   ```
   - Solution: Run `aws configure` or set environment variables

3. **API Gateway Domain**
   ```
   Error: Invalid domain name
   ```
   - Solution: Verify API Gateway domain is correct and accessible

4. **Permission Errors**
   ```
   Error: AccessDenied
   ```
   - Solution: Verify AWS credentials have required permissions

### Validation Commands

```bash
# Check Terraform syntax
terraform validate

# Check formatting
terraform fmt -check

# Verify AWS credentials
aws sts get-caller-identity

# Test API Gateway domain
curl -I https://your-api-domain.com/health
```

## Cleanup

To destroy all infrastructure:

```bash
# Destroy all resources
terraform destroy

# Verify cleanup in AWS console
```

**Note**: S3 bucket with versioned objects may require manual deletion.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Terraform and AWS documentation
3. Verify AWS service limits and quotas
4. Check AWS CloudTrail logs for detailed error information