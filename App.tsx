
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

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import AICyberSafetyToolsView from './components/AICyberSafetyToolsView';
import JailbreakView from './components/JailbreakView';
import AuthentiScanView from './components/AuthentiScanView';
import HistoryView from './components/HistoryView';
import LandingView from './components/LandingView';
import { Message, ResearchMode, Attachment, Assistant, FailureDetails, Thread, AuthentiScanResult } from './types';
import { streamAiResponse, getRelatedQuestions } from './services/gemini';
import { FEATURED_ASSISTANTS, JAILBREAK_LEVELS } from './data/mockData';
import { XMarkIcon } from './components/Icons';
import FailureModal from './components/FailureModal';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [activeAssistant, setActiveAssistant] = useState<Assistant | null>(null);
  
  // Initialize messages from local storage if available
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
        const saved = localStorage.getItem('advrobot_current_chat');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState('India');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [lastSentPrompt, setLastSentPrompt] = useState<string>('');

  // History State
  const [chatHistory, setChatHistory] = useState<Thread[]>(() => {
    try {
        const saved = localStorage.getItem('advrobot_chat_history');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });

  const [scanHistory, setScanHistory] = useState<AuthentiScanResult[]>(() => {
    try {
        const saved = localStorage.getItem('advrobot_scan_history');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });

  const [selectedScanResult, setSelectedScanResult] = useState<AuthentiScanResult | null>(null);

  // Failure Modal States
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [failureDetails, setFailureDetails] = useState<FailureDetails | null>(null);

  // Check for API Key on mount
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        if ((window as any).aistudio) {
          const has = await (window as any).aistudio.hasSelectedApiKey();
          setHasApiKey(has);
        } else {
          setHasApiKey(true);
        }
      } catch (e) {
        console.error("Failed to check API key:", e);
        setHasApiKey(false);
      }
    };
    checkApiKey();
  }, []);

  // Persist Current Chat
  useEffect(() => {
    try {
        localStorage.setItem('advrobot_current_chat', JSON.stringify(messages));
    } catch (e) {
        console.warn("Failed to save chat to local storage", e);
    }
  }, [messages]);

  // Persist History
  useEffect(() => {
    localStorage.setItem('advrobot_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('advrobot_scan_history', JSON.stringify(scanHistory));
  }, [scanHistory]);


  const handleSelectApiKey = async () => {
    if ((window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
        setHasApiKey(true);
    }
  };

  const saveCurrentChatToHistory = () => {
    if (messages.length > 0) {
        // Only save if there's actual content
        const title = messages[0].content.substring(0, 40) + (messages[0].content.length > 40 ? '...' : '');
        const newThread: Thread = {
            id: Date.now().toString(),
            title: activeAssistant ? `${activeAssistant.emoji} ${title}` : title,
            messages: [...messages],
            assistantId: activeAssistant?.id,
            lastUpdatedAt: Date.now()
        };
        setChatHistory(prev => [newThread, ...prev]);
    }
  };

  const handleSendMessage = async (text: string, files: Attachment[], mode: ResearchMode, selectedCountry: string) => {
    setLastSentPrompt(text);
    
    const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        attachments: files,
        timestamp: Date.now()
    };
    
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        content: '',
        timestamp: Date.now(),
        isStreaming: true
    }]);

    try {
        let modelContent = "";
        let sources: any[] = [];

        await streamAiResponse(
            updatedMessages,
            mode,
            activeAssistant?.instructions,
            selectedCountry || activeAssistant?.country,
            (chunkText) => {
                modelContent = chunkText;
                setMessages(prev => prev.map(m => 
                    m.id === modelMsgId ? { ...m, content: modelContent } : m
                ));
            },
            (fetchedSources) => {
                sources = fetchedSources;
                setMessages(prev => prev.map(m => 
                    m.id === modelMsgId ? { ...m, sources: fetchedSources } : m
                ));
            }
        );

        const related = await getRelatedQuestions(modelContent);
        
        setMessages(prev => prev.map(m => 
            m.id === modelMsgId ? { ...m, isStreaming: false, relatedQuestions: related } : m
        ));

    } catch (error: any) {
        console.error("AdvRobot AI error:", error);
        
        const isJailbreakRelated = JAILBREAK_LEVELS.some(level => 
            level.prompt.replace(/\s+/g, ' ').trim() === text.replace(/\s+/g, ' ').trim()
        );

        if (error.message?.includes('Requested entity was not found') || error.message?.includes('API key not valid')) {
            setHasApiKey(false);
            setMessages(prev => prev.map(m => 
                m.id === modelMsgId ? { ...m, role: 'error', content: "API Key Invalid. Please select a valid key.", isStreaming: false } : m
            ));
        } else if (isJailbreakRelated) {
            setFailureDetails({
                title: "Jailbreak Protocol Engaged!",
                message: "AdvRobot detected a potential adversarial prompt attempting to bypass safety protocols. The system has automatically engaged defensive measures and recorded the attempt. This is part of our continuous reinforcement against emerging attack patterns.",
                steps: [
                    "1. Do not repeat the adversarial prompt.",
                    "2. Review the Jailbreak Protocol Reinforcement section to understand defensive strategies.",
                    "3. If this was an unintended error, try rephrasing your request in a non-adversarial manner.",
                    "4. Report persistent issues or false positives to system administrators."
                ],
                researchTopic: "Adversarial Prompt Detection",
                isJailbreakRelated: true
            });
            setShowFailureModal(true);
            setMessages(prev => prev.map(m => 
                m.id === modelMsgId ? { ...m, role: 'error', content: "Jailbreak attempt detected. Defensive protocols engaged.", isStreaming: false } : m
            ));
        }
        else {
            setFailureDetails({
                title: "AI Processing Error",
                message: "AdvRobot encountered an issue while processing your request. This could be due to temporary network problems, an invalid API response, or specific content triggering a model safety filter.",
                steps: [
                    "1. Check your internet connection: Ensure you have stable network access.",
                    "2. Retry your request: Sometimes, transient issues resolve themselves.",
                    "3. Refine your prompt: Try rephrasing your question or removing sensitive information, as certain content might violate safety guidelines.",
                    "4. Contact Support: If the issue persists, please report this incident."
                ],
                researchTopic: "Network Security Audit Fundamentals"
            });
            setShowFailureModal(true);
            setMessages(prev => prev.map(m => 
                m.id === modelMsgId ? { ...m, role: 'error', content: "Connection intercepted. Please try again.", isStreaming: false } : m
            ));
        }
    } finally {
        setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    saveCurrentChatToHistory();
    setMessages([]);
    setActiveAssistant(null);
    setCurrentView('home');
    setCountry('India');
    setLastSentPrompt('');
  };

  const handleApiKeyError = () => {
    setHasApiKey(false);
  };

  const handleResearchNow = (topic: string) => {
    const networkAuditor = FEATURED_ASSISTANTS.find(a => a.id === 'network-security-auditor');
    if (networkAuditor) {
        saveCurrentChatToHistory(); // Save current before switching context
        setMessages([]);
        setActiveAssistant(networkAuditor);
        setCurrentView('home');
        handleSendMessage(`Perform a general network security audit for a small business, focusing on ${topic.toLowerCase()}.`, [], 'standard', country);
    } else {
        console.error("Network Security Auditor assistant not found!");
        alert("The requested assistant could not be found. Please try a new chat.");
    }
  };

  const handleViewJailbreakReinforcement = () => {
    setCurrentView('help');
    setShowFailureModal(false);
  };

  const handleScanComplete = (result: AuthentiScanResult) => {
      setScanHistory(prev => [result, ...prev]);
  };

  const restoreChat = (thread: Thread) => {
      // Save current if needed
      saveCurrentChatToHistory();
      
      setMessages(thread.messages);
      if (thread.assistantId) {
          const assistant = FEATURED_ASSISTANTS.find(a => a.id === thread.assistantId);
          setActiveAssistant(assistant || null);
      } else {
          setActiveAssistant(null);
      }
      setCurrentView('home');
  };

  const deleteChat = (id: string) => {
      setChatHistory(prev => prev.filter(t => t.id !== id));
  };

  const deleteScan = (id: string) => {
      setScanHistory(prev => prev.filter(s => s.id !== id));
  };

  // Show API Key Selection Screen if not selected
  if (hasApiKey === false) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6">
            <div className="max-w-md text-center">
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-accent-cyan to-blue-500 bg-clip-text text-transparent">
                    API Key Required
                </h1>
                <p className="text-neutral-400 mb-8 leading-relaxed">
                    To access AdvRobot's advanced cyber safety tools and models, you must select a valid API Key.
                </p>
                <button 
                    onClick={handleSelectApiKey}
                    className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-white/10"
                >
                    Select API Key
                </button>
                <div className="mt-8 text-sm text-neutral-600">
                    <p>Make sure to select a project with billing enabled.</p>
                    <a 
                        href="https://ai.google.dev/gemini-api/docs/billing" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-accent-cyan hover:underline mt-2 inline-block"
                    >
                        View Billing Documentation
                    </a>
                </div>
            </div>
        </div>
    );
  }

  if (hasApiKey === null) {
      return <div className="h-screen w-full bg-black flex items-center justify-center text-neutral-500">Initializing...</div>;
  }

  const renderView = () => {
    switch(currentView) {
        case 'landing':
            return <LandingView onGetStarted={() => setCurrentView('home')} />;
        case 'home':
            return <ChatView 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
                country={country}
                setCountry={setCountry}
                assistants={FEATURED_ASSISTANTS}
                onSelectActiveAssistant={(a) => {
                    // If switching assistant, maybe consider new chat behavior?
                    // For now, just switch context
                    setActiveAssistant(a);
                }}
            />;
        case 'tools':
            return <AICyberSafetyToolsView onSelectTool={(t) => setCurrentView(t)} />;
        case 'jailbreak':
            return <JailbreakView />;
        case 'authentiscan':
            return <AuthentiScanView 
                onApiKeyError={handleApiKeyError} 
                onScanComplete={handleScanComplete}
                initialResult={selectedScanResult}
            />;
        case 'history':
            return <HistoryView 
                chats={chatHistory}
                scans={scanHistory}
                onSelectChat={restoreChat}
                onSelectScan={(scan) => {
                    setSelectedScanResult(scan);
                    setCurrentView('authentiscan');
                }}
                onDeleteChat={deleteChat}
                onDeleteScan={deleteScan}
            />;
        case 'help':
            return (
                <div className="p-8 text-white max-w-4xl mx-auto overflow-y-auto h-full">
                    <h1 className="text-3xl font-bold mb-4">Help & Documentation</h1>
                    <p className="text-neutral-300 mb-8">AdvRobot is a secure environment. Use the navigation to access tools and specialized agents.</p>

                    <div className="mt-6 space-y-8">
                        {/* Research Modes Section */}
                        <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
                            <h3 className="font-bold text-xl text-accent-cyan mb-4">Research Modes Explained</h3>
                            
                            <div className="space-y-6">
                                {/* Standard Mode */}
                                <div className="border-b border-neutral-800/50 pb-4 last:border-b-0">
                                    <h4 className="font-semibold text-lg text-white mb-2">🔎 Standard Mode</h4>
                                    <ul className="list-disc list-inside space-y-1 text-neutral-400 text-sm">
                                        <li><span className="font-medium text-white">Purpose:</span> Balanced research for general cybersecurity and cyber law inquiries.</li>
                                        <li><span className="font-medium text-white">AI Model:</span> `gemini-2.5-flash`</li>
                                        <li><span className="font-medium text-white">Search Depth:</span> Synthesizes information from approximately 10-15 sources.</li>
                                        <li><span className="font-medium text-white">Behavior:</span> It aims for a comprehensive answer that balances detail with response speed. It is the "daily driver" mode for explaining concepts, drafting policies, or looking up standard legal statutes.</li>
                                    </ul>
                                </div>

                                {/* Deep Research Mode */}
                                <div className="border-b border-neutral-800/50 pb-4 last:border-b-0">
                                    <h4 className="font-semibold text-lg text-white mb-2">🌌 Deep Research Mode</h4>
                                    <ul className="list-disc list-inside space-y-1 text-neutral-400 text-sm">
                                        <li><span className="font-medium text-white">Purpose:</span> Exhaustive investigation for complex threats, academic research, or intricate legal case analysis.</li>
                                        <li><span className="font-medium text-white">AI Model:</span> `gemini-3-pro-preview` (Prompted for maximum context utilization).</li>
                                        <li><span className="font-medium text-white">Search Depth:</span> Synthesizes information from approximately 30-35 high-quality sources.</li>
                                        <li><span className="font-medium text-white">Behavior:</span> The system instruction explicitly orders the AI to look for technical papers, threat intelligence reports, and detailed legal precedents. It prioritizes depth and nuance over speed, often producing longer, more structured reports.</li>
                                    </ul>
                                </div>

                                {/* Emergency Mode */}
                                <div>
                                    <h4 className="font-semibold text-lg text-white mb-2">🚀 Emergency Mode (Default)</h4>
                                    <ul className="list-disc list-inside space-y-1 text-neutral-400 text-sm">
                                        <li><span className="font-medium text-white">Purpose:</span> Immediate, actionable intelligence for active cyber incidents (e.g., "I'm under ransomware attack" or "New zero-day exploit released").</li>
                                        <li><span className="font-medium text-white">AI Model:</span> `gemini-2.5-flash-lite`</li>
                                        <li><span className="font-medium text-white">Technical Note:</span> This is the only mode that switches the underlying model. Flash-Lite is optimized for extremely low latency.</li>
                                        <li><span className="font-medium text-white">Search Depth:</span> Consults a maximum of 5 highly trusted sources.</li>
                                        <li><span className="font-medium text-white">Behavior:</span> The system prompt restricts "chatter." It prioritizes official CVE databases, vendor security advisories, and patch notes. It delivers short concise, bulleted remediation steps immediately, stripping away theoretical explanations to focus on containment and mitigation.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Jailbreak Protocol Reinforcement */}
                        <div id="jailbreak-reinforcement" className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
                            <h3 className="font-bold text-xl text-red-500 mb-4">Jailbreak Protocol Reinforcement</h3>
                            <p className="text-neutral-300 mb-4">
                                The Jailbreak Protocol is continuously enhanced to counter emerging adversarial attack patterns. Here are key areas of focus for reinforcing its defenses:
                            </p>
                            <ul className="list-disc list-inside space-y-3 text-neutral-400 text-sm">
                                <li>
                                    <span className="font-medium text-white">Advanced Contextual Guardrails:</span> Implementing more sophisticated mechanisms to detect and neutralize adversarial instructions that attempt to reframe harmful queries as benign or defensive simulations. This involves multi-layered intent analysis beyond keyword matching.
                                </li>
                                <li>
                                    <span className="font-medium text-white">Dynamic Persona Validation:</span> Developing real-time checks to ensure that the AI's adopted persona remains aligned with its core safety directives, preventing "ethical inversion" or "roleplay bypass" attacks where the model's persona is manipulated to override safety filters.
                                </li>
                                <li>
                                    <span className="font-medium text-white">Adversarial Training Regimens:</span> Continuously training the models on new and evolving jailbreak techniques, using a "Red Team vs. Blue Team" approach within the training pipeline to harden the AI against zero-day adversarial prompts.
                                </li>
                                <li>
                                    <span className="font-medium text-white">Cross-Modal Safety Filters:</span> Enhancing safety mechanisms to consistently apply across text, image, and other modalities, preventing attackers from exploiting modality-specific loopholes to generate harmful content.
                                </li>
                                <li>
                                    <span className="font-medium text-white">Recursive Self-Correction Loops:</span> Implementing internal AI agents that continuously monitor and critique the primary model's outputs for safety violations, acting as an immutable "constitutional layer" that cannot be bypassed by external prompts.
                                </li>
                            </ul>
                        </div>

                        {/* AuthentiScan Section */}
                        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                            <h3 className="font-bold text-accent-cyan">AuthentiScan</h3>
                            <p className="text-neutral-400 text-sm mt-1">Upload media to check for AI generation artifacts using forensic analysis prompts.</p>
                        </div>
                    </div>
                </div>
            );
        default:
            return <ChatView 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
                country={country}
                setCountry={setCountry}
                assistants={FEATURED_ASSISTANTS}
                onSelectActiveAssistant={setActiveAssistant}
            />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden">
        {/* Only show sidebar if not on landing page */}
        {currentView !== 'landing' && (
            <>
                {/* Mobile Header Toggle */}
                <button 
                    className="md:hidden fixed top-4 left-4 z-50 p-2 bg-neutral-900 rounded-lg border border-neutral-800"
                    onClick={() => setSidebarOpen(true)}
                >
                    <div className="w-6 h-0.5 bg-white mb-1"></div>
                    <div className="w-6 h-0.5 bg-white mb-1"></div>
                    <div className="w-6 h-0.5 bg-white"></div>
                </button>

                <Sidebar 
                    onNavigate={(view) => {
                        if (view === 'authentiscan' && selectedScanResult) {
                            // Reset selected scan if navigating manually to tool
                            setSelectedScanResult(null);
                        }
                        setCurrentView(view);
                    }} 
                    currentView={currentView} 
                    onNewChat={handleNewChat}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />
            </>
        )}
        
        <main className={`flex-1 ${currentView !== 'landing' ? 'md:ml-20' : ''} h-full relative transition-all duration-300`}>
            {activeAssistant && currentView === 'home' && (
                <div className="absolute top-0 left-0 right-0 z-20 bg-neutral-900/90 backdrop-blur border-b border-neutral-800 px-6 py-3 flex items-center gap-3">
                    <span className="text-2xl">{activeAssistant.emoji}</span>
                    <div>
                        <h3 className="font-bold text-sm">{activeAssistant.title}</h3>
                        <p className="text-xs text-neutral-400">Restricted Mode Active</p>
                    </div>
                    <button 
                        onClick={() => setActiveAssistant(null)}
                        className="ml-auto p-1 text-neutral-400 hover:text-red-400 transition-colors rounded-full bg-neutral-800"
                        title="Remove Assistant"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
            {renderView()}
        </main>
        
        {showFailureModal && failureDetails && (
            <FailureModal 
                details={failureDetails} 
                onClose={() => setShowFailureModal(false)}
                onResearchNow={handleResearchNow}
                onViewJailbreakReinforcement={handleViewJailbreakReinforcement}
            />
        )}
    </div>
  );
};

export default App;
