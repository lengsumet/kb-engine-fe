# S3 Bucket Configuration
# Creates a private S3 bucket for hosting static frontend assets with security configurations

# S3 bucket for frontend static assets
resource "aws_s3_bucket" "frontend" {
  bucket = local.bucket_name

  tags = merge(local.common_tags, {
    Name        = "${local.name_prefix}-frontend-bucket"
    Purpose     = "Static website hosting"
    ContentType = "Frontend assets"
  })
}

# Block all public access to the S3 bucket
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  # Block all public access
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  depends_on = [aws_s3_bucket.frontend]
}

# Enable versioning for rollback capabilities
resource "aws_s3_bucket_versioning" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  versioning_configuration {
    status = "Enabled"
  }

  depends_on = [aws_s3_bucket.frontend]
}

# Enable server-side encryption with AES256
resource "aws_s3_bucket_server_side_encryption_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }

    bucket_key_enabled = true
  }

  depends_on = [aws_s3_bucket.frontend]
}

# S3 bucket policy to allow CloudFront Origin Access Identity access
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontOAI"
        Effect = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.main.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })

  depends_on = [
    aws_s3_bucket.frontend,
    aws_s3_bucket_public_access_block.frontend,
    aws_cloudfront_origin_access_identity.main
  ]
}

# Optional: S3 bucket notification configuration for deployment automation
resource "aws_s3_bucket_notification" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  # This can be extended to trigger Lambda functions or SNS notifications
  # when new objects are uploaded (useful for cache invalidation automation)

  depends_on = [aws_s3_bucket.frontend]
}

# S3 bucket lifecycle configuration to manage old versions
resource "aws_s3_bucket_lifecycle_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  rule {
    id     = "cleanup_old_versions"
    status = "Enabled"

    # Apply to all objects in the bucket
    filter {}

    # Delete non-current versions after 30 days
    noncurrent_version_expiration {
      noncurrent_days = 30
    }

    # Delete incomplete multipart uploads after 7 days
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }

  depends_on = [aws_s3_bucket_versioning.frontend]
}