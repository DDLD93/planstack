import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useChatStore, ChatMessage, PredefinedPrompt } from '../store/chatStore';
import { Button } from './ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

// Chat message component to render individual messages
const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  return (
    <div className={`flex mb-4 ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`flex items-start max-w-[80%] ${
          message.role === 'assistant' 
            ? 'bg-gray-100 text-gray-800' 
            : 'bg-red-600 text-white'
        } rounded-lg p-3 shadow`}
      >
        <div className="mr-2 mt-1">
          {message.role === 'assistant' ? (
            <Bot size={18} className="text-red-600" />
          ) : (
            <User size={18} className="text-white" />
          )}
        </div>
        <div className="markdown-content">
          {message.role === 'assistant' ? (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                // Define components for rendering different markdown elements
                p: ({node, ...props}) => <p className="whitespace-pre-wrap my-2" {...props} />,
                code: ({node, inline, className, ...props}: any) => 
                  inline 
                    ? <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600 font-mono text-sm" {...props} />
                    : <code className="block bg-gray-800 text-white p-4 rounded-md overflow-x-auto my-4 font-mono" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 my-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-2" {...props} />,
                li: ({node, ...props}) => <li className="my-1" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                table: ({node, ...props}) => <table className="border-collapse my-4 w-full" {...props} />,
                th: ({node, ...props}) => <th className="border border-gray-300 px-4 py-2 bg-gray-100" {...props} />,
                td: ({node, ...props}) => <td className="border border-gray-300 px-4 py-2" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
          <div className={`text-xs mt-1 ${message.role === 'assistant' ? 'text-gray-500' : 'text-gray-200'}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Predefined prompt button component
const PredefinedPromptButton: React.FC<{
  prompt: PredefinedPrompt;
  onClick: (content: string) => void;
}> = ({ prompt, onClick }) => (
  <button
    className="bg-gray-100 hover:bg-gray-200 text-left rounded-lg p-3 mb-2 transition-colors duration-200 flex items-center"
    onClick={() => onClick(prompt.content)}
  >
    <Sparkles size={16} className="text-red-600 mr-2" />
    <span>{prompt.title}</span>
  </button>
);

const ChatModal: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    messages, 
    isModalOpen, 
    isLoading, 
    predefinedPrompts, 
    generateResponse, 
    toggleModal, 
    clearChat 
  } = useChatStore();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      const message = inputMessage.trim();
      setInputMessage('');
      await generateResponse(message);
    }
  };

  const handlePredefinedPrompt = async (content: string) => {
    if (!isLoading) {
      setInputMessage('');
      await generateResponse(content);
    }
  };

  // Handle pressing Enter to send message (Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <Bot size={22} className="text-red-600 mr-2" />
            <h2 className="text-xl font-semibold">Planstack PLS Assistant</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              disabled={isLoading || messages.length === 0}
            >
              Clear Chat
            </Button>
            <Button
              className="hover:bg-gray-100 rounded-full p-1"
              variant="ghost"
              onClick={toggleModal}
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main chat area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <Bot size={48} className="text-red-600 mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Hello, I'm your Planstack PLS Assistant</h3>
                  <p className="text-gray-600 mb-4">
                    I can help you analyze data, provide insights, and answer questions about your Planstack PLS operations.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Ask me anything or use one of the suggested prompts.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessageItem key={message.id} message={message} />
                  ))}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex items-center relative">
                <textarea
                  ref={inputRef}
                  className="flex-1 border rounded-lg p-3 pr-10 resize-none h-12 max-h-32 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  rows={1}
                />
                <Button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5"
                >
                  <Send size={18} />
                </Button>
              </div>
              {isLoading && (
                <div className="mt-2 text-sm text-gray-500 flex items-center">
                  <div className="mr-2">AI is thinking</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Predefined prompts sidebar */}
          <div className="w-64 border-l bg-gray-50 p-4 overflow-y-auto hidden md:block">
            <h3 className="font-medium mb-3 text-gray-700">Suggested Prompts</h3>
            <div className="space-y-2">
              {predefinedPrompts.map((prompt) => (
                <PredefinedPromptButton
                  key={prompt.id}
                  prompt={prompt}
                  onClick={handlePredefinedPrompt}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal; 