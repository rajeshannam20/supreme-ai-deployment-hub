
# Production Deployment Checklist

This document serves as a comprehensive pre-deployment checklist to ensure our infrastructure is production-ready. Use this guide before deploying to production.

## 1. Security Review

### IAM and Access Controls
- [x] Use principle of least privilege for all IAM roles
- [ ] Enable AWS CloudTrail for comprehensive API auditing
- [ ] Verify no public S3 buckets are accessible
- [ ] Review security groups to ensure minimal necessary port exposure

### Encryption and Secrets
- [x] Verify KMS key setup for EKS secrets encryption
- [ ] Enable encryption at rest for all data stores
- [ ] Use AWS Secrets Manager or Parameter Store for sensitive values
- [ ] Ensure RDS instance uses TLS for connections

### Network Security
- [x] Confirm VPC security groups only allow necessary traffic
- [ ] Implement Network ACLs as an additional security layer
- [ ] Enable VPC Flow Logs for network traffic monitoring
- [ ] Set up AWS WAF for web application protection

### Compliance
- [ ] Complete GDPR compliance review if serving European users
- [ ] Verify SOC2 compliance requirements are met
- [ ] Document all security measures for audit purposes

## 2. Resource Sizing

### EKS Cluster
```terraform
node_groups = {
  dev_nodes = {
    desired_capacity = var.node_desired_capacity  # Default: 2
    max_capacity     = var.node_max_capacity      # Default: 4
    min_capacity     = var.node_min_capacity      # Default: 1
    instance_types   = var.node_instance_types    # Default: ["t3.medium"]
  }
}
```

**Recommended Production Values:**
- `node_desired_capacity`: 3 (for high availability across AZs)
- `node_max_capacity`: 6-10 (depending on expected load)
- `node_min_capacity`: 3 (maintain minimum HA setup)
- `instance_types`: ["t3.large"] for general workloads or ["c5.large"] for compute-intensive applications

### RDS Database
```terraform
instance_class = var.db_instance_class        # Default: db.t3.micro
allocated_storage = var.db_allocated_storage  # Default: 20
max_allocated_storage = var.db_max_allocated_storage  # Default: 50
```

**Recommended Production Values:**
- `db_instance_class`: db.t3.medium (minimum) or db.t3.large for higher traffic
- `db_allocated_storage`: 50 GB (minimum for production)
- `db_max_allocated_storage`: 100-200 GB (allowing for growth)

### NAT Gateway Configuration
```terraform
single_nat_gateway = var.environment != "production"
```
This correctly ensures multiple NAT Gateways in production for high availability.

## 3. Monitoring & Alerting Setup

### Current Configuration
```terraform
# CloudWatch Logs for the EKS control plane
cluster_enabled_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
```

### Additional Monitoring Recommendations
- [ ] Set up CloudWatch Dashboards for key metrics
- [ ] Configure CloudWatch Alarms for:
  - High CPU/Memory utilization (>80%)
  - RDS connection count (>80% of max)
  - RDS storage capacity (<20% free)
  - 5xx error rates (>1% of requests)
  - API response latency (>500ms)
- [ ] Implement Amazon EventBridge rules for infrastructure events
- [ ] Set up SNS topics for alert notifications
- [ ] Integrate with PagerDuty or similar for on-call rotations

## 4. Backup & Disaster Recovery

### Current Configuration
```terraform
# RDS backup configuration
backup_retention_period = 7
backup_window = "03:00-06:00"
```

### Enhanced Backup Strategy
- [ ] Increase RDS backup retention to 30 days for production
- [ ] Enable automated database snapshots
- [ ] Set up cross-region replication for critical RDS instances
- [ ] Implement EKS cluster backup using Velero
- [ ] Document and test database restore procedures
- [ ] Create automation for regular restore testing

### Disaster Recovery Plan
- [ ] Define RPO (Recovery Point Objective) and RTO (Recovery Time Objective)
- [ ] Document complete failover procedure
- [ ] Set up infrastructure in a secondary region for critical workloads
- [ ] Implement Route53 health checks and failover routing
- [ ] Schedule quarterly DR drills

## 5. Staging Environment Testing

### Pre-Production Validation
- [ ] Deploy complete infrastructure to staging environment
- [ ] Run load tests (recommend using k6, JMeter or Locust)
- [ ] Verify auto-scaling functionality works as expected
- [ ] Test failure scenarios (instance termination, AZ failure)
- [ ] Validate all monitoring and alerting functions
- [ ] Perform security penetration testing
- [ ] Verify backup and restore procedures

### Rollout Strategy
- [ ] Document production deployment process
- [ ] Create rollback procedure
- [ ] Implement blue/green or canary deployment strategy
- [ ] Define validation checks for successful deployment

## 6. Cost Optimization

### Cost Review
- [ ] Enable AWS Cost Explorer and Budgets
- [ ] Set up cost allocation tags
- [ ] Review reserved instance opportunities
- [ ] Configure auto-scaling based on schedules for non-production environments
- [ ] Implement lifecycle policies for EBS snapshots and backups

## Deployment Sign-off

| Role | Name | Approval | Date |
|------|------|----------|------|
| DevOps Lead | | | |
| Security Officer | | | |
| Application Owner | | | |
| Operations Manager | | | |

## Post-Deployment Verification

- [ ] Verify all services are running correctly
- [ ] Confirm monitoring is active and properly configured
- [ ] Test alerting functionality
- [ ] Perform initial backup validation
- [ ] Document any issues encountered and resolutions
