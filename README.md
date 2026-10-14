# BIOCATALYST 2026 // Deep-Tech & Biotech Hackathon

[![BIOCATALYST 2026](https://biocatalyst.uoi.gr/assets/og-cover.png)](https://biocatalyst.uoi.gr/)

**BIOCATALYST 2026** is the premier deep-tech and biotech event hosted at the **University of Ioannina (UoI)** during **Startup Greece Week 2026** (**Friday, 23 October 2026**). Bridging cutting-edge synthetic biology, bioinformatics, and AI with entrepreneurial commercialization, BIOCATALYST is the sandbox for disruptive ideas.

---

## 🏗️ Project Architecture & Filing System

The repository follows a clean, maintainable, and modern separation of concerns: structured HTML pages, modular CSS styling, external interactive JavaScript, and organized media assets.

```text
biocatalyst/
├── index.html              # Main Landing Page & Event Overview (~970 lines)
├── team.html               # Dedicated Team & Supported By Partners Page (~390 lines)
├── Biocatalyst.html        # Duplicate alias page for legacy bookmarks
├── css/
│   └── style.css           # Brutalist Design System & UI styles (~1,490 lines)
├── js/
│   └── main.js             # Interactive Engine, Canvas Simulations, Audio Synth & Modals (~2,580 lines)
├── assets/
│   └── images/             # Speaker portraits, logos & graphic assets
│       ├── speaker_chantas.png
│       ├── speaker_koskinas.png
│       └── speaker_koutlas.png
└── README.md               # Project documentation
```

---

## 🎨 Design System & Aesthetics

BIOCATALYST uses a **Brutalist / Deep-Tech Cyberpunk** aesthetic featuring bold typography, high-contrast borders, tactile drop shadows, and responsive micro-animations.

### Color Tokens (`:root`)
- **Purple (`--purple`)**: `#5c359d` — Primary brand & deep-tech identity
- **Green (`--green`)**: `#44b549` — Biotech & biohazard accent
- **Pink (`--pink`)**: `#ff6bdf` — Dynamic interactive highlight
- **Yellow (`--yellow`)**: `#ffee55` — High-alert badges & marquee banners
- **Blue (`--blue`)**: `#4da6ff` — Tech & data infrastructure accent
- **Black (`--black`)**: `#111111` — Brutalist borders & structural shadows
- **White (`--white`)**: `#ffffff` — Crisp contrast backgrounds

---

## ⚡ Interactive Features

1. **Dynamic Kirby Krackle & Matrix Rain Canvas (`#bgCanvas`)**
   - Interactive background simulation responding to cursor repulsion physics and mode toggles (Kirby Krackle bubbles vs. Matrix DNA rain).
2. **Audio Drum Machine / Bio-Synth (`audioCtx`)**
   - Web Audio API synthesizer triggered by DNA nucleotide buttons (**A, T, C, G**) producing distinct waveform frequencies (`sawtooth`, `triangle`, `square`, `sine`).
3. **Interactive Ticket Generator & Barcode Puncher**
   - Customizable attendee badge generator with punch-hole animation and live ticket printing.
4. **Interactive Modals & Schedule Sidebars**
   - Dynamic modal overlays for Speakers, Sponsors, and Event Schedule breakdowns (with all 4 program sessions).
5. **PDF Schedule Generator (`jsPDF`)**
   - Built-in brutalist PDF itinerary generator allowing attendees to export the official 4-session event schedule directly from their browser.
6. **CRT Scanline Overlay & Biohazard Mode**
   - Retro CRT monitor visual overlay and biohazard theme switchers with state persistence (`sessionStorage`).

---

## 🚀 Running Locally

No build tools or bundlers are required. You can launch the project directly using any local HTTP server:

```bash
# Using Node.js (serve)
npx serve .

# Or using Python 3 built-in HTTP server
python -m http.server 8000
```

Open `http://localhost:8000` in your web browser to experience the hackathon portal.

---

## 📜 License & Organization

Organized by the **Biocatalyst Organizing Committee — University of Ioannina**  
In collaboration with **Startup Greece Week 2026** & **iGEM Ioannina**