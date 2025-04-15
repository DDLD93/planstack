import { create } from 'zustand';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define interfaces for our chat data
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface PredefinedPrompt {
  id: string;
  title: string;
  content: string;
}

interface ChatState {
  messages: ChatMessage[];
  isModalOpen: boolean;
  isLoading: boolean;
  predefinedPrompts: PredefinedPrompt[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  generateResponse: (message: string) => Promise<void>;
  toggleModal: () => void;
  clearChat: () => void;
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isModalOpen: false,
  isLoading: false,
  predefinedPrompts: [
    {
      id: '1',
      title: 'Analyze power consumption',
      content: 'Analyze my feeder data for power consumption patterns and suggest optimization strategies. Present your analysis with formatted lists, tables if applicable, and highlight key insights.',
    },
    {
      id: '2',
      title: 'Explain technical terms',
      content: 'Can you explain the technical terms related to voltage regulation in simple language? Use proper formatting with headings, bullet points, and perhaps some code examples where relevant.',
    },
    {
      id: '3',
      title: 'Troubleshoot metering issues',
      content: 'What are common metering issues that could lead to inaccurate readings and how can I fix them? Present solutions in a step-by-step format with numbered lists.',
    },
    {
      id: '4',
      title: 'Revenue optimization',
      content: 'How can I optimize revenue collection based on current consumption patterns? Organize your recommendations in sections with clear headings and bullet points.',
    },
    {
      id: '5',
      title: 'Customer service improvement',
      content: 'What strategies can improve customer service in our electricity distribution system? Please include a comparative table showing pros and cons of different approaches.',
    },
    {
      id: '6',
      title: 'Markdown capabilities',
      content: 'Demonstrate your markdown capabilities by showing examples of headings, lists, tables, code blocks, blockquotes, and other formatting features.',
    },
  ],
  
  addMessage: (message) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date(),
        ...message,
      },
    ],
  })),
  
  generateResponse: async (message) => {
    const state = get();
    state.addMessage({ role: 'user', content: message });
    set({ isLoading: true });
    
    try {
      // Create a chat and send the message
      const chat = model.startChat({
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
        history: state.messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
        systemInstruction: {
          role: "system",
          parts: [{ 
            text: `You are a helpful and knowledgeable assistant for Planstack PLS electricity operations. 
            Format your responses using Markdown syntax for better readability. Use:
            - Headings (# ## ###) for organization
            - **Bold** and *italic* for emphasis
            - Bullet points and numbered lists for structured content
            - \`code\` formatting for technical terms
            - \`\`\`code blocks\`\`\` for examples
            - Tables for comparative data
            - > Blockquotes for important notes
            
            Always provide comprehensive, well-structured responses. When discussing data or metrics, 
            organize information in a visually clear way using appropriate markdown formatting.`
          }],
        },
      });
      
      // Generate a response
      const result = await chat.sendMessageStream(message);
      
      // Create a new response message with empty content initially
      const responseId = Math.random().toString(36).substring(2, 9);
      
      // Add the initial empty response
      state.addMessage({ 
        role: 'assistant', 
        content: ''
      });
      
      // Get the index of the newly added message
      const messageIndex = get().messages.length - 1;
      let fullResponse = '';
      
      // Process the streaming response
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        
        // Update the message with the current response
        set((state) => ({
          messages: state.messages.map((msg, index) => 
            index === messageIndex ? { ...msg, content: fullResponse } : msg
          ),
        }));
      }
    } catch (error) {
      console.error('Error generating response:', error);
      state.addMessage({ 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while generating a response. Please try again.' 
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
  
  clearChat: () => set({ messages: [] }),
})); 