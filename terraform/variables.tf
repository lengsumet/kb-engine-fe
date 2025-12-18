# Terraform Variables Configuration
# Defines all input variables with validation rules and descriptions

variable "project_name" {
  type        = string
  description = "Project name used for resource naming and tagging"
  default     = "kb-engine-fe"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "Project name must contain only lowercase letters, numbers, and hyphens."
  }

  validation {
    condition     = length(var.project_name) >= 3 && length(var.project_name) <= 20
    error_message = "Project name must be between 3 and 20 characters long."
  }
}

variable "environment" {
  type        = string
  description = "Environment name (dev, staging, prod) used for resource naming and tagging"
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "aws_region" {
  type        = string
  description = "AWS region for resource deployment"
  default     = "us-east-1"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.aws_region))
    error_message = "AWS region must be a valid region identifier."
  }
}

variable "api_gateway_domain" {
  type        = string
  description = "API Gateway domain name for backend integration (optional). Leave empty to deploy without API Gateway."
  default     = ""

  validation {
    condition     = var.api_gateway_domain == "" || can(regex("^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\\.[a-zA-Z]{2,}$", var.api_gateway_domain))
    error_message = "API Gateway domain must be empty or a valid domain name."
  }
}

variable "api_gateway_stage" {
  type        = string
  description = "API Gateway stage name (e.g., prod, v1, dev)"
  default     = "prod"

  validation {
    condition     = can(regex("^[a-zA-Z0-9_-]+$", var.api_gateway_stage))
    error_message = "API Gateway stage must contain only alphanumeric characters, underscores, and hyphens."
  }
}

variable "cloudfront_price_class" {
  type        = string
  description = "CloudFront price class for geographic distribution"
  default     = "PriceClass_100"

  validation {
    condition = contains([
      "PriceClass_All",
      "PriceClass_200",
      "PriceClass_100"
    ], var.cloudfront_price_class)
    error_message = "CloudFront price class must be one of: PriceClass_All, PriceClass_200, PriceClass_100."
  }
}

variable "tags" {
  type        = map(string)
  description = "Additional tags to apply to all resources"
  default     = {}

  validation {
    condition     = alltrue([for k, v in var.tags : can(regex("^[a-zA-Z0-9+\\-=._:/@\\s]+$", k)) && can(regex("^[a-zA-Z0-9+\\-=._:/@\\s]+$", v))])
    error_message = "Tag keys and values must contain only valid characters."
  }
}

# CloudWatch Logs Configuration Variables
variable "log_retention_days" {
  type        = number
  description = "Number of days to retain CloudWatch logs"
  default     = 30

  validation {
    condition = contains([
      1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653
    ], var.log_retention_days)
    error_message = "Log retention days must be one of the valid CloudWatch retention periods."
  }
}

variable "enable_cloudfront_logging" {
  type        = bool
  description = "Enable CloudFront access logging to CloudWatch"
  default     = true
}

variable "enable_lambda_logging" {
  type        = bool
  description = "Enable Lambda function logging to CloudWatch"
  default     = false
}

variable "log_level" {
  type        = string
  description = "Application log level (DEBUG, INFO, WARN, ERROR)"
  default     = "INFO"

  validation {
    condition     = contains(["DEBUG", "INFO", "WARN", "ERROR"], var.log_level)
    error_message = "Log level must be one of: DEBUG, INFO, WARN, ERROR."
  }
}