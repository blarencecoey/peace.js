# 🪨 Interactive Zen Garden — Technical Specification

## Project Overview

Build an immersive, interactive 3D zen garden experience using Three.js. The garden serves as a meditative digital space where users can rake sand patterns, place stones, and find moments of calm. The aesthetic is minimal, refined, and deeply tactile — inspired by traditional Japanese karesansui (枯山水) dry landscape gardens.

---

## Core Philosophy

The experience should embody:
- **Ma (間)** — The beauty of negative space and emptiness
- **Wabi-sabi (侘寂)** — Imperfection and transience as aesthetic values
- **Shizen (自然)** — Naturalness without forced artifice

Every interaction should feel intentional. No UI clutter. No gamification. Just presence.

---

## Visual Design Language

### Color Palette

```
Background/Sky:     #F5F2EB (warm off-white, like aged paper)
Sand Base:          #E8E0D0 (pale warm sand)
Sand Shadows:       #D4C9B8 (groove shadows)
Sand Highlights:    #F9F6F0 (rake peaks)
Stone Dark:         #4A4A48 (wet basalt)
Stone Mid:          #6B6B68 (dry granite)
Stone Light:        #8A8A86 (weathered stone)
Moss:               #5C6B54 (muted sage green)
Wood/Bamboo:        #A68B6A (natural timber)
Water (if used):    #7A9A9C (still pond, muted teal)
Accent:             #C4A882 (golden hour warmth)
```

### Lighting

- **Primary:** Soft directional light simulating late afternoon sun (warm, ~3500K)
- **Secondary:** Subtle ambient light to fill shadows without flattening depth
- **No harsh shadows** — use soft shadow maps with large radius blur
- Consider subtle god rays or atmospheric haze for depth
- Time-of-day option: dawn (cool pink), noon (neutral), dusk (golden), night (moonlit blue)

### Materials & Textures

**Sand:**
- Displacement mapping for rake grooves (real-time dynamic)
- Subtle normal map for fine grain texture
- Soft specular for that "freshly raked" shimmer
- Consider subsurface scattering approximation for realism

**Stones:**
- PBR materials with roughness variation (0.6-0.9)
- Subtle ambient occlusion in crevices
- Slight wetness variation (darker base where touching sand)
- Each stone should feel unique — procedural variation

**Moss:**
- Soft, fuzzy appearance using noise-based displacement
- No hard edges — organic, creeping forms
- Subtle color variation (lighter tips, darker base)

**Wood Elements:**
- Visible grain through normal mapping
- Weathered, not polished — matte finish
- Subtle wear patterns at edges

---

## Scene Composition

### Garden Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│    ┌─────┐                                          │
│    │Bamboo│        ○ Stone           🌿 Moss        │
│    │Fence │         Cluster                         │
│    └─────┘              ○                           │
│                    ○                                │
│                                                     │
│         ════════════════════                        │
│              Sand Area                              │
│          (interactive raking)                       │
│                                     ┌────┐          │
│                                     │Stone│         │
│              ○                      │Lantern        │
│         Single                      └────┘          │
│         Feature                                     │
│         Stone                                       │
│                                                     │
│    ═══════════════════════════════════════          │
│                                                     │
│                        🌿                           │
│              Wooden Viewing Platform                │
│                   (camera anchor)                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Required Elements

1. **Sand Bed** — Main interactive area, rectangular with natural edges
2. **Stone Groupings** — 3-5-7 arrangement (odd numbers, asymmetric)
3. **Boundary** — Subtle wooden frame or natural stone border
4. **Moss Patches** — Organic clusters near stones and edges
5. **Background Elements:**
   - Bamboo fence or hedge (implied depth, not detailed)
   - Distant trees as silhouettes (atmospheric perspective)
   - Optional: stone lantern, water basin, wooden rake

---

## Interactive Features

### 1. Sand Raking (Primary Interaction)

**Mechanics:**
- Click/touch and drag to create rake grooves in real-time
- Rake follows cursor with physics-based momentum
- Grooves persist until reset
- Multiple rake patterns available:
  - **Single line** (default)
  - **Parallel lines** (3-5 tines)
  - **Curved/circular** (concentric around stones)

**Technical Implementation:**
```javascript
// Approach: Dynamic displacement map on sand plane
// - Render rake strokes to an offscreen canvas/texture
// - Use as displacement map on sand geometry
// - Smooth falloff at stroke edges
// - Accumulative (strokes layer)

// Raycasting for interaction:
// - Cast ray from camera through mouse position
// - Intersect with sand plane
// - Draw stroke at UV coordinates
// - Update displacement texture each frame (or on change)
```

**Feel:**
- Slight resistance at start of stroke
- Smooth glide once moving
- Subtle haptic feedback concept (visual "settling" of sand)
- Grooves should have realistic depth falloff

### 2. Stone Placement (Secondary Interaction)

**Mechanics:**
- Select from 3-5 stone types (varying shapes/sizes)
- Click to place, drag to reposition
- Stones automatically "settle" into sand (slight sink + shadow)
- Sand automatically flows around placed stones (displacement update)
- Remove stones by dragging to edge or double-tap

**Constraints:**
- Maximum 7-9 stones to maintain aesthetic
- Stones cannot overlap
- Subtle snap-to-grid option (toggleable) for intentional placement

### 3. Camera Controls

**Default Behavior:**
- Fixed elevated perspective (like sitting on viewing platform)
- Subtle parallax on mouse move (2-3° rotation max)
- Smooth easing on all camera movements

**Optional Controls:**
- Scroll to zoom (constrained range)
- Two-finger rotate on mobile
- Preset viewpoints (top-down, corner, close-up)

### 4. Ambient Interactions

- **Wind:** Occasional subtle ripple across sand surface
- **Particles:** Sparse floating dust motes in light beams
- **Sound Response:** If audio enabled, rake sounds, ambient nature

---

## Audio Design (Optional but Recommended)

### Soundscape

- **Ambient Base:** Soft wind, distant birds, rustling leaves
- **Interactive:**
  - Rake dragging through sand (granular, satisfying)
  - Stone placement (soft thud, sand displacement)
  - UI interactions (subtle wooden clicks)
- **Volume:** Subtle, never intrusive — easily muted

### Implementation Notes

- Use Howler.js or Tone.js for audio management
- Spatial audio not necessary (overhead perspective)
- Crossfade ambient loops seamlessly
- Rake sound should follow stroke velocity

---

## User Interface

### Philosophy: Invisible Until Needed

No persistent UI elements. The garden IS the interface.

### Hidden Controls (Reveal on Hover/Tap Edge)

```
┌────────────────────────────────────────────┐
│                                            │
│  ☰ (top-left, on hover)                    │
│     └─ Settings flyout                     │
│         • Sound on/off                     │
│         • Time of day                      │
│         • Reset garden                     │
│         • Save/Load pattern                │
│                                            │
│                              Tools ─┐      │
│                              (right edge)  │
│                                  ├─ Rake   │
│                                  ├─ Stone  │
│                                  └─ Hand   │
│                                            │
│                                            │
│                   ◯ (bottom center)        │
│               Breath guide                 │
│          (optional, tap to toggle)         │
│                                            │
└────────────────────────────────────────────┘
```

### Tool Selection

- Small circular icons, semi-transparent
- Active tool has subtle glow
- Tooltip on hover (desktop only)

### Breath Guide (Optional Feature)

- Subtle pulsing circle overlay
- Expands on inhale (4s), contracts on exhale (4s)
- Helps users find meditative rhythm
- Completely optional, hidden by default

---

## Technical Architecture

### Stack

```
Three.js          — Core 3D rendering
GSAP              — Smooth animations and transitions
Howler.js         — Audio (if implemented)
lil-gui           — Dev controls (remove in production)
```

### Performance Targets

- **60fps** on modern desktop browsers
- **30fps minimum** on mid-range mobile (2020+)
- **Initial load:** < 3 seconds on 4G
- **Total bundle:** < 2MB (excluding audio)

### Scene Graph Structure

```
Scene
├── Lights
│   ├── DirectionalLight (sun)
│   ├── AmbientLight (fill)
│   └── HemisphereLight (sky/ground)
├── Environment
│   ├── SkyDome / Background
│   ├── GroundPlane (beneath sand)
│   └── BoundaryGroup
│       ├── WoodFrame
│       └── BorderStones
├── Garden
│   ├── SandMesh (with dynamic displacement)
│   ├── StoneGroup
│   │   ├── Stone_1...n
│   │   └── StoneShadows
│   └── MossGroup
│       └── MossPatch_1...n
├── Decorations
│   ├── Lantern
│   ├── WaterBasin
│   └── BambooFence
├── Particles
│   └── DustMotes
└── Camera
    └── PerspectiveCamera (controlled)
```

### Key Technical Challenges

**1. Dynamic Sand Displacement**

```javascript
// Solution: DataTexture updated in real-time
// 
// - Create high-res DataTexture (2048x2048 for quality)
// - On rake interaction, draw to texture using canvas API or direct pixel manipulation
// - Apply as displacementMap to sand PlaneGeometry
// - Use custom shader for:
//   - Displacement (grooves)
//   - Normal calculation (lighting on grooves)
//   - Color variation (darker in grooves)

const sandMaterial = new THREE.ShaderMaterial({
  uniforms: {
    displacementMap: { value: displacementTexture },
    sandColor: { value: new THREE.Color('#E8E0D0') },
    grooveColor: { value: new THREE.Color('#D4C9B8') },
    displacementScale: { value: 0.15 },
    // ... lighting uniforms
  },
  vertexShader: sandVertexShader,
  fragmentShader: sandFragmentShader,
});
```

**2. Performant Stroke Rendering**

```javascript
// Use offscreen canvas for stroke accumulation
// Only update Three.js texture when strokes change
// Implement stroke smoothing (Catmull-Rom or similar)
// 
// Stroke data structure:
// {
//   points: [{x, y, pressure, timestamp}, ...],
//   width: number,
//   type: 'single' | 'parallel' | 'circular'
// }
```

**3. Stone-Sand Interaction**

```javascript
// When stone placed/moved:
// 1. Calculate stone footprint on displacement texture
// 2. Create circular "depression" around stone
// 3. Add concentric ripple pattern (traditional style)
// 4. Blend smoothly with existing rake patterns
```

---

## Asset Requirements

### 3D Models

| Asset | Polygon Budget | Notes |
|-------|---------------|-------|
| Stone Type A (large, angular) | 500-800 | Low-poly with normal map detail |
| Stone Type B (medium, rounded) | 400-600 | |
| Stone Type C (small, flat) | 200-400 | |
| Stone Lantern | 800-1200 | Optional decoration |
| Water Basin | 400-600 | Optional |
| Rake (for UI/cursor) | 200-300 | Simple geometry |

### Textures

| Texture | Resolution | Type |
|---------|------------|------|
| Sand normal | 1024x1024 | Normal map (fine grain) |
| Stone diffuse (atlas) | 2048x2048 | Color + roughness packed |
| Stone normal (atlas) | 2048x2048 | Surface detail |
| Moss color | 512x512 | With alpha for edges |
| Wood grain | 512x512 | Normal + roughness |
| Environment map | 256x256 | Soft HDRI for reflections |

### Audio (If Used)

| Sound | Duration | Format |
|-------|----------|--------|
| Ambient loop | 60-90s | MP3, 128kbps |
| Rake drag | 3-5s | MP3, loopable |
| Stone place | 0.5s | MP3 |
| UI click | 0.1s | MP3 |

---

## Responsive Behavior

### Desktop (1200px+)

- Full garden view with generous margins
- Mouse-based interactions
- Hover states on interactive elements
- Keyboard shortcuts (R = rake, S = stone, Esc = deselect)

### Tablet (768px - 1199px)

- Slightly zoomed view
- Touch interactions with gesture support
- Tools always visible (no hover reveal)

### Mobile (< 768px)

- Portrait: Top-down view, vertically scrollable garden
- Landscape: Side view similar to desktop
- Simplified particle effects for performance
- Larger touch targets
- Bottom sheet for tool selection

---

## Animation Guidelines

### Easing

Use natural, organic easing for all animations:

```javascript
// GSAP easing recommendations
const EASE = {
  default: 'power2.out',
  enter: 'power3.out',
  exit: 'power2.in',
  bounce: 'elastic.out(1, 0.5)',
  smooth: 'sine.inOut',
};
```

### Timing

| Action | Duration | Notes |
|--------|----------|-------|
| Camera transition | 800-1200ms | Between viewpoints |
| Stone settle | 400-600ms | With slight bounce |
| Tool selection | 200ms | Quick, responsive |
| Sand groove | Real-time | Follows input |
| Ripple effect | 2000ms | Slow, meditative |
| UI reveal | 300ms | Fade + slide |

### Micro-interactions

- Stone hover: Subtle lift (2-3px) + soft shadow expansion
- Rake cursor: Shows groove preview at 20% opacity
- Breath guide: Smooth sinusoidal scaling
- Sand settling: Particles drift down after rake

---

## State Management

### Garden State Object

```typescript
interface GardenState {
  // Sand state
  sand: {
    displacementData: Uint8Array; // Raw texture data
    lastModified: number;
  };
  
  // Placed elements
  stones: Array<{
    id: string;
    type: 'A' | 'B' | 'C';
    position: { x: number; z: number };
    rotation: number;
    scale: number;
  }>;
  
  // User preferences
  settings: {
    soundEnabled: boolean;
    timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
    showBreathGuide: boolean;
  };
  
  // Tool state
  activeTool: 'rake' | 'stone' | 'hand' | null;
  selectedRakeType: 'single' | 'parallel' | 'circular';
}
```

### Persistence (Optional)

- Save garden state to localStorage
- Export/import as JSON
- Share via URL parameters (compressed state)

---

## Accessibility Considerations

- **Keyboard navigation:** Full functionality without mouse
- **Reduced motion:** Option to disable particles and animations
- **High contrast mode:** Ensure sufficient contrast in all themes
- **Screen reader:** Provide alt descriptions for garden state
- **Focus indicators:** Clear, visible focus states on controls

---

## Performance Optimizations

1. **Instanced rendering** for moss patches
2. **LOD (Level of Detail)** for stones at distance
3. **Frustum culling** for off-screen elements
4. **Texture atlasing** to reduce draw calls
5. **RequestAnimationFrame throttling** when tab inactive
6. **Progressive loading:** Show sand first, load details async
7. **GPU picking** for raycasting (faster than CPU)

---

## Development Phases

### Phase 1: Foundation (Core Experience)
- [ ] Basic scene setup with lighting
- [ ] Sand plane with static displacement
- [ ] Camera controls
- [ ] Basic rake interaction (single line)

### Phase 2: Interactivity
- [ ] Full rake system with multiple patterns
- [ ] Stone placement and manipulation
- [ ] Stone-sand interaction
- [ ] Tool selection UI

### Phase 3: Polish
- [ ] All visual materials finalized
- [ ] Animations and micro-interactions
- [ ] Audio implementation
- [ ] Time-of-day variations

### Phase 4: Optimization & Launch
- [ ] Performance optimization pass
- [ ] Mobile responsiveness
- [ ] Accessibility audit
- [ ] State persistence
- [ ] Final QA

---

## Reference & Inspiration

### Traditional Gardens
- Ryōan-ji Temple, Kyoto
- Daisen-in, Daitoku-ji
- Portland Japanese Garden

### Digital References
- Stardew Valley (peaceful interaction design)
- Monument Valley (clean aesthetic)
- Journey (emotional minimalism)
- Pause (iOS meditation app)

### Technical References
- Three.js Journey (Bruno Simon) — Displacement techniques
- Codrops WebGL demos — Interaction patterns
- Shadertoy — Sand/granular material shaders

---

## Deliverables Checklist

- [ ] Three.js scene with complete garden environment
- [ ] Interactive sand raking system
- [ ] Stone placement functionality  
- [ ] Responsive UI overlay
- [ ] Audio integration (optional)
- [ ] Mobile-optimized version
- [ ] Documentation for future maintenance
- [ ] Performance benchmarks met

---

*"In the garden, find stillness. In stillness, find yourself."*
