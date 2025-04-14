
# Azure Container Apps Terraform Configuration

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  backend "azurerm" {
    # Backend configuration will be provided via CLI parameters
  }
}

provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = var.environment
    Terraform   = "true"
    Project     = "Devonn.AI"
  }
}

# Log Analytics Workspace for Container Apps
resource "azurerm_log_analytics_workspace" "workspace" {
  name                = "devonn-${var.environment}-logs"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    Environment = var.environment
    Terraform   = "true"
  }
}

# Container Apps Environment
resource "azurerm_container_app_environment" "env" {
  name                       = var.container_app_environment_name
  resource_group_name        = azurerm_resource_group.rg.name
  location                   = azurerm_resource_group.rg.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.workspace.id

  tags = {
    Environment = var.environment
    Terraform   = "true"
  }
}

# Container App
resource "azurerm_container_app" "app" {
  name                         = var.container_app_name
  resource_group_name          = azurerm_resource_group.rg.name
  container_app_environment_id = azurerm_container_app_environment.env.id
  revision_mode                = "Single"

  template {
    container {
      name   = "api"
      image  = var.image_name
      cpu    = "0.5"
      memory = "1Gi"
      
      env {
        name  = "ENVIRONMENT"
        value = var.environment
      }
      
      env {
        name  = "LOG_LEVEL"
        value = var.environment == "production" ? "INFO" : "DEBUG"
      }
    }

    min_replicas = 1
    max_replicas = 10
  }
  
  ingress {
    external_enabled = true
    target_port      = 8000
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  tags = {
    Environment = var.environment
    Terraform   = "true"
  }
}

# Application Insights for monitoring
resource "azurerm_application_insights" "insights" {
  name                = "devonn-${var.environment}-insights"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
  workspace_id        = azurerm_log_analytics_workspace.workspace.id

  tags = {
    Environment = var.environment
    Terraform   = "true"
  }
}
