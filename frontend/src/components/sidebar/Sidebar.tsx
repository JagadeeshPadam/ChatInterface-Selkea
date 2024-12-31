import React from 'react';
import { MessageSquarePlus, MessagesSquare } from 'lucide-react';
import { ChatSession } from '../../types/chat';

interface SidebarProps {
  sessions: ChatSession[];
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  currentSessionId: string;
}

export default function Sidebar({ sessions, onNewChat, onSelectSession, currentSessionId }: SidebarProps) {
  // Remove duplicates based on session ID
  const uniqueSessions = Array.from(new Map(sessions.map(session => [session.id, session])).values());
  console.log(uniqueSessions)
  return (
    <div className="h-full bg-teal-50 w-64 p-4 flex flex-col">
      <button 
        onClick={onNewChat}
        className="flex items-center gap-2 w-full p-3 bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors mb-4"
      >
        <MessageSquarePlus className="w-5 h-5" />
        <span>New Chat</span>
      </button>
      
      <div className="flex-1 overflow-y-auto space-y-2">
        {uniqueSessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`flex items-center gap-2 p-3 hover:bg-teal-100 rounded-lg cursor-pointer transition-colors
              ${currentSessionId === session.id ? 'bg-teal-100' : ''}`}
          >
            <MessagesSquare className="w-4 h-4 text-teal-600" />
            <div className="flex-1 truncate">
              <p className="text-sm text-gray-800">{session.title}</p>
              <p className="text-xs text-gray-500">
                {/* {new Date(session.timestamp).toLocaleDateString()} */}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
