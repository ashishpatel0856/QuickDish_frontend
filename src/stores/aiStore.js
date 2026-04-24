import { create } from 'zustand';

export const useAiStore = create((set) => ({
  isChatOpen: false,
  sessionId: null,
  chatHistory: [],
  
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setSessionId: (id) => set({ sessionId: id }),
  addMessage: (msg) => set((state) => ({ 
    chatHistory: [...state.chatHistory, msg] 
  })),
  clearHistory: () => set({ chatHistory: [], sessionId: null })
}));