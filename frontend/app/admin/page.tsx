'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Calendar, 
  MessageSquare, 
  Camera, 
  FileText, 
  BarChart3,
  Shield,
  Bell,
  Download
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface DashboardCard {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

interface RecentActivity {
  id: number;
  type: 'rsvp' | 'guestbook' | 'upload' | 'login';
  user: string;
  action: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Sample dashboard data (in real app, this would come from API)
  const dashboardCards: DashboardCard[] = [
    {
      title: 'Total RSVPs',
      count: 157,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500',
      change: '+12 this week'
    },
    {
      title: 'Confirmed Guests',
      count: 134,
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-green-500',
      change: '+8 this week'
    },
    {
      title: 'Guestbook Messages',
      count: 89,
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'bg-purple-500',
      change: '+5 today'
    },
    {
      title: 'Gallery Uploads',
      count: 234,
      icon: <Camera className="h-6 w-6" />,
      color: 'bg-pink-500',
      change: '+23 pending approval'
    }
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: 1,
      type: 'rsvp',
      user: 'Sarah Johnson',
      action: 'Confirmed attendance for Wedding Ceremony',
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      type: 'guestbook',
      user: 'Ahmed Rahman',
      action: 'Left a message in the guestbook',
      timestamp: '15 minutes ago'
    },
    {
      id: 3,
      type: 'upload',
      user: 'Fatima Ali',
      action: 'Uploaded 3 photos to gallery',
      timestamp: '1 hour ago'
    },
    {
      id: 4,
      type: 'rsvp',
      user: 'Dr. Hassan',
      action: 'Updated dietary restrictions',
      timestamp: '2 hours ago'
    },
    {
      id: 5,
      type: 'login',
      user: 'Guest User',
      action: 'First time login and RSVP',
      timestamp: '3 hours ago'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'rsvp':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'guestbook':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'upload':
        return <Camera className="h-4 w-4 text-pink-500" />;
      case 'login':
        return <Shield className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in as an admin to access this dashboard.</p>
          <a
            href="/auth/login"
            className="bg-rose-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors"
          >
            Login as Admin
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-rose-500 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Wedding Website Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <a
                href="/"
                className="text-gray-600 hover:text-rose-500 transition-colors"
              >
                ← Back to Website
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'rsvps', name: 'RSVPs', icon: <Users className="h-4 w-4" /> },
              { id: 'content', name: 'Content', icon: <FileText className="h-4 w-4" /> },
              { id: 'gallery', name: 'Gallery', icon: <Camera className="h-4 w-4" /> },
              { id: 'messages', name: 'Messages', icon: <MessageSquare className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardCards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{card.count}</p>
                      {card.change && (
                        <p className="text-sm text-gray-500 mt-1">{card.change}</p>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <div className="text-white">{card.icon}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-colors">
                      <div className="flex items-center">
                        <Download className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Export Guest List</p>
                          <p className="text-sm text-gray-500">Download complete RSVP data</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-colors">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Send Reminder</p>
                          <p className="text-sm text-gray-500">Email pending RSVPs</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-colors">
                      <div className="flex items-center">
                        <Camera className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Review Uploads</p>
                          <p className="text-sm text-gray-500">23 photos pending approval</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-colors">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Update Content</p>
                          <p className="text-sm text-gray-500">Edit website text and images</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tab content would go here */}
        {activeTab !== 'overview' && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              {activeTab === 'rsvps' && <Users className="h-16 w-16 mx-auto" />}
              {activeTab === 'content' && <FileText className="h-16 w-16 mx-auto" />}
              {activeTab === 'gallery' && <Camera className="h-16 w-16 mx-auto" />}
              {activeTab === 'messages' && <MessageSquare className="h-16 w-16 mx-auto" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 capitalize">
              {activeTab} Management
            </h3>
            <p className="text-gray-600 mb-6">
              This section would contain the detailed management interface for {activeTab}.
            </p>
            <p className="text-sm text-gray-500">
              Implementation ready - connect to backend APIs for full functionality.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}