
// Observability and monitoring configuration

export const observabilityYaml = `# X-Ray integration for observability
resource "aws_iam_role" "xray_role" {
  name = "devonn-xray-role-\${var.environment}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "xray.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "xray_role_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
  role       = aws_iam_role.xray_role.name
}

# CloudWatch dashboard for service mesh metrics
resource "aws_cloudwatch_dashboard" "service_mesh_dashboard" {
  dashboard_name = "devonn-service-mesh-\${var.environment}"
  
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/AppMesh", "TargetResponseTime", "MeshName", "devonn-mesh-\${var.environment}", "VirtualGatewayName", "gateway", "RouteId", "gateway-route-1", {"stat": "Average"}]
          ]
          title  = "API Gateway Response Time"
          period = 300
          region = var.aws_region
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/AppMesh", "HTTPCode_Target_5XX_Count", "MeshName", "devonn-mesh-\${var.environment}", "VirtualGatewayName", "gateway", {"stat": "Sum"}]
          ]
          title  = "HTTP 5XX Errors"
          period = 300
          region = var.aws_region
        }
      }
    ]
  })
}`;
