
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
  
  # Backup configuration
  backup_retention_period = 7
  backup_window           = "03:00-06:00"
  maintenance_window      = "Mon:00:00-Mon:03:00"

  # Enhanced monitoring
  monitoring_interval = 60
  monitoring_role_name = "devonn-rds-monitoring-role-\${var.environment}"
  
  # Deletion protection in production
  deletion_protection = var.environment == "production"
}`;
