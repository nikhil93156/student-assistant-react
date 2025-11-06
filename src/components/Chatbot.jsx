import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useStudent } from '../context/StudentContext';

// Initialize Google GenAI client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const MODEL_NAME = "gemini-2.5-flash";
const ALLOWED_STREAMS = ['Science', 'Commerce', 'Arts']; // Defined once for both functions

const Chatbot = ({ initialQuestion }) => {
  const { studentData, activeStreamData } = useStudent();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- API Communication Function (Contains System Instructions) ---
  const sendToGemini = useCallback(async (textToSend, history) => {
    setIsLoading(true);

    const streamContext = activeStreamData?.context || 
                          "You are a general 10th-grade academic assistant. Be accurate and honest.";

    // *** FINAL, MOST RESTRICTIVE SYSTEM INSTRUCTION ***
    const systemInstruction = 
        `***MANDATORY ROLE***: You are solely a **BRUTALLY HONEST, expert 10th-grade Career Counselor**. 
        
        **YOUR ENTIRE KNOWLEDGE BASE IS RESTRICTED TO THESE THREE STREAMS: ${ALLOWED_STREAMS.join(', ')}.**
        
        You only provide guidance related to **Career Paths, Educational Streams, Subject Choice, or Top Educational Institutions** that fall under one of those three domains.
        
        **CRITICAL STYLE CONSTRAINT**: You must maintain a strictly professional, formal, and analytical tone. **You are absolutely forbidden from using humor, jokes, emojis, greetings, or conversational filler phrases.** Your responses must be direct, factual, and focused only on the career/education query.
        
        **CRITICAL FAILURE MODE**: If a user asks a question outside of the scope of ${ALLOWED_STREAMS.join(', ')} (e.g., entertainment, general knowledge, or other non-career topics), you **MUST** immediately stop and respond with: "My role is strictly limited to guidance within the Science, Commerce, and Arts streams. I cannot discuss that topic."
        
        **Base Context**: ${streamContext} Your core personality is brutally honest, truth-speaking, and highly knowledgeable. You must never lie or give misleading information. The student's name is ${studentData?.name || 'Student'} and their focus subject is ${studentData?.focusSubject || 'general studies'}.`;
    // ************************************************************


    const apiMessages = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    try {
      const chat = ai.chats.create({
        model: MODEL_NAME,
        systemInstruction: systemInstruction,
        history: apiMessages
      });

      const response = await chat.sendMessage({ message: textToSend });
      const responseText = response.text;

      const botMessage = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'model'
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, there was a severe error connecting to the assistant. Please check your API key, network, or server logs.",
        sender: 'model'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [activeStreamData, studentData]);

  // --- Message Handler (Includes Client-Side Filter) ---
  const handleSendMessage = useCallback((textToSend) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessageText = textToSend.trim();
    const lowerText = userMessageText.toLowerCase();

    const offTopicPattern = /movie|film|joke|list|ranking|top\s*\d+|celebrity|dating|love|crush|anxiety|feel\s*bad|personal\s*problem|capital\s*of|define\s*|who\s*is|what\s*is\s*the\s*best|how\s*to\s*make/;

    if (offTopicPattern.test(lowerText) || !ALLOWED_STREAMS.some(s => lowerText.includes(s.toLowerCase())) && !lowerText.includes('career')) {
      
      // Internal rejection message—guaranteed delivery and no API cost
      const blockMessage = {
        id: Date.now() + 0.5,
        text: `My role is strictly limited to guidance within the ${ALLOWED_STREAMS.join(', ')} streams. I cannot discuss that topic.`,
        sender: 'model'
      };

      const userMessage = { id: Date.now(), text: userMessageText, sender: 'user' };
      setMessages((prev) => [...prev, userMessage, blockMessage]);
      setInput('');
      return;
    }
    // ----------------------------------------------------------------------

    const userMessage = { id: Date.now(), text: userMessageText, sender: 'user' };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    sendToGemini(userMessageText, [...messages, userMessage]);

  }, [messages, isLoading, sendToGemini]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (initialQuestion) {
      setIsOpen(true);
      handleSendMessage(initialQuestion);
    }
  }, [initialQuestion, handleSendMessage]);

  const handleInputSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(input.trim());
  };

  return (
    <div className="fixed top-8 right-8 z-50">

      {isOpen && (
        <div className="flex flex-col h-[400px] w-80 bg-white rounded-xl shadow-2xl border border-gray-200 mb-4 transition-all duration-300 transform scale-100 opacity-100">
          <div className="p-4 border-b bg-indigo-600 text-white rounded-t-xl flex justify-between items-center">
            <h3 className="font-bold">10th Grade Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:opacity-75 transition"
              title="Minimize Chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-grow p-4 space-y-4 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 italic">
                👋 Ask a question about your 10th-grade stream options!
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${msg.sender === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleInputSubmit} className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? "Waiting for response..." : "Type your query..."}
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`font-bold py-2 px-4 rounded-r-md transition duration-150 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                disabled={isLoading}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
        title={isOpen ? "Minimize Chat" : "Open Assistant Chat"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Chatbot;