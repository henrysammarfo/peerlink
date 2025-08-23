import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Download, Share2, Copy, RefreshCw, QrCode as QrCodeIcon } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface QRSharingProps {
  user: any;
}

export const QRSharing: React.FC<QRSharingProps> = ({ user }) => {
  const [qrValue] = useState(`https://peerlink.app/u/${user?.id || 'demo'}`);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadQR = () => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `peerlink-qr-${user?.name?.replace(/\s+/g, '-').toLowerCase()}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          });
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Connect with ${user?.name} on PeerLink`,
          text: 'Scan this QR code to connect with me instantly!',
          url: qrValue,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My QR Code</h1>
        <p className="text-gray-600">
          Share your QR code to let others connect with you instantly at events.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code Display */}
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div 
              ref={qrRef}
              className="inline-block p-6 bg-white rounded-xl shadow-lg"
            >
              <QRCode
                value={qrValue}
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox="0 0 256 256"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleShare} className="flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share QR Code</span>
              </Button>
              <Button variant="secondary" onClick={handleDownloadQR}>
                <Download className="w-4 h-4 mr-2" />
                <span>Download</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={qrValue}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyLink}
                className={copied ? 'text-green-600' : ''}
              >
                <Copy className="w-4 h-4" />
                <span className="ml-1">{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* QR Code Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              How It Works
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Share Your QR Code</p>
                  <p className="text-sm text-gray-600">Display your QR code or share the link with others</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">They Scan & Connect</p>
                  <p className="text-sm text-gray-600">Others scan your code to see your public profile and connect</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Start Networking</p>
                  <p className="text-sm text-gray-600">Begin private messaging and networking instantly</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Profile Preview
            </h3>
            <div className="flex items-center space-x-4">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=60'}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{user?.name}</h4>
                <p className="text-sm text-gray-600">{user?.title}</p>
                <p className="text-xs text-purple-600">Civic Verified</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                This is what others will see when they scan your QR code. 
                Only information marked as visible in your privacy settings will be shown.
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <QrCodeIcon className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">
                  Pro Tip: Event Mode
                </h4>
                <p className="text-sm text-blue-700">
                  When joining events, your QR code automatically updates to include 
                  event context, making it easier for fellow attendees to connect with you.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};