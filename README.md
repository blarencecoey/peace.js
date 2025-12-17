# 🪨 Interactive Zen Garden

An immersive, interactive 3D zen garden experience built with Three.js. Rake sand patterns, place stones, and find moments of calm in this meditative digital space.

[![peace.js](src/assets/peace-js.png)](https://peace-js.vercel.app/)

## Features

- **Interactive Sand Raking**: Click and drag to create beautiful rake patterns with real-time displacement mapping
- **Dynamic Camera**: Subtle parallax effect following mouse movement, zoom with scroll wheel
- **Stone Placement**: Add and arrange stones in the garden (coming soon)
- **Time of Day**: Switch between dawn, day, dusk, and night lighting atmospheres
- **Zen-Inspired UI**: Minimal, non-intrusive interface that reveals on interaction
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Import your repository
4. Vercel will auto-detect Vite settings
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Configuration

The project includes a `vercel.json` with optimized settings:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite
- SPA routing enabled

## Controls

- **Click & Drag**: Rake the sand
- **Mouse Move**: Subtle camera parallax
- **Scroll**: Zoom in/out
- **Settings Menu** (top-left): Change time of day, reset garden
- **Tool Selector** (right): Switch between rake, stone, and hand tools

## Tech Stack

- **Three.js** - 3D graphics
- **TypeScript** - Type safety
- **Vite** - Build tool
- **GSAP** - Smooth animations
- **Custom GLSL Shaders** - Sand displacement effects

## Project Structure

```
src/
├── components/
│   ├── CameraController.ts    # Camera parallax & zoom
│   ├── Environment.ts          # Ground, boundary, moss
│   ├── GardenScene.ts          # Main scene setup
│   ├── InputManager.ts         # Mouse/touch interaction
│   ├── Sand.ts                 # Sand mesh with displacement
│   ├── Stone.ts                # Stone placement system
│   └── UI.ts                   # UI overlay
├── shaders/
│   ├── sand.frag.ts            # Sand fragment shader
│   └── sand.vert.ts            # Sand vertex shader
├── styles/
│   └── index.css               # Global styles
└── main.ts                     # Entry point
```

## Design Philosophy

Built following Japanese aesthetic principles:
- **Ma (間)** - Beauty of negative space
- **Wabi-sabi (侘寂)** - Imperfection and transience
- **Shizen (自然)** - Naturalness without artifice

---

*"In the garden, find stillness. In stillness, find yourself."*
