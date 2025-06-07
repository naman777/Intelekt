# 🧠 Intelekt

A full-stack, real-time **Live Coding Interview Platform** built for modern technical assessments. Intelekt combines video calling, collaborative code editing, live screen monitoring, and gaze-based anti-cheating AI to ensure fair, insightful, and scalable interviews.

---

## 🚀 Features

- 🎥 **Real-time video/audio** via mediasoup SFU
- 🧑‍💻 **Collaborative coding editor** using Monaco + Yjs
- 🔍 **Live screen and gaze monitoring** for candidate behavior tracking
- ⚠️ **AI-powered anti-cheating detection**
- 🧪 **Isolated code execution** via Docker sandbox
- 🌐 **Multi-participant interviews** with role-based views
- 📊 **Live analytics dashboard** for interviewers
- 🧱 Scalable **Turborepo monorepo** architecture

---

## 🏗️ Monorepo Structure

```bash
intelekt/
├── apps/
│   ├── frontend/            # Next.js app with Monaco + Yjs
│   ├── signaling-server/    # TypeScript WebRTC signaling server (mediasoup)
│   ├── code-runner/         # Docker-based code executor (TypeScript)
│   ├── monitor-service/     # Python ML microservice for gaze detection
│   └── api-server/          # TypeScript API server (NestJS/Fastify)
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── types/               # Shared TypeScript types/interfaces
│   ├── utils/               # Reusable helpers, logger, config
├── infra/                   # Docker, K8s manifests, deployment config
├── .github/                 # GitHub Actions workflows
├── turbo.json               # Turborepo pipeline config
└── README.md
```

---

## ⚙️ Tech Stack

| Layer              | Technologies                                  |
| ------------------ | --------------------------------------------- |
| **Frontend**       | Next.js, TypeScript, TailwindCSS, Monaco, Yjs |
| **Signaling**      | Node.js, TypeScript, mediasoup, WebSockets    |
| **Code Execution** | Docker, Node.js, Dockerode                    |
| **AI/ML**          | Python, OpenCV, MediaPipe, FastAPI            |
| **Backend API**    | NestJS or Fastify (TypeScript)                |
| **Messaging**      | Redis / Kafka for real-time coordination      |
| **Infra**          | Docker, Kubernetes, GitHub Actions            |

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/intelekt.git
cd intelekt
pnpm install
```

### 2. Development

Start all apps:

```bash
pnpm dev
```

Or run individual apps:

```bash
pnpm dev --filter frontend
pnpm dev --filter signaling-server
pnpm dev --filter code-runner
pnpm dev --filter api-server
```

### 3. Environment Variables

Each app has its own `.env.example`. Copy and configure:

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

Repeat for other apps.

---

## 🧪 Code Runner

* Accepts code snippets via API
* Spawns secure Docker containers per language
* Supports: JavaScript, Python, C++
* Returns stdout, stderr, and execution time

---

## 👁️‍🗨️ Monitor Service

* Tracks face position, gaze direction, and head orientation
* Analyzes video frames using OpenCV + MediaPipe
* Sends real-time cheating alerts to interviewer dashboard

---

## 📦 Shared Packages

* `types`: Shared TypeScript types (`User`, `Room`, `Session`)
* `ui`: Button, layout, editor wrapper components
* `utils`: Common utility functions and config

---

## 🧱 Turborepo

Turbo powers the monorepo with blazing-fast builds and dev workflows:

```json
{
  "pipeline": {
    "dev": {
      "dependsOn": ["^dev"],
      "outputs": []
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    }
  }
}
```

---

## 📦 Deployment

* Docker Compose (for local dev)
* Kubernetes manifests (for scalable deployments)
* GitHub Actions CI/CD (auto-build + deploy)

Coming soon in `infra/`

---

## 💡 Naming

> **Intelekt**: A fusion of “intellect” and “tech,” representing smart, secure, and insightful interviews.

---

## 👥 Contributors

* **Your Name** – System Architect, Fullstack Developer, AI Integrator

---

## 📄 License

MIT License. Free to use, improve, and contribute.

---

## 🌐 Future Plans

* Built-in calendar and interview scheduling
* Chatbot-based candidate onboarding
* ML-based scoring & candidate ranking
* Interview playback + annotation

---

## 🧩 Related Technologies

* Mediasoup
* Monaco Editor + Yjs
* Docker + Dockerode
* OpenCV + MediaPipe
* FastAPI / NestJS
* Redis / Kafka
* Turborepo

---

Feel free to contribute, fork, and build on top of **Intelekt**. Let's redefine the way coding interviews are done.