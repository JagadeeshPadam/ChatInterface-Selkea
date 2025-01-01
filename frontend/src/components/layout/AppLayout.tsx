// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../sidebar/Sidebar';
// import MainContent from './MainContent';
// import Header from '../Header/Header';
// import MobileOverlay from './MobileOverlay';
// import { useAuth } from '../../context/AuthContext';
// import { ChatSession, Message } from '../../types/chat';

// export default function AppLayout() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [sessions, setSessions] = useState<ChatSession[]>([]);
//   const [currentSessionId, setCurrentSessionId] = useState<string>('');
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user) {
//       navigate('/signin');
//       return;
//     }
    
//     // Create initial session if none exists
//     if (sessions.length === 0) {
//       createNewSession();
//     }
//   }, [user, navigate, sessions.length]);

//   const createNewSession = () => {
//     const newSession: ChatSession = {
//       id: Date.now().toString(),
//       title: 'New Chat',
//       messages: [],
//       timestamp: new Date().toISOString()
//     };
//     setSessions(prev => [newSession, ...prev]);
//     setCurrentSessionId(newSession.id);
//   };

//   const updateSessionMessages = (sessionId: string, messages: Message[]) => {
//     setSessions(prev => prev.map(session => {
//       if (session.id === sessionId) {
//         const firstMessage = messages[0]?.content || 'New Chat';
//         const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
//         return { ...session, messages, title };
//       }
//       return session;
//     }));
//   };

//   const currentSession = sessions.find(s => s.id === currentSessionId);
//   const currentMessages = currentSession?.messages || [];

//   return (
//     <div className="min-h-screen bg-white text-gray-800">
//       <div className="flex h-screen overflow-hidden">
//         <div
//           className={`${
//             isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-30 w-64
//           transition-transform duration-200 ease-in-out`}
//         >
//           <Sidebar 
//             sessions={sessions}
//             onNewChat={createNewSession}
//             onSelectSession={setCurrentSessionId}
//             currentSessionId={currentSessionId}
//           />
//         </div>

//         <div className="flex-1 flex flex-col min-w-0">
//           <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
//           <MainContent 
//             sessionId={currentSessionId}
//             messages={currentMessages}
//             onUpdateMessages={(messages) => updateSessionMessages(currentSessionId, messages)}
//           />
//         </div>

//         <MobileOverlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import MainContent from './MainContent';
import Header from '../Header/Header';
import MobileOverlay from './MobileOverlay';
import { useAuth } from '../../context/AuthContext';
import { ChatSession, Message } from '../../types/chat';
import axios from 'axios';

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

    // Fetch session titles from the backend
    fetchSessions();
  }, [user, navigate]);

  const fetchSessions = async () => {
    try {
      const response = await axios.post('http://localhost:8000/chat/session', {
        username: user?.username,
      });
      const fetchedSessions: ChatSession[] = response.data.session;
  
      if (fetchedSessions.length > 0) {
        // Sort sessions by `created_at` in descending order
        const sortedSessions = fetchedSessions.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
  
        // Set the current session ID to the most recent session
        setCurrentSessionId(sortedSessions[-1].id);
      } else {
        // Create a new session if no sessions exist
        createNewSession();
      }
  
      // Update sessions state
      setSessions(fetchedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };
  

  const createNewSession = async () => {
    try {
      const requestBody={
        username: user?.username
      }
      const response = await fetch("http://localhost:8000/chat/create_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      const newSession: ChatSession = {
        id: data.session_id,
        title: 'New Chat',
        messages: [],
        timestamp: new Date().toISOString(),
      };
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
    } catch (error) {
      console.error('Error creating a new session:', error);
    }
  };

  // const updateSessionMessages = async (sessionId: string, messages: Message[]) => {
  //   try {
  //     const firstMessage = messages[0]?.content || 'New Chat';
  //     const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');

  //     // Update the session title on the backend
  //     await axios.post('http://localhost:8000/chat/update_session', {
  //       session_id: sessionId,
  //       username: user?.username,
  //       title,
  //     });

  //     // Update the session title locally
  //     setSessions((prev) =>
  //       prev.map((session) => {
  //         if (session.id === sessionId) {
  //           return { ...session, messages, title };
  //         }
  //         return session;
  //       }),
  //     );
  //   } catch (error) {
  //     console.error('Error updating session messages:', error);
  //   }
  // };

  const updateSessionMessages = async (sessionId: string, messages: Message[]) => {
        setSessions(prev => prev.map(session => {
          if (session.id === sessionId) {
            
            return { ...session, messages, title };
          }
          return session;
        }
      ));
      const firstMessage = messages[0]?.content || 'New Chat';
      const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
      const requestBody={
        session_id: sessionId,
        title:title, 
        username: user?.username
      }
      const response = await fetch("http://localhost:8000/chat/update_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      console.log(data);
      };
  const currentSession = sessions.find((s) => s.id === currentSessionId);
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
