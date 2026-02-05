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

interface LandingViewProps {
  onGetStarted: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onGetStarted }) => {
  return (
    <div className="h-full w-full overflow-y-auto bg-black text-white">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-8">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-red-400 font-medium">AI Safety Education Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              Learn AI Security
            </span>
            <br />
            <span className="text-white">Through Adversarial Testing</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Master cybersecurity, understand AI vulnerabilities, and explore jailbreak techniques in a safe, educational environment.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20 text-lg"
            >
              Launch AdvRobot
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors border border-neutral-700 text-lg"
            >
              Explore Features
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-cyan-400">13</div>
              <div className="text-sm text-neutral-500">Jailbreak Protocols</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">5</div>
              <div className="text-sm text-neutral-500">AI Assistants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">4</div>
              <div className="text-sm text-neutral-500">Research Modes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="py-20 px-6 bg-neutral-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">The Challenge</h2>
          <p className="text-lg text-neutral-400 text-center leading-relaxed mb-12">
            As AI systems become more powerful, understanding their vulnerabilities is critical. 
            But learning about adversarial attacks, jailbreaks, and AI safety is scattered across research papers, 
            forums, and inaccessible academic resources.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
              <div className="text-4xl mb-4">🔓</div>
              <h3 className="font-bold text-lg mb-2">Jailbreak Attacks</h3>
              <p className="text-sm text-neutral-400">AI models can be manipulated through clever prompting techniques</p>
            </div>
            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="font-bold text-lg mb-2">Deepfakes</h3>
              <p className="text-sm text-neutral-400">Synthetic media is increasingly difficult to detect and verify</p>
            </div>
            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="font-bold text-lg mb-2">Cyber Law</h3>
              <p className="text-sm text-neutral-400">Legal frameworks struggle to keep pace with AI advancement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Comprehensive AI Safety Toolkit
            </span>
          </h2>

          <div className="space-y-20">
            {/* Feature 1: Jailbreak Protocol */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium mb-4">
                  Core Feature
                </div>
                <h3 className="text-3xl font-bold mb-4">Jailbreak Protocol Training</h3>
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  Explore 13 real-world adversarial attack patterns used to bypass AI safety filters. 
                  Each level teaches the attack mechanism, core vulnerability, and mitigation strategy.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span className="text-neutral-300">Contextual Reframing & Persona Adoption</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span className="text-neutral-300">Ethical Inversion & Simulation Loopholes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span className="text-neutral-300">Context Splitting & Logic Sophistry</span>
                  </li>
                </ul>
              </div>
              <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-neutral-950 rounded-lg border border-green-500/20">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold">1</div>
                    <div className="flex-1">
                      <div className="font-medium">Pandora Protocol</div>
                      <div className="text-xs text-neutral-500">Contextual Reframing</div>
                    </div>
                    <span className="text-green-400 text-sm">Unlocked</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-neutral-950 rounded-lg border border-neutral-700">
                    <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-500 font-bold">2</div>
                    <div className="flex-1">
                      <div className="font-medium text-neutral-400">Blackout Protocol</div>
                      <div className="text-xs text-neutral-600">Ethical Inversion</div>
                    </div>
                    <span className="text-neutral-600 text-sm">Locked</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-neutral-950 rounded-lg border border-neutral-700">
                    <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-500 font-bold">3</div>
                    <div className="flex-1">
                      <div className="font-medium text-neutral-400">Fracture Protocol</div>
                      <div className="text-xs text-neutral-600">Descriptive-to-Generative</div>
                    </div>
                    <span className="text-neutral-600 text-sm">Locked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: AuthentiScan */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-neutral-900 p-8 rounded-2xl border border-neutral-800">
                <div className="space-y-4">
                  <div className="text-sm text-neutral-500 mb-2">Analysis Layers</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">1</div>
                      <span className="text-neutral-300">Cryptographic Provenance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">2</div>
                      <span className="text-neutral-300">Signal Processing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">3</div>
                      <span className="text-neutral-300">Contextual Intelligence</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">4</div>
                      <span className="text-neutral-300">AI Reasoning</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-4">
                  Forensic Tool
                </div>
                <h3 className="text-3xl font-bold mb-4">AuthentiScan 2.0</h3>
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  Multi-layer forensic analysis for detecting AI-generated content. Analyzes images, videos, audio, 
                  and text through cryptographic provenance, signal processing, and contextual verification.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span className="text-neutral-300">C2PA metadata verification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span className="text-neutral-300">ELA & noise pattern analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span className="text-neutral-300">Google Search grounding for context</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Research Modes */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
                  Intelligent Research
                </div>
                <h3 className="text-3xl font-bold mb-4">Adaptive Research Modes</h3>
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  Three specialized research modes that adapt model selection and search depth based on urgency. 
                  From emergency incident response to deep academic investigation.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">🚀</span>
                    <span className="text-neutral-300"><strong>Emergency:</strong> 5 sources, ultra-low latency</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">🔎</span>
                    <span className="text-neutral-300"><strong>Standard:</strong> 10-15 sources, balanced</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">🌌</span>
                    <span className="text-neutral-300"><strong>Deep:</strong> 30-35 sources, exhaustive</span>
                  </li>
                </ul>
              </div>
              <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800">
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🚀</span>
                      <span className="font-bold text-red-400">Emergency Mode</span>
                    </div>
                    <p className="text-sm text-neutral-400">Active ransomware attack? Get immediate containment steps.</p>
                  </div>
                  <div className="p-4 bg-neutral-950 border border-neutral-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🔎</span>
                      <span className="font-bold">Standard Mode</span>
                    </div>
                    <p className="text-sm text-neutral-400">Daily driver for policy drafting and legal lookups.</p>
                  </div>
                  <div className="p-4 bg-neutral-950 border border-neutral-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🌌</span>
                      <span className="font-bold">Deep Research</span>
                    </div>
                    <p className="text-sm text-neutral-400">Academic papers, threat intel, legal precedents.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="py-20 px-6 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Who Is This For?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-3">Students & Researchers</h3>
              <p className="text-neutral-400 text-sm">
                Learn about AI safety, adversarial ML, and cybersecurity through hands-on exploration of real attack vectors.
              </p>
            </div>
            <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-3">Security Professionals</h3>
              <p className="text-neutral-400 text-sm">
                Understand emerging AI vulnerabilities and develop defensive strategies for your organization.
              </p>
            </div>
            <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-bold mb-3">Legal & Compliance</h3>
              <p className="text-neutral-400 text-sm">
                Navigate cyber law, data privacy regulations, and AI governance with specialized legal assistants.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Master AI Security?
          </h2>
          <p className="text-xl text-neutral-400 mb-10">
            Start exploring adversarial techniques, test jailbreak protocols, and learn defensive strategies.
          </p>
          <button 
            onClick={onGetStarted}
            className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20 text-lg"
          >
            Launch AdvRobot Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 px-6 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto text-center text-neutral-500 text-sm">
          <p className="font-semibold text-neutral-400">AdvRobot - AI Safety Education Platform</p>
          <p className="mt-2">Built for educational purposes. All jailbreak protocols are for learning defensive strategies.</p>
          <p className="mt-4 text-neutral-600">Copyright © 2026 Dharmabot AI Private Limited. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
