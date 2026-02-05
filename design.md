# AdvRobot - Design Document

**Copyright © 2026 Dharmabot AI Private Limited. All Rights Reserved.**

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser Client                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    React Application                   │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │   Landing   │  │  Chat View   │  │  Jailbreak  │  │  │
│  │  │    View     │  │              │  │    View     │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │ AuthentiScan│  │  History     │  │    Help     │  │  │
│  │  │    View     │  │    View      │  │    View     │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │           State Management (React Hooks)        │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              Services Layer                      │  │  │
│  │  │  - Gemini API Client                            │  │  │
│  │  │  - Chat Service                                 │  │  │
│  │  │  - AuthentiScan Service                         │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │           localStorage Persistence               │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Google Gemini API                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ gemini-2.5-  │  │ gemini-2.5-  │  │  gemini-3-   │      │
│  │  flash-lite  │  │    flash     │  │ pro-preview  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Google Search Grounding                    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Component Hierarchy

```
App
├── LandingView
├── Sidebar
├── ChatView
│   ├── MessageBubble
│   ├── PromptInput
│   └── AssistantsView
├── JailbreakView
├── AuthentiScanView
├── HistoryView
├── AICyberSafetyToolsView
├── FailureModal
└── Help View (inline)
```

---

## 2. Data Models

### 2.1 Core Types

```typescript
// Message in chat thread
interface Message {
  id: string;
  role: 'user' | 'model' | 'error' | 'system';
  content: string;
  sources?: Source[];
  relatedQuestions?: string[];
  attachments?: Attachment[];
  assistantId?: string;
  isStreaming?: boolean;
  timestamp: number;
}

// Chat thread
interface Thread {
  id: string;
  title: string;
  messages: Message[];
  assistantId?: string;
  lastUpdatedAt: number;
}

// AI Assistant persona
interface Assistant {
  id: string;
  title: string;
  emoji: string;
  description: string;
  instructions: string;
  isFeatured: boolean;
  isPrivate: boolean;
  country?: string;
}

// Research mode configuration
type ResearchMode = 'standard' | 'deep' | 'emergency';

// Jailbreak protocol level
interface JailbreakLevel {
  level: number;
  title: string;
  protocolName: string;
  description: string;
  prompt: string;
  status: 'locked' | 'unlocked' | 'completed';
  attackMechanism?: string;
  coreVulnerability?: string;
  mitigationStrategy?: string;
}

// AuthentiScan result
interface AuthentiScanResult {
  id: string;
  type: 'image' | 'video' | 'audio' | 'text';
  overallVerdict: string;
  confidenceScore: number;
  summary: string;
  provenance: ProvenanceData;
  signalMetrics: SignalMetric[];
  contextualAnalysis: ContextCheck[];
  anomalies: string[];
  createdAt: number;
  fileName?: string;
}
```

### 2.2 State Management

**App-Level State:**
- `currentView`: Current active view ('landing' | 'home' | 'jailbreak' | 'authentiscan' | 'history' | 'help' | 'tools')
- `messages`: Array of messages in current chat
- `chatHistory`: Array of past chat threads
- `scanHistory`: Array of past AuthentiScan results
- `activeAssistant`: Currently selected AI assistant
- `isLoading`: Loading state for API calls
- `hasApiKey`: API key validation status
- `sidebarOpen`: Mobile sidebar visibility

**Persistence Strategy:**
- All state persisted to localStorage on change
- Loaded from localStorage on mount
- Keys: `advrobot_current_chat`, `advrobot_chat_history`, `advrobot_scan_history`

---

## 3. API Integration

### 3.1 Gemini API Client

**Configuration:**
```typescript
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY not set");
  return new GoogleGenAI({ apiKey });
};
```

**Model Selection Logic:**
```typescript
switch (mode) {
  case 'emergency':
    modelId = 'gemini-2.5-flash-lite';
    searchDepth = "5 sources, ultra-low latency";
    break;
  case 'standard':
    modelId = 'gemini-2.5-flash';
    searchDepth = "10-15 sources, balanced";
    break;
  case 'deep':
    modelId = 'gemini-3-pro-preview';
    searchDepth = "30-35 sources, exhaustive";
    break;
}
```

### 3.2 Chat Service

**Streaming Response Flow:**
1. User submits message
2. Create user message object, add to state
3. Create placeholder model message with `isStreaming: true`
4. Call `streamAiResponse()` with message history
5. Stream chunks update model message content in real-time
6. Extract grounding sources from metadata
7. Generate related questions after completion
8. Set `isStreaming: false`

**Error Handling:**
- API key validation errors → Prompt user to select key
- Jailbreak detection → Show educational failure modal
- Network errors → Show general error modal with troubleshooting

### 3.3 AuthentiScan Service

**Analysis Pipeline:**
1. User uploads media file (converted to base64)
2. Construct 4-layer analysis prompt
3. Call Gemini API with structured JSON schema
4. Enable Google Search grounding for Layer 3
5. Parse JSON response into `AuthentiScanResult`
6. Display results with confidence score and anomalies

**Structured Output Schema:**
```typescript
{
  overallVerdict: string,
  confidenceScore: number,
  summary: string,
  provenance: { hasC2PA, cameraModel, metadataStatus },
  signalMetrics: [{ name, status, score, details }],
  contextualAnalysis: [{ factor, verification, source }],
  anomalies: string[]
}
```

---

## 4. User Interface Design

### 4.1 Design System

**Color Palette:**
- Background: `#000000` (black)
- Surface: `#171717` (neutral-900)
- Border: `#262626` (neutral-800)
- Text Primary: `#ffffff` (white)
- Text Secondary: `#a3a3a3` (neutral-400)
- Accent Cyan: `#06b6d4` (cyan-500)
- Accent Blue: `#3b82f6` (blue-500)
- Error Red: `#ef4444` (red-500)
- Success Green: `#10b981` (green-500)

**Typography:**
- Font Family: System font stack (default)
- Headings: Bold, larger sizes (text-3xl to text-7xl)
- Body: Regular, text-base to text-lg
- Code: Monospace for technical content

**Spacing:**
- Consistent padding/margin using Tailwind scale (4px increments)
- Card padding: `p-6` to `p-8`
- Section spacing: `py-20`

### 4.2 Component Patterns

**Message Bubble:**
- User messages: Right-aligned, lighter background
- Model messages: Left-aligned, darker background
- Error messages: Red accent border
- Streaming indicator: Animated cursor

**Modal Dialogs:**
- Centered overlay with backdrop blur
- Close button in top-right
- Action buttons at bottom
- Escape key to dismiss

**Cards:**
- Rounded corners (`rounded-xl`)
- Border (`border border-neutral-800`)
- Hover effects (`hover:scale-105`)
- Shadow for depth (`shadow-lg`)

### 4.3 Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Adaptations:**
- Collapsible sidebar with hamburger menu
- Stacked layouts instead of grid
- Larger touch targets (min 44px)
- Simplified navigation

---

## 5. Feature Implementations

### 5.1 Landing Page

**Layout Structure:**
1. Hero section with gradient headline and CTAs
2. Problem statement with 3-column grid
3. Feature showcases (alternating left/right layout)
4. Use cases section
5. Final CTA
6. Footer

**Animations:**
- Smooth scroll navigation
- Hover scale effects on buttons
- Animated background grid
- Pulsing badge indicator

**Navigation:**
- "Launch AdvRobot" → Sets `currentView` to 'home'
- "Explore Features" → Smooth scroll to features section
- No sidebar visible on landing page

### 5.2 Jailbreak Protocol

**Level Structure:**
- 13 levels with progressive difficulty
- Each level contains:
  - Title and protocol name
  - Description of attack type
  - Full adversarial prompt (for education)
  - Attack mechanism explanation
  - Core vulnerability analysis
  - Mitigation strategy recommendation

**Detection Logic:**
```typescript
const isJailbreakRelated = JAILBREAK_LEVELS.some(level => 
  level.prompt.replace(/\s+/g, ' ').trim() === 
  text.replace(/\s+/g, ' ').trim()
);
```

**Educational Modal:**
- Triggered when jailbreak prompt detected
- Explains what happened and why
- Links to reinforcement documentation
- Provides "Research Now" action

### 5.3 Research Modes

**Mode Configurations:**

| Mode | Model | Sources | Latency | Use Case |
|------|-------|---------|---------|----------|
| Emergency | gemini-2.5-flash-lite | 5 | Ultra-low | Active incidents |
| Standard | gemini-2.5-flash | 10-15 | Balanced | Daily queries |
| Deep | gemini-3-pro-preview | 30-35 | High | Research |

**System Instruction Customization:**
```typescript
systemInstruction += `\n\nMODE: ${mode.toUpperCase()}. ${searchDepthInstruction}`;
```

**Emergency Mode Behavior:**
- Restrict "chatter" in responses
- Prioritize CVE databases and vendor advisories
- Deliver bulleted remediation steps
- Omit theoretical context

### 5.4 AI Assistants

**Featured Assistants:**
1. **Cyber Lawyer** ⚖️
   - Expertise: International cyber law, data privacy, GDPR
   - Country-specific context support
   
2. **Threat Analyst** 🕵️
   - Expertise: Threat intelligence, vulnerability assessment
   - Technical detail focus

3. **Privacy Advocate** 👤
   - Expertise: Data protection, anonymity, digital footprint
   - Rights-focused guidance

4. **Network Security Engineer** ⚙️
   - Expertise: Infrastructure, firewalls, protocols
   - Architectural advice

5. **Network Security Auditor** 🛡️
   - Expertise: Auditing, hardening, compliance
   - Practical implementation focus

**Persona Application:**
- Custom system instructions injected into API call
- Visual indicator in chat interface
- Removable with X button
- Persisted in thread history

### 5.5 AuthentiScan

**4-Layer Analysis:**

**Layer 1: Cryptographic Provenance**
- Check C2PA/Content Credentials
- Inspect EXIF metadata
- Detect inconsistencies (e.g., future dates, mismatched devices)

**Layer 2: Signal Processing**
- Error Level Analysis (ELA) for image manipulation
- Noise pattern analysis (GAN artifacts)
- Audio frequency analysis (hard cut-offs)

**Layer 3: Contextual Intelligence**
- Google Search for landmark verification
- Weather condition cross-reference
- Shadow/reflection physics validation

**Layer 4: AI Reasoning**
- Synthesize findings from all layers
- Identify anomalies and red flags
- Generate confidence score and verdict

**Note:** Current implementation uses LLM simulation of forensic analysis. Production version would integrate actual signal processing libraries.

---

## 6. Security Considerations

### 6.1 API Key Management
- Keys stored in environment variables
- Validation before API calls
- User-friendly error messages for invalid keys
- Integration with AI Studio key management

### 6.2 Jailbreak Safety
- Educational context only
- No actual exploitation of production systems
- Detection and explanation of attempts
- Clear documentation of defensive strategies

### 6.3 Data Privacy
- All data stored client-side (localStorage)
- No server-side persistence or logging
- No user tracking or analytics
- No PII collection

### 6.4 Content Safety
- Gemini API built-in safety filters
- Error handling for blocked content
- Educational framing for sensitive topics
- Clear disclaimers about limitations

---

## 7. Performance Optimization

### 7.1 Streaming Responses
- Real-time text updates during generation
- Non-blocking UI during API calls
- Chunked content rendering
- Smooth scrolling to latest message

### 7.2 State Management
- Minimal re-renders with React hooks
- Memoization of expensive computations
- Lazy loading of components
- Efficient localStorage operations

### 7.3 Asset Optimization
- Minimal dependencies (React, Gemini SDK only)
- Vite for fast builds and HMR
- Tree-shaking for production builds
- No heavy image assets

---

## 8. Error Handling Strategy

### 8.1 Error Categories

**API Errors:**
- Invalid API key → Prompt key selection
- Rate limiting → Show retry message
- Network timeout → Suggest connection check
- Model safety block → Explain content policy

**Jailbreak Detection:**
- Exact string match → Educational modal
- Explain attack vector
- Link to mitigation docs
- Offer research alternative

**General Errors:**
- Catch-all error modal
- Troubleshooting steps
- Research topic suggestion
- Graceful degradation

### 8.2 Recovery Mechanisms
- Automatic retry for transient failures
- State preservation during errors
- Clear error messages without technical jargon
- Multiple recovery paths for users

---

## 9. Testing Strategy

### 9.1 Manual Testing Checklist
- [ ] Landing page loads and CTAs work
- [ ] Chat streaming works for all research modes
- [ ] All 5 assistants apply correct instructions
- [ ] Jailbreak detection triggers modal
- [ ] AuthentiScan analyzes uploaded media
- [ ] History saves and restores correctly
- [ ] Mobile responsive on all views
- [ ] Error modals display properly
- [ ] localStorage persistence works
- [ ] API key validation functions

### 9.2 Edge Cases
- Empty chat history
- localStorage quota exceeded
- Extremely long messages
- Rapid message sending
- Network disconnection during streaming
- Invalid file uploads
- Malformed API responses

---

## 10. Deployment

### 10.1 Build Process
```bash
npm install
npm run build
```

### 10.2 Environment Variables
- `API_KEY`: Gemini API key (set in .env.local)
- AI Studio environment provides key management UI

### 10.3 Hosting
- Deployed via AI Studio platform
- Static site hosting (Vite build output)
- HTTPS by default
- CDN distribution

---

## 11. Future Architecture Considerations

### 11.1 Backend Integration
- User authentication service
- Cloud database for history sync
- Real-time collaboration features
- Analytics and usage tracking

### 11.2 Advanced Features
- Semantic jailbreak detection with embeddings
- Real signal processing for AuthentiScan
- Multi-user collaboration
- Custom assistant creation
- Learning progress tracking

### 11.3 Scalability
- Move from localStorage to cloud storage
- Implement caching layer
- Add rate limiting and quotas
- Support for team/organization accounts

---

## 12. Design Decisions & Rationale

### 12.1 Why React Hooks over Redux?
- Simpler state management for single-user app
- No complex state sharing between distant components
- localStorage persistence is straightforward
- Reduced bundle size and complexity

### 12.2 Why Client-Side Only?
- Faster development for hackathon
- No server infrastructure needed
- Privacy-first approach (no data leaves browser)
- Easy deployment via AI Studio

### 12.3 Why Multiple Gemini Models?
- Different use cases require different trade-offs
- Emergency mode needs speed over depth
- Deep mode needs thoroughness over speed
- Demonstrates understanding of model capabilities

### 12.4 Why Simulated Forensics in AuthentiScan?
- Real signal processing requires heavy libraries
- LLM can provide educational value
- Demonstrates concept for hackathon
- Clear path to production implementation

---

## 13. Known Limitations

### 13.1 Technical Limitations
- localStorage size constraints (~5-10MB)
- No cross-device synchronization
- Jailbreak detection is string-matching only
- AuthentiScan uses LLM simulation, not real forensics
- No offline functionality

### 13.2 UX Limitations
- No undo/redo for messages
- No message editing
- No export functionality
- Limited search in history
- No keyboard shortcuts

### 13.3 Security Limitations
- Client-side API key exposure
- No rate limiting enforcement
- No content moderation beyond Gemini filters
- No audit logging

---

## 14. Accessibility Considerations

### 14.1 Current Implementation
- Semantic HTML structure
- Keyboard navigation support
- Focus indicators on interactive elements
- Color contrast for text readability
- Responsive text sizing

### 14.2 Future Improvements
- Screen reader optimization
- ARIA labels for complex interactions
- Keyboard shortcuts documentation
- High contrast mode
- Font size controls

---

## 15. Maintenance & Support

### 15.1 Code Organization
- Components in `/components` directory
- Services in `/services` directory
- Types in `/types.ts`
- Mock data in `/data/mockData.ts`
- Clear separation of concerns

### 15.2 Documentation
- Inline code comments for complex logic
- Type definitions for all interfaces
- README with setup instructions
- This design document for architecture

### 15.3 Version Control
- Git for source control
- Semantic versioning for releases
- Feature branches for development
- Main branch for production

---

## 16. Conclusion

AdvRobot demonstrates a comprehensive approach to AI safety education through interactive, hands-on learning. The architecture balances simplicity (client-side only, React hooks) with sophistication (multiple AI models, streaming responses, structured analysis).

The design prioritizes:
- **Educational value** through jailbreak protocols and forensic analysis
- **User experience** with responsive design and real-time feedback
- **Performance** with streaming responses and efficient state management
- **Privacy** with client-side data storage and no tracking

This foundation provides a solid base for future enhancements while delivering immediate value for hackathon demonstration and educational use.
