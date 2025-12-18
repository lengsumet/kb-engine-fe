# CloudFront Distribution Configuration
# Creates a global CDN distribution with S3 and API Gateway origins

# CloudFront distribution for global content delivery
resource "aws_cloudfront_distribution" "main" {
  comment             = "${local.name_prefix} frontend distribution"
  default_root_object = "index.html"
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = var.cloudfront_price_class

  # S3 Origin for static content (default)
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.frontend.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }

  # API Gateway Origin for backend API calls (conditional)
  dynamic "origin" {
    for_each = var.api_gateway_domain != "" ? [1] : []
    content {
      domain_name = var.api_gateway_domain
      origin_id   = "API-Gateway"
      origin_path = var.api_gateway_stage != "" ? "/${var.api_gateway_stage}" : ""

      custom_origin_config {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "https-only"
        origin_ssl_protocols   = ["TLSv1.2"]
      }
    }
  }

  # Default cache behavior for static content
  default_cache_behavior {
    target_origin_id       = "S3-${aws_s3_bucket.frontend.id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    allowed_methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods  = ["GET", "HEAD"]

    # Use AWS managed caching policy for static content (replaces forwarded_values and TTL settings)
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized

    # Attach security headers policy
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
  }

  # Ordered cache behavior for API requests (conditional)
  dynamic "ordered_cache_behavior" {
    for_each = var.api_gateway_domain != "" ? [1] : []
    content {
      path_pattern           = "/api/*"
      target_origin_id       = "API-Gateway"
      viewer_protocol_policy = "https-only"
      compress               = false

      allowed_methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
      cached_methods  = ["GET", "HEAD"]

      # Use AWS managed cache policy for API (no caching)
      cache_policy_id = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingDisabled

      # Forward all headers, query strings, and cookies for API requests
      origin_request_policy_id = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf" # CORS-S3Origin

      # Attach security headers policy to API responses too
      response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
    }
  }

  # Custom error responses for SPA routing support
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  # SSL/TLS configuration
  viewer_certificate {
    cloudfront_default_certificate = true
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  # Geographic restrictions (none by default)
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-cloudfront-distribution"
    Purpose = "Global content delivery"
  })

  depends_on = [
    aws_s3_bucket.frontend,
    aws_cloudfront_origin_access_identity.main
  ]
}

# CloudFront response headers policy for security headers
resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name    = "${local.name_prefix}-security-headers"
  comment = "Security headers policy for ${local.name_prefix}"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000 # 1 year
      include_subdomains         = true
      override                   = false
    }

    content_type_options {
      override = false
    }

    frame_options {
      frame_option = "DENY"
      override     = false
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = false
    }
  }
}

