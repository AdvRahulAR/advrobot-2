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
import { Assistant } from '../types';
import { FEATURED_ASSISTANTS } from '../data/mockData';

interface AssistantsViewProps {
  onSelectAssistant: (assistant: Assistant) => void;
}

const AssistantsView: React.FC<AssistantsViewProps> = ({ onSelectAssistant }) => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8">Specialized Agents</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_ASSISTANTS.map((assistant) => (
          <button 
            key={assistant.id}
            onClick={() => onSelectAssistant(assistant)}
            className="group relative flex flex-col items-start p-6 bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-accent-cyan/50 hover:bg-neutral-800/50 transition-all text-left"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-accent-cyan border border-accent-cyan px-2 py-1 rounded-full">SELECT</span>
            </div>
            <div className="text-4xl mb-4">{assistant.emoji}</div>
            <h3 className="text-lg font-bold text-white mb-2">{assistant.title}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{assistant.description}</p>
            {assistant.isFeatured && (
                <div className="mt-4 inline-flex items-center px-2 py-1 bg-accent-blue/10 text-accent-blue text-xs rounded font-medium">
                    Featured
                </div>
            )}
          </button>
        ))}
        
        {/* Placeholder for custom creation */}
        <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-800 rounded-2xl hover:border-neutral-600 hover:bg-neutral-900/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-4 text-neutral-400">
                <span className="text-2xl">+</span>
            </div>
            <span className="font-semibold text-neutral-400">Create Custom Agent</span>
        </button>
      </div>
    </div>
  );
};

export default AssistantsView;
