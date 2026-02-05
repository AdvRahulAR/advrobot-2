/**
 * AdvRobot - AI Safety Education Platform
 * 
 * Copyright (c) 2026 Dharmabot AI Private Limited
 * All rights reserved.
 * 
 * This file is part of AdvRobot and is proprietary to Dharmabot AI Private Limited.
 * Unauthorized copying, modification, or distribution is prohibited.
 * 
 * Licensed under the MIT License. See LICENSE file in the project root.
 */

import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { Message, ResearchMode, Attachment, Assistant } from '../types';
import MessageBubble from './MessageBubble';
import PromptInput from './PromptInput';

interface ChatViewProps {
  messages: Message[];
  onSendMessage: (text: string, files: Attachment[], mode: ResearchMode, country: string) => void;
  isLoading: boolean;
  country: string;
  setCountry: (c: string) => void;
  assistants: Assistant[]; // New prop for assistants list
  onSelectActiveAssistant: (assistant: Assistant | null) => void; // New prop for selecting active assistant
}

const ChatView: React.FC<ChatViewProps> = ({ messages, onSendMessage, isLoading, country, setCountry, assistants, onSelectActiveAssistant }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isWelcome = messages.length === 0;
  
  // Track previous message length to detect new messages
  const prevMessagesLengthRef = useRef(messages.length);

  useLayoutEffect(() => {
    if (isWelcome) return;

    const isNewMessage = messages.length > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = messages.length;

    // Only scroll to bottom when a NEW message is added (User or Model start).
    // We intentionally do NOT scroll on streaming updates (same length), 
    // so the user can read the beginning of the message while it generates below.
    if (isNewMessage) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isWelcome]);

  return (
    <div className="flex flex-col h-full bg-black relative">
      {isWelcome ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
             <div className="text-center mb-8 animate-fade-in">
                 <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">AdvRobot</h1>
                 <p className="text-neutral-500 text-lg">Your AI Cyber Safety & Research Assistant.</p>
             </div>
             
             <div className="w-full max-w-3xl animate-fade-in-up">
                <PromptInput 
                    onSend={onSendMessage} 
                    isLoading={isLoading} 
                    disabled={isLoading} 
                    country={country}
                    setCountry={setCountry}
                    assistants={assistants} // Pass assistants prop
                    onSelectActiveAssistant={onSelectActiveAssistant} // Pass onSelectActiveAssistant prop
                />
             </div>
             
             {/* Disclaimer footer inside centered view */}
             <div className="text-center mt-4 text-[11px] text-neutral-600 select-none">
                AdvRobot can make mistakes. Verify critical information.
             </div>
        </div>
      ) : (
        <>
            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar"
            >
              <div className="max-w-3xl mx-auto pt-4 pb-24">
                {messages.map((msg) => (
                  <MessageBubble 
                    key={msg.id} 
                    message={msg} 
                    onRelatedClick={(text) => onSendMessage(text, [], 'standard', country)}
                  />
                ))}
                <div ref={bottomRef} />
              </div>
            </div>
          
            <div className="sticky bottom-0 z-10 bg-gradient-to-t from-black via-black to-transparent pb-6 pt-10 px-4">
                <div className="w-full max-w-3xl mx-auto">
                    <PromptInput 
                        onSend={onSendMessage} 
                        isLoading={isLoading} 
                        disabled={isLoading} 
                        country={country}
                        setCountry={setCountry}
                        assistants={assistants} // Pass assistants prop
                        onSelectActiveAssistant={onSelectActiveAssistant} // Pass onSelectActiveAssistant prop
                    />
                    <div className="text-center mt-3 text-[11px] text-neutral-600 select-none">
                        AdvRobot can make mistakes. Verify critical information.
                    </div>
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default ChatView;
