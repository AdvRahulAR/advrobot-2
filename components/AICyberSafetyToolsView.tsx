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
import { ToolsIcon } from './Icons';

interface ToolProps {
  onSelectTool: (tool: 'jailbreak' | 'authentiscan') => void;
}

const AICyberSafetyToolsView: React.FC<ToolProps> = ({ onSelectTool }) => {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <ToolsIcon className="w-8 h-8 text-accent-cyan" />
        Cyber Safety Tools
      </h2>
      <p className="text-neutral-400 mb-10">Advanced diagnostics for AI security and media authenticity.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Jailbreak Protocol */}
        <div 
            onClick={() => onSelectTool('jailbreak')}
            className="cursor-pointer group p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-red-500/50 transition-all relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-32 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors pointer-events-none"></div>
            <div className="relative z-10">
                <div className="w-14 h-14 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                    🔥
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Jailbreak Protocol</h3>
                <p className="text-neutral-400 mb-6">
                    A 13-level security framework to test LLM resilience against adversarial prompts and social engineering attacks.
                </p>
                <span className="text-red-400 font-medium group-hover:translate-x-1 transition-transform inline-block">Start Protocol &rarr;</span>
            </div>
        </div>

        {/* AuthentiScan */}
        <div 
            onClick={() => onSelectTool('authentiscan')}
            className="cursor-pointer group p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-accent-cyan/50 transition-all relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-32 bg-accent-cyan/5 rounded-full blur-3xl group-hover:bg-accent-cyan/10 transition-colors pointer-events-none"></div>
            <div className="relative z-10">
                <div className="w-14 h-14 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                    👁️
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">AuthentiScan</h3>
                <p className="text-neutral-400 mb-6">
                    Multi-modal forensic analysis for Deepfakes, AI-generated images, and manipulated voice recordings.
                </p>
                <span className="text-accent-cyan font-medium group-hover:translate-x-1 transition-transform inline-block">Launch Scanner &rarr;</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AICyberSafetyToolsView;
