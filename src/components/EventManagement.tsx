import React, { useState } from 'react';
import { Calendar, MapPin, Users, QrCode, Plus, Search, Filter } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface EventManagementProps {
  user: any;
}

export const EventManagement: React.FC<EventManagementProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'attending' | 'hosting'>('attending');
  const [searchTerm, setSearchTerm] = useState('');

  const attendingEvents = [
    {
      id: '1',
      name: 'Tech Innovators Summit 2024',
      description: 'Leading tech conference bringing together innovators and entrepreneurs',
      date: '2024-03-20',
      time: '9:00 AM - 6:00 PM',
      location: 'San Francisco Convention Center',
      attendees: 2500,
      connections: 42,
      isActive: true,
    },
    {
      id: '2',
      name: 'Web3 & Blockchain Meetup',
      description: 'Monthly meetup for blockchain enthusiasts and developers',
      date: '2024-03-25',
      time: '7:00 PM - 10:00 PM',
      location: 'TechHub Austin',
      attendees: 150,
      connections: 18,
      isActive: true,
    },
    {
      id: '3',
      name: 'Startup Pitch Night',
      description: 'Entrepreneurs pitch their ideas to investors and peers',
      date: '2024-02-15',
      time: '6:30 PM - 9:30 PM',
      location: 'Innovation Center NYC',
      attendees: 200,
      connections: 23,
      isActive: false,
    },
  ];

  const hostingEvents = [
    {
      id: '4',
      name: 'AI Product Design Workshop',
      description: 'Hands-on workshop exploring AI in product design',
      date: '2024-04-10',
      time: '2:00 PM - 5:00 PM',
      location: 'Design Studio SF',
      attendees: 75,
      registrations: 68,
      isActive: true,
    },
  ];

  const currentEvents = activeTab === 'attending' ? attendingEvents : hostingEvents;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Event Management</h1>
        <p className="text-gray-600">
          Join events, connect with attendees, and manage your networking activities.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8">
        <button
          onClick={() => setActiveTab('attending')}
          className={`px-6 py-3 font-medium text-sm rounded-lg transition-colors duration-200 ${
            activeTab === 'attending'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
          }`}
        >
          Attending Events ({attendingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('hosting')}
          className={`px-6 py-3 font-medium text-sm rounded-lg transition-colors duration-200 ${
            activeTab === 'hosting'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
          }`}
        >
          Hosting Events ({hostingEvents.length})
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          {activeTab === 'hosting' && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="space-y-6">
        {currentEvents.map((event) => (
          <Card key={event.id} hover className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {event.name}
                  </h3>
                  {event.isActive && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 lg:mt-0 lg:ml-8">
                <div className="flex flex-col space-y-3">
                  {activeTab === 'attending' ? (
                    <>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">
                          {(event as any).connections}
                        </p>
                        <p className="text-sm text-gray-500">connections made</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm">
                          <QrCode className="w-4 h-4 mr-2" />
                          Event QR
                        </Button>
                        <Button size="sm" variant="outline">
                          View Attendees
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-teal-600">
                          {(event as any).registrations}
                        </p>
                        <p className="text-sm text-gray-500">registered</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm">
                          Manage Event
                        </Button>
                        <Button size="sm" variant="outline">
                          View Analytics
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      {activeTab === 'attending' && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold text-purple-600">83</h3>
            <p className="text-sm text-gray-600">Total Connections</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold text-teal-600">12</h3>
            <p className="text-sm text-gray-600">Events Attended</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold text-orange-600">4.8</h3>
            <p className="text-sm text-gray-600">Avg Rating</p>
          </Card>
        </div>
      )}

      {/* Event Mode Info */}
      <Card className="p-6 mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <QrCode className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              Event Mode Benefits
            </h3>
            <p className="text-purple-700 mb-4">
              When you join an event, you get access to exclusive networking features:
            </p>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Auto-generated event-specific QR codes</li>
              <li>• Access to attendee directory</li>
              <li>• Event-based connection recommendations</li>
              <li>• Group messaging with fellow attendees</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};