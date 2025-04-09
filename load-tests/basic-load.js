
import http from 'k6/http';
import { sleep, check } from 'k6';

/**
 * Basic load test for Devonn.AI API
 * 
 * This script tests the API endpoints under various load scenarios
 * Run with: k6 run basic-load.js
 */

// Configuration
const API_ENDPOINT = __ENV.API_ENDPOINT || 'https://api.devonn.ai';
const API_KEY = __ENV.API_KEY || 'test-api-key';

// Test scenarios
export const options = {
  scenarios: {
    // Warm-up phase with low load
    warm_up: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '1m', target: 10 }
      ],
      gracefulRampDown: '30s',
      exec: 'warmup',
    },
    
    // Constant load test
    constant_load: {
      executor: 'constant-vus',
      vus: 20,
      duration: '3m',
      startTime: '1m30s',
      exec: 'constantLoad',
    },
    
    // Spike test to simulate traffic surges
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 5,
      stages: [
        { duration: '30s', target: 5 },
        { duration: '30s', target: 50 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 5 },
      ],
      startTime: '5m',
      exec: 'spikeTest',
    },
    
    // Stress test to find breaking points
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 5,
      stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 0 },
      ],
      startTime: '7m',
      exec: 'stressTest',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests can fail
  },
};

// Headers setup
const params = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
};

// Warm-up phase execution function - gentle load
export function warmup() {
  const res = http.get(`${API_ENDPOINT}/api/health`, params);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  sleep(1);
}

// Constant load execution function - steady traffic
export function constantLoad() {
  const endpoints = [
    '/api/health',
    '/api/status',
    '/api/users/count',
  ];
  
  const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const res = http.get(`${API_ENDPOINT}${randomEndpoint}`, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(Math.random() * 2 + 1); // Random sleep between 1-3 seconds
}

// Spike test execution function - sudden traffic increases
export function spikeTest() {
  // Mix of GET and POST requests
  if (Math.random() > 0.7) {
    // 30% POST requests
    const payload = JSON.stringify({
      message: 'Test message',
      timestamp: new Date().toISOString(),
    });
    
    const res = http.post(`${API_ENDPOINT}/api/messages`, payload, params);
    check(res, {
      'status is 201': (r) => r.status === 201,
      'response time < 1s': (r) => r.timings.duration < 1000,
    });
  } else {
    // 70% GET requests
    const res = http.get(`${API_ENDPOINT}/api/messages`, params);
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 800ms': (r) => r.timings.duration < 800,
    });
  }
  
  sleep(0.5); // Short pause between requests to generate high load
}

// Stress test execution function - finding breaking points
export function stressTest() {
  // Complex operation to stress the system
  const payload = JSON.stringify({
    query: `query {
      agents(limit: 20) {
        id
        name
        status
        capabilities {
          id
          name
          description
        }
        history(limit: 10) {
          id
          timestamp
          action
          result
        }
      }
    }`
  });
  
  const res = http.post(`${API_ENDPOINT}/api/graphql`, payload, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'contains data': (r) => r.json('data') !== null,
  });
  
  // Also test a simple endpoint to compare performance
  const healthRes = http.get(`${API_ENDPOINT}/api/health`, params);
  
  check(healthRes, {
    'health check still works': (r) => r.status === 200,
  });
  
  sleep(1);
}

export default function() {
  // This default function won't be used due to scenarios above
  warmup();
}
