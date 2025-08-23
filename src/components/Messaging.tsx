import React, { useState } from 'react';
import { Search, Send, MoreVertical, Phone, Video, Shield, Clock } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface MessagingProps {
  user: any;
}

export const Messaging: React.FC<MessagingProps> = ({ user }) => {
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'UX Designer at Figma',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=60',
      lastMessage: 'Thanks for connecting! Would love to chat about design systems.',
      timestamp: '2m ago',
      unread: 2,
      isOnline: true,
      event: 'Tech Meetup SF',
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      title: 'Blockchain Developer',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60',
      lastMessage: 'The Web3 event was great! Let me know if you want to collaborate.',
      timestamp: '1h ago',
      unread: 0,
      isOnline: false,
      event: 'Web3 Summit',
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      title: 'Product Manager at Stripe',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=60',
      lastMessage: 'Your pitch was impressive! I\'d love to discuss potential partnerships.',
      timestamp: '3h ago',
      unread: 1,
      isOnline: true,
      event: 'Startup Pitch Night',
    },
    {
      id: '4',
      name: 'David Kim',
      title: 'AI Research Scientist',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=60',
      lastMessage: 'Looking forward to our coffee chat next week!',
      timestamp: '1d ago',
      unread: 0,
      isOnline: false,
      event: 'AI Conference',
    },
  ];

  const messages = [
    {
      id: '1',
      senderId: '2',
      content: 'Hi Alex! Great meeting you at the Tech Meetup today. Your presentation on user-centered design was fantastic!',
      timestamp: '2:30 PM',
      isOwn: false,
    },
    {
      id: '2',
      senderId: '1',
      content: 'Thank you Sarah! I really enjoyed your insights on design systems. Would love to continue the conversation.',
      timestamp: '2:32 PM',
      isOwn: true,
    },
    {
      id: '3',
      senderId: '2',
      content: 'Absolutely! I\'ve been working on some interesting patterns at Figma that might align with what you\'re building.',
      timestamp: '2:35 PM',
      isOwn: false,
    },
    {
      id: '4',
      senderId: '1',
      content: 'That sounds incredible. Maybe we could set up a call this week to dive deeper?',
      timestamp: '2:40 PM',
      isOwn: true,
    },
    {
      id: '5',
      senderId: '2',
      content: 'Perfect! I\'m free Thursday afternoon or Friday morning. What works better for you?',
      timestamp: '2:42 PM',
      isOwn: false,
    },
  ];

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Add message logic here
      setMessageText('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
        <p className="text-gray-600">
          Private conversations with your connections, secured by Civic verification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`
                    p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200
                    ${selectedChat === conversation.id ? 'bg-purple-50 border-purple-200' : ''}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                      <div className="absolute -top-1 -left-1">
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {conversation.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {conversation.timestamp}
                          </span>
                          {conversation.unread > 0 && (
                            <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-xs text-purple-600 mb-1">
                        Met at {conversation.event}
                      </p>
                      
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedConversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {selectedConversation.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.title}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-xs lg:max-w-md px-4 py-2 rounded-lg
                        ${message.isOwn
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                        }
                      `}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.isOwn ? 'text-purple-200' : 'text-gray-500'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Secure Messaging
                </h3>
                <p className="text-gray-600">
                  Select a conversation to start private messaging with verified connections.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <Card className="p-6 mt-8 bg-green-50 border-green-200">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-green-600 mt-1" />
          <div>
            <h4 className="font-semibold text-green-800 mb-2">
              Privacy-First Messaging
            </h4>
            <p className="text-sm text-green-700">
              All conversations are private and secure. Messages are only shared between verified users 
              who have mutually connected through PeerLink. No personal contact information is revealed 
              unless you choose to share it explicitly.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};