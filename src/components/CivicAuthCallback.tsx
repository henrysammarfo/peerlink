import React, { useEffect } from 'react';
import { useUser } from '@civic/auth/react';
import { Loader2 } from 'lucide-react';

interface CivicAuthCallbackProps {
  onLogin: (user: any) => void;
}

export const CivicAuthCallback: React.FC<CivicAuthCallbackProps> = ({ onLogin }) => {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User successfully authenticated
        console.log('Civic Auth callback successful, user:', user);
        
        // Create user profile from Civic Auth data
        const userProfile = {
          id: user.id || `civic-${Date.now()}`,
          civicId: user.id || `civic-${Date.now()}`,
          name: user.name || user.email?.split('@')[0] || 'Civic User',
          title: 'Civic Verified User',
          company: 'Civic Auth',
          email: user.email || 'user@civic.com',
          phone: '',
          linkedin: '',
          twitter: '',
          walletAddress: `0xcivic-${Date.now()}`,
          bio: 'Verified through Civic Auth - secure, decentralized identity',
          avatar: user.picture || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150',
          isVerified: true,
          oauthProvider: 'twitter',
          profileVisibility: {
            email: false,
            phone: false,
            linkedin: false,
            twitter: false,
            walletAddress: false,
          },
          createdAt: new Date(),
        };
        
        // Store user data
        localStorage.setItem('peerlink_user', JSON.stringify(userProfile));
        localStorage.setItem('peerlink_oauth_provider', 'civic');
        
        // Call onLogin to open dashboard
        onLogin(userProfile);
      } else {
        // Authentication failed
        console.log('Civic Auth callback failed');
        // Could redirect back to landing or show error
      }
    }
  }, [user, isLoading, onLogin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Completing Authentication
        </h3>
        <p className="text-gray-600">
          Please wait while we complete your authentication...
        </p>
      </div>
    </div>
  );
};
