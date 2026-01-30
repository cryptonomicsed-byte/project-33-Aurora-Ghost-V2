# Aurora + Ghost V2 Hybrid Architecture

**Living Nebula UI (Aurora) + Ghost Automation Backend**

Three systems unified into one:
1. **Aurora** – React 3D UI (nebula visualization, LLM chat, haptics)
2. **Ghost V2** – Automation engine (macros, task queue, scheduling, background jobs)
3. **Aurora Brain** – Spontaneous dreaming, procedural audio, emotion detection

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Aurora UI Layer                             │
│  ┌─────────────────┬──────────────────┬──────────────────────┐  │
│  │   Nebula.tsx    │   Interface.tsx  │    Brain.tsx         │  │
│  │   (3D Visual)   │   (Chat/Config)  │   (LLM + Ghost API)  │  │
│  └─────────────────┴──────────────────┴──────────────────────┘  │
│                                ↓                                  │
│                     HybridAPI Bridge Layer                        │
│                (hybrid-api.ts + ghost-backend.ts)                │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│               Ghost V2 Backend (Shell Automation)                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         automation-engine.sh                             │   │
│  │  ├─ Macro Recording & Playback                          │   │
│  │  ├─ Task Queue Management (priority-based)              │   │
│  │  ├─ Cron Job Scheduling (natural language parsing)      │   │
│  │  └─ Background Job Management (PID tracking)            │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         dev-tools.sh                                    │   │
│  │  ├─ Git (commit, push, pull, branch, merge)             │   │
│  │  ├─ Docker (build, run, start, stop, logs)              │   │
│  │  ├─ Package Management (update, install, search)        │   │
│  │  ├─ Web Servers (Python, Node)                          │   │
│  │  └─ SSH (connect, exec, copy)                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         ecosystem.sh                                    │   │
│  │  ├─ Webhooks (event-based HTTP callbacks)               │   │
│  │  ├─ Extensions (dynamic module loading)                 │   │
│  │  ├─ Profiles (multi-user support)                       │   │
│  │  ├─ Wake Words (custom trigger phrases)                 │   │
│  │  └─ Remote API (networked control)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│           System Resources (Files, Logs, Configs)               │
│  ~/.ghost-config/       - All Ghost configs                     │
│  ~/.ghost-extensions/   - Installed extensions                  │
│  ~/.ghost-profiles/     - User profiles                         │
│  ~/ghost-repos/         - Logs & data                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### User speaks to Aurora Brain
```
User Input → Brain.tsx (LLM inference)
           → Parses NebulaCommand (motion + color + design)
           → Routes to Ghost Backend if automation-related
           → Aurora UI visualizes immediately
           → Ghost backend executes scheduled/queued tasks
           → Events bubble back to Brain → Spontaneous Dreams
```

### Example: "Queue a build task"

```javascript
// 1. User says: "Queue a build task"
User Input
  ↓
// 2. Brain.tsx processes with LaMini
LLM Response: "I queued npm run build as a high priority task."
NebulaCommand: { primary_motion: 'breathe_slow', hue_shift: 'joy_gold' }
  ↓
// 3. Brain detects 'queue' keyword, routes to Ghost
ghostClient.queueTask("npm run build", "high")
  ↓
// 4. Ghost automation-engine.sh adds to task-queue.json
{
  "id": "abc123",
  "task": "npm run build",
  "priority": "high",
  "status": "pending"
}
  ↓
// 5. Brain receives event, triggers spontaneous response
Spontaneous Dream: Dragon (anger) → "I will forge this build..."
Haptic: spontaneous (soft double pulse)
```

---

## Using the Hybrid API

### In Aurora Components

```typescript
import { getHybridAPI } from '$lib/hybrid-api';

const hybrid = getHybridAPI();

// AUTOMATION
await hybrid.automation.queueTask("npm run test", "high");
await hybrid.automation.scheduleJob("every 6 hours", "npm run build");
await hybrid.automation.playMacro("deploy-prod");

// DEV TOOLS
await hybrid.devtools.git.commit("Aurora integration");
await hybrid.devtools.docker.start("postgres");
await hybrid.devtools.pkg.install("ffmpeg");
await hybrid.devtools.server.start("python", 8000, "./dist");

// ECOSYSTEM
await hybrid.ecosystem.extension.install("https://example.com/ext.sh", "my-ext");
await hybrid.ecosystem.profile.create("work");
await hybrid.ecosystem.wakeWord.add("yo nebula");
await hybrid.ecosystem.webhook.register("task.completed", "https://webhook.site/abc");

// EVENTS
hybrid.events.on('automation.taskQueued', (data) => {
  console.log(`Task queued: ${data.task}`);
  triggerHaptic('intake');
});
```

### From Brain.tsx (LLM-driven)

```typescript
// Brain.tsx automatically detects intent and routes
const lastUser = chatHistory[chatHistory.length - 1]?.content || '';

if (/queue|task/.test(lastUser)) {
  await hybrid.automation.queueTask(extractedTask, 'high');
}

if (/schedule|cron/.test(lastUser)) {
  await hybrid.automation.scheduleJob(schedule, command);
}

if (/commit|push/.test(lastUser)) {
  await hybrid.devtools.git.commit(message);
  await hybrid.devtools.git.push();
}

if (/docker|container/.test(lastUser)) {
  await hybrid.devtools.docker.start('my-service');
}
```

---

## Configuration

### Ghost Backend Config (in Brain.tsx)

```typescript
const ghostClientRef = useRef<any>(
  getGhostClient({
    ghostReposPath: `${process.env.HOME}/ghost-repos`,
    macrosFile: `${process.env.HOME}/.ghost-config/macros.json`,
    queueFile: `${process.env.HOME}/.ghost-config/task-queue.json`,
    jobsFile: `${process.env.HOME}/.ghost-config/background-jobs.json`,
    websocketPort: 8765,
  })
);
```

### Macro Definition (Ghost)

```json
{
  "macros": {
    "deploy-prod": {
      "description": "Deploy to production",
      "steps": [
        "git status",
        "npm run build",
        "npm run test",
        "docker build -t prod .",
        "docker push prod"
      ],
      "created": "2025-12-25",
      "runs": 12
    }
  }
}
```

### Task Queue (Ghost)

```json
{
  "queue": [
    {
      "id": "abc123",
      "task": "npm run build",
      "priority": "high",
      "status": "pending"
    }
  ],
  "history": [],
  "max_size": 100
}
```

---

## Event System

### Aurora → Ghost Events

- `automation.taskQueued` – Task added to queue
- `automation.macroPlayed` – Macro started
- `automation.jobScheduled` – Cron job scheduled
- `devtools.gitCommitted` – Git commit completed
- `devtools.dockerStarted` – Container started
- `ecosystem.extensionInstalled` – Extension loaded
- `ecosystem.profileSwitched` – User profile changed

### Ghost → Aurora Events

- `ghost.task.queue` – Task added (triggers haptic + TTS)
- `ghost.macro.play` – Macro running (triggers spontaneous)
- `ghost.job.schedule` – Job scheduled (triggers wonder)
- `ghost.git.commit` – Commit success
- `ghost.docker.start` – Container running
- etc.

---

## Features

### Automation Engine
- **Voice Macros**: Record/playback command sequences via speech
- **Task Queue**: Priority-based execution (high/normal/low)
- **Cron Jobs**: Natural language schedule parsing ("every 6 hours")
- **Background Jobs**: PID tracking, stop/restart capabilities

### Dev Tools
- **Git**: Full workflow (commit, push, pull, branch, merge)
- **Docker**: Build, run, manage containers
- **Package Management**: Update, install, search, list
- **Web Servers**: Python/Node HTTP servers on custom ports
- **SSH**: Remote execution, file transfer

### Ecosystem
- **Webhooks**: Event-triggered HTTP callbacks
- **Extensions**: Dynamic shell module loading
- **Profiles**: Multi-user configuration switching
- **Wake Words**: Custom voice triggers
- **Remote API**: Network-accessible interface

### Aurora Brain Integration
- **Spontaneous Dreaming**: Idle-triggered visualizations based on mood
- **Procedural Audio**: Nature sounds (stream, breeze, fauna) adaptive to motion
- **Haptic Feedback**: Emotion-mapped vibration patterns
- **Command Bridge**: LLM naturally routes to Ghost operations

---

## Startup Flow

```bash
# Terminal 1: Start Ghost backend services
source ~/ghost-modules-dev/automation-engine.sh
source ~/ghost-modules-dev/dev-tools.sh
source ~/ghost-modules-dev/ecosystem.sh
ghost-daemon start

# Terminal 2: Start Aurora frontend
cd ~/aurora
npm install
npm run dev

# Open browser to localhost:1111
# Aurora auto-connects to Ghost backend
```

---

## File Structure

```
aurora/
├── src/
│   ├── components/
│   │   ├── Nebula.tsx          (3D visualization)
│   │   ├── Interface.tsx        (Chat UI + settings)
│   │   └── Brain.tsx            (LLM + Ghost integration)
│   ├── lib/
│   │   ├── ghost-backend.ts     (Ghost API client)
│   │   ├── hybrid-api.ts        (Unified interface)
│   │   └── geometryEngine.ts    (Particle systems)
│   ├── shaders/
│   │   ├── nebula.vert          (GLSL vertex)
│   │   └── nebula.frag          (GLSL fragment)
│   ├── types.ts                 (TypeScript interfaces)
│   └── App.tsx                  (Main component)
├── package.json
├── vite.config.ts
├── tsconfig.json
└── HYBRID_ARCHITECTURE.md       (This file)

ghost-modules-dev/
├── automation-engine.sh         (Macros, queue, scheduling)
├── dev-tools.sh                 (Git, Docker, packages)
├── ecosystem.sh                 (Webhooks, extensions)
├── lib/
│   ├── config-store.sh
│   ├── event-bus.sh
│   └── intent-router.sh
└── ...
```

---

## Troubleshooting

### Ghost Backend Not Connecting
```bash
# Check if Ghost daemon is running
ps aux | grep ghost-daemon

# Check logs
tail -f ~/ghost-repos/automation-engine.log

# Try manual connection test
npm run dev  # Aurora will show warnings if unavailable
```

### Task Queue Not Executing
```bash
# Verify task-queue.json exists
cat ~/.ghost-config/task-queue.json

# Manually execute queue
source ~/ghost-modules-dev/automation-engine.sh
queue_execute
```

### Macro Playback Failing
```bash
# List recorded macros
source ~/ghost-modules-dev/automation-engine.sh
list_macros

# Test macro directly
macro_play my-macro-name
```

### Audio Issues (Nature Sounds)
```typescript
// Check if TTS is enabled in Interface settings
// Restart audio context:
// 1. Disable "Enable Voice" toggle
// 2. Re-enable "Enable Voice" toggle
// 3. Natural sounds should resume
```

---

## Development

### Running Aurora in Dev Mode
```bash
cd aurora
npm run dev  # http://localhost:1111
```

### Building for Production
```bash
npm run build       # dist/
npm run preview     # Test production build locally
```

### Testing Ghost Integration
```typescript
// In Brain.tsx
useEffect(() => {
  const test = async () => {
    const hybrid = getHybridAPI();
    
    // Test automation
    const taskId = await hybrid.automation.queueTask("echo 'test'");
    console.log("Task queued:", taskId);
    
    // Test dev tools
    await hybrid.devtools.git.status();
    
    // Test ecosystem
    await hybrid.ecosystem.profile.list();
  };
  test();
}, []);
```

---

## Roadmap

- [ ] WebSocket real-time Ghost events in Aurora
- [ ] Visual task queue monitor in Interface
- [ ] Macro recording UI (voice + visual)
- [ ] Git history visualization
- [ ] Container status dashboard
- [ ] Extension marketplace UI
- [ ] Profile switcher UI
- [ ] Webhook event replay
- [ ] Advanced scheduling UI (calendar)
- [ ] Speech-to-intent NLP refinement

---

## Credits

- **Aurora**: Living Nebula 3D UI + LLM Brain
- **Ghost V2**: Automation framework (macros, queue, jobs)
- **Hybrid Bridge**: Real-time event system connecting both

**Status**: ✅ Fully integrated and operational
