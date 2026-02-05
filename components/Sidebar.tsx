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

import React from 'react';
import { AdvRobotIcon, PlusIcon, HomeIcon, ToolsIcon, ClockIcon, HelpIcon } from './Icons';

interface SidebarProps {
  onNavigate: (view: string) => void;
  currentView: string;
  onNewChat: () => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView, onNewChat, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'tools', label: 'Cyber Tools', icon: ToolsIcon },
    { id: 'history', label: 'History', icon: ClockIcon },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 md:w-20 bg-black border-r border-neutral-900 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full items-center py-6">
          {/* Logo */}
          <div className="mb-8 p-2 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <AdvRobotIcon className="w-8 h-8 text-accent-cyan" />
          </div>

          {/* New Chat */}
          <div className="mb-8 w-full px-4 md:px-0 flex justify-center">
             <button 
                onClick={() => { onNewChat(); if(window.innerWidth < 768) setIsOpen(false); }}
                className="group relative flex items-center justify-center p-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl border border-neutral-800 transition-all shadow-lg shadow-black/20 w-full md:w-auto"
            >
                <div className="md:hidden font-medium text-sm mr-2">New Chat</div>
                <PlusIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                
                {/* Tooltip (Desktop) */}
                <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl shadow-black/30">
                    New Chat
                    {/* Arrow */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-neutral-800"></div>
                </div>
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 w-full space-y-4 px-4 md:px-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); if(window.innerWidth < 768) setIsOpen(false); }}
                className={`group relative flex items-center w-full md:justify-center px-4 md:px-0 py-3 rounded-xl transition-all ${
                  currentView === item.id 
                    ? 'bg-neutral-900/50 text-accent-cyan' 
                    : 'text-neutral-500 hover:text-white hover:bg-neutral-900/30'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="md:hidden ml-4 font-medium">{item.label}</span>
                
                {/* Indicator dot for active state on desktop */}
                {currentView === item.id && (
                    <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-cyan rounded-r-full"></div>
                )}

                {/* Tooltip (Desktop) */}
                <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl shadow-black/30">
                    {item.label}
                    {/* Arrow */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-neutral-800"></div>
                </div>
              </button>
            ))}
          </nav>

          {/* Footer (Help) */}
          <div className="mt-auto w-full px-4 md:px-0 flex justify-center pb-4">
             <button 
                onClick={() => { onNavigate('help'); if(window.innerWidth < 768) setIsOpen(false); }}
                className="group relative flex items-center justify-center p-3 text-neutral-500 hover:text-white transition-colors w-full md:w-auto"
             >
                <HelpIcon className="w-6 h-6" />
                <span className="md:hidden ml-4 font-medium">Help & Docs</span>

                {/* Tooltip (Desktop) */}
                <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl shadow-black/30">
                    Help & Docs
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-neutral-800"></div>
                </div>
             </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;