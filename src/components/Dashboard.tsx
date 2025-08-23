import React from 'react';
import { Users, Calendar, MessageCircle, QrCode, Trophy, TrendingUp } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface DashboardProps {
  user: any;
  onViewChange: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onViewChange }) => {
  const stats = [
    { icon: Users, label: 'Connections', value: '42', change: '+12 this week' },
    { icon: Calendar, label: 'Events Attended', value: '8', change: '2 upcoming' },
    { icon: MessageCircle, label: 'Messages', value: '15', change: '3 unread' },
    { icon: QrCode, label: 'QR Scans', value: '127', change: '+23 today' },
  ];

  const recentConnections = [
    {
      name: 'Sarah Chen',
      title: 'UX Designer at Figma',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      event: 'Tech Meetup SF',
      time: '2 hours ago'
    },
    {
      name: 'Marcus Johnson',
      title: 'Blockchain Developer',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      event: 'Web3 Summit',
      time: '1 day ago'
    },
    {
      name: 'Elena Rodriguez',
      title: 'Product Manager at Stripe',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
      event: 'Startup Pitch Night',
      time: '2 days ago'
    }
  ];

  const upcomingEvents = [
    {
      name: 'AI & Machine Learning Conference',
      date: 'Mar 15, 2024',
      location: 'San Francisco, CA',
      attendees: 250
    },
    {
      name: 'Crypto Developers Meetup',
      date: 'Mar 22, 2024',
      location: 'Austin, TX',
      attendees: 80
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your networking world.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-xs text-green-600">{stat.change}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Connections */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Connections
            </h2>
            <Button variant="ghost" onClick={() => onViewChange('connections')}>
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentConnections.map((connection, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                <img
                  src={connection.avatar}
                  alt={connection.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{connection.name}</h3>
                  <p className="text-sm text-gray-600">{connection.title}</p>
                  <p className="text-xs text-purple-600">{connection.event} • {connection.time}</p>
                </div>
                <Button size="sm" variant="outline">
                  Message
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Upcoming Events
            </h2>
            <Button variant="ghost" onClick={() => onViewChange('events')}>
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                <h3 className="font-medium text-gray-800 mb-2">{event.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{event.date}</span>
                  <span>•</span>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-purple-600">
                    {event.attendees} attendees
                  </span>
                  <Button size="sm">
                    Join Event
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={() => onViewChange('qr')} className="flex items-center space-x-2">
              <QrCode className="w-4 h-4" />
              <span>Share My QR</span>
            </Button>
            <Button variant="secondary" onClick={() => onViewChange('events')}>
              <Calendar className="w-4 h-4 mr-2" />
              <span>Join Event</span>
            </Button>
            <Button variant="outline" onClick={() => onViewChange('profile')}>
              <Users className="w-4 h-4 mr-2" />
              <span>Edit Profile</span>
            </Button>
            <Button variant="ghost" onClick={() => onViewChange('messages')}>
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>Messages</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};