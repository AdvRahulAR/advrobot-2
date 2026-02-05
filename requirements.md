# AdvRobot - Requirements Document

**Copyright © 2026 Dharmabot AI Private Limited. All Rights Reserved.**

---

## 1. Project Overview

### 1.1 Purpose
AdvRobot is an AI safety education platform that teaches cybersecurity professionals, students, and researchers about AI vulnerabilities, adversarial attacks, and defensive strategies through interactive, hands-on exploration.

### 1.2 Target Audience
- Cybersecurity students and researchers
- Security professionals and penetration testers
- Legal and compliance teams working with AI systems
- AI safety researchers and educators

### 1.3 Core Value Proposition
Democratize AI safety education by providing a safe, interactive environment to learn about jailbreak techniques, deepfake detection, and cybersecurity best practices without real-world risks.

---

## 2. Functional Requirements

### 2.1 Landing Page
**Priority: High**

**User Story:** As a first-time visitor, I want to understand what AdvRobot offers so I can decide if it's relevant to my needs.

**Acceptance Criteria:**
- 2.1.1 Display hero section with clear value proposition
- 2.1.2 Show key statistics (13 jailbreak protocols, 5 AI assistants, 4 research modes)
- 2.1.3 Present problem statement explaining AI security challenges
- 2.1.4 Showcase three main features with visual examples
- 2.1.5 Include use case descriptions for different user types
- 2.1.6 Provide "Launch AdvRobot" CTA that navigates to main application
- 2.1.7 Implement smooth scroll navigation between sections
- 2.1.8 Ensure mobile-responsive design

### 2.2 Chat Interface
**Priority: High**

**User Story:** As a user, I want to interact with AI assistants to get cybersecurity advice and legal guidance.

**Acceptance Criteria:**
- 2.2.1 Display message history with user and AI responses
- 2.2.2 Support streaming responses with real-time text updates
- 2.2.3 Show typing indicators during AI response generation
- 2.2.4 Display source citations with clickable links
- 2.2.5 Show related follow-up questions after each response
- 2.2.6 Support file attachments (images, documents)
- 2.2.7 Allow users to select different AI assistants (Cyber Lawyer, Threat Analyst, etc.)
- 2.2.8 Persist chat history to localStorage
- 2.2.9 Enable users to start new chat sessions
- 2.2.10 Display active assistant indicator when persona is selected

### 2.3 Research Modes
**Priority: High**

**User Story:** As a user, I want to choose different research depths based on my query urgency and complexity.

**Acceptance Criteria:**
- 2.3.1 Provide three research modes: Emergency, Standard, Deep
- 2.3.2 Emergency mode: Use gemini-2.5-flash-lite, consult 5 sources, ultra-low latency
- 2.3.3 Standard mode: Use gemini-2.5-flash, consult 10-15 sources, balanced speed
- 2.3.4 Deep mode: Use gemini-3-pro-preview, consult 30-35 sources, exhaustive research
- 2.3.5 Display mode selector in chat interface
- 2.3.6 Adjust system instructions based on selected mode
- 2.3.7 Show mode-specific behavior in responses (concise for emergency, detailed for deep)

### 2.4 Jailbreak Protocol Training
**Priority: High**

**User Story:** As a security researcher, I want to learn about adversarial attack patterns so I can understand AI vulnerabilities.

**Acceptance Criteria:**
- 2.4.1 Display 13 jailbreak levels with progressive difficulty
- 2.4.2 Show level details: title, protocol name, description, attack mechanism
- 2.4.3 Display core vulnerability explanation for each level
- 2.4.4 Provide mitigation strategy recommendations
- 2.4.5 Include actual adversarial prompts for educational purposes
- 2.4.6 Implement lock/unlock status for levels
- 2.4.7 Detect jailbreak attempts and show educational failure modal
- 2.4.8 Track completion status for each protocol
- 2.4.9 Persist jailbreak session progress to localStorage

### 2.5 AuthentiScan (Deepfake Detection)
**Priority: Medium**

**User Story:** As a user, I want to analyze media files to detect AI-generated content and manipulation.

**Acceptance Criteria:**
- 2.5.1 Support multiple media types: image, video, audio, text
- 2.5.2 Implement 4-layer forensic analysis:
  - Layer 1: Cryptographic Provenance (C2PA, EXIF metadata)
  - Layer 2: Signal Processing (ELA, noise patterns)
  - Layer 3: Contextual Intelligence (Google Search verification)
  - Layer 4: AI Reasoning (anomaly detection)
- 2.5.3 Display overall verdict and confidence score
- 2.5.4 Show detailed analysis results for each layer
- 2.5.5 List detected anomalies and inconsistencies
- 2.5.6 Provide source citations for contextual verification
- 2.5.7 Save scan results to history
- 2.5.8 Allow users to review past scan results

### 2.6 AI Assistants
**Priority: Medium**

**User Story:** As a user, I want to interact with specialized AI personas for domain-specific expertise.

**Acceptance Criteria:**
- 2.6.1 Provide 5 specialized assistants:
  - Cyber Lawyer (legal advice, compliance)
  - Threat Analyst (threat intelligence, vulnerabilities)
  - Privacy Advocate (data protection, anonymity)
  - Network Security Engineer (infrastructure, firewalls)
  - Network Security Auditor (auditing, hardening)
- 2.6.2 Display assistant card with emoji, title, description
- 2.6.3 Apply custom system instructions when assistant is selected
- 2.6.4 Show active assistant indicator in chat interface
- 2.6.5 Allow users to remove assistant and return to general mode
- 2.6.6 Support country-specific legal context for Cyber Lawyer

### 2.7 History Management
**Priority: Medium**

**User Story:** As a user, I want to access my previous chat sessions and scan results.

**Acceptance Criteria:**
- 2.7.1 Display list of past chat threads with titles and timestamps
- 2.7.2 Show list of past AuthentiScan results
- 2.7.3 Allow users to restore previous chat sessions
- 2.7.4 Allow users to view previous scan results
- 2.7.5 Enable deletion of chat threads and scan results
- 2.7.6 Persist history to localStorage
- 2.7.7 Display assistant emoji in thread title if applicable

### 2.8 Error Handling & Failure Modals
**Priority: High**

**User Story:** As a user, I want clear error messages and guidance when something goes wrong.

**Acceptance Criteria:**
- 2.8.1 Detect API key errors and prompt user to select valid key
- 2.8.2 Show jailbreak detection modal with educational content
- 2.8.3 Display general error modal with troubleshooting steps
- 2.8.4 Provide "Research Now" action to investigate error topics
- 2.8.5 Link to jailbreak reinforcement documentation
- 2.8.6 Show user-friendly error messages in chat interface

### 2.9 Help & Documentation
**Priority: Low**

**User Story:** As a user, I want to understand how to use different features and research modes.

**Acceptance Criteria:**
- 2.9.1 Provide detailed explanation of research modes
- 2.9.2 Document jailbreak protocol reinforcement strategies
- 2.9.3 Explain AuthentiScan functionality
- 2.9.4 Include model information and search depth details
- 2.9.5 Provide navigation to help section from sidebar

---

## 3. Non-Functional Requirements

### 3.1 Performance
- 3.1.1 Emergency mode responses must start streaming within 2 seconds
- 3.1.2 Standard mode responses must start streaming within 5 seconds
- 3.1.3 Chat interface must remain responsive during streaming
- 3.1.4 localStorage operations must not block UI

### 3.2 Usability
- 3.2.1 Interface must be intuitive for first-time users
- 3.2.2 Mobile-responsive design for all screen sizes
- 3.2.3 Consistent dark theme across all views
- 3.2.4 Clear visual feedback for all user actions
- 3.2.5 Accessible color contrast ratios (WCAG AA minimum)

### 3.3 Security
- 3.3.1 API keys must be validated before use
- 3.3.2 Jailbreak prompts must be educational only (no actual exploitation)
- 3.3.3 User data must remain in browser (no server-side storage)
- 3.3.4 External links must open in new tabs with proper security attributes

### 3.4 Reliability
- 3.4.1 Graceful degradation when API calls fail
- 3.4.2 localStorage fallback if quota exceeded
- 3.4.3 Error recovery without requiring page refresh
- 3.4.4 Consistent state management across sessions

### 3.5 Compatibility
- 3.5.1 Support modern browsers (Chrome, Firefox, Safari, Edge)
- 3.5.2 Responsive design for mobile, tablet, desktop
- 3.5.3 Compatible with AI Studio environment
- 3.5.4 Support for Gemini API v1.31.0+

---

## 4. Technical Constraints

### 4.1 Technology Stack
- React 19.2.1
- TypeScript 5.8.2
- Vite 6.2.0
- Google Gemini API (@google/genai 1.31.0)

### 4.2 API Dependencies
- Gemini API for chat and content generation
- Google Search grounding for research modes
- AI Studio environment for API key management

### 4.3 Storage Limitations
- localStorage limited to ~5-10MB per domain
- No backend database or server-side persistence
- All data stored client-side

---

## 5. Future Enhancements (Out of Scope)

### 5.1 User Accounts & Cloud Sync
- User authentication and profiles
- Cloud storage for chat history and scan results
- Cross-device synchronization

### 5.2 Advanced Jailbreak Detection
- Semantic similarity detection using embeddings
- Fine-tuned classifier for adversarial prompts
- Real-time threat intelligence integration

### 5.3 Real Deepfake Detection
- Actual signal processing libraries (not LLM simulation)
- Integration with forensic tools (ELA, noise analysis)
- Video frame-by-frame analysis

### 5.4 Collaboration Features
- Share chat threads with team members
- Collaborative jailbreak protocol testing
- Expert consultation marketplace

### 5.5 Analytics & Insights
- Usage statistics and learning progress
- Jailbreak attempt patterns and trends
- Personalized learning recommendations

---

## 6. Success Metrics

### 6.1 User Engagement
- Average session duration > 10 minutes
- Jailbreak protocol completion rate > 30%
- Return user rate > 40%

### 6.2 Educational Impact
- Users complete at least 3 jailbreak levels
- Users try all 3 research modes
- Users interact with at least 2 different assistants

### 6.3 Technical Performance
- 95% uptime for API calls
- < 5 second average response time
- < 1% error rate for chat interactions

---

## 7. Assumptions & Dependencies

### 7.1 Assumptions
- Users have stable internet connection
- Users have modern browsers with localStorage support
- Users have valid Gemini API keys with billing enabled
- Users understand basic cybersecurity concepts

### 7.2 Dependencies
- Google Gemini API availability and reliability
- Google Search grounding service availability
- AI Studio environment for deployment
- Browser localStorage functionality

---

## 8. Glossary

**Jailbreak**: An adversarial technique to bypass AI safety filters and constraints.

**Grounding**: Using external data sources (like Google Search) to verify and enhance AI responses.

**C2PA**: Coalition for Content Provenance and Authenticity - a standard for media metadata.

**ELA**: Error Level Analysis - a forensic technique to detect image manipulation.

**DURC**: Dual-Use Research of Concern - research that could be used for harmful purposes.

**Persona**: A specialized AI assistant with custom instructions and expertise.

**Research Mode**: A configuration that adjusts AI model selection and search depth.
