import React from 'react';
import { Bot, X } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

const FloatingActionButton: React.FC = () => {
  const { isModalOpen, toggleModal } = useChatStore();

  return (
    <button
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center transition-all duration-300 z-40"
      onClick={toggleModal}
      aria-label={isModalOpen ? "Close Assistant" : "Open Assistant"}
    >
      {isModalOpen ? <X size={24} /> : <Bot size={24} />}
    </button>
  );
};

export default FloatingActionButton; 