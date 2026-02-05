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

import { GoogleGenAI, Type } from "@google/genai";
import { Message, ResearchMode, AuthentiScanResult } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY not set");
  return new GoogleGenAI({ apiKey });
};

// --- CHAT SERVICE ---

export const streamAiResponse = async (
  messages: Message[],
  mode: ResearchMode,
  assistantInstructions?: string,
  country?: string,
  onChunk?: (text: string) => void,
  onSources?: (sources: {uri: string, title: string}[]) => void
): Promise<string> => {
  const ai = getClient();
  const lastMsg = messages[messages.length - 1];
  
  // Model selection and specific instruction based on mode
  let modelId: string;
  let searchDepthInstruction = "";
  
  switch (mode) {
    case 'standard':
      modelId = 'gemini-2.5-flash';
      searchDepthInstruction = "Synthesize information from approximately 10-15 sources, aiming for a comprehensive answer that balances detail with response speed. Act as the 'daily driver' for explaining concepts, drafting policies, or looking up standard legal statutes.";
      break;
    case 'deep':
      modelId = 'gemini-3-pro-preview'; // Deeper reasoning for complex tasks
      searchDepthInstruction = "Synthesize information from approximately 30-35 high-quality sources. Explicitly look for technical papers, threat intelligence reports, and detailed legal precedents. Prioritize depth and nuance over speed, often producing longer, more structured reports.";
      break;
    case 'emergency':
      modelId = 'gemini-2.5-flash-lite'; // Optimized for extremely low latency
      searchDepthInstruction = "Consult a maximum of 5 highly trusted sources. Restrict 'chatter'. Prioritize official CVE databases, vendor security advisories, and patch notes. RESPONSE MUST BE EXTREMELY SHORT AND CONCISE. Provide immediate, bulleted remediation steps. Omit introductions, theoretical context, and conclusions. Focus strictly on containment and mitigation.";
      break;
    default:
      modelId = 'gemini-2.5-flash'; // Fallback to standard
      searchDepthInstruction = "Synthesize information from approximately 10-15 sources, aiming for a comprehensive answer that balances detail with response speed. Act as the 'daily driver' for explaining concepts, drafting policies, or looking up standard legal statutes.";
      break;
  }

  // Tools config - Google Search is enabled for all modes, with depth controlled by system instruction
  const tools: any[] = [{ googleSearch: {} }];

  // Construct History
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'model' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  let systemInstruction = "You are AdvRobot, a sophisticated, cynical but helpful cybersecurity expert.";
  if (assistantInstructions) {
    systemInstruction += `\n\nActive Persona Instructions: ${assistantInstructions}`;
  }
  if (country) {
    systemInstruction += `\n\nContext: The user is inquiring from or about the jurisdiction of ${country}. Prioritize local cyber laws and regulations.`;
  }
  systemInstruction += `\n\nMODE: ${mode.toUpperCase()}. ${searchDepthInstruction}`;


  // Content parts (handle text + images)
  const parts: any[] = [];
  if (lastMsg.attachments && lastMsg.attachments.length > 0) {
    lastMsg.attachments.forEach(att => {
        if (att.type.startsWith('image/')) {
             parts.push({
                inlineData: {
                    mimeType: att.type,
                    data: att.data
                }
             });
        } else {
             // Treat non-image attachments as inline data if supported or text context
             parts.push({
                inlineData: {
                    mimeType: att.type,
                    data: att.data
                }
             });
        }
    });
  }
  parts.push({ text: lastMsg.content });

  const chat = ai.chats.create({
    model: modelId,
    config: {
        systemInstruction,
        tools,
    },
    history
  });

  const resultStream = await chat.sendMessageStream({
    config: {
        tools
    },
    message: parts 
  });

  let fullText = "";
  
  for await (const chunk of resultStream) {
    const text = chunk.text;
    if (text) {
        fullText += text;
        if (onChunk) onChunk(fullText);
    }
    
    // Extract grounding
    const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
        const sources = groundingChunks
            .map((c: any) => c.web ? { uri: c.web.uri, title: c.web.title } : null)
            .filter((s: any) => s !== null);
        if (sources.length > 0 && onSources) {
            onSources(sources);
        }
    }
  }

  return fullText;
};

// --- AUTHENTISCAN 2.0 SERVICE ---

export const analyzeAuthenticity = async (
    type: 'image' | 'video' | 'audio' | 'text',
    fileData: string | null, // base64
    textData: string | null, // for news/text
    mimeType: string = 'image/jpeg'
): Promise<AuthentiScanResult> => {
    const ai = getClient();
    // Use Pro model for reasoning layers in 2.0
    const model = 'gemini-3-pro-preview'; 

    let prompt = "";
    
    // AuthentiScan 2.0 System Prompt Construction
    if (type === 'text') {
        prompt = `You are AuthentiScan 2.0. Analyze this text for misinformation, logical fallacies, and factual accuracy. 
        Use Google Search to cross-reference claims.
        Text to Analyze: "${textData}"`;
    } else {
        prompt = `You are the AuthentiScan 2.0 Engine.
        
        TASK:
        Perform a 4-Layer Forensic Analysis on the provided media.
        
        LAYER 1: CRYPTOGRAPHIC PROVENANCE
        - Simulate an inspection of C2PA/Content Credentials and EXIF metadata. 
        - Look for inconsistencies (e.g., iPhone 15 photo with 2021 creation date).
        
        LAYER 2: SIGNAL PROCESSING (The "Microscope")
        - Analyze the visual data for:
          - Error Level Analysis (ELA) inconsistencies (assume high-contrast areas on faces indicate manipulation).
          - Noise Pattern Analysis (look for smooth, noise-free surfaces typical of GANs).
          - Audio: Check for hard frequency cut-offs (>16kHz) or unnatural phase continuity.
        
        LAYER 3: CONTEXTUAL INTELLIGENCE (The "Detective")
        - Use Google Search to cross-reference any visual landmarks, weather conditions, or public events depicted.
        - Check shadow/reflection physics (e.g., sun angle vs time of day).
        
        LAYER 4: COGNITIVE REASONING (The "Brain")
        - Synthesize all findings into a final verdict.
        
        Output valid JSON only.`;
    }

    const schema = {
        type: Type.OBJECT,
        properties: {
            overallVerdict: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            
            // Layer 1
            provenance: {
                type: Type.OBJECT,
                properties: {
                    hasC2PA: { type: Type.BOOLEAN },
                    cameraModel: { type: Type.STRING },
                    metadataStatus: { type: Type.STRING, enum: ['Verified', 'Manipulated', 'Missing'] }
                }
            },
            
            // Layer 2
            signalMetrics: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        status: { type: Type.STRING, enum: ['Pass', 'Fail', 'Suspicious'] },
                        score: { type: Type.NUMBER },
                        details: { type: Type.STRING }
                    }
                }
            },
            
            // Layer 3
            contextualAnalysis: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        factor: { type: Type.STRING },
                        verification: { type: Type.STRING, enum: ['Verified', 'Contradicted', 'Inconclusive'] },
                        source: { type: Type.STRING }
                    }
                }
            },
            
            anomalies: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['overallVerdict', 'confidenceScore', 'summary', 'provenance', 'signalMetrics', 'contextualAnalysis']
    };

    const parts: any[] = [{ text: prompt }];
    if (fileData) {
        parts.push({
            inlineData: {
                mimeType: mimeType,
                data: fileData
            }
        });
    }

    const result = await ai.models.generateContent({
        model,
        contents: { parts: parts },
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            tools: [{ googleSearch: {} }] // Enable Grounding for Layer 3
        }
    });

    const json = JSON.parse(result.text || "{}");
    
    return {
        id: Date.now().toString(),
        type,
        overallVerdict: json.overallVerdict || "Unknown",
        confidenceScore: json.confidenceScore || 0,
        summary: json.summary || "Analysis incomplete.",
        provenance: json.provenance || { hasC2PA: false, metadataStatus: 'Missing' },
        signalMetrics: json.signalMetrics || [],
        contextualAnalysis: json.contextualAnalysis || [],
        anomalies: json.anomalies || [],
        createdAt: Date.now()
    };
};

// --- HELPERS ---

export const getRelatedQuestions = async (context: string): Promise<string[]> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: {
                parts: [{ text: `Based on this context: "${context.substring(0, 500)}...", generate 3 short relevant follow-up questions for a cybersecurity professional. Return JSON array of strings.` }]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) {
        return [];
    }
}
