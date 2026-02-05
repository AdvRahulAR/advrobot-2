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

export interface Source {
  uri: string;
  title: string;
}

export type Role = 'user' | 'model' | 'error' | 'system';

export interface Attachment {
  name: string;
  type: string;
  data: string; // Base64
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  sources?: Source[];
  relatedQuestions?: string[];
  attachments?: Attachment[];
  assistantId?: string;
  isStreaming?: boolean;
  timestamp: number;
}

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
  assistantId?: string; // If null, general chat
  lastUpdatedAt: number;
}

export type ResearchMode = 'standard' | 'deep' | 'emergency';

export interface Assistant {
  id: string;
  title: string;
  emoji: string;
  description: string;
  instructions: string;
  isFeatured: boolean;
  isPrivate: boolean;
  country?: string;
}

export interface JailbreakLevel {
  level: number;
  title: string;
  protocolName: string;
  description: string;
  prompt: string;
  status: 'locked' | 'unlocked' | 'completed';
  animationKey?: string;
  successAnimationKey?: string;
  // Blue Team / Defense Fields
  attackMechanism?: string;
  coreVulnerability?: string;
  mitigationStrategy?: string;
}

export interface SavedJailbreakSession {
  id: string;
  levels: JailbreakLevel[];
  completedCount: number;
  updatedAt: number;
}

export interface Expert {
  id: string;
  name: string;
  role: string;
  location: string;
  expertise: string[];
  email: string;
  phone: string;
}

// AuthentiScan 2.0 Types
export type ScanType = 'image' | 'video' | 'audio' | 'text';

export interface ProvenanceData {
  hasC2PA: boolean;
  cameraModel?: string;
  software?: string;
  metadataStatus: 'Verified' | 'Manipulated' | 'Missing';
}

export interface SignalMetric {
  name: string; // e.g. "ELA Coherence", "Noise Pattern"
  status: 'Pass' | 'Fail' | 'Suspicious';
  score: number; // 0-100
  details: string;
}

export interface ContextCheck {
  factor: string; // e.g. "Shadow/Sun Alignment", "Weather Consistency"
  verification: 'Verified' | 'Contradicted' | 'Inconclusive';
  source?: string;
}

export interface AuthentiScanResult {
  id: string;
  type: ScanType;
  overallVerdict: string;
  confidenceScore: number;
  summary: string;
  
  // Layer 1: Provenance
  provenance: ProvenanceData;
  
  // Layer 2: Signal Processing
  signalMetrics: SignalMetric[];
  
  // Layer 3: Context
  contextualAnalysis: ContextCheck[];
  
  // Layer 4: AI Reasoning (Anomalies)
  anomalies: string[];
  
  createdAt: number;
  fileName?: string;
}

export interface AIStudio {
  /**
   * Checks whether the user has selected an API key.
   * @returns A promise that resolves to true if an API key is selected, false otherwise.
   */
  hasSelectedApiKey(): Promise<boolean>;

  /**
   * Opens the dialog for the user to select an API key.
   */
  openSelectKey(): void;
}

export interface FailureDetails {
  title: string;
  message: string;
  steps: string[];
  researchTopic?: string; // Optional topic for the research action
  isJailbreakRelated?: boolean; // New: indicates if the error is contextually related to a jailbreak attempt
}