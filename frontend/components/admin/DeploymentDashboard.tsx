'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DeploymentStatus {
  platform: string;
  status: 'success' | 'failure' | 'pending' | 'unknown';
  url?: string;
  lastDeployed?: string;
  health?: 'healthy' | 'unhealthy' | 'unknown';
}

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  responseTime?: number;
  timestamp: string;
}

const statusColors = {
  success: 'text-green-600 bg-green-50 border-green-200',
  failure: 'text-red-600 bg-red-50 border-red-200',
  pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  unknown: 'text-gray-600 bg-gray-50 border-gray-200',
};

const healthColors = {
  healthy: 'text-green-600',
  unhealthy: 'text-red-600',
  unknown: 'text-gray-600',
};

export default function DeploymentDashboard() {
  const [deployments, setDeployments] = useState<DeploymentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Sample deployment configurations
  const platforms = useMemo(() => [
    { 
      name: 'Vercel (Frontend)', 
      key: 'vercel',
      healthUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
      type: 'frontend'
    },
    { 
      name: 'GHCR (Container)', 
      key: 'ghcr',
      healthUrl: null,
      type: 'container'
    },
    { 
      name: 'Docker Hub', 
      key: 'dockerhub',
      healthUrl: null,
      type: 'container'
    },
    { 
      name: 'Heroku (Backend)', 
      key: 'heroku',
      healthUrl: process.env.NEXT_PUBLIC_HEROKU_URL,
      type: 'backend'
    },
    { 
      name: 'Railway (Backend)', 
      key: 'railway',
      healthUrl: process.env.NEXT_PUBLIC_RAILWAY_URL,
      type: 'backend'
    },
  ], []);

  const performHealthCheck = async (url: string): Promise<HealthCheckResult> => {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${url}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        return {
          status: 'healthy',
          responseTime,
          timestamp: new Date().toISOString(),
        };
      } else {
        return {
          status: 'unhealthy',
          responseTime,
          timestamp: new Date().toISOString(),
        };
      }
    } catch {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  };

  const checkDeploymentStatus = useCallback(async () => {
    setLoading(true);
    const statusPromises = platforms.map(async (platform) => {
      const status: DeploymentStatus = {
        platform: platform.name,
        status: 'unknown',
        health: 'unknown',
      };

      // For container platforms, we can't check health directly
      if (platform.type === 'container') {
        status.status = 'success'; // Assume success for container registries
        status.url = platform.key === 'ghcr' 
          ? `https://github.com/syed-reza98/Weeding/pkgs/container`
          : `https://hub.docker.com/u/syed-reza98`;
      } else if (platform.healthUrl) {
        // For platforms with health URLs, perform health checks
        try {
          const healthResult = await performHealthCheck(platform.healthUrl);
          status.health = healthResult.status;
          status.status = healthResult.status === 'healthy' ? 'success' : 'failure';
          status.url = platform.healthUrl;
          status.lastDeployed = healthResult.timestamp;
        } catch {
          status.status = 'failure';
          status.health = 'unhealthy';
        }
      }

      return status;
    });

    const results = await Promise.all(statusPromises);
    setDeployments(results);
    setLastUpdated(new Date().toLocaleString());
    setLoading(false);
  }, [platforms]);

  useEffect(() => {
    checkDeploymentStatus();
    // Refresh every 5 minutes
    const interval = setInterval(checkDeploymentStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkDeploymentStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'failure':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return '🟢';
      case 'unhealthy':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Deployment Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor the status of all deployment platforms
          </p>
        </div>
        <button
          onClick={checkDeploymentStatus}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '🔄 Checking...' : '🔄 Refresh'}
        </button>
      </div>

      {lastUpdated && (
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deployments.map((deployment, index) => (
          <Card key={index} className={`border-2 ${statusColors[deployment.status]}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{deployment.platform}</span>
                <span className="text-2xl">
                  {getStatusIcon(deployment.status)}
                </span>
              </CardTitle>
              <CardDescription>
                Status: {deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {deployment.health !== 'unknown' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Health:</span>
                    <span className={`text-sm font-medium ${healthColors[deployment.health || 'unknown']}`}>
                      {getHealthIcon(deployment.health || 'unknown')} {deployment.health}
                    </span>
                  </div>
                )}
                
                {deployment.url && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">URL:</span>
                    <a
                      href={deployment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-32"
                      title={deployment.url}
                    >
                      View →
                    </a>
                  </div>
                )}
                
                {deployment.lastDeployed && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last check:</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(deployment.lastDeployed).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deployment Information</CardTitle>
          <CardDescription>
            Quick reference for deployment platforms and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Frontend Deployments</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>Vercel:</strong> Primary frontend hosting with edge CDN</li>
                <li>• <strong>GitHub Pages:</strong> Backup static site hosting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Backend Deployments</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>Heroku:</strong> Managed platform with PostgreSQL</li>
                <li>• <strong>Railway:</strong> Modern platform with auto-scaling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Container Registries</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>GHCR:</strong> GitHub Container Registry</li>
                <li>• <strong>Docker Hub:</strong> Public container distribution</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Quick Actions</h4>
              <ul className="text-sm space-y-1">
                <li>• <a href="https://github.com/syed-reza98/Weeding/actions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">View Workflows →</a></li>
                <li>• <a href="https://github.com/syed-reza98/Weeding/pkgs/container" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">View Packages →</a></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}