
// Security configuration for Terraform

export const securityConfigYaml = `# --- Security Configuration ---

# AWS CloudTrail for AWS API auditing
resource "aws_cloudtrail" "devonn_cloudtrail" {
  count                         = var.environment == "production" ? 1 : 0
  name                          = "devonn-cloudtrail-\${var.environment}"
  s3_bucket_name                = aws_s3_bucket.cloudtrail_bucket[0].id
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_log_file_validation    = true
  
  event_selector {
    read_write_type           = "All"
    include_management_events = true
    
    data_resource {
      type   = "AWS::S3::Object"
      values = ["arn:aws:s3:::"]
    }
  }
}

# S3 bucket for CloudTrail logs
resource "aws_s3_bucket" "cloudtrail_bucket" {
  count  = var.environment == "production" ? 1 : 0
  bucket = "devonn-cloudtrail-\${var.environment}-\${random_id.bucket_suffix[0].hex}"
}

# CloudTrail bucket random suffix
resource "random_id" "bucket_suffix" {
  count       = var.environment == "production" ? 1 : 0
  byte_length = 8
}

# S3 bucket policy for CloudTrail
resource "aws_s3_bucket_policy" "cloudtrail_bucket_policy" {
  count  = var.environment == "production" ? 1 : 0
  bucket = aws_s3_bucket.cloudtrail_bucket[0].id
  
  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AWSCloudTrailAclCheck",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudtrail.amazonaws.com"
      },
      "Action": "s3:GetBucketAcl",
      "Resource": "\${aws_s3_bucket.cloudtrail_bucket[0].arn}"
    },
    {
      "Sid": "AWSCloudTrailWrite",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudtrail.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "\${aws_s3_bucket.cloudtrail_bucket[0].arn}/*",
      "Condition": {
        "StringEquals": {
          "s3:x-amz-acl": "bucket-owner-full-control"
        }
      }
    }
  ]
}
POLICY
}

# Security best practices for S3 buckets
resource "aws_s3_bucket_public_access_block" "cloudtrail_bucket_access" {
  count                   = var.environment == "production" ? 1 : 0
  bucket                  = aws_s3_bucket.cloudtrail_bucket[0].id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable S3 bucket server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "cloudtrail_bucket_encryption" {
  count  = var.environment == "production" ? 1 : 0
  bucket = aws_s3_bucket.cloudtrail_bucket[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# VPC Flow Logs for network monitoring
resource "aws_flow_log" "vpc_flow_logs" {
  count                = var.environment == "production" ? 1 : 0
  log_destination      = aws_cloudwatch_log_group.flow_log_group[0].arn
  log_destination_type = "cloud-watch-logs"
  traffic_type         = "ALL"
  vpc_id               = module.vpc.vpc_id
  iam_role_arn         = aws_iam_role.vpc_flow_log_role[0].arn
}

# Log group for VPC Flow Logs
resource "aws_cloudwatch_log_group" "flow_log_group" {
  count             = var.environment == "production" ? 1 : 0
  name              = "/aws/vpc-flow-logs/devonn-vpc-\${var.environment}"
  retention_in_days = 30
}

# IAM role for VPC Flow Logs
resource "aws_iam_role" "vpc_flow_log_role" {
  count = var.environment == "production" ? 1 : 0
  name  = "devonn-vpc-flow-log-role-\${var.environment}"
  
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "vpc-flow-logs.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

# IAM policy for VPC Flow Logs
resource "aws_iam_role_policy" "vpc_flow_log_policy" {
  count = var.environment == "production" ? 1 : 0
  name  = "devonn-vpc-flow-log-policy-\${var.environment}"
  role  = aws_iam_role.vpc_flow_log_role[0].id
  
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

# AWS Config for compliance monitoring (production only)
resource "aws_config_configuration_recorder" "devonn_config" {
  count    = var.environment == "production" ? 1 : 0
  name     = "devonn-config-recorder-\${var.environment}"
  role_arn = aws_iam_role.config_role[0].arn
  
  recording_group {
    all_supported                 = true
    include_global_resource_types = true
  }
}

# IAM role for AWS Config
resource "aws_iam_role" "config_role" {
  count = var.environment == "production" ? 1 : 0
  name  = "devonn-config-role-\${var.environment}"
  
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "config.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

# Attach AWS managed policy for Config
resource "aws_iam_role_policy_attachment" "config_policy_attachment" {
  count      = var.environment == "production" ? 1 : 0
  role       = aws_iam_role.config_role[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSConfigRole"
}`;
