# Video Highlight Tool

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Dockerized](https://img.shields.io/badge/Docker-ready-blue)

A modern, performant web tool for creating and previewing video highlights with transcript-based editing. Built with React, TypeScript, Zustand, Tailwind CSS, and Vite. Supports internationalization (i18n) and is production-ready with Docker and Nginx.

---

## ⚡ Quick Start

```sh
make build-dev
make run-dev-hot
# or for production
make build-prod
make run-prod
```

---

## 📚 Table of Contents
- [Project Overview & Solution Design](#-project-overview--solution-design)
- [Docker Usage (Development & Production)](#-docker-usage-development--production)
- [Makefile Shortcuts for Docker](#-makefile-shortcuts-for-docker)
- [Local Development Setup (without Docker)](#-local-development-setup-without-docker)
- [Internationalization (i18n)](#-internationalization-i18n)
- [Technologies Used](#-technologies-used)
- [Technical Choices & Rationale](#-technical-choices--rationale)
- [Mocked API Format & Schema](#-mocked-api-format--schema)
- [Folder Structure](#-folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Project Overview & Solution Design

**Video Highlight Tool** enables users to upload a video, view and edit its transcript, select highlight segments, and preview the result with a synchronized video player and timeline. The UI is split into an editing area (transcript, selection, navigation) and a preview area (video, overlay, timeline). State is managed with Zustand for performance and scalability. Internationalization is provided via `react-i18next` with YAML translation files.

### **Key Features**
- **Video Upload**: Upload a video and receive a mock transcript via API.
- **Transcript Editing**: Select/unselect sentences, see section titles, timestamps, and suggested highlights. Click timestamps to seek video.
- **Preview Area**: Video player with overlay, timeline bar showing highlights and playhead.
- **Highlight Playback**: Play only selected highlights, skipping unselected parts.
- **Synchronization**: Clicking timestamps or timeline seeks video; selection updates preview; playback highlights and auto-scrolls transcript.
- **Responsive Design**: Mobile and desktop layouts, accessible file upload, and keyboard shortcuts.
- **Internationalization**: English and Traditional Chinese supported, with YAML-based translations.

### **Solution & Design**
- **State Management**: Zustand store with selectors for granular subscriptions, minimizing re-renders.
- **Transcript Model**: Sections and sentences, each with timestamps and highlight flags.
- **Custom Hooks**: `useVideoHighlights` for highlight logic, playback, and scrubbing.
- **Performance**: Memoized components, debounced auto-scroll, and efficient state updates.
- **Production-Ready**: Dockerfile for multi-stage build, Nginx for static serving and SPA routing.

---

## 🐳 Docker Usage (Development & Production)

This project supports both **development** and **production** Docker workflows. Use the appropriate Dockerfile for your needs:

| Use Case      | Dockerfile         | Build Command                                              | Run Command                                               | Exposed Port |
|-------------- |-------------------|------------------------------------------------------------|-----------------------------------------------------------|--------------|
| Development   | Dockerfile.dev     | `docker build -f Dockerfile.dev -t video-highlight-tool-dev .` | `docker run -p 5173:5173 video-highlight-tool-dev`         | 5173         |
| Production    | Dockerfile         | `docker build -t video-highlight-tool .`                        | `docker run -p 8080:80 video-highlight-tool`               | 80 (mapped to 8080) |

### **Development with Docker (`Dockerfile.dev`)**

1. **Build the development image:**
   ```sh
   docker build -f Dockerfile.dev -t video-highlight-tool-dev .
   ```

2. **Run the development container:**
   ```sh
   docker run -p 5173:5173 video-highlight-tool-dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).

3. **(Optional) Enable hot reloading with local files:**
   Mount your code as a volume so changes on your host are reflected in the container:
   ```sh
   docker run -p 5173:5173 -v $(PWD):/app -v /app/node_modules video-highlight-tool-dev
   ```

### **Production Build & Docker Usage (`Dockerfile`)**

1. **Build the Docker image:**
   ```sh
   docker build -t video-highlight-tool .
   ```

2. **Run the container:**
   ```sh
   docker run -p 8080:80 video-highlight-tool
   ```
   The app will be available at [http://localhost:8080](http://localhost:8080).

- The Dockerfile uses a multi-stage build (Node for build, Nginx for serving static files).
- The included `nginx.conf` ensures correct SPA routing (all routes serve `index.html`).

---

## 🛠️ Makefile Shortcuts for Docker

You can use the provided `Makefile` to simplify Docker workflows:

| Make Target      | Description                                 |
|------------------|---------------------------------------------|
| `make build-dev` | Build the development Docker image          |
| `make run-dev`   | Run the dev container (port 5173)           |
| `make run-dev-hot` | Run dev container with hot reload (mounts source) |
| `make build-prod`| Build the production Docker image           |
| `make run-prod`  | Run the production container (port 8080)    |
| `make clean`     | Remove all containers and dev/prod images   |

**Example:**
```sh
make build-dev
make run-dev-hot
```

---

## 🛠️ Local Development Setup (without Docker)

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd video-highlight-tool
   ```

2. **Install dependencies (using pnpm):**
   ```sh
   pnpm install
   ```

3. **Start the development server:**
   ```sh
   pnpm dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

4. **Lint the code:**
   ```sh
   pnpm lint
   ```

---

## 🌐 Internationalization (i18n)
- Uses `react-i18next` with YAML translation files in `src/i18n/locales/`.
- English (`en.yml`) and Traditional Chinese (`zh-TW.yml`) are supported.
- Add new languages by creating a new YAML file and updating the i18n config.

---

## 🏗️ Technologies Used
- **React 19** + **TypeScript**
- **Vite** (dev/build tool)
- **Zustand** (state management)
- **Tailwind CSS** (styling)
- **react-i18next** (i18n)
- **js-yaml** (YAML translation parsing)
- **Nginx** (static file serving in production)
- **Docker** (containerization)

---

## 💡 Technical Choices & Rationale

| Aspect            | Choice                                 | Rationale                                                                |
|-------------------|----------------------------------------|--------------------------------------------------------------------------|
| Frontend Framework| React + Vite + TypeScript              | Fast development, type safety, modern tooling, and great ecosystem       |
| UI                | Tailwind CSS                           | Utility-first, rapid RWD, easy to maintain and customize                 |
| State Management  | useState/useRef/useEffect + Zustand    | Simple local state, scalable global state, minimal re-renders            |
| Mock API          | JSON file + Axios                      | Easy to mock, simulates real API, async/await support                    |
| Video/Sync        | `<video>` + ref + `timeupdate` event   | Native browser support, precise control, performant                      |
| Transcript Overlay| DOM overlay, position calculation      | Flexible, supports animation and responsive design                       |
| Docker            | Dockerfile for frontend                | Consistent builds, easy deployment, works in any environment             |

---

## 📄 Mocked API Format & Schema

The app uses a mocked API (local JSON file) to simulate transcript data returned from a backend. The schema is as follows:

### **Transcript Data Schema**
```json
{
  "sections": [
    {
      "title": "Section Title",
      "sentences": [
        {
          "id": "unique-sentence-id",
          "text": "Sentence text here.",
          "startTime": 0.0,
          "endTime": 3.5,
          "isSuggestedHighlight": true
        }
        // ... more sentences
      ]
    }
    // ... more sections
  ]
}
```

- **sections**: Array of transcript sections (e.g., chapters or topics)
  - **title**: Section title (string)
  - **sentences**: Array of sentences in the section
    - **id**: Unique identifier for the sentence (string)
    - **text**: The transcript text for the sentence (string)
    - **startTime**: Start time in seconds (number)
    - **endTime**: End time in seconds (number)
    - **isSuggestedHighlight**: Whether this sentence is a suggested highlight (boolean)

The mock API is loaded asynchronously using Axios, and the app expects this structure for all transcript data.

---

## 📁 Folder Structure
```
video-highlight-tool/
├── src/
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks
│   ├── i18n/               # i18n config and locales
│   ├── models/             # TypeScript types/models
│   ├── services/           # API and service logic
│   ├── store/              # Zustand store
│   └── ...
├── public/                 # Static assets
├── Dockerfile              # Production Dockerfile
├── Dockerfile.dev          # Development Dockerfile
├── nginx.conf              # Nginx config for SPA routing
├── package.json            # Project metadata and scripts
├── pnpm-lock.yaml          # pnpm lockfile
└── README.md               # This file
```

---

## 📄 License
MIT

