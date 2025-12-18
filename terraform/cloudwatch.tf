# CloudWatch Logs Configuration
# Creates CloudWatch Log Groups and Log Streams for application logging

# CloudWatch Log Group for application logs
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/aws/${local.name_prefix}/application"
  retention_in_days = var.log_retention_days

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-app-logs"
    Purpose = "Application logging"
    Type    = "CloudWatch Log Group"
  })
}

# CloudWatch Log Group for CloudFront access logs (if enabled)
resource "aws_cloudwatch_log_group" "cloudfront_logs" {
  count             = var.enable_cloudfront_logging ? 1 : 0
  name              = "/aws/${local.name_prefix}/cloudfront"
  retention_in_days = var.log_retention_days

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-cloudfront-logs"
    Purpose = "CloudFront access logging"
    Type    = "CloudWatch Log Group"
  })
}

# CloudWatch Log Group for API Gateway logs (if API Gateway is configured)
resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  count             = var.api_gateway_domain != "" ? 1 : 0
  name              = "/aws/${local.name_prefix}/api-gateway"
  retention_in_days = var.log_retention_days

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-api-gateway-logs"
    Purpose = "API Gateway logging"
    Type    = "CloudWatch Log Group"
  })
}

# CloudWatch Log Group for Lambda functions (if any)
resource "aws_cloudwatch_log_group" "lambda_logs" {
  count             = var.enable_lambda_logging ? 1 : 0
  name              = "/aws/lambda/${local.name_prefix}"
  retention_in_days = var.log_retention_days

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-lambda-logs"
    Purpose = "Lambda function logging"
    Type    = "CloudWatch Log Group"
  })
}

# CloudWatch Log Stream for application events
resource "aws_cloudwatch_log_stream" "app_events" {
  name           = "application-events"
  log_group_name = aws_cloudwatch_log_group.app_logs.name

  depends_on = [aws_cloudwatch_log_group.app_logs]
}

# CloudWatch Log Stream for error logs
resource "aws_cloudwatch_log_stream" "error_logs" {
  name           = "error-logs"
  log_group_name = aws_cloudwatch_log_group.app_logs.name

  depends_on = [aws_cloudwatch_log_group.app_logs]
}

# CloudWatch Log Stream for access logs
resource "aws_cloudwatch_log_stream" "access_logs" {
  name           = "access-logs"
  log_group_name = aws_cloudwatch_log_group.app_logs.name

  depends_on = [aws_cloudwatch_log_group.app_logs]
}

# CloudWatch Log Metric Filter for error monitoring
resource "aws_cloudwatch_log_metric_filter" "error_count" {
  name           = "${local.name_prefix}-error-count"
  log_group_name = aws_cloudwatch_log_group.app_logs.name
  pattern        = "[timestamp, request_id, ERROR, ...]"

  metric_transformation {
    name      = "ErrorCount"
    namespace = "${local.name_prefix}/Application"
    value     = "1"
  }

  depends_on = [aws_cloudwatch_log_group.app_logs]
}

# CloudWatch Log Metric Filter for 4xx errors
resource "aws_cloudwatch_log_metric_filter" "client_errors" {
  name           = "${local.name_prefix}-4xx-errors"
  log_group_name = aws_cloudwatch_log_group.app_logs.name
  pattern        = "[timestamp, request_id, status_code=4*, ...]"

  metric_transformation {
    name      = "ClientErrors"
    namespace = "${local.name_prefix}/Application"
    value     = "1"
  }

  depends_on = [aws_cloudwatch_log_group.app_logs]
}

# CloudWatch Log Metric Filter for 5xx errors
resource "aws_cloudwatch_log_metric_filter" "server_errors" {
  name           = "${local.name_prefix}-5xx-errors"
  log_group_name = aws_cloudwatch_log_group.app_logs.name
  pattern        = "[timestamp, request_id, status_code=5*, ...]"

  metric_transformation {
    name      = "ServerErrors"
    namespace = "${local.name_prefix}/Application"
    value     = "1"
  }

  depends_on = [aws_cloudwatch_log_group.app_logs]
}