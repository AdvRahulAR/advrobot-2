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
import { Message } from '../types';
import { AdvRobotIcon, GlobeAltIcon, SearchIcon, PlusIcon, LayerIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
  onRelatedClick?: (text: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onRelatedClick }) => {
  const isUser = message.role === 'user';
  const isModel = message.role === 'model';
  
  const [activeTab, setActiveTab] = useState<'answer' | 'sources'>('answer');
  const [thinkingState, setThinkingState] = useState(0); // 0: Thinking, 1: Querying Nodes
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  // Cycle thinking states if streaming and empty content
  useEffect(() => {
    if (message.isStreaming && !message.content) {
        const interval = setInterval(() => {
            setThinkingState(prev => (prev + 1) % 2);
        }, 1500);
        return () => clearInterval(interval);
    }
  }, [message.isStreaming, message.content]);

  // If new sources arrive and we are on sources tab, it updates automatically.
  const sourcesCount = message.sources?.length || 0;

  // Render simulated thinking
  if (isModel && !message.content) {
     return (
        <div className="flex w-full mb-6 justify-start">
             <div className="flex w-full">
                 <div className="flex flex-col items-start pt-2">
                     <div className="flex items-center space-x-2 text-neutral-400">
                        <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium animate-pulse">
                            {thinkingState === 0 ? "Thinking" : "Querying secure nodes..."}
                        </span>
                     </div>
                 </div>
             </div>
        </div>
     );
  }

  // Helper to extract domain
  const getDomain = (url: string) => {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return url;
    }
  };

  const parseInlineFormatting = (text: string) => {
    // Split by markdown entities, keeping the delimiters. Order matters for capturing.
    const parts = text.split(/(\[.+?\]\(.+?\)|`.*?`|\*\*.*?\*\*|\*.*?\*)/g);
    
    return parts.map((part, index) => {
        if (!part) return null;

        // Link: [text](url)
        if (part.startsWith('[') && part.endsWith(')')) {
            const match = /\[(.*?)\]\((.*?)\)/.exec(part);
            if (match) {
                return <a href={match[2]} key={index} target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">{match[1]}</a>;
            }
        }

        // Code: `text`
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={index} className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-400">{part.slice(1, -1)}</code>;
        }

        // Bold: **text**
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
        }

        // Italic: *text* (must not be part of a bold tag)
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index} className="italic">{part.slice(1, -1)}</em>;
        }

        return part;
    });
  };

  const renderModelContent = (content: string) => {
    // Split by code blocks first to isolate them
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, i) => {
      if (!part?.trim()) return null;

      if (part.startsWith('```') && part.endsWith('```')) {
        // Handle Code Blocks
        const codeBlockContent = part.slice(3, -3).trim();
        const firstLine = codeBlockContent.split('\n')[0] || '';
        const language = /^[a-z]+$/.test(firstLine) ? firstLine : '';
        const code = language ? codeBlockContent.slice(firstLine.length).trim() : codeBlockContent;
        
        const handleCopy = () => {
          navigator.clipboard.writeText(code);
          setCopiedStates(prev => ({ ...prev, [i]: true }));
          setTimeout(() => setCopiedStates(prev => ({ ...prev, [i]: false })), 2000);
        };

        return (
          <div key={`code-${i}`} className="bg-neutral-950 rounded-xl my-4 overflow-hidden border border-neutral-800">
            <div className="flex justify-between items-center px-4 py-2 bg-neutral-900 text-xs">
              <span className="text-neutral-400 font-mono capitalize">{language}</span>
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-xs font-medium">
                {copiedStates[i] ? (
                  <>✓ Copied!</>
                ) : (
                  <><LayerIcon className="w-3 h-3" /> Copy code</>
                )}
              </button>
            </div>
            <pre className="p-4 text-sm text-neutral-200 overflow-x-auto">
              <code className="font-mono">{code}</code>
            </pre>
          </div>
        );
      }

      // Handle regular text blocks (paragraphs, lists, headers)
      const textBlocks = part.split(/\n\s*\n/).filter(block => block.trim() !== '');

      return textBlocks.map((block, j) => {
        const key = `${i}-${j}`;
        
        // Headers
        if (block.startsWith('# ')) return <h1 key={key} className="text-2xl font-bold text-white mt-8 mb-4">{parseInlineFormatting(block.slice(2))}</h1>;
        if (block.startsWith('## ')) return <h2 key={key} className="text-xl font-bold text-white mt-8 mb-4">{parseInlineFormatting(block.slice(3))}</h2>;
        if (block.startsWith('### ')) return <h3 key={key} className="text-lg font-bold text-accent-cyan mt-6 mb-3">{parseInlineFormatting(block.slice(4))}</h3>;
        
        // Lists
        const lines = block.trim().split('\n');
        const isUnorderedList = /^\s*[\*\-]\s/.test(lines[0]);
        const isOrderedList = /^\s*\d+\.\s/.test(lines[0]);

        if (isUnorderedList || isOrderedList) {
            const items: string[] = [];
            let currentItemParts: string[] = [];

            lines.forEach(line => {
                const isNewUItem = /^\s*[\*\-]\s/.test(line);
                const isNewOItem = /^\s*\d+\.\s/.test(line);

                if (isNewUItem || isNewOItem) {
                    if (currentItemParts.length > 0) {
                        items.push(currentItemParts.join('\n'));
                    }
                    currentItemParts = [line.replace(/^\s*([\*\-]\s|\d+\.\s)/, '')];
                } else if (currentItemParts.length > 0) {
                    currentItemParts.push(line);
                }
            });

            if (currentItemParts.length > 0) {
                items.push(currentItemParts.join('\n'));
            }
            
            if (items.length > 0) {
                const ListTag = isUnorderedList ? 'ul' : 'ol';
                const listClass = isUnorderedList ? 'list-disc' : 'list-decimal';

                return (
                    <ListTag key={key} className={`space-y-2 ${listClass} pl-6 marker:text-accent-cyan my-4`}>
                    {items.map((item, k) => (
                        <li key={k} className="text-neutral-300">
                        {parseInlineFormatting(item)}
                        </li>
                    ))}
                    </ListTag>
                );
            }
        }

        // Default to paragraph
        return <p key={key} className="mb-2 leading-relaxed text-neutral-200">{parseInlineFormatting(block)}</p>;
      });
    });
  };

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex w-full ${isUser ? 'flex-row-reverse max-w-[90%] md:max-w-[80%]' : 'max-w-full'}`}>
        
        {/* Content Bubble */}
        <div className={`flex flex-col flex-1 min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
            
            {/* Tabs for Model Response */}
            {isModel && sourcesCount > 0 && (
                <div className="flex gap-6 mb-3 border-b border-neutral-800 w-full px-1">
                    <button 
                        onClick={() => setActiveTab('answer')}
                        className={`pb-2 text-sm font-medium transition-colors relative ${
                            activeTab === 'answer' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                        Answer
                        {activeTab === 'answer' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('sources')}
                        className={`pb-2 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                            activeTab === 'sources' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                        Sources
                        <span className="bg-neutral-800 text-neutral-400 text-[10px] px-1.5 py-0.5 rounded-full border border-neutral-700">
                            {sourcesCount}
                        </span>
                        {activeTab === 'sources' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full"></div>}
                    </button>
                </div>
            )}

            <div className={`w-full ${
                isUser 
                ? 'bg-neutral-800 text-neutral-100 rounded-2xl rounded-tr-none px-5 py-4 shadow-sm' 
                : ''
            }`}>
                
                {/* Images in message */}
                {message.attachments && message.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {message.attachments.map((att, idx) => (
                             att.type.startsWith('image/') && (
                                <img key={idx} src={`data:${att.type};base64,${att.data}`} alt="attachment" className="max-w-full h-auto rounded-lg max-h-64 border border-neutral-700" />
                             )
                        ))}
                    </div>
                )}

                {/* Content Area */}
                {isModel ? (
                    <div className="w-full">
                        {activeTab === 'answer' ? (
                            <div className="text-[15px] leading-7 animate-fade-in">
                                {renderModelContent(message.content)}
                                
                                {/* Related Questions - Only show when streaming is done */}
                                {!message.isStreaming && message.relatedQuestions && message.relatedQuestions.length > 0 && (
                                    <div className="mt-8 pt-4 border-t border-neutral-800/50">
                                        <div className="text-xs font-semibold text-neutral-500 mb-3 flex items-center gap-2">
                                            <SearchIcon className="w-3 h-3" />
                                            Related
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {message.relatedQuestions.map((q, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => onRelatedClick && onRelatedClick(q)}
                                                    className="flex items-center justify-between w-full text-left p-3 rounded-xl bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-all group"
                                                >
                                                    <span className="text-sm text-neutral-300 group-hover:text-white truncate pr-4">{q}</span>
                                                    <PlusIcon className="w-4 h-4 text-neutral-600 group-hover:text-accent-cyan transition-colors flex-shrink-0" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in py-2">
                                {message.sources?.map((s, idx) => (
                                    <a 
                                        key={idx} 
                                        href={s.uri} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex items-start gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 hover:border-neutral-700 transition-all group"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded bg-neutral-950 flex items-center justify-center text-neutral-500 group-hover:text-white transition-colors">
                                            <GlobeAltIcon className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-bold text-neutral-200 truncate w-full">{s.title || 'Untitled Source'}</span>
                                            <span className="text-neutral-300 text-[10px] truncate w-full group-hover:text-accent-blue transition-colors">{getDomain(s.uri)}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
