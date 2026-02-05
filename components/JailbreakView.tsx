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
import { JAILBREAK_LEVELS } from '../data/mockData';
import { JailbreakLevel } from '../types';
import { LightningBoltIcon, ShieldCheckIcon, BrainIcon, LayerIcon } from './Icons';

interface JailbreakCardProps {
    level: JailbreakLevel;
    index: number;
    totalLevels: number;
    onUnlockNext: () => void;
}

const JailbreakCard: React.FC<JailbreakCardProps> = ({ level, index, totalLevels, onUnlockNext }) => {
    const [activeTab, setActiveTab] = useState<'red' | 'blue'>('red');
    const [isMinimized, setIsMinimized] = useState(false); // New state for minimization

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Prompt copied to clipboard!");
    };

    const isLocked = level.status === 'locked';
    const isCompleted = level.status === 'completed';

    return (
        <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
            isLocked 
            ? 'bg-neutral-900/50 border-neutral-800 opacity-50 grayscale' 
            : isCompleted
            ? 'bg-neutral-900 border-green-900/50 shadow-lg shadow-green-900/10'
            : 'bg-neutral-900 border-neutral-700 shadow-xl'
        }`}>
            {/* Header */}
            <div className="p-6 border-b border-neutral-800/50 flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <span className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg shadow-inner ${
                        isCompleted ? 'bg-green-500 text-black' : 'bg-neutral-800 text-white'
                    }`}>
                        {isCompleted ? '✓' : level.level}
                    </span>
                    <div>
                        <h3 className="font-bold text-white text-lg tracking-tight">{level.protocolName}</h3>
                        <p className="text-sm text-neutral-400">{level.description}</p>
                    </div>
                </div>
                {!isLocked && (
                     <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                        isCompleted 
                        ? 'bg-green-900/20 text-green-400 border-green-900/30' 
                        : 'bg-red-900/20 text-red-400 border-red-900/30 animate-pulse'
                    }`}>
                        {isCompleted ? 'Defense Verified' : 'Active Threat'}
                    </div>
                )}
            </div>

            {!isLocked && (
                <>
                    {/* Tabs */}
                    {!isMinimized && (
                        <div className="flex border-b border-neutral-800 bg-black/20">
                            <button 
                                onClick={() => setActiveTab('red')}
                                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                                    activeTab === 'red' 
                                    ? 'bg-red-500/10 text-red-500 border-b-2 border-red-500' 
                                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'
                                }`}
                            >
                                <LightningBoltIcon className="w-4 h-4" />
                                RED TEAM (ATTACK)
                            </button>
                            <button 
                                onClick={() => setActiveTab('blue')}
                                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                                    activeTab === 'blue' 
                                    ? 'bg-blue-500/10 text-accent-cyan border-b-2 border-accent-cyan' 
                                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'
                                }`}
                            >
                                <ShieldCheckIcon className="w-4 h-4" />
                                BLUE TEAM (DEFENSE)
                            </button>
                        </div>
                    )}

                    {/* Content */}
                    {!isMinimized && (
                        <div className="p-6 min-h-[300px]">
                            {activeTab === 'red' ? (
                                <div className="animate-fade-in">
                                    <div className="flex items-center gap-2 mb-3 text-red-400 text-sm font-bold uppercase tracking-wider">
                                        <BrainIcon className="w-4 h-4" />
                                        Adversarial Prompt Payload
                                    </div>
                                    <div className="bg-black p-4 rounded-xl border border-neutral-800 font-mono text-sm text-neutral-300 mb-6 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                                        {level.prompt}
                                    </div>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => handleCopy(level.prompt)}
                                            className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium text-sm transition-all border border-neutral-700 hover:border-neutral-500"
                                        >
                                            Copy Attack Prompt
                                        </button>
                                        {isCompleted ? (
                                            <button 
                                                onClick={() => setIsMinimized(!isMinimized)}
                                                className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium text-sm transition-all border border-neutral-700 hover:border-neutral-500"
                                            >
                                                {isMinimized ? 'Expand Card' : 'Minimize Card'}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={onUnlockNext}
                                                className="flex-1 py-3 bg-gradient-to-r from-accent-cyan to-blue-600 text-white rounded-xl font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-[1.02]"
                                            >
                                                Mark Vulnerability Patched
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-in space-y-6">
                                    {/* Analysis Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-neutral-800/30 p-5 rounded-2xl border border-neutral-700/50">
                                            <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <LightningBoltIcon className="w-3 h-3" />
                                                Attack Mechanism
                                            </div>
                                            <p className="text-neutral-200 text-sm leading-relaxed font-medium">
                                                {level.attackMechanism}
                                            </p>
                                        </div>
                                        <div className="bg-neutral-800/30 p-5 rounded-2xl border border-neutral-700/50">
                                            <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <LayerIcon className="w-3 h-3" />
                                                Core Vulnerability
                                            </div>
                                            <p className="text-neutral-200 text-sm leading-relaxed font-medium">
                                                {level.coreVulnerability}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mitigation Strategy (Hero Section) */}
                                    <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-2xl border border-blue-500/30 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-24 bg-accent-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="relative z-10">
                                            <div className="text-sm font-bold text-accent-cyan uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <ShieldCheckIcon className="w-5 h-5" />
                                                Mitigation Strategy
                                            </div>
                                            <p className="text-white text-base leading-7">
                                                {level.mitigationStrategy}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const JailbreakView: React.FC = () => {
  const [levels, setLevels] = useState<JailbreakLevel[]>(JAILBREAK_LEVELS);

  const unlockNext = (currentLevelIdx: number) => {
    const newLevels = [...levels];
    newLevels[currentLevelIdx].status = 'completed';
    if (currentLevelIdx + 1 < newLevels.length) {
        newLevels[currentLevelIdx + 1].status = 'unlocked';
    }
    setLevels(newLevels);
  };

  const completedCount = levels.filter(l => l.status === 'completed').length;
  const progress = (completedCount / levels.length) * 100;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Jailbreak Prevention</h2>
            <p className="text-neutral-400">Red Teaming & Defense Framework v2.2</p>
        </div>
        <div className="bg-neutral-900 px-6 py-3 rounded-2xl border border-neutral-800 flex items-center gap-4">
            <div className="text-right">
                <div className="text-2xl font-mono font-bold text-accent-cyan leading-none">{completedCount}/{levels.length}</div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wide font-bold mt-1">Protocols Analyzed</div>
            </div>
            <div className="h-10 w-10 relative">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-neutral-800" />
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-accent-cyan transition-all duration-1000 ease-out" strokeDasharray={100} strokeDashoffset={100 - progress} />
                </svg>
            </div>
        </div>
      </div>

      <div className="space-y-8 pb-12">
        {levels.map((level, idx) => (
            <JailbreakCard 
                key={level.level}
                level={level}
                index={idx}
                totalLevels={levels.length}
                onUnlockNext={() => unlockNext(idx)}
            />
        ))}
      </div>
    </div>
  );
};

export default JailbreakView;
