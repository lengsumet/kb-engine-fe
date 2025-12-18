# IAM Configuration
# Creates CloudFront Origin Access Identity and related IAM policies

# CloudFront Origin Access Identity for secure S3 access
resource "aws_cloudfront_origin_access_identity" "main" {
  comment = "OAI for ${local.name_prefix} frontend bucket access"

  # This creates a special CloudFront user that can access S3 bucket
  # while keeping the bucket private from direct internet access
}

# Data source to get the current AWS caller identity
data "aws_caller_identity" "current" {}

# Data source to get the current AWS region
data "aws_region" "current" {}