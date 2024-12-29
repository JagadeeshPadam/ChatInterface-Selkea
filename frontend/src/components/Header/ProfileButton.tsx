import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '../../context/AuthContext';

export default function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-teal-50 px-3 py-2 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center">
          <span className="text-sm font-medium">{user ? getInitials(user.username) : '?'}</span>
        </div>
        <span className="hidden sm:inline">{user?.username}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      <ProfileDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}