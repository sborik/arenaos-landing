# arenaOS

**The platform layer for robot esports.**

A vision for a new platform layer for robot esports. Existing games translated to physical robot competition—or new ones built native to the platform. An open ecosystem where students build, educators teach, and sponsors invest. A new education-to-economy pipeline.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://arenaos-landing.vercel.app)
[![ToddlerBot Paper](https://img.shields.io/badge/arXiv-2502.00893-b31b1b)](https://arxiv.org/abs/2502.00893)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🎯 Vision

arenaOS is the infrastructure layer for **mixed-reality robot esports**—a complete ecosystem for:

- **Students** building and operating robots
- **Educators** teaching robotics through competition
- **Sponsors** investing in the next generation of operators
- **Creators** streaming and producing content
- **Leagues** running standardized competitions

## 🤖 Built on ToddlerBot

arenaOS is built on the [ToddlerBot](https://toddlerbot.github.io/) platform—an open-source humanoid robot from Stanford designed for ML research and real-world deployment.

### Why ToddlerBot?

| Metric | Value | Why It Matters |
|--------|-------|----------------|
| **Cost** | <$6,000 USD | Accessible to schools and hobbyists |
| **Degrees of Freedom** | 30 active DoFs | Full loco-manipulation capability |
| **Build Time** | 3 days (non-expert) | Rapid replication and repair |
| **Sim-to-Real** | Zero-shot transfer | Train in simulation, deploy on hardware |
| **Policy Transfer** | Cross-instance | Standardized competition—all robots equal |
| **Repair Time** | 35 minutes | 21min print + 14min assembly |
| **Onboard Compute** | 2.5 TFLOPS (Jetson Orin) | Real-time vision + control |
| **Manipulation Success** | 90% | With only 60 demonstrations |

### Academic Foundation

ToddlerBot is backed by peer-reviewed research from Stanford:

- **ToddlerBot** (2025) — [arXiv:2502.00893](https://arxiv.org/abs/2502.00893) | [Website](https://toddlerbot.github.io/)
- **Locomotion Beyond Feet** (2026) — [arXiv:2601.03607](https://arxiv.org/abs/2601.03607) | [Website](https://locomotion-beyond-feet.github.io/)

Funded by NSF and Stanford Institute for Human-Centered AI.

---

## 🏗️ Core Infrastructure

arenaOS provides four core services:

### 🛡️ Safety Envelope
Runtime safety assertions for robots:
- Speed limits and motor temperature monitoring
- Battery thresholds and geofencing
- Emergency stop protocols

### 📊 Telemetry & Broadcast
Real-time robot state capture:
- Live telemetry ingestion and SQLite storage
- Replay capabilities for training and review
- Dashboard adapters for broadcast overlays

### 📚 Education (PATINA)
Learning analytics platform:
- Private LLM conversation analysis for skill assessment
- Educator insights dashboard
- Badge-gated curriculum progression

### 🎮 Curriculum (Jungle Gym)
Skill progression framework:
- Structured training modules
- Achievement and ranking systems
- Team leaderboards

---

## 🎮 Game Modes

arenaOS supports physical robot versions of:

| Category | Examples |
|----------|----------|
| **Fighting** | Smash Bros, Tekken, Street Fighter |
| **Tactical** | Rocket League, Overwatch |
| **Sports** | FIFA, NBA 2K |
| **Racing** | Mario Kart, F-Zero |
| **Battle Royale** | Fortnite, Apex Legends |
| **Native Formats** | Robot sumo, capture-the-flag, relay races |

---

## 📐 Arena Specifications

### School Kit (~$1,500)
- 2×2m foam arena with soft borders
- Overhead camera mount
- Raspberry Pi control unit
- Basic lighting

### Regional Venue (~$50,000)
- Dual 3×3m competition arenas
- Professional camera system (PTZ)
- DMX lighting rig
- Broadcast-ready streaming

### Full details: [Arena Spec](docs/ARENA-SPEC.md)

---

## 🚀 Getting Started

```bash
# Clone the landing page
git clone https://github.com/sborik/arenaos-landing.git
cd arenaos-landing
npm install
npm run dev

# Clone the core services
git clone https://github.com/sborik/arenaos-core.git
cd arenaos-core
npm install
npm test
```

---

## 📚 Documentation

- [Technical Specification](docs/ARENAOS-TECH-SPEC.md)
- [Game Mode Matrix](docs/arenaOS-GAME-MATRIX.md)
- [Cable Rig CAD Spec](docs/arenaOS-CABLE-RIG-CAD-SPEC.md)
- [System Completeness Map](docs/arenaOS-COMPLETENESS-MAP.md)

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| **Live Demo** | [arenaos-landing.vercel.app](https://arenaos-landing.vercel.app) |
| **ToddlerBot** | [toddlerbot.github.io](https://toddlerbot.github.io/) |
| **ToddlerBot Paper** | [arXiv:2502.00893](https://arxiv.org/abs/2502.00893) |
| **ToddlerBot CAD** | [Onshape](https://cad.onshape.com/documents/565bc33af293a651f66e88d2) |
| **Discord Community** | [Join](https://toddlerbot.github.io/) |

---

## 📄 Citation

If you use arenaOS or ToddlerBot in your research, please cite:

```bibtex
@article{shi2025toddlerbot,
  title={ToddlerBot: Open-Source ML-Compatible Humanoid Platform for Loco-Manipulation},
  author={Shi, Haochen and Wang, Weizhuo and Song, Shuran and Liu, C. Karen},
  journal={arXiv preprint arXiv:2502.00893},
  year={2025}
}

@misc{yang2026locomotion,
  title={Locomotion Beyond Feet},
  author={Yang, Tae Hoon and Shi, Haochen and Hu, Jiacheng and Zhang, Zhicong and others},
  year={2026},
  eprint={2601.03607},
  archivePrefix={arXiv}
}
```

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

---

**arenaOS** — *The games you love, on a new medium.*
