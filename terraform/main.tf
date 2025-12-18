# Main Terraform Configuration
# Entry point for the Knowledge Base Engine AWS infrastructure

# Local values for resource naming and configuration
locals {
  # Consistent naming convention for all resources
  name_prefix = "${var.project_name}-${var.environment}"

  # Common tags applied to all resources
  common_tags = merge(var.tags, {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  })

  # S3 bucket name (must be globally unique)
  bucket_name = "${local.name_prefix}-frontend-${random_id.bucket_suffix.hex}"
}

# Random ID for ensuring S3 bucket name uniqueness
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

