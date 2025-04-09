
// AWS App Mesh service mesh configuration

export const serviceMeshYaml = `# --- AWS App Mesh Configuration ---

# App Mesh service mesh
resource "aws_appmesh_mesh" "devonn_mesh" {
  name = "devonn-mesh-\${var.environment}"
  
  spec {
    egress_filter {
      type = "ALLOW_ALL"
    }
  }
  
  tags = {
    Environment = var.environment
    Project     = "devonn"
  }
}

# Virtual nodes for microservices
resource "aws_appmesh_virtual_node" "api_node" {
  name      = "api-node"
  mesh_name = aws_appmesh_mesh.devonn_mesh.name
  
  spec {
    listener {
      port_mapping {
        port     = 8000
        protocol = "http"
      }
      
      health_check {
        protocol            = "http"
        path                = "/api/health"
        healthy_threshold   = 2
        unhealthy_threshold = 3
        timeout_millis      = 3000
        interval_millis     = 10000
      }
    }
    
    service_discovery {
      dns {
        hostname = "api.devonn.local"
      }
    }
    
    backend {
      virtual_service {
        virtual_service_name = "database.devonn.local"
      }
    }
    
    logging {
      access_log {
        file {
          path = "/dev/stdout"
        }
      }
    }
  }
}

resource "aws_appmesh_virtual_node" "database_node" {
  name      = "database-node"
  mesh_name = aws_appmesh_mesh.devonn_mesh.name
  
  spec {
    listener {
      port_mapping {
        port     = 5432
        protocol = "tcp"
      }
    }
    
    service_discovery {
      dns {
        hostname = "database.devonn.local"
      }
    }
  }
}

resource "aws_appmesh_virtual_node" "worker_node" {
  name      = "worker-node"
  mesh_name = aws_appmesh_mesh.devonn_mesh.name
  
  spec {
    listener {
      port_mapping {
        port     = 8080
        protocol = "http"
      }
    }
    
    service_discovery {
      dns {
        hostname = "worker.devonn.local"
      }
    }
    
    backend {
      virtual_service {
        virtual_service_name = "database.devonn.local"
      }
    }
    
    backend {
      virtual_service {
        virtual_service_name = "api.devonn.local"
      }
    }
  }
}

# Virtual services
resource "aws_appmesh_virtual_service" "api_service" {
  name      = "api.devonn.local"
  mesh_name = aws_appmesh_mesh.devonn_mesh.name
  
  spec {
    provider {
      virtual_node {
        virtual_node_name = aws_appmesh_virtual_node.api_node.name
      }
    }
  }
}

resource "aws_appmesh_virtual_service" "database_service" {
  name      = "database.devonn.local"
  mesh_name = aws_appmesh_mesh.devonn_mesh.name
  
  spec {
    provider {
      virtual_node {
        virtual_node_name = aws_appmesh_virtual_node.database_node.name
      }
    }
  }
}

resource "aws_appmesh_virtual_service" "worker_service" {
  name      = "worker.devonn.local"
  mesh_name = aws_appmesh_mesh.devonn_mesh.name
  
  spec {
    provider {
      virtual_node {
        virtual_node_name = aws_appmesh_virtual_node.worker_node.name
      }
    }
  }
}

# Virtual router and routes
resource "aws_appmesh_virtual_router" "api_router" {
  name      = "api-router"
  mesh_name = aws_appmesh_mesh.devonn_mesh.name
  
  spec {
    listener {
      port_mapping {
        port     = 8000
        protocol = "http"
      }
    }
  }
}

# Canary deployment route
resource "aws_appmesh_route" "api_route" {
  name                = "api-route"
  mesh_name           = aws_appmesh_mesh.devonn_mesh.name
  virtual_router_name = aws_appmesh_virtual_router.api_router.name
  
  spec {
    http_route {
      match {
        prefix = "/"
      }
      
      # For canary deployments, split traffic between versions
      weighted_target {
        virtual_node = aws_appmesh_virtual_node.api_node.name
        weight       = 90
      }
      
      weighted_target {
        virtual_node = "api-canary-node"  # This would be created when deploying a new version
        weight       = 10
      }
      
      # Configure retries for resilience
      retry_policy {
        http_retry_events = ["server-error", "gateway-error"]
        max_retries       = 3
        
        per_retry_timeout {
          unit  = "ms"
          value = 1000
        }
      }
      
      # Circuit breaker to prevent cascading failures
      timeout {
        idle {
          unit  = "ms"
          value = 30000
        }
        
        per_request {
          unit  = "ms"
          value = 5000
        }
      }
    }
  }
}

# Envoy proxy configuration for EKS
resource "kubernetes_deployment" "envoy_proxy" {
  count = var.environment == "production" ? 1 : 0
  
  metadata {
    name      = "envoy-proxy"
    namespace = "devonn"
    
    labels = {
      app = "envoy-proxy"
    }
  }
  
  spec {
    replicas = 3
    
    selector {
      match_labels = {
        app = "envoy-proxy"
      }
    }
    
    template {
      metadata {
        labels = {
          app = "envoy-proxy"
        }
      }
      
      spec {
        container {
          name  = "envoy"
          image = "envoyproxy/envoy:v1.22.0"
          
          port {
            container_port = 9901
            name           = "admin"
          }
          
          port {
            container_port = 15001
            name           = "proxy"
          }
          
          # Envoy sidecar config would typically be injected by App Mesh controller
          args = [
            "-c", "/etc/envoy/envoy.yaml",
            "--service-cluster", "devonn-cluster",
            "--service-node", "devonn-node"
          ]
          
          env {
            name  = "APPMESH_RESOURCE_ARN"
            value = aws_appmesh_mesh.devonn_mesh.arn
          }
          
          # mTLS certificate volume mount
          volume_mount {
            name       = "envoy-certs"
            mount_path = "/etc/envoy-certs"
            read_only  = true
          }
        }
        
        # AWS App Mesh Envoy sidecars inject themselves into pods
        # This is just an example deployment for the proxy itself
        
        # TLS certificates for mTLS
        volume {
          name = "envoy-certs"
          
          secret {
            secret_name = "envoy-certs"
          }
        }
      }
    }
  }
}

# X-Ray integration for observability
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

