# Zaidan Ibnusabil Iryanto - Portfolio Website

A modern, responsive personal portfolio website built with Vue.js 3 and Vite, showcasing projects, skills, and professional experience.

## 🚀 Features

- **Modern Tech Stack**: Built with Vue.js 3 and Vite for optimal performance
- **Dark Mode**: Full dark/light mode support with system preference detection and localStorage persistence
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **Single Page Application**: Smooth scrolling navigation with Vue Router
- **Project Showcase**: Interactive project cards with GitHub integration
- **Optimized Performance**: Fast load times and smooth animations

## 🛠️ Tech Stack

- **Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **Router**: Vue Router 4
- **Styling**: CSS3 with CSS Variables for theming
- **Icons**: SVG icons

## 📁 Project Structure

```
ibnu-portofolio/
├── public/
│   └── images/           # Project thumbnails and images
├── src/
│   ├── components/       # Reusable Vue components
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   └── ProjectCard.vue
│   ├── composables/      # Vue composables
│   │   └── useDarkMode.js
│   ├── data/            # Data files
│   │   └── portfolio.js
│   ├── router/          # Vue Router configuration
│   │   └── index.js
│   ├── views/           # Page components
│   │   └── Home.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Sections

1. **Hero**: Introduction with call-to-action buttons
2. **About**: Professional summary and education
3. **Skills**: Categorized technical skills
4. **Projects**: Featured project showcase with GitHub links
5. **Experience**: Work experience and achievements timeline
6. **Contact**: Contact information and social links

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ibnusabil43/ibnu-portofolio.git
cd ibnu-portofolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🖼️ Adding Project Images

1. Add your project images to `/public/images/`
2. Use the following naming convention:
   - `project-bantu.jpg`
   - `project-quitzone.jpg`
   - `project-emotion.jpg`
   - `project-face.jpg`
   - `project-anihunt.jpg`
   - `project-keebshub.jpg`
   - `project-rythm.jpg`
   - `placeholder.jpg` (fallback image)

3. Recommended image specifications:
   - Size: 800x600 pixels or 16:9 aspect ratio
   - Format: JPG or PNG
   - Optimized for web

## 🎯 Customization

### Updating Personal Information

Edit `/src/data/portfolio.js` to update:
- Profile information
- Education details
- Skills
- Projects
- Experience
- Achievements

### Theme Colors

Modify CSS variables in `/src/App.vue` to customize the color scheme.

### Dark Mode

The dark mode implementation:
- Automatically detects system preference on first visit
- Persists user choice in localStorage
- Provides toggle button in navbar
- Smooth transitions between modes

## 🔗 Featured Projects

- **bantu.in** - Volunteer and charity platform
- **QuitZone** - Smoking cessation mobile app
- **Bahasa Emotion Classifier** - NLP emotion classification using RoBERTa
- **Real Time Face Recognition** - Computer vision application
- **AniHunt** - Anime discovery and tracking app
- **KeebsHub** - Mechanical keyboard e-commerce platform
- **Rythm** - Music streaming application

## 📱 Social Links

- **GitHub**: [github.com/Ibnusabil43](https://github.com/Ibnusabil43)
- **LinkedIn**: [linkedin.com/in/ibnusabil](https://www.linkedin.com/in/ibnusabil/)
- **Email**: zaidan.ibnusabil@gmail.com

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**Zaidan Ibnusabil Iryanto**
- Software Engineer
- Informatics Graduate from Telkom University
- Bangkit Academy 2024 Graduate

---

Built with ❤️ using Vue.js

