import React, { useState } from 'react';
import { User, Mail, Phone, Linkedin, Twitter, Wallet, Eye, EyeOff, Save, Shield } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface ProfileManagementProps {
  user: any;
  onUpdateProfile: (updates: any) => void;
}

export const ProfileManagement: React.FC<ProfileManagementProps> = ({
  user,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState(user || {});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisibility = (field: string) => {
    setFormData({
      ...formData,
      profileVisibility: {
        ...formData.profileVisibility,
        [field]: !formData.profileVisibility[field],
      },
    });
  };

  const profileFields = [
    { key: 'email', label: 'Email', icon: Mail, type: 'email' },
    { key: 'phone', label: 'Phone', icon: Phone, type: 'tel' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, type: 'url' },
    { key: 'twitter', label: 'Twitter', icon: Twitter, type: 'text' },
    { key: 'walletAddress', label: 'Wallet Address', icon: Wallet, type: 'text' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile Management</h1>
        <p className="text-gray-600">
          Control your privacy and manage what information you share with connections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="p-6 lg:col-span-1">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
              {user?.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {user?.name}
            </h2>
            <p className="text-gray-600 mb-2">{user?.title}</p>
            <p className="text-sm text-gray-500 mb-4">{user?.company}</p>
            
            {user?.isVerified && (
              <div className="flex items-center justify-center space-x-2 text-green-600 text-sm">
                <Shield className="w-4 h-4" />
                <span>Civic Verified</span>
              </div>
            )}
          </div>
        </Card>

        {/* Profile Form */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Personal Information
            </h3>
            <Button
              variant={isEditing ? "secondary" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                icon={<User className="w-4 h-4 text-gray-400" />}
              />
              <Input
                label="Job Title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <Input
              label="Company"
              value={formData.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              disabled={!isEditing}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:bg-gray-50"
                placeholder="Tell others about yourself..."
              />
            </div>

            {/* Contact Information with Privacy Controls */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-800">
                Contact Information & Privacy
              </h4>
              
              {profileFields.map((field) => {
                const Icon = field.icon;
                const isVisible = formData.profileVisibility?.[field.key];
                
                return (
                  <div key={field.key} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        label={field.label}
                        type={field.type}
                        value={formData[field.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        disabled={!isEditing}
                        icon={<Icon className="w-4 h-4 text-gray-400" />}
                      />
                    </div>
                    
                    <div className="flex flex-col items-center space-y-1 pt-6">
                      <button
                        type="button"
                        onClick={() => toggleVisibility(field.key)}
                        disabled={!isEditing}
                        className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${isVisible 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                          }
                          ${!isEditing && 'opacity-50 cursor-not-allowed'}
                        `}
                      >
                        {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <span className="text-xs text-gray-500">
                        {isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {isEditing && (
              <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSave}
                  isLoading={isSaving}
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFormData(user);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Privacy Tips */}
      <Card className="p-6 mt-8 bg-purple-50 border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">
          Privacy Tips
        </h3>
        <ul className="space-y-2 text-sm text-purple-700">
          <li>• Use the visibility controls to show only the information relevant to each networking context</li>
          <li>• Your Civic verification status is always visible to build trust</li>
          <li>• Update your privacy settings before attending different types of events</li>
          <li>• You can always adjust visibility settings even after making connections</li>
        </ul>
      </Card>
    </div>
  );
};