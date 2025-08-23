import React, { useState } from 'react';
import { Landing } from './components/Landing';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ProfileManagement } from './components/ProfileManagement';
import { QRSharing } from './components/QRSharing';
import { EventManagement } from './components/EventManagement';
import { Messaging } from './components/Messaging';
import { Web3Wallet } from './components/Web3Wallet';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import { Web3Provider } from './hooks/useWeb3';

function AppContent() {
  const { user, isLoading, loginWithCivic, logout, updateProfile } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading PeerLink...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Landing onLogin={loginWithCivic} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'profile':
        return <ProfileManagement user={user} onUpdateProfile={updateProfile} />;
      case 'qr':
        return <QRSharing user={user} />;
      case 'events':
        return <EventManagement user={user} />;
      case 'messages':
        return <Messaging user={user} />;
      case 'wallet':
        return <Web3Wallet />;
      default:
        return <Dashboard user={user} onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onLogout={logout}
      />
      {renderCurrentView()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <AppContent />
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;