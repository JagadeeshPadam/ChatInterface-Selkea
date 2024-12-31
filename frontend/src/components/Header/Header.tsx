import React from 'react';
import { Bot, Menu } from 'lucide-react';
import ProfileButton from './ProfileButton';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 border-b border-teal-100 bg-white shadow-sm flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-teal-50 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <Bot className="w-6 h-6 text-teal-600" />
        <h1 className="text-xl font-semibold text-gray-800">
          <span className="text-green-800">Compl</span>
          <span className="text-orange-500">AI</span>
          <span className="text-green-800"> Genie</span>
        </h1>

      </div>
      
      <ProfileButton />
    </header>
  );
}