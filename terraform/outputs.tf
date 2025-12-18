# Terraform Outputs Configuration
# Defines output values for deployment automation and external integrations

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name for accessing the application"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidation operations"
  value       = aws_cloudfront_distribution.main.id
}

output "s3_bucket_name" {
  description = "S3 bucket name for uploading frontend build artifacts"
  value       = aws_s3_bucket.frontend.id
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN for IAM policy references"
  value       = aws_s3_bucket.frontend.arn
}

output "cloudfront_url" {
  description = "Complete HTTPS URL for accessing the application"
  value       = "https://${aws_cloudfront_distribution.main.domain_name}"
}

output "s3_bucket_regional_domain_name" {
  description = "S3 bucket regional domain name for CloudFront origin configuration"
  value       = aws_s3_bucket.frontend.bucket_regional_domain_name
}

output "origin_access_identity_id" {
  description = "CloudFront Origin Access Identity ID for S3 bucket policy"
  value       = aws_cloudfront_origin_access_identity.main.id
}

# CloudWatch Logs Outputs
output "cloudwatch_log_group_app" {
  description = "CloudWatch Log Group name for application logs"
  value       = aws_cloudwatch_log_group.app_logs.name
}

output "cloudwatch_log_group_app_arn" {
  description = "CloudWatch Log Group ARN for application logs"
  value       = aws_cloudwatch_log_group.app_logs.arn
}

output "cloudwatch_log_group_cloudfront" {
  description = "CloudWatch Log Group name for CloudFront logs (if enabled)"
  value       = var.enable_cloudfront_logging ? aws_cloudwatch_log_group.cloudfront_logs[0].name : null
}

output "cloudwatch_log_group_api_gateway" {
  description = "CloudWatch Log Group name for API Gateway logs (if configured)"
  value       = var.api_gateway_domain != "" ? aws_cloudwatch_log_group.api_gateway_logs[0].name : null
}

output "cloudwatch_log_streams" {
  description = "CloudWatch Log Streams for different log types"
  value = {
    app_events  = aws_cloudwatch_log_stream.app_events.name
    error_logs  = aws_cloudwatch_log_stream.error_logs.name
    access_logs = aws_cloudwatch_log_stream.access_logs.name
  }
}