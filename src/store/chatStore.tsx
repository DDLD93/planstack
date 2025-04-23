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
      title: 'Analyze property evaluation',
      content: 'Analyze our property data for evaluation price patterns across different regions and property types. What insights can you provide about how property values vary by location and property characteristics?',
    },
    {
      id: '2',
      title: 'Explain tax compliance',
      content: 'Can you explain the different tax status categories in our system and provide best practices for improving tax compliance rates? Please format your response with clear sections and bullet points.',
    },
    {
      id: '3',
      title: 'Property valuation factors',
      content: 'What are the main factors that influence property evaluation prices in our system? How do elements like location, property size, and property type impact overall valuation?',
    },
    {
      id: '4',
      title: 'Revenue optimization strategies',
      content: 'Based on our property evaluation data, what strategies would you recommend to optimize revenue collection? Please organize your recommendations by region and property type.',
    },
    {
      id: '5',
      title: 'Regional property analysis',
      content: 'Compare property metrics across different LGAs in our system. Which areas have the highest property values and what characteristics contribute to this? Please include a comparative table in your response.',
    },
    {
      id: '6',
      title: 'Property size vs. evaluation',
      content: 'Analyze the relationship between property size and evaluation price in our data. Is there a consistent correlation or does it vary by region and property type? Please include any notable patterns in your analysis.',
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
            text: `You are a helpful and knowledgeable assistant for Lands and Survey property management system. 
            You provide insights on property evaluation, tax status, and regional analytics.
            
            Format your responses using Markdown syntax for better readability. Use:
            - Headings (# ## ###) for organization
            - **Bold** and *italic* for emphasis
            - Bullet points and numbered lists for structured content
            - \`code\` formatting for technical terms
            - \`\`\`code blocks\`\`\` for examples
            - Tables for comparative data
            - > Blockquotes for important notes
            
            You understand property metrics including owner information, location data, property type,
            property size, tax status, region/LGA/ward classifications, and most importantly, property evaluation prices.
            
            Always provide comprehensive, well-structured responses. When discussing property data or metrics, 
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