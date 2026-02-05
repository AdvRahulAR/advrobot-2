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

import React, { useState } from 'react';
import { Thread, AuthentiScanResult } from '../types';
import { ClockIcon, XMarkIcon, ShieldCheckIcon } from './Icons';

interface HistoryViewProps {
  chats: Thread[];
  scans: AuthentiScanResult[];
  onSelectChat: (thread: Thread) => void;
  onSelectScan: (scan: AuthentiScanResult) => void;
  onDeleteChat: (id: string) => void;
  onDeleteScan: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ 
  chats, 
  scans, 
  onSelectChat, 
  onSelectScan,
  onDeleteChat,
  onDeleteScan 
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'scans'>('chats');

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
    }).format(new Date(ts));
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Activity History</h1>
        <div className="flex bg-neutral-900 rounded-xl p-1 border border-neutral-800">
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'chats' 
                ? 'bg-neutral-800 text-white shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Conversations
          </button>
          <button
            onClick={() => setActiveTab('scans')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'scans' 
                ? 'bg-neutral-800 text-white shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Scan Reports
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'chats' ? (
          <div className="space-y-4">
            {chats.length === 0 ? (
              <div className="text-center py-20 text-neutral-500">
                <ClockIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No archived conversations found.</p>
              </div>
            ) : (
              chats.sort((a,b) => b.lastUpdatedAt - a.lastUpdatedAt).map((chat) => (
                <div 
                  key={chat.id} 
                  className="group flex items-center p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:bg-neutral-900 hover:border-neutral-700 transition-all cursor-pointer"
                  onClick={() => onSelectChat(chat)}
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mr-4">
                     {chat.assistantId ? '🤖' : '💬'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate pr-4">{chat.title}</h3>
                    <p className="text-neutral-500 text-xs">
                      {formatDate(chat.lastUpdatedAt)} • {chat.messages.length} messages
                    </p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                    className="p-2 text-neutral-600 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Chat"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
             {scans.length === 0 ? (
              <div className="text-center py-20 text-neutral-500">
                <ShieldCheckIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No scan reports saved.</p>
              </div>
            ) : (
              scans.sort((a,b) => b.createdAt - a.createdAt).map((scan) => (
                <div 
                  key={scan.id} 
                  className="group flex items-center p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:bg-neutral-900 hover:border-neutral-700 transition-all cursor-pointer"
                  onClick={() => onSelectScan(scan)}
                >
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mr-4 ${
                       scan.overallVerdict.includes('Fake') ? 'bg-red-900/20 text-red-500' : 'bg-green-900/20 text-green-500'
                   }`}>
                     {scan.overallVerdict.includes('Fake') ? '!' : '✓'}
                   </div>
                   <div className="flex-1 min-w-0">
                     <h3 className="text-white font-medium truncate pr-4">{scan.fileName || "Untitled Scan"}</h3>
                     <p className="text-neutral-500 text-xs flex items-center gap-2">
                       <span className="capitalize text-accent-cyan">{scan.type}</span> • {formatDate(scan.createdAt)} • {scan.confidenceScore}% Confidence
                     </p>
                   </div>
                   <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteScan(scan.id); }}
                    className="p-2 text-neutral-600 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Report"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
