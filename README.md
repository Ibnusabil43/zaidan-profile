# Zaidan Ibnusabil Iryanto — Portfolio

A modern, monochrome, minimalist personal portfolio built with **React 18**, **Vite**, and **Tailwind CSS v4** — showcasing projects, skills, and professional experience.

## ✦ Design

Editorial monochrome aesthetic: a single grayscale ramp (no accent color), large display typography (Space Grotesk), hairline grids, generous whitespace, and tasteful scroll-reveal motion. Numbered sections, an inverting hover system, and a fine film-grain overlay give it a crafted, non-generic feel.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animation**: Framer Motion
- **Fonts**: Space Grotesk (display), Inter (body), JetBrains Mono (labels)

## ✦ Features

- **Dark / Light mode** — system-preference detection + `localStorage` persistence
- **Fully responsive** — mobile-first, works across all viewports
- **Single-page scroll navigation** with smooth anchored sections
- **Accordion experience timeline** and interactive project cards with GitHub links
- **Reduced-motion aware** animations and marquee

## 🎨 Sections

1. **Hero** — introduction with call-to-action
2. **About** — summary, portrait, stats, and education
3. **Skills** — marquee + categorized technical skills
4. **Experience** — expandable role timeline
5. **Projects** — featured work with GitHub links
6. **Achievements** — honors and recognition
7. **Contact** — email and social links

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Install & run

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## 📁 Structure

```
src/
├── components/
│   ├── sections/   # Hero, About, Skills, Experience, Projects, Achievements, Contact
│   ├── ui/         # Reveal, SectionHeader, ProjectCard, FillerCell
│   ├── Navbar.jsx
│   └── Footer.jsx
├── data/portfolio.js   # all content (profile, skills, projects, experience, ...)
├── hooks/useTheme.js   # dark/light theme state
├── App.jsx
├── main.jsx
└── index.css           # Tailwind v4 theme + design tokens
```

All content lives in [`src/data/portfolio.js`](src/data/portfolio.js) — edit there to update the site.
