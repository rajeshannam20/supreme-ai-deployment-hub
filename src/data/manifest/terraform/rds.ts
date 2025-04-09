
// RDS database configuration for Terraform

export const rdsConfigYaml = `# --- RDS PostgreSQL Configuration ---

# 3. RDS PostgreSQL Configuration
module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "5.2.2"

  identifier = "devonn-postgres-\${var.environment}"
  engine     = "postgres"
  engine_version = "14.9"
  instance_class = var.db_instance_class

  allocated_storage = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_encrypted = true

  name     = "devonndb"
  username = "admin"
  password = var.db_password
  port     = 5432

  vpc_security_group_ids = [module.vpc.default_security_group_id]
  db_subnet_group_name   = module.vpc.database_subnet_group
  publicly_accessible    = false
  
  # Backup configuration - enhanced for production
  backup_retention_period = var.environment == "production" ? 30 : 7
  backup_window           = "03:00-06:00"
  maintenance_window      = "Mon:00:00-Mon:03:00"
  
  # Performance Insights for better monitoring in production
  performance_insights_enabled = var.environment == "production"
  performance_insights_retention_period = 7
  
  # Enhanced monitoring for production
  monitoring_interval = var.environment == "production" ? 30 : 60
  monitoring_role_name = "devonn-rds-monitoring-role-\${var.environment}"
  create_monitoring_role = true
  
  # Multi-AZ setup for production
  multi_az = var.environment == "production"
  
  # Deletion protection in production
  deletion_protection = var.environment == "production"
  
  # Snapshots for production
  skip_final_snapshot = var.environment != "production"
  final_snapshot_identifier = var.environment == "production" ? "devonn-postgres-final-\${var.environment}" : null
  
  # Automated backups
  copy_tags_to_snapshot = true
  
  # Parameter group for PostgreSQL optimizations
  parameter_group_name = var.environment == "production" ? aws_db_parameter_group.postgres_production[0].name : null
}

# Production-optimized parameter group (only created for production environment)
resource "aws_db_parameter_group" "postgres_production" {
  count = var.environment == "production" ? 1 : 0
  
  name   = "devonn-postgres-params-\${var.environment}"
  family = "postgres14"
  
  parameter {
    name  = "max_connections"
    value = "200"
  }
  
  parameter {
    name  = "shared_buffers"
    value = "{DBInstanceClassMemory/32768}MB"
  }
  
  parameter {
    name  = "effective_cache_size"
    value = "{DBInstanceClassMemory/16384}MB"
  }
  
  parameter {
    name  = "work_mem"
    value = "8MB"
  }
  
  parameter {
    name  = "maintenance_work_mem"
    value = "64MB"
  }
  
  parameter {
    name  = "log_min_duration_statement"
    value = "1000" # Log queries taking more than 1 second
  }
}`;
