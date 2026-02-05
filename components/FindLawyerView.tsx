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
import { EXPERTS } from '../data/mockData';

const FindLawyerView: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8">Expert Directory</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {EXPERTS.map((expert) => (
            <div key={expert.id} className="flex flex-col sm:flex-row bg-neutral-900 border border-neutral-800 p-6 rounded-2xl hover:border-accent-cyan/30 transition-all">
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center text-2xl mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                    👤
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{expert.name}</h3>
                    <p className="text-accent-cyan text-sm font-medium mb-1">{expert.role}</p>
                    <p className="text-neutral-500 text-sm mb-4">{expert.location}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        {expert.expertise.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded border border-neutral-700">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <button className="flex-1 py-2 px-4 bg-white text-black font-semibold rounded-lg text-sm hover:bg-neutral-200 transition-colors">
                            Call
                        </button>
                        <button className="flex-1 py-2 px-4 border border-neutral-700 text-white font-semibold rounded-lg text-sm hover:bg-neutral-800 transition-colors">
                            Email
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default FindLawyerView;
