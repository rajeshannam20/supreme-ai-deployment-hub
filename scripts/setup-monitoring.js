
#!/usr/bin/env node

/**
 * AWS CloudWatch Monitoring Setup Script
 * 
 * This script sets up CloudWatch dashboards and alarms for monitoring
 * production infrastructure deployed via Terraform.
 * 
 * Requirements:
 * - AWS CLI configured with appropriate permissions
 * - Node.js 14+
 * - AWS SDK for JavaScript
 */

const { CloudWatch, CloudWatchLogs } = require('@aws-sdk/client-cloudwatch');
const { SNS } = require('@aws-sdk/client-sns');
const fs = require('fs');
const path = require('path');

// Get environment from command line or default to production
const env = process.argv[2] || 'production';
console.log(`Setting up monitoring for ${env} environment`);

// Configuration
const config = {
  region: process.env.AWS_REGION || 'us-west-2',
  clusterName: `devonn-eks-${env}`,
  dbInstanceId: `devonn-postgres-${env}`,
  alarmPrefix: `devonn-${env}`,
  snsTopicName: `devonn-${env}-alerts`,
  thresholds: {
    cpu: 80, // 80% CPU utilization
    memory: 80, // 80% Memory utilization
    disk: 80, // 80% Disk utilization
    connections: 80, // 80% of max connections
    errorRate: 1, // 1% error rate
    latency: 500 // 500ms latency
  }
};

async function main() {
  try {
    // Initialize AWS clients
    const cloudwatch = new CloudWatch({ region: config.region });
    const sns = new SNS({ region: config.region });
    
    // Create SNS topic for alerts if it doesn't exist
    console.log('Creating SNS topic for alerts...');
    const topicResponse = await sns.createTopic({ Name: config.snsTopicName });
    const topicArn = topicResponse.TopicArn;
    console.log(`SNS Topic ARN: ${topicArn}`);
    
    // Create CloudWatch Dashboard
    console.log('Creating CloudWatch dashboard...');
    const dashboardName = `Devonn-${env}-Dashboard`;
    const dashboardBody = JSON.stringify({
      widgets: [
        // Node group CPU utilization
        {
          type: 'metric',
          x: 0,
          y: 0,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              ['AWS/EKS', 'pod_cpu_utilization', 'ClusterName', config.clusterName]
            ],
            period: 300,
            stat: 'Average',
            region: config.region,
            title: 'EKS CPU Utilization'
          }
        },
        // Node group Memory utilization
        {
          type: 'metric',
          x: 12,
          y: 0,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              ['AWS/EKS', 'pod_memory_utilization', 'ClusterName', config.clusterName]
            ],
            period: 300,
            stat: 'Average',
            region: config.region,
            title: 'EKS Memory Utilization'
          }
        },
        // RDS CPU utilization
        {
          type: 'metric',
          x: 0,
          y: 6,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              ['AWS/RDS', 'CPUUtilization', 'DBInstanceIdentifier', config.dbInstanceId]
            ],
            period: 300,
            stat: 'Average',
            region: config.region,
            title: 'RDS CPU Utilization'
          }
        },
        // RDS Free Storage Space
        {
          type: 'metric',
          x: 12,
          y: 6,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              ['AWS/RDS', 'FreeStorageSpace', 'DBInstanceIdentifier', config.dbInstanceId]
            ],
            period: 300,
            stat: 'Average',
            region: config.region,
            title: 'RDS Free Storage Space'
          }
        }
      ]
    });
    
    await cloudwatch.putDashboard({
      DashboardName: dashboardName,
      DashboardBody: dashboardBody
    });
    
    console.log(`Dashboard created: ${dashboardName}`);
    
    // Create CloudWatch Alarms
    console.log('Creating CloudWatch alarms...');
    
    // EKS CPU Alarm
    await cloudwatch.putMetricAlarm({
      AlarmName: `${config.alarmPrefix}-eks-cpu-high`,
      ComparisonOperator: 'GreaterThanThreshold',
      EvaluationPeriods: 2,
      MetricName: 'pod_cpu_utilization',
      Namespace: 'AWS/EKS',
      Period: 300,
      Statistic: 'Average',
      Threshold: config.thresholds.cpu,
      ActionsEnabled: true,
      AlarmActions: [topicArn],
      AlarmDescription: `EKS CPU utilization exceeds ${config.thresholds.cpu}%`,
      Dimensions: [
        {
          Name: 'ClusterName',
          Value: config.clusterName
        }
      ]
    });
    
    // RDS CPU Alarm
    await cloudwatch.putMetricAlarm({
      AlarmName: `${config.alarmPrefix}-rds-cpu-high`,
      ComparisonOperator: 'GreaterThanThreshold',
      EvaluationPeriods: 2,
      MetricName: 'CPUUtilization',
      Namespace: 'AWS/RDS',
      Period: 300,
      Statistic: 'Average',
      Threshold: config.thresholds.cpu,
      ActionsEnabled: true,
      AlarmActions: [topicArn],
      AlarmDescription: `RDS CPU utilization exceeds ${config.thresholds.cpu}%`,
      Dimensions: [
        {
          Name: 'DBInstanceIdentifier',
          Value: config.dbInstanceId
        }
      ]
    });
    
    // RDS Free Storage Space Alarm
    await cloudwatch.putMetricAlarm({
      AlarmName: `${config.alarmPrefix}-rds-storage-low`,
      ComparisonOperator: 'LessThanThreshold',
      EvaluationPeriods: 1,
      MetricName: 'FreeStorageSpace',
      Namespace: 'AWS/RDS',
      Period: 300,
      Statistic: 'Average',
      Threshold: 20 * 1024 * 1024 * 1024, // 20 GB in bytes
      ActionsEnabled: true,
      AlarmActions: [topicArn],
      AlarmDescription: 'RDS free storage space is running low',
      Dimensions: [
        {
          Name: 'DBInstanceIdentifier',
          Value: config.dbInstanceId
        }
      ]
    });
    
    console.log('Monitoring setup complete!');
    console.log(`NOTE: Subscribe to SNS topic ${topicArn} to receive alerts`);
    
    console.log('\nNext steps:');
    console.log('1. Add email subscribers to the SNS topic');
    console.log('2. Verify the created dashboard in CloudWatch');
    console.log('3. Test the alarms by simulating threshold breaches');
    
  } catch (error) {
    console.error('Error setting up monitoring:', error);
    process.exit(1);
  }
}

main();
