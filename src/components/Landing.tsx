import React, { useState, useEffect } from 'react';
import { Shield, QrCode, Users, MessageCircle, Eye, Zap, Star, ArrowRight, CheckCircle, Chrome, MessageCircle as DiscordIcon, Twitter, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useUser } from '@civic/auth/react';

interface LandingProps {
  onLogin: (user: any) => void;
}

export const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [forceNewAuth, setForceNewAuth] = useState(true);
  
  const { user, signIn, isLoading, signOut } = useUser();

  // Clear any existing user state when component mounts to force fresh authentication
  useEffect(() => {
    if (user) {
      console.log('Existing user detected on mount, clearing state...');
      setForceNewAuth(false);
    }
  }, [user]);

  const features = [
    {
      icon: Shield,
      title: 'Civic-Verified Identity',
      description: 'Secure identity verification without revealing sensitive information',
    },
    {
      icon: QrCode,
      title: 'Instant QR Sharing',
      description: 'Generate unique QR codes for seamless networking at events',
    },
    {
      icon: Eye,
      title: 'Selective Privacy',
      description: 'Control exactly what information you share with each connection',
    },
    {
      icon: Users,
      title: 'Event Mode',
      description: 'Auto-directory for event participants with organizer tools',
    },
    {
      icon: MessageCircle,
      title: 'Private Messaging',
      description: 'In-app messaging without exchanging contact information',
    },
    {
      icon: Zap,
      title: 'Web3 Ready',
      description: 'Optional wallet integration for tipping and NFT passes',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Sign In Securely',
      description: 'Use Civic Auth to verify your identity with Google, Discord, or X',
      icon: Shield,
    },
    {
      step: '02',
      title: 'Generate Your QR',
      description: 'Create a unique QR code that represents your professional profile',
      icon: QrCode,
    },
    {
      step: '03',
      title: 'Connect Instantly',
      description: 'Scan QR codes at events to instantly connect with other professionals',
      icon: Users,
    },
    {
      step: '04',
      title: 'Control Your Privacy',
      description: 'Choose exactly what information to share with each connection',
      icon: Eye,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager at TechCorp',
      content: 'PeerLink revolutionized how I network at conferences. No more business cards, just instant connections with verified professionals.',
      avatar: 'SC',
      rating: 5,
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Startup Founder',
      content: 'The privacy controls are incredible. I can share different information with different people based on the context.',
      avatar: 'MR',
      rating: 5,
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Research Director',
      content: 'Finally, a networking tool that respects privacy while making connections effortless. The QR system is brilliant.',
      avatar: 'EW',
      rating: 5,
    },
  ];

  const handleLaunchApp = async () => {
    try {
      console.log('Launch App clicked - forcing new authentication...');
      
      // Check if Civic Auth is ready
      if (isLoading) {
        console.log('Civic Auth is still loading, please wait...');
        return;
      }
      
      if (!signIn) {
        console.error('signIn function is not available');
        setAuthError('Authentication service is not ready. Please refresh the page.');
        return;
      }
      
      // Force new authentication by clearing any existing state
      setForceNewAuth(true);
      setIsProcessing(true);
      setAuthError(null);
      
      // If there's an existing user, sign them out first to force fresh auth
      if (user) {
        console.log('Existing user detected, signing out first...');
        try {
          await signOut();
          console.log('User signed out, now starting fresh authentication...');
        } catch (signOutError) {
          console.log('Sign out failed, continuing with fresh auth...');
        }
      }
      
      // Now start fresh authentication
      console.log('Starting fresh Civic Auth authentication...');
      const result = await signIn();
      console.log('signIn() result:', result);
      
    } catch (error) {
      console.error('Civic Auth failed:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        name: error instanceof Error ? error.name : 'Unknown error type'
      });
      setAuthError('Authentication failed. Please try again.');
      setIsProcessing(false);
      setForceNewAuth(false);
    }
  };

  // Process user when they complete OAuth flow
  useEffect(() => {
    // Only process if authentication was started by user clicking Launch App
    if (user && isProcessing && forceNewAuth) { // Changed condition to forceNewAuth
      console.log('User authenticated through Civic Auth:', user);
      
      // Mark OAuth as completed to prevent multiple triggers
      // setOauthCompleted(true); // This line is removed
      
      // Determine OAuth provider from user data
      let oauthProvider: 'google' | 'discord' | 'x' | 'civic' = 'civic';
      if (user.email && user.email.includes('gmail.com')) {
        oauthProvider = 'google';
      } else if (user.email && user.email.includes('discord.com')) {
        oauthProvider = 'discord';
      } else if (user.email && user.email.includes('twitter.com')) {
        oauthProvider = 'x';
      }
      
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
        bio: `Verified through ${oauthProvider.charAt(0).toUpperCase() + oauthProvider.slice(1)} OAuth - secure, decentralized identity`,
        avatar: user.picture || getDefaultAvatar(oauthProvider),
        isVerified: true,
        oauthProvider: oauthProvider,
        profileVisibility: {
          email: false,
          phone: false,
          linkedin: false,
          twitter: false,
          walletAddress: false,
        },
        createdAt: new Date(),
      };
      
      // Store user info with proper OAuth provider
      localStorage.setItem('peerlink_oauth_provider', oauthProvider);
      localStorage.setItem('peerlink_oauth_user', JSON.stringify(user));
      
      // Mark that we should open dashboard now
      // setShouldOpenDashboard(true); // This line is removed
      
      // Small delay to ensure OAuth flow is complete, then open dashboard
      setTimeout(() => {
        console.log('OAuth completed, opening dashboard with user:', userProfile);
        onLogin(userProfile);
        setIsProcessing(false);
        // setAuthStarted(false); // This line is removed
        setForceNewAuth(false); // Reset forceNewAuth after successful login
      }, 1000);
    }
  }, [user, isProcessing, forceNewAuth, onLogin]);

  // Show loading state while OAuth is in progress
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Completing Authentication
          </h3>
          <p className="text-gray-600 mb-4">
            Please complete the authentication in the popup window
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Waiting for authentication...</span>
          </div>
        </div>
      </div>
    );
  }

  // Prevent dashboard from opening if user exists but authentication wasn't started by user
  if (user && !forceNewAuth) { // Changed condition to forceNewAuth
    console.log('User exists but authentication was not started by user - staying on landing page');
    // Don't render anything that would trigger dashboard opening
  }

  const getDefaultAvatar = (provider: 'google' | 'discord' | 'x' | 'civic') => {
    switch (provider) {
      case 'discord':
        return 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150';
      case 'x':
        return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
      case 'google':
        return 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150';
      default:
        return 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">PL</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                PeerLink
              </span>
            </div>
            
            <Button 
              onClick={handleLaunchApp} 
              disabled={isProcessing || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Initializing...
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                'Launch App'
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent leading-tight">
              PeerLink
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 mt-4 mb-8">
              Instant trusted connections — without oversharing
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Privacy-first networking that lets you connect instantly at events through QR codes, 
              with verified identities and granular control over what you share.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleLaunchApp}
                size="lg" 
                disabled={isProcessing || isLoading}
                className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Initializing...
                  </>
                ) : isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Launch App
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Watch Demo
              </Button>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-md mx-auto">
                <p className="text-sm">{authError}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started with PeerLink in just four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Icon className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-white/50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need for seamless professional networking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} hover className="p-8 text-center bg-white/80 backdrop-blur-sm">
                <div className="flex justify-center mb-6">
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100">
                    <Icon className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            What Professionals Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of professionals who trust PeerLink for their networking needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">{testimonial.avatar}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 leading-relaxed italic">
                "{testimonial.content}"
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Transform Your Networking?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already using PeerLink to build meaningful connections
          </p>
          <Button 
            onClick={handleLaunchApp}
            size="lg" 
            disabled={isProcessing || isLoading}
            className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Initializing...
              </>
            ) : isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Authenticating...
              </>
            ) : (
              <>
                Launch App Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-white">PL</span>
                </div>
                <span className="text-xl font-bold">PeerLink</span>
              </div>
              <p className="text-gray-400">
                Privacy-first professional networking with verified identities.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Security</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PeerLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};