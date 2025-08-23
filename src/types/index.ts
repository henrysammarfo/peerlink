export interface User {
  id: string;
  civicId: string;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  walletAddress?: string;
  bio?: string;
  avatar?: string;
  isVerified: boolean;
  profileVisibility: {
    email: boolean;
    phone: boolean;
    linkedin: boolean;
    twitter: boolean;
    walletAddress: boolean;
  };
  createdAt: Date;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  organizerId: string;
  attendees: string[];
  isActive: boolean;
  qrCode: string;
}

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  connectedAt: Date;
  eventId?: string;
  status: 'pending' | 'accepted' | 'blocked';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}