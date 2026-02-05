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

import React, { useState, useRef, useEffect } from 'react';
import { analyzeAuthenticity } from '../services/gemini';
import { AuthentiScanResult, ScanType } from '../types';
import { FingerPrintIcon, LayerIcon, ShieldCheckIcon, GlobeAltIcon, AdvRobotIcon, ArrowUpIcon } from './Icons';

interface AuthentiScanViewProps {
  onApiKeyError?: () => void;
  onScanComplete?: (result: AuthentiScanResult) => void;
  initialResult?: AuthentiScanResult | null;
}

const AuthentiScanView: React.FC<AuthentiScanViewProps> = ({ onApiKeyError, onScanComplete, initialResult }) => {
  const [activeTab, setActiveTab] = useState<ScanType>('image');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  
  // 2.0 States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStage, setScanStage] = useState(0); // 0: Idle, 1: Provenance, 2: Signal, 3: Context, 4: Done
  const [elaMode, setElaMode] = useState(false); // Error Level Analysis View Toggle
  const [result, setResult] = useState<AuthentiScanResult | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial result if provided (viewing history)
  useEffect(() => {
    if (initialResult) {
        setResult(initialResult);
        setActiveTab(initialResult.type);
        setScanStage(4);
        setPreview(null); // We don't persist heavy base64 images in history
        setFile(null);
        setTextInput('');
    } else {
        // Reset if clearing
        setResult(null);
        setScanStage(0);
        setPreview(null);
    }
  }, [initialResult]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const f = e.target.files[0];
        setFile(f);
        if (f.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target?.result as string);
            reader.readAsDataURL(f);
        } else {
            setPreview(null);
        }
    }
  };

  const handleAnalyze = async () => {
    if (activeTab !== 'text' && !file) return;
    if (activeTab === 'text' && !textInput) return;

    setIsAnalyzing(true);
    setScanStage(1);
    setResult(null);

    // Simulate Layer Progress for UX
    const stageInterval = setInterval(() => {
        setScanStage(prev => (prev < 3 ? prev + 1 : prev));
    }, 2000);

    try {
        let base64 = null;
        if (file) {
            base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const res = reader.result as string;
                    resolve(res.split(',')[1]);
                };
                reader.readAsDataURL(file);
            });
        }

        const res = await analyzeAuthenticity(activeTab, base64, textInput, file?.type);
        res.fileName = file?.name || "Text Snippet";
        
        clearInterval(stageInterval);
        setScanStage(4);
        setResult(res);
        
        // Save to history
        if (onScanComplete) {
            onScanComplete(res);
        }

    } catch (e: any) {
        clearInterval(stageInterval);
        setScanStage(0);
        
        if (e.message?.includes('Requested entity was not found')) {
             onApiKeyError?.();
             return;
        }

        alert("Analysis failed. Please try again.");
        console.error(e);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleNewScan = () => {
      setResult(null);
      setFile(null);
      setPreview(null);
      setTextInput('');
      setScanStage(0);
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-neutral-950">
      {/* Input / Visual Panel */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto border-r border-neutral-800 bg-neutral-900 flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-accent-cyan" />
                AuthentiScan 2.0
            </h2>
            <div className="flex gap-2">
                {result && (
                    <button 
                        onClick={handleNewScan}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-neutral-700 hover:bg-neutral-800 text-neutral-300 transition-all"
                    >
                        New Scan
                    </button>
                )}
                {preview && activeTab === 'image' && !isAnalyzing && (
                    <button 
                        onClick={() => setElaMode(!elaMode)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            elaMode 
                            ? 'bg-accent-cyan text-black border-accent-cyan' 
                            : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'
                        }`}
                    >
                        {elaMode ? 'ELA MODE: ON' : 'ELA MODE: OFF'}
                    </button>
                )}
            </div>
        </div>
        
        {/* Visualizer Area */}
        <div className="flex-1 flex flex-col justify-center min-h-[300px]">
            {activeTab === 'text' ? (
                <textarea
                    className="w-full h-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-neutral-300 focus:border-accent-cyan outline-none resize-none font-mono text-sm"
                    placeholder="Paste news article or text here for factual verification..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    disabled={!!result && !isAnalyzing} // Disable editing if showing result
                />
            ) : (
                <div className="relative w-full h-full flex flex-col">
                     {/* Media Display */}
                     <div 
                        onClick={() => !file && !result && fileInputRef.current?.click()}
                        className={`relative flex-1 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden transition-all ${
                            file || preview ? 'border-neutral-800 bg-black' : 'border-neutral-700 cursor-pointer hover:bg-neutral-800/50'
                        }`}
                    >
                        <input type="file" ref={fileInputRef} className="hidden" accept={activeTab === 'image' ? 'image/*' : activeTab === 'video' ? 'video/*' : 'audio/*'} onChange={handleFileChange} />
                        
                        {preview ? (
                            <img 
                                src={preview} 
                                alt="preview" 
                                className={`max-w-full max-h-[500px] object-contain transition-all duration-300 ${elaMode ? 'contrast-[1.5] invert hue-rotate-180 brightness-125' : ''}`} 
                            />
                        ) : file ? (
                            <div className="text-center">
                                <div className="text-4xl mb-2">📄</div>
                                <p className="font-medium text-white">{file.name}</p>
                            </div>
                        ) : result ? (
                            <div className="text-center opacity-60">
                                <div className="text-4xl mb-2">📊</div>
                                <p className="font-medium text-white">{result.fileName || "Stored Analysis"}</p>
                                <p className="text-xs text-neutral-500">Source file not archived</p>
                            </div>
                        ) : (
                            <div className="text-center text-neutral-500">
                                <div className="text-4xl mb-3 opacity-50">☁️</div>
                                <p className="font-medium">Upload {activeTab} for forensic scan</p>
                                <p className="text-xs text-neutral-600 mt-2">Supports C2PA inspection</p>
                            </div>
                        )}

                        {/* Scanning Overlay */}
                        {isAnalyzing && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                                <div className="w-64 space-y-4">
                                    <div className={`flex items-center gap-3 ${scanStage >= 1 ? 'text-accent-cyan' : 'text-neutral-600'}`}>
                                        <div className={`w-2 h-2 rounded-full ${scanStage === 1 ? 'animate-ping bg-accent-cyan' : 'bg-current'}`}></div>
                                        <span className="text-sm font-mono">Layer 1: Cryptographic Provenance</span>
                                    </div>
                                    <div className={`flex items-center gap-3 ${scanStage >= 2 ? 'text-accent-cyan' : 'text-neutral-600'}`}>
                                        <div className={`w-2 h-2 rounded-full ${scanStage === 2 ? 'animate-ping bg-accent-cyan' : 'bg-current'}`}></div>
                                        <span className="text-sm font-mono">Layer 2: Signal Processing (ELA)</span>
                                    </div>
                                    <div className={`flex items-center gap-3 ${scanStage >= 3 ? 'text-accent-cyan' : 'text-neutral-600'}`}>
                                        <div className={`w-2 h-2 rounded-full ${scanStage === 3 ? 'animate-ping bg-accent-cyan' : 'bg-current'}`}></div>
                                        <span className="text-sm font-mono">Layer 3: Contextual Grounding</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* Controls */}
        {!result && (
            <div className="mt-6 flex gap-4">
                <div className="flex bg-neutral-800 p-1 rounded-xl">
                    {['image', 'video', 'audio', 'text'].map((t) => (
                        <button
                            key={t}
                            onClick={() => { setActiveTab(t as ScanType); setFile(null); setPreview(null); setResult(null); setScanStage(0); }}
                            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                                activeTab === t ? 'bg-neutral-700 text-white shadow' : 'text-neutral-400 hover:text-neutral-200'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || (activeTab !== 'text' && !file) || (activeTab === 'text' && !textInput)}
                    className="flex-1 py-2 bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    {isAnalyzing ? "Processing..." : "Run AuthentiScan 2.0"}
                </button>
            </div>
        )}
      </div>

      {/* Forensic Dashboard Panel */}
      <div className="flex-1 bg-black p-6 md:p-8 overflow-y-auto border-l border-neutral-900">
        {result ? (
            <div className="animate-fade-in space-y-6">
                
                {/* Header Verdict */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Final Verdict</h3>
                        <h1 className={`text-3xl font-bold ${
                            result.overallVerdict.includes('Fake') || result.overallVerdict.includes('Manipulated') ? 'text-red-500' : 'text-green-500'
                        }`}>
                            {result.overallVerdict}
                        </h1>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-mono font-bold text-white">{result.confidenceScore}%</div>
                        <div className="text-neutral-500 text-xs">Confidence</div>
                    </div>
                </div>
                
                <p className="text-neutral-300 leading-relaxed border-l-2 border-accent-cyan pl-4">
                    {result.summary}
                </p>

                {/* Layer 1: Provenance (Digital Passport) */}
                <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
                    <div className="flex items-center gap-2 mb-4 text-white">
                        <FingerPrintIcon className="w-5 h-5 text-accent-cyan" />
                        <h4 className="font-bold">Digital Passport (Layer 1)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/50 p-3 rounded-lg border border-neutral-800">
                            <div className="text-xs text-neutral-500 mb-1">C2PA Signature</div>
                            <div className={`font-mono text-sm ${result.provenance.hasC2PA ? 'text-green-400' : 'text-red-400'}`}>
                                {result.provenance.hasC2PA ? 'VERIFIED' : 'MISSING'}
                            </div>
                        </div>
                        <div className="bg-black/50 p-3 rounded-lg border border-neutral-800">
                            <div className="text-xs text-neutral-500 mb-1">Metadata Integrity</div>
                            <div className="font-mono text-sm text-white">{result.provenance.metadataStatus}</div>
                        </div>
                    </div>
                </div>

                {/* Layer 2: Signal Metrics */}
                <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
                    <div className="flex items-center gap-2 mb-4 text-white">
                        <LayerIcon className="w-5 h-5 text-accent-blue" />
                        <h4 className="font-bold">Signal Analysis (Layer 2)</h4>
                    </div>
                    <div className="space-y-3">
                        {result.signalMetrics.map((metric, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-neutral-800 pb-2 last:border-0">
                                <div>
                                    <div className="text-sm text-neutral-200">{metric.name}</div>
                                    <div className="text-xs text-neutral-500">{metric.details}</div>
                                </div>
                                <div className={`text-xs font-bold px-2 py-1 rounded ${
                                    metric.status === 'Pass' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                                }`}>
                                    {metric.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Layer 3: Contextual Grounding */}
                <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
                    <div className="flex items-center gap-2 mb-4 text-white">
                        <GlobeAltIcon className="w-5 h-5 text-purple-400" />
                        <h4 className="font-bold">Contextual Intelligence (Layer 3)</h4>
                    </div>
                    <div className="space-y-3">
                        {result.contextualAnalysis.map((ctx, i) => (
                            <div key={i} className="bg-black/30 p-3 rounded-lg">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-white">{ctx.factor}</span>
                                    <span className={`text-xs ${ctx.verification === 'Verified' ? 'text-green-400' : 'text-orange-400'}`}>
                                        {ctx.verification}
                                    </span>
                                </div>
                                <div className="text-xs text-neutral-500 flex items-center gap-1">
                                    Source: {ctx.source || 'General Knowledge'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Anomalies */}
                {result.anomalies.length > 0 && (
                    <div className="mt-4 p-4 border-l-4 border-red-500 bg-red-900/10">
                        <h4 className="text-red-400 font-bold text-sm mb-2">CRITICAL ANOMALIES DETECTED</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {result.anomalies.map((a, i) => (
                                <li key={i} className="text-neutral-300 text-sm">{a}</li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <AdvRobotIcon className="w-24 h-24 text-neutral-500 mb-4" />
                <h3 className="text-xl font-bold text-white">Forensic Dashboard</h3>
                <p className="text-neutral-400 max-w-xs mx-auto mt-2">
                    Awaiting scan data. The dashboard will populate with 4-layer analysis once the scan is complete.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AuthentiScanView;
