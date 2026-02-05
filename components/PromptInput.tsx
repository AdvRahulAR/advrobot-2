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

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpIcon, PaperClipIcon, MicrophoneIcon, SearchIcon, LightningBoltIcon, BrainIcon, ChevronDownIcon, XMarkIcon } from './Icons';
import { ResearchMode, Attachment, Assistant } from '../types';
import { LEGAL_QUESTIONS } from '../data/mockData';

interface PromptInputProps {
  onSend: (text: string, files: Attachment[], mode: ResearchMode, country: string) => void;
  isLoading: boolean;
  disabled: boolean;
  country: string;
  setCountry: (c: string) => void;
  assistants: Assistant[]; // New prop for assistants list
  onSelectActiveAssistant: (assistant: Assistant | null) => void; // New prop for selecting active assistant
}

const PromptInput: React.FC<PromptInputProps> = ({ onSend, isLoading, disabled, country, setCountry, assistants, onSelectActiveAssistant }) => {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<ResearchMode>('emergency'); // Changed default mode to 'emergency'
  const [files, setFiles] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  
  // Question Suggestions
  const [filteredQuestions, setFilteredQuestions] = useState<string[]>([]);
  const [showQuestionSuggestions, setShowQuestionSuggestions] = useState(false);
  
  // Assistant Suggestions
  const [showAssistantSuggestions, setShowAssistantSuggestions] = useState(false);
  const [filteredAssistants, setFilteredAssistants] = useState<Assistant[]>([]);
  const [assistantSearchTerm, setAssistantSearchTerm] = useState('');

  const [suggestionSelected, setSuggestionSelected] = useState(false); // Used to prevent re-filtering immediately after selection
  const [showCountryPopover, setShowCountryPopover] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const countryPopoverRef = useRef<HTMLDivElement>(null);
  const typingAssistantRef = useRef(false); // Ref to track if user is actively typing an assistant name

  const POPULAR_COUNTRIES = [
    'Global', 'United States', 'India', 'European Union', 
    'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'Japan', 'China', 'Brazil', 'South Africa'
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  // Handle autocomplete/suggestions (Questions & Assistants)
  useEffect(() => {
    if (suggestionSelected) {
      setFilteredQuestions([]);
      setShowQuestionSuggestions(false);
      setFilteredAssistants([]);
      setShowAssistantSuggestions(false);
      typingAssistantRef.current = false;
      return;
    }

    const lastAtIndex = text.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      typingAssistantRef.current = true;
      const term = text.substring(lastAtIndex + 1).toLowerCase();
      setAssistantSearchTerm(term);
      setFilteredAssistants(
        assistants.filter(a => a.title.toLowerCase().includes(term))
      );
      setShowAssistantSuggestions(true);
      setShowQuestionSuggestions(false); // Hide question suggestions if typing @
    } else {
      typingAssistantRef.current = false;
      setShowAssistantSuggestions(false);
      setFilteredAssistants([]);
      setAssistantSearchTerm('');

      // Handle question suggestions
      if (text.trim().length > 0) {
        const lowerText = text.toLowerCase();
        const matches = LEGAL_QUESTIONS.filter(q => q.toLowerCase().includes(lowerText)).slice(0, 5);
        setFilteredQuestions(matches);
        setShowQuestionSuggestions(matches.length > 0);
      } else {
        setFilteredQuestions([]);
        setShowQuestionSuggestions(false);
      }
    }
  }, [text, suggestionSelected, assistants]);

  // Close country popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (countryPopoverRef.current && !countryPopoverRef.current.contains(event.target as Node)) {
            setShowCountryPopover(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [countryPopoverRef]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setSuggestionSelected(false); // Reset selection flag on manual typing
  };

  const handleSend = () => {
    if ((!text.trim() && files.length === 0) || isLoading || disabled) return;
    onSend(text, files, mode, country);
    setText('');
    setFiles([]);
    setFilteredQuestions([]);
    setShowQuestionSuggestions(false);
    setFilteredAssistants([]);
    setShowAssistantSuggestions(false);
    setSuggestionSelected(false);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove data:image/png;base64, prefix for API
            const base64Data = base64String.split(',')[1];
            setFiles(prev => [...prev, { name: file.name, type: file.type, data: base64Data }]);
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
        setIsRecording(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.start();
        
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setText(prev => prev + (prev ? " " : "") + transcript);
            setIsRecording(false);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
    } else {
        alert("Speech recognition not supported in this browser.");
    }
  };

  const handleCountrySelect = (value: string) => {
    setCountry(value === 'Global' ? '' : value);
    setShowCountryPopover(false);
  };

  const handleAssistantSelect = (assistant: Assistant) => {
    onSelectActiveAssistant(assistant);
    setText(''); // Clear input after selecting assistant
    setSuggestionSelected(true); // Mark suggestion as selected
    setShowAssistantSuggestions(false);
    setFilteredAssistants([]);
  };

  const currentSuggestions = showAssistantSuggestions ? filteredAssistants : filteredQuestions;
  const showSuggestionsPanel = showAssistantSuggestions || showQuestionSuggestions;

  return (
    <div className="w-full max-w-3xl mx-auto relative">
       {/* Suggestions Panel */}
       {showSuggestionsPanel && currentSuggestions.length > 0 && (
           <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1e1e1e] border border-neutral-800 rounded-2xl shadow-xl overflow-hidden z-20 animate-fade-in-up">
               <div className="px-4 py-2 text-xs font-bold text-neutral-500 uppercase tracking-wider bg-neutral-900/50 border-b border-neutral-800">
                   {showAssistantSuggestions ? 'Suggested Assistants' : 'Suggested Questions'}
               </div>
               <div className="flex flex-col">
                   {showAssistantSuggestions ? (
                       (currentSuggestions as Assistant[]).map((assistant, i) => (
                           <button
                               key={assistant.id}
                               onClick={() => handleAssistantSelect(assistant)}
                               className="text-left px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors border-b border-neutral-800/50 last:border-0 flex items-center gap-2"
                           >
                               <span className="text-xl">{assistant.emoji}</span> {assistant.title}
                               <span className="text-xs text-neutral-500 ml-auto">{assistant.description.split('.')[0]}</span>
                           </button>
                       ))
                   ) : (
                       (currentSuggestions as string[]).map((q, i) => (
                           <button
                               key={i}
                               onClick={() => { 
                                   setText(q); 
                                   setSuggestionSelected(true);
                                   setFilteredQuestions([]); 
                                   setShowQuestionSuggestions(false);
                               }}
                               className="text-left px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors border-b border-neutral-800/50 last:border-0"
                           >
                               {q}
                           </button>
                       ))
                   )}
               </div>
           </div>
       )}

       <div className={`relative flex flex-col w-full bg-[#1e1e1e] border border-neutral-800 transition-all duration-200 rounded-2xl ${isLoading ? 'opacity-50' : 'shadow-2xl shadow-black/50 hover:border-neutral-700'}`}>
          
          {/* Attachments Preview Area */}
          {files.length > 0 && (
             <div className="flex gap-3 px-4 pt-4 overflow-x-auto no-scrollbar">
                {files.map((f, i) => (
                    <div key={i} className="relative group flex-shrink-0 w-16 h-16 bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
                       {f.type.startsWith('image/') ? (
                          <img src={`data:${f.type};base64,${f.data}`} className="w-full h-full object-cover opacity-80" alt="preview" />
                       ) : (
                          <div className="flex items-center justify-center h-full text-[10px] text-center p-1 text-neutral-400 break-words leading-tight">{f.name.slice(0, 15)}...</div>
                       )}
                       <button 
                         onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                         className="absolute top-0 right-0 bg-neutral-900/90 text-neutral-400 p-0.5 rounded-bl hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <XMarkIcon className="w-3.5 h-3.5" />
                       </button>
                    </div>
                ))}
             </div>
          )}

          {/* Text Area */}
          <textarea
             ref={textareaRef}
             value={text}
             onChange={handleTextChange}
             onKeyDown={handleKeyDown}
             placeholder="Ask a question, or type @ to mention a cyber assistant..."
             disabled={disabled}
             className="w-full bg-transparent text-neutral-200 px-4 pt-4 pb-2 min-h-[56px] max-h-40 resize-none focus:outline-none text-[15px] leading-relaxed placeholder-neutral-500 font-medium"
             rows={1}
          />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between px-3 pb-3 mt-1 select-none">
             
             {/* Left Controls: Modes & Country */}
             <div className="flex items-center gap-2">
                {/* Mode Toggles */}
                <div className="flex items-center bg-[#2a2a2a] rounded-full p-1 gap-1">
                   <button 
                      onClick={() => setMode('standard')}
                      className={`p-1.5 rounded-full transition-all ${mode === 'standard' ? 'bg-neutral-600 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                      title="Standard Research"
                   >
                      <SearchIcon className="w-4 h-4" />
                   </button>
                   <button 
                      onClick={() => setMode('deep')}
                      className={`p-1.5 rounded-full transition-all ${mode === 'deep' ? 'bg-neutral-600 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                      title="Deep Research"
                   >
                      <BrainIcon className="w-4 h-4" />
                   </button>
                   <button 
                      onClick={() => setMode('emergency')}
                      className={`p-1.5 rounded-full transition-all ${mode === 'emergency' ? 'bg-neutral-600 text-accent-blue shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'text-neutral-500 hover:text-neutral-300'}`}
                      title="Emergency Mode"
                   >
                      <LightningBoltIcon className="w-4 h-4" />
                   </button>
                </div>

                {/* Country Selector (Pill + Popover) */}
                <div 
                    className="relative flex items-center gap-1 bg-[#2a2a2a] rounded-full px-3 py-1.5 cursor-pointer hover:bg-neutral-700 transition-colors group h-[32px]"
                    onClick={() => setShowCountryPopover(!showCountryPopover)}
                    ref={countryPopoverRef}
                >
                   <span className="text-[11px] font-bold text-neutral-400 group-hover:text-neutral-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                     {country || 'Global'}
                   </span>
                   <ChevronDownIcon className="w-3 h-3 text-neutral-500 group-hover:text-neutral-400" />

                   {showCountryPopover && (
                       <div className="absolute bottom-full left-0 mb-2 p-3 bg-[#1e1e1e] border border-neutral-800 rounded-lg shadow-xl min-w-[200px] z-30 animate-fade-in-up">
                           <input
                               type="text"
                               value={country}
                               onChange={(e) => setCountry(e.target.value)}
                               placeholder="Type country or region..."
                               className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-sm text-white focus:outline-none focus:border-accent-cyan mb-2"
                               onClick={(e) => e.stopPropagation()} // Prevent closing popover when clicking input
                           />
                           <div className="flex flex-wrap gap-1 mb-2 max-h-40 overflow-y-auto no-scrollbar">
                               {POPULAR_COUNTRIES.map(c => (
                                   <button
                                       key={c}
                                       onClick={(e) => { e.stopPropagation(); handleCountrySelect(c); }}
                                       className={`px-3 py-1 text-xs rounded-full ${
                                            (country === c) || (c === 'Global' && country === '') 
                                                ? 'bg-accent-cyan text-black font-semibold' 
                                                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                       }`}
                                   >
                                       {c}
                                   </button>
                               ))}
                           </div>
                           <button
                               onClick={(e) => { e.stopPropagation(); handleCountrySelect(''); }}
                               className="w-full mt-2 px-3 py-1.5 text-xs text-red-400 bg-neutral-800 hover:bg-neutral-700 rounded-md"
                           >
                               Clear Selection
                           </button>
                       </div>
                   )}
                </div>
             </div>

             {/* Right Controls: Attach, Mic, Send */}
             <div className="flex items-center gap-2">
                 <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                 
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                    title="Attach file"
                 >
                    <PaperClipIcon className="w-5 h-5" />
                 </button>
                 
                 <button 
                    onClick={toggleRecording}
                    className={`p-2 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-neutral-400 hover:text-white'}`}
                    title="Dictate"
                 >
                    <MicrophoneIcon className="w-5 h-5" />
                 </button>

                 <button 
                    onClick={handleSend}
                    disabled={(!text.trim() && files.length === 0) || isLoading}
                    className={`p-2 rounded-lg transition-all flex items-center justify-center w-9 h-9 ${
                        (!text.trim() && files.length === 0) || isLoading
                        ? 'bg-[#2a2a2a] text-neutral-600 cursor-not-allowed' 
                        : 'bg-neutral-200 text-neutral-900 hover:bg-white hover:scale-105'
                    }`}
                 >
                    <ArrowUpIcon className="w-5 h-5" />
                 </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default PromptInput;