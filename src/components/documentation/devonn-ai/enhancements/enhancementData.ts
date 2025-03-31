
import React from 'react';
import { Zap, Shield, Cpu, Server, Database, Activity } from 'lucide-react';

export interface Enhancement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

export const enhancementData: Enhancement[] = [
  {
    id: 'advanced-security',
    title: 'Advanced Security Module',
    description: 'Enhanced security features including advanced encryption, authentication, and role-based access control.',
    icon: Shield,
    color: 'from-red-500 to-red-700'
  },
  {
    id: 'performance',
    title: 'Performance Accelerator',
    description: 'Optimization toolkit for enhancing throughput and reducing latency in high-demand environments.',
    icon: Zap,
    color: 'from-amber-500 to-orange-700'
  },
  {
    id: 'gpu',
    title: 'GPU Acceleration',
    description: 'Seamless integration with GPU resources for faster model training and inference.',
    icon: Cpu,
    color: 'from-green-500 to-emerald-700'
  },
  {
    id: 'scaling',
    title: 'Auto-Scaling System',
    description: 'Intelligent resource management that scales based on demand patterns and workload analysis.',
    icon: Server,
    color: 'from-blue-500 to-indigo-700'
  },
  {
    id: 'integration',
    title: 'Enterprise Integration Hub',
    description: 'Connect with existing enterprise systems through pre-built connectors and customizable APIs.',
    icon: Database,
    color: 'from-purple-500 to-violet-700'
  },
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    description: 'Comprehensive analytics dashboard for monitoring performance, usage patterns, and system health.',
    icon: Activity,
    color: 'from-pink-500 to-rose-700'
  }
];
