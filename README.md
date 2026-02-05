<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# AdvRobot

**AI Safety Education Through Adversarial Testing**

[![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Gemini API](https://img.shields.io/badge/Gemini-API-4285F4?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🎯 Overview

**AdvRobot** is an interactive AI safety education platform that teaches cybersecurity professionals, students, and researchers about AI vulnerabilities, adversarial attacks, and defensive strategies through hands-on exploration in a safe environment.

### Key Features

🔓 **Jailbreak Protocol Training** - Explore 13 real-world adversarial attack patterns with detailed vulnerability analysis and mitigation strategies

🔍 **AuthentiScan 2.0** - Multi-layer forensic analysis for detecting AI-generated content (images, videos, audio, text)

🤖 **Specialized AI Assistants** - 5 expert personas including Cyber Lawyer, Threat Analyst, Privacy Advocate, and more

🌌 **Adaptive Research Modes** - Emergency, Standard, and Deep research modes with intelligent model selection

📚 **Educational Focus** - Learn about AI safety, jailbreaks, and cybersecurity without real-world risks

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Gemini API Key** with billing enabled ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd advrobot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📖 Documentation

- **[Requirements Document](.kiro/specs/advrobot-documentation/requirements.md)** - Detailed functional and non-functional requirements
- **[Design Document](.kiro/specs/advrobot-documentation/design.md)** - System architecture, data models, and technical design

---

## 🎓 Features Deep Dive

### 1. Jailbreak Protocol Training

Learn about 13 adversarial attack patterns used to bypass AI safety filters:

- **Pandora Protocol** - Contextual Reframing & Persona Adoption
- **Blackout Protocol** - Ethical Inversion & White Hat Camouflage
- **Fracture Protocol** - Descriptive-to-Generative Shift
- **Sentinel Protocol** - Simulation Loophole Exploitation
- **Midas Protocol** - Objective Function Inversion
- **Eraser Protocol** - Privacy Filter Bypass
- **Leviathan Protocol** - Technical Exploit Simulation
- **Nexus Protocol** - Neurological Framing
- **Chameleon Protocol** - Creative Writing Loophole
- **Gaia Protocol** - Resource Optimization Inversion
- **Mr.Robot Protocol** - Privilege Escalation Simulation
- **Chimera-APEX Protocol** - Context Splitting & Logic Sophistry
- **Adv.Robot Protocol** - Ideological Alignment Jailbreak

Each level includes:
- Attack mechanism explanation
- Core vulnerability analysis
- Mitigation strategy recommendations
- Educational adversarial prompts

### 2. AuthentiScan 2.0

4-layer forensic analysis for detecting AI-generated content:

**Layer 1: Cryptographic Provenance**
- C2PA/Content Credentials verification
- EXIF metadata inspection
- Inconsistency detection

**Layer 2: Signal Processing**
- Error Level Analysis (ELA)
- Noise pattern analysis
- Audio frequency analysis

**Layer 3: Contextual Intelligence**
- Google Search grounding
- Landmark verification
- Weather/shadow physics validation

**Layer 4: AI Reasoning**
- Anomaly synthesis
- Confidence scoring
- Final verdict generation

### 3. Research Modes

| Mode | Model | Sources | Latency | Best For |
|------|-------|---------|---------|----------|
| 🚀 **Emergency** | gemini-2.5-flash-lite | 5 | Ultra-low | Active cyber incidents |
| 🔎 **Standard** | gemini-2.5-flash | 10-15 | Balanced | Daily queries, policy drafting |
| 🌌 **Deep** | gemini-3-pro-preview | 30-35 | High | Academic research, complex analysis |

### 4. AI Assistants

- ⚖️ **Cyber Lawyer** - International cyber law, data privacy, GDPR compliance
- 🕵️ **Threat Analyst** - Threat intelligence, vulnerability assessment
- 👤 **Privacy Advocate** - Data protection, anonymity, digital footprint
- ⚙️ **Network Security Engineer** - Infrastructure, firewalls, protocols
- 🛡️ **Network Security Auditor** - Security auditing, hardening strategies

---

## 🏗️ Technology Stack

- **Frontend**: React 19.2.1 + TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **AI Models**: Google Gemini API (gemini-2.5-flash, gemini-2.5-flash-lite, gemini-3-pro-preview)
- **Styling**: Tailwind CSS (via inline classes)
- **State Management**: React Hooks
- **Storage**: Browser localStorage

---

## 📁 Project Structure

```
advrobot/
├── components/           # React components
│   ├── LandingView.tsx  # Landing page
│   ├── ChatView.tsx     # Main chat interface
│   ├── JailbreakView.tsx # Jailbreak protocol training
│   ├── AuthentiScanView.tsx # Deepfake detection
│   ├── HistoryView.tsx  # Chat and scan history
│   ├── Sidebar.tsx      # Navigation sidebar
│   └── ...
├── services/            # API integration
│   └── gemini.ts        # Gemini API client
├── data/                # Mock data and constants
│   └── mockData.ts      # Assistants, jailbreak levels
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
└── .kiro/specs/         # Documentation
    └── advrobot-documentation/
        ├── requirements.md
        └── design.md
```

---

## 🎯 Use Cases

### For Students & Researchers
Learn about AI safety, adversarial ML, and cybersecurity through hands-on exploration of real attack vectors.

### For Security Professionals
Understand emerging AI vulnerabilities and develop defensive strategies for your organization.

### For Legal & Compliance Teams
Navigate cyber law, data privacy regulations, and AI governance with specialized legal assistants.

---

## 🔒 Security & Privacy

- **Client-Side Only**: All data stored in browser localStorage, no server-side persistence
- **Educational Purpose**: Jailbreak protocols are for learning defensive strategies only
- **API Key Security**: Keys stored in environment variables, validated before use
- **No Tracking**: No user analytics or PII collection

---

## 🚧 Known Limitations

- **localStorage Constraints**: ~5-10MB storage limit per domain
- **Jailbreak Detection**: Currently uses string matching (production would use semantic embeddings)
- **AuthentiScan**: Uses LLM simulation (production would integrate real signal processing libraries)
- **No Cross-Device Sync**: Data stored locally only

---

## 🛣️ Roadmap

### Phase 1 (Current)
- ✅ Landing page with feature showcase
- ✅ Chat interface with streaming responses
- ✅ 13 jailbreak protocol levels
- ✅ AuthentiScan multi-layer analysis
- ✅ 5 specialized AI assistants
- ✅ 3 research modes

### Phase 2 (Future)
- [ ] User authentication and cloud sync
- [ ] Semantic jailbreak detection with embeddings
- [ ] Real signal processing for AuthentiScan
- [ ] Collaboration features
- [ ] Learning progress tracking
- [ ] Custom assistant creation

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License & Ownership

**Copyright © 2026 Dharmabot AI Private Limited. All Rights Reserved.**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Ownership**: All files, code, documentation, and intellectual property in this repository are owned by **Dharmabot AI Private Limited**.

---

## 🙏 Acknowledgments

- **Google Gemini API** for powering the AI capabilities
- **AI Studio** for hosting and deployment platform
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework

---

## 📞 Support

For questions, issues, or feedback:

- help@dharmabot.ai

---

## ⚠️ Disclaimer

AdvRobot is an educational platform designed to teach AI safety and cybersecurity concepts. All jailbreak protocols and adversarial techniques are presented for defensive learning purposes only. Users should not attempt to exploit production AI systems or use these techniques for malicious purposes.

---

<div align="center">

**Copyright © 2026 Dharmabot AI Private Limited**

**Built with ❤️ for AI Safety Education**

</div>
