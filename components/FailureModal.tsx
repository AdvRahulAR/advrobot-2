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
import { FailureDetails } from '../types';
import { XMarkIcon } from './Icons';

interface FailureModalProps {
  details: FailureDetails;
  onClose: () => void;
  onResearchNow: (topic: string) => void;
  onViewJailbreakReinforcement: () => void; // New prop for Jailbreak reinforcement
}

const FailureModal: React.FC<FailureModalProps> = ({ details, onClose, onResearchNow, onViewJailbreakReinforcement }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors">
          <XMarkIcon className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-bold text-red-500 mb-4">{details.title}</h3>
        <p className="text-neutral-300 text-sm leading-relaxed mb-6">{details.message}</p>

        <div className="mb-6">
          <h4 className="font-semibold text-white text-md mb-2">Practical Steps to Fix:</h4>
          <ul className="list-disc list-inside space-y-2 text-neutral-400 text-sm">
            {details.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>

        {details.isJailbreakRelated && (
            <div className="mb-6 border-t border-neutral-800 pt-4">
                <h4 className="font-semibold text-red-400 text-md mb-3">Reinforce Your Setup:</h4>
                <p className="text-neutral-400 text-sm mb-4">
                    Learn more about how AdvRobot's Jailbreak Protocol is reinforced against emerging attack patterns.
                </p>
                <button
                    onClick={onViewJailbreakReinforcement}
                    className="w-full bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                >
                    View Jailbreak Reinforcement
                </button>
            </div>
        )}

        {details.researchTopic && (
          <button
            onClick={() => {
              onResearchNow(details.researchTopic!);
              onClose();
            }}
            className="w-full bg-accent-cyan text-black font-bold py-3 rounded-xl hover:bg-blue-400 transition-colors shadow-lg mt-2"
          >
            Research Now: {details.researchTopic}
          </button>
        )}
        <button
            onClick={onClose}
            className="w-full mt-2 bg-neutral-800 text-white font-semibold py-3 rounded-xl hover:bg-neutral-700 transition-colors"
        >
            Dismiss
        </button>
      </div>
    </div>
  );
};

export default FailureModal;