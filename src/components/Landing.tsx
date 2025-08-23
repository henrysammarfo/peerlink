import React from 'react';
import { Shield, QrCode, Users, MessageCircle, Eye, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface LandingProps {
  onLogin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLogin }) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
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
              <Button size="lg" onClick={onLogin} className="text-lg px-8 py-4">
                Login with Civic Auth
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Networking, Reimagined
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built for privacy-conscious professionals who want seamless connections 
            without compromising their personal information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} hover className="p-8 text-center">
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

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Network Securely?
          </h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Join thousands of professionals who trust PeerLink for secure, 
            privacy-first networking at events and online communities.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={onLogin}
            className="text-lg px-10 py-4 bg-white text-purple-600 hover:bg-gray-100"
          >
            Get Started with Civic Auth
          </Button>
        </div>
      </div>
    </div>
  );
};