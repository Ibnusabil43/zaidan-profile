<template>
  <nav class="navbar">
    <div class="nav-container">
      <a href="#hero" class="nav-logo">
        <span class="logo-text">ZI</span>
      </a>
      
      <div class="nav-menu" :class="{ active: isMenuOpen }">
        <a href="#about" class="nav-link" @click="closeMenu">About</a>
        <a href="#skills" class="nav-link" @click="closeMenu">Skills</a>
        <a href="#projects" class="nav-link" @click="closeMenu">Projects</a>
        <a href="#experience" class="nav-link" @click="closeMenu">Experience</a>
        <a href="#achievements" class="nav-link" @click="closeMenu">Achievements</a>
        <a href="#contact" class="nav-link" @click="closeMenu">Contact</a>
        
        <button @click="toggleDark" class="theme-toggle" aria-label="Toggle theme">
          <svg v-if="!isDark" class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-else class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
      </div>
      
      <button class="hamburger" :class="{ active: isMenuOpen }" @click="toggleMenu" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useDarkMode } from '../composables/useDarkMode';

const { isDark, toggleDarkMode } = useDarkMode();
const isMenuOpen = ref(false);

const toggleDark = () => {
  toggleDarkMode();
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  transition: all 0.3s ease;
}

.dark .navbar {
  background: rgba(17, 24, 39, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  color: #3b82f6;
  transition: transform 0.3s ease;
}

.nav-logo:hover {
  transform: scale(1.05);
}

.logo-text {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.dark .nav-link {
  color: #d1d5db;
}

.nav-link:hover {
  color: #3b82f6;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.theme-toggle {
  background: none;
  border: none;
  color: #4b5563;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .theme-toggle {
  color: #fbbf24;
}

.theme-toggle:hover {
  background: rgba(59, 130, 246, 0.1);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: #4b5563;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.dark .hamburger span {
  background: #d1d5db;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .nav-container {
    padding: 0.875rem 1rem;
  }

  .hamburger {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    top: 62px;
    left: -100%;
    flex-direction: column;
    background: white;
    width: 100%;
    max-width: 100%;
    padding: 1.5rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transition: left 0.3s ease;
    gap: 0;
    align-items: flex-start;
  }

  .dark .nav-menu {
    background: #111827;
  }

  .nav-menu.active {
    left: 0;
  }

  .nav-link {
    width: 100%;
    padding: 1rem 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .dark .nav-link {
    border-bottom-color: #374151;
  }

  .nav-link:last-of-type {
    border-bottom: none;
  }

  .nav-link::after {
    display: none;
  }

  .theme-toggle {
    width: 100%;
    justify-content: flex-start;
    margin-top: 1rem;
    padding: 1rem 0;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}

@media (max-width: 480px) {
  .nav-logo {
    font-size: 1.25rem;
  }

  .nav-menu {
    top: 58px;
    padding: 1rem;
  }

  .nav-link {
    padding: 0.875rem 0;
    font-size: 0.938rem;
  }
}

</style>
