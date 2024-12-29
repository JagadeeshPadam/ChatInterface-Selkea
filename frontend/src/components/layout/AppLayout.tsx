import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import MainContent from './MainContent';
import Header from '../Header/Header';
import MobileOverlay from './MobileOverlay';
import { useAuth } from '../../context/AuthContext';
import { ChatSession, Message } from '../../types/chat';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    // Create initial session if none exists
    if (sessions.length === 0) {
      createNewSession();
    }
  }, [user, navigate, sessions.length]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: new Date().toISOString()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const updateSessionMessages = (sessionId: string, messages: Message[]) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const firstMessage = messages[0]?.content || 'New Chat';
        const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
        return { ...session, messages, title };
      }
      return session;
    }));
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const currentMessages = currentSession?.messages || [];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="flex h-screen overflow-hidden">
        <div
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-30 w-64
          transition-transform duration-200 ease-in-out`}
        >
          <Sidebar 
            sessions={sessions}
            onNewChat={createNewSession}
            onSelectSession={setCurrentSessionId}
            currentSessionId={currentSessionId}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <MainContent 
            sessionId={currentSessionId}
            messages={currentMessages}
            onUpdateMessages={(messages) => updateSessionMessages(currentSessionId, messages)}
          />
        </div>

        <MobileOverlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
    </div>
  );
}