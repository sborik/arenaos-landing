# arenaOS

Mixed-reality robot esports infrastructure.

## What This Is

**ToddlerBot** (Stanford TML): Open-source humanoid for ML research. 30 DoF, $6k, PPO walking, diffusion manipulation, Quest teleoperation. [Paper: arXiv:2502.00893](https://arxiv.org/abs/2502.00893)

**arenaOS**: Software for match orchestration, telemetry streaming, skill trees, and education curriculum. Built for robot competition. Never connected to real robots.

**The Question**: Could ToddlerBot be the platform? What would it take to find out?

---

## What's Built

Extracted from the PENNY platform, these systems are production-ready:

### Control Plane (95%)
- **Mission Launcher**: 1-click orchestration pipeline
- **Formation Engine**: Team composition (3v3, 5v5, auto-recommend)
- **Task Splitter**: Multi-robot work decomposition
- **Draft Enforcer**: Ban/pick validation
- **Scheduler Service**: Cron-based match scheduling

### Telemetry & Health (90%)
- **Robot Health Schema**: Battery, temp, pose, faults
- **Snapshot Adapter**: Ingest → SystemSnapshot
- **Session Server**: Real-time websocket broadcast
- **Telemetry DB**: SQLite WAL with cleanup

### Visualization (85%)
- **PeakyPanes**: Multi-surface layout engine
- **Director Bridge**: Policy-driven view switching
- **Mock Publisher**: Demo without hardware

### Education & Certification (90%)
- **Jungle Gym**: Skill tree + curriculum
- **PATINA**: Capability inference from traces
- **Credential Issuer**: Verifiable achievement tokens

### Safety & Validation (80%)
- **Safety Assertions**: Power budget, geofence, thermal limits
- **Validation Rules**: Draft legality, formation constraints

---

## What's Needed

### Hardware Integration (30%)
- ROS2 adapter (ToddlerBot → our schema)
- AprilTag position ingest
- MCU telemetry (ESP32/STM32)
- Sensor fusion (IMU + odometry + AprilTag)

### Broadcast/Streaming (20%)
- Multi-camera capture
- AR overlay pipeline
- Twitch integration

### AR/VR Spectator (40%)
- Mobile AR app (fog of war, overlays)
- VR spectator mode

---

## Game Modes

| Mode | Cost/Robot | Cables? | Arena Cost | Tier |
|------|------------|---------|------------|------|
| **Fighting (Sumo)** | $6k | No | $500 | Tier 1 |
| **Fighting (Aerial)** | $7.5k | Yes | $8k | Tier 2 |
| **FPS (Tactical)** | $6k | No | $10k | Tier 1 |
| **MOBA (5v5)** | $6k | No | $65k | Tier 3 |

See [arenaOS-BOM-BY-GAME.md](../docs/arenaOS-BOM-BY-GAME.md) for full BOMs.

---

## Phase 1: Validation ($12.5k)

**Goal**: Prove robots survive competition

- 2× ToddlerBots ($12k)
- 2m × 2m arena mat ($50)
- Tracking camera + computer ($150)
- AprilTags ($10)
- Misc ($240)

**Deliverable**: 60-second demo video of sumo ring-out match

---

## Technical Docs

- [Game Matrix](../docs/arenaOS-GAME-MATRIX.md) - Full technical implementation across FPS/Fighting/MOBA/RTS
- [BOMs by Game Mode](../docs/arenaOS-BOM-BY-GAME.md) - Component-level breakdowns
- [Built vs Needed](../docs/arenaOS-audit/pitch/BUILT-VS-NEEDED.md) - System readiness scorecard

---

## Repository Structure

```
arenaOS/
├── packages/
│   ├── core/              # Match orchestration, formations
│   ├── telemetry/         # SystemSnapshot, adapters
│   ├── visualization/     # PeakyPanes, Director
│   ├── education/         # Skill trees, credentials
│   └── safety/            # Assertions, validation
├── docs/                  # Technical documentation
├── examples/              # Integration examples
└── landing/               # Marketing site
```

---

## Funding Tiers

| Tier | Funding | Timeline | Output |
|------|---------|----------|--------|
| **0: Validation** | $12.5k | 2-3 months | 2 bots, sumo demo |
| **1: Prototype** | $100k | 6 months | 10 bots, 3 schools |
| **2: Early Stage** | $1M | 12 months | 50 bots, cable rigs |
| **3: Series A** | $5M | 18 months | Regional leagues |

---

## Contact

This is an early-stage research project. For partnership inquiries: [GitHub Issues](https://github.com/sborik/arenaOS/issues)

---

## License

Software: MIT  
Documentation: CC-BY-4.0  
Hardware designs: Defer to ToddlerBot (CC BY-NC-SA)

---

## Acknowledgments

Built on [ToddlerBot](https://toddlerbot.github.io/) by Haochen Shi, Weizhuo Wang, Shuran Song, and C. Karen Liu (Stanford TML/REALab).
