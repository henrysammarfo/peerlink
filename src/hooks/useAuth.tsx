import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  loginWithCivic: () => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Civic Auth integration for development
export const mockCivicAuth = () => {
  return new Promise<User>((resolve) => {
    setTimeout(() => {
      const mockUser: User = {
        id: 'user-1',
        civicId: 'civic-verified-123',
        name: 'Alex Morgan',
        title: 'Product Designer',
        company: 'TechCorp',
        email: 'alex@techcorp.com',
        phone: '+1-555-0123',
        linkedin: 'linkedin.com/in/alexmorgan',
        twitter: '@alexmorgan',
        walletAddress: '0x1234...5678',
        bio: 'Passionate about creating user-centered digital experiences',
        avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: true,
        profileVisibility: {
          email: true,
          phone: false,
          linkedin: true,
          twitter: true,
          walletAddress: false,
        },
        createdAt: new Date(),
      };
      
      // Store mock user
      localStorage.setItem('peerlink_user', JSON.stringify(mockUser));
      resolve(mockUser);
    }, 1500);
  });
};

// Check if user is already logged in
export const checkExistingAuth = (): User | null => {
  try {
    const storedUser = localStorage.getItem('peerlink_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Convert string dates back to Date objects
      user.createdAt = new Date(user.createdAt);
      return user;
    }
  } catch (error) {
    console.error('Error parsing stored user:', error);
  }
  return null;
};

// Logout function
export const logout = () => {
  localStorage.removeItem('peerlink_user');
  localStorage.removeItem('civic_token');
  // Redirect to home or clear state
  window.location.href = '/';
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on app load
    const existingUser = checkExistingAuth();
    if (existingUser) {
      setUser(existingUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    // This would be used for traditional login if needed
    throw new Error('Traditional login not implemented. Use Civic Auth instead.');
  };

  const loginWithCivicAuth = async () => {
    setIsLoading(true);
    try {
      // For now, use mock auth since Civic Auth setup requires more configuration
      // In production, you would integrate with the actual Civic Auth flow
      const mockUser = await mockCivicAuth();
      setUser(mockUser);
    } catch (error) {
      console.error('Civic Auth login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('peerlink_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    loginWithCivic: loginWithCivicAuth,
    logout: logoutUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};