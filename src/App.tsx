import React, { useState, useEffect } from 'react';
import { CivicAuthProvider } from '@civic/auth/react';
import { Landing } from './components/Landing';
import { Navigation } from './components/Navigation';
import { ProfileManagement } from './components/ProfileManagement';
import { EventManagement } from './components/EventManagement';
import { QRSharing } from './components/QRSharing';
import { Messaging } from './components/Messaging';
import { Web3Wallet } from './components/Web3Wallet';
import { Button } from './components/ui/Button';
import './index.css';
import { Users, QrCode, Calendar, User, MessageCircle } from 'lucide-react';

interface User {
  id: string;
  civicId: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  linkedin: string;
  twitter: string;
  walletAddress: string;
  bio: string;
  avatar: string;
  isVerified: boolean;
  oauthProvider?: 'google' | 'discord' | 'x' | 'mock';
  profileVisibility: {
    email: boolean;
    phone: boolean;
    linkedin: boolean;
    twitter: boolean;
    walletAddress: boolean;
  };
  createdAt: Date;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'qr' | 'events' | 'messages' | 'wallet'>('dashboard');

  // Clear any existing login state on component mount
  useEffect(() => {
    localStorage.removeItem('peerlink_user');
    localStorage.removeItem('peerlink_wallet');
    setUser(null);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
    localStorage.removeItem('peerlink_user');
    localStorage.removeItem('peerlink_wallet');
  };

  const handleUpdateProfile = (updates: any) => {
    setUser({ ...user!, ...updates });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Header */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">PL</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome back, {user?.name}! 👋</h1>
              <p className="text-xl text-gray-600 mb-6">Your verified professional networking dashboard</p>
              <div className="flex items-center justify-center gap-2 text-green-600">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Civic Verified</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">24</h3>
                <p className="text-gray-600">Connections</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">156</h3>
                <p className="text-gray-600">QR Scans</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">8</h3>
                <p className="text-gray-600">Events</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">42</h3>
                <p className="text-gray-600">Messages</p>
              </div>
            </div>

            {/* Main Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Profile Management</h3>
                    <p className="text-gray-600">Control your privacy and professional information</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Profile Completion</span>
                    <span className="text-green-600 font-medium">95%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Privacy Settings</span>
                    <span className="text-blue-600 font-medium">Configured</span>
                  </div>
                </div>
                <Button onClick={() => setCurrentView('profile')} className="w-full">
                  Manage Profile
                </Button>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">QR Code Sharing</h3>
                    <p className="text-gray-600">Generate and share your professional QR code</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Last Generated</span>
                    <span className="text-gray-600">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Total Scans</span>
                    <span className="text-blue-600 font-medium">156</span>
                  </div>
                </div>
                <Button onClick={() => setCurrentView('qr')} className="w-full">
                  View QR Code
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">New connection with Sarah Chen</p>
                    <p className="text-sm text-gray-600">Product Manager at TechCorp</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">QR code scanned at Tech Meetup SF</p>
                    <p className="text-sm text-gray-600">Event networking</p>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Joined Web3 Summit event</p>
                    <p className="text-sm text-gray-600">Austin, TX - March 22, 2024</p>
                  </div>
                  <span className="text-xs text-gray-500">3 days ago</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-100">
                <h4 className="font-semibold text-gray-800 mb-3">Create Event</h4>
                <p className="text-gray-600 mb-4">Organize your own networking event</p>
                <Button onClick={() => setCurrentView('events')} variant="outline" className="w-full">
                  Get Started
                </Button>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
                <h4 className="font-semibold text-gray-800 mb-3">Send Message</h4>
                <p className="text-gray-600 mb-4">Connect with your network</p>
                <Button onClick={() => setCurrentView('messages')} variant="outline" className="w-full">
                  Open Chat
                </Button>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
                <h4 className="font-semibold text-gray-800 mb-3">Wallet</h4>
                <p className="text-gray-600 mb-4">Manage your Web3 assets</p>
                <Button onClick={() => setCurrentView('wallet')} variant="outline" className="w-full">
                  View Wallet
                </Button>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return <ProfileManagement user={user!} onUpdateProfile={handleUpdateProfile} />;
      case 'events':
        return <EventManagement user={user!} />;
      case 'qr':
        return <QRSharing user={user!} />;
      case 'messages':
        return <Messaging user={user!} />;
      case 'wallet':
        return <Web3Wallet user={user!} />;
      default:
        return <Landing onLogin={handleLogin} />;
    }
  };

  return (
    <CivicAuthProvider 
      clientId={import.meta.env.VITE_CIVIC_APP_ID || "5b74fab7-e455-4130-b150-56062fe80139"}
      redirectUrl={import.meta.env.VITE_CIVIC_REDIRECT_URI || "https://peerlink-do6jxlqwu-teamtitanlink.vercel.app/callback"}
      scopes={["openid", "profile", "email"]}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {!user ? (
          <Landing onLogin={handleLogin} />
        ) : (
          <>
            <Navigation 
              currentView={currentView}
              onViewChange={(view: string) => setCurrentView(view as any)}
              onLogout={handleLogout}
            />
            {renderCurrentView()}
          </>
        )}
      </div>
    </CivicAuthProvider>
  );
}

export default App;