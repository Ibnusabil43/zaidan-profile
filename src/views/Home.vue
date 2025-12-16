<template>
  <div class="home">
    <Navbar />
    
    <!-- Hero Section -->
    <section id="hero" class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Hi, I'm <span class="gradient-text">{{ profile.name }}</span>
            </h1>
            <p class="hero-description">{{ profile.summary }}</p>
            
            <div class="hero-buttons">
              <a href="#projects" class="btn btn-primary">
                View Projects
              </a>
              <a :href="profile.github" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a :href="profile.linkedin" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
          
          <div class="hero-image">
            <img src="/images/pasfoto.jpg" alt="Profile Photo" class="profile-photo" />
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section">
      <div class="container">
        <h2 class="section-title">About Me</h2>
        <div class="about-content">
          <p class="about-text">{{ profile.summary }}</p>
          
          <div class="education-card">
            <h3 class="card-title">Education</h3>
            <div v-for="edu in education" :key="edu.institution" class="education-item">
              <h4 class="edu-degree">{{ edu.degree }}</h4>
              <p class="edu-institution">{{ edu.institution }}</p>
              <p class="edu-details">{{ edu.period }}</p>
              <p class="edu-gpa">GPA: {{ edu.gpa }}</p>
              <ul class="edu-achievements">
                <li v-for="detail in edu.details" :key="detail">
                  {{ detail }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="section section-alt">
      <div class="container">
        <h2 class="section-title">Skills & Technologies</h2>
        <div class="skills-grid">
          <div v-for="(skillList, category) in skills" :key="category" class="skill-category">
            <h3 class="category-title">{{ category }}</h3>
            <div class="skill-tags">
              <span v-for="skill in skillList" :key="skill" class="skill-tag">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="section">
      <div class="container">
        <h2 class="section-title">Featured Projects</h2>
        <p class="section-subtitle">Academic and personal projects showcasing my development skills</p>
        
        <div class="projects-grid">
          <ProjectCard 
            v-for="project in projects" 
            :key="project.id" 
            :project="project"
          />
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section id="experience" class="section section-alt">
      <div class="container">
        <h2 class="section-title">Experience</h2>
        
        <div class="experience-timeline">
          <div v-for="exp in experience" :key="exp.title" class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h3 class="timeline-title">{{ exp.title }}</h3>
              </div>
              <p class="timeline-organization">{{ exp.company }}</p>
              <p class="timeline-period">{{ exp.period }}<span v-if="exp.location"> | {{ exp.location }}</span></p>
              <ul class="timeline-description">
                <li v-for="item in exp.responsibilities" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Achievements Section -->
    <section id="achievements" class="section">
      <div class="container">
        <h2 class="section-title">Achievements</h2>
        <div class="achievements-grid">
          <div v-for="achievement in achievements" :key="achievement.title" class="achievement-card">
            <span class="achievement-category">{{ achievement.category }}</span>
            <h4 class="achievement-title">{{ achievement.title }}</h4>
            <p class="achievement-description">{{ achievement.description }}</p>
            <p class="achievement-role">{{ achievement.relatedRole }} - {{ achievement.institution }}</p>
            <p class="achievement-period">{{ achievement.period }}</p>
            <span class="achievement-year">{{ achievement.year }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="section section-alt">
      <div class="container">
        <h2 class="section-title">Get In Touch</h2>
        <p class="section-subtitle">Open to opportunities and collaboration</p>
        
        <div class="contact-content">
          <div class="contact-links">
            <a :href="`mailto:${profile.email}`" class="contact-card">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <div>
                <h3 class="contact-title">Email</h3>
                <p class="contact-text">{{ profile.email }}</p>
              </div>
            </a>
            
            <a :href="profile.github" target="_blank" rel="noopener noreferrer" class="contact-card">
              <svg class="contact-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <div>
                <h3 class="contact-title">GitHub</h3>
                <p class="contact-text">@Ibnusabil43</p>
              </div>
            </a>
            
            <a :href="profile.linkedin" target="_blank" rel="noopener noreferrer" class="contact-card">
              <svg class="contact-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <div>
                <h3 class="contact-title">LinkedIn</h3>
                <p class="contact-text">in/ibnusabil</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import ProjectCard from '../components/ProjectCard.vue';
import { profile, education, skills, projects, experience, achievements } from '../data/portfolio.js';
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section {
  padding: 5rem 0;
}

.section-alt {
  background: #f9fafb;
}

.dark .section-alt {
  background: #1f2937;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: #111827;
}

.dark .section-title {
  color: #f9fafb;
}

.section-subtitle {
  text-align: center;
  color: #6b7280;
  font-size: 1.125rem;
  margin-bottom: 3rem;
}

.dark .section-subtitle {
  color: #9ca3af;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 80px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.dark .hero-title {
  color: #f9fafb;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.dark .hero-subtitle {
  color: #9ca3af;
}

.hero-description {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.dark .hero-description {
  color: #9ca3af;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.dark .btn-secondary {
  color: #60a5fa;
  border-color: #60a5fa;
}

.btn-secondary:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.hero-image {
  display: flex;
  justify-content: center;
}

.profile-photo {
  width: 350px;
  height: 350px;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  border: 3px solid #e5e7eb;
}

.dark .profile-photo {
  border-color: #374151;
}

.image-placeholder {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #eff6ff, #f3f4f6);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
}

.dark .image-placeholder {
  background: linear-gradient(135deg, #1f2937, #374151);
  border-color: #4b5563;
}

.placeholder-icon {
  width: 120px;
  height: 120px;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.placeholder-text {
  color: #6b7280;
  font-size: 1.125rem;
}

.dark .placeholder-text {
  color: #9ca3af;
}

/* About Section */
.about-content {
  max-width: 900px;
  margin: 0 auto;
}

.about-text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #4b5563;
  margin-bottom: 2rem;
  text-align: center;
}

.dark .about-text {
  color: #d1d5db;
}

.education-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.dark .education-card {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border-color: #374151;
}

.education-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
}

.dark .education-card:hover {
  box-shadow: 0 12px 24px rgba(96, 165, 250, 0.2);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
}

.dark .card-title {
  color: #f9fafb;
}

.education-item {
  padding-bottom: 1.5rem;
}

.edu-degree {
  font-size: 1.25rem;
  font-weight: 600;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.edu-institution {
  font-size: 1.125rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.dark .edu-institution {
  color: #d1d5db;
}

.edu-details {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.dark .edu-details {
  color: #9ca3af;
}

.edu-gpa {
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 1rem;
}

.edu-achievements {
  list-style: none;
  padding-left: 0;
}

.edu-achievements li {
  padding-left: 1.5rem;
  position: relative;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.dark .edu-achievements li {
  color: #9ca3af;
}

.edu-achievements li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-weight: bold;
}

/* Skills Section */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.skill-category {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.dark .skill-category {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border-color: #374151;
}

.skill-category:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
}

.dark .skill-category:hover {
  box-shadow: 0 12px 24px rgba(96, 165, 250, 0.2);
}

.category-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.dark .category-title {
  color: #f9fafb;
  border-bottom-color: #374151;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  padding: 0.5rem 1rem;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.dark .skill-tag {
  background: #1e3a5f;
  color: #60a5fa;
}

/* Projects Section */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

/* Experience Section */
.experience-timeline {
  max-width: 900px;
  margin: 0 auto 4rem;
  position: relative;
}

.experience-timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e5e7eb;
}

.dark .experience-timeline::before {
  background: #374151;
}

.timeline-item {
  position: relative;
  padding-left: 60px;
  margin-bottom: 3rem;
}

.timeline-marker {
  position: absolute;
  left: 12px;
  top: 0;
  width: 18px;
  height: 18px;
  background: #3b82f6;
  border-radius: 50%;
  border: 3px solid white;
}

.dark .timeline-marker {
  border-color: #111827;
}

.timeline-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.dark .timeline-content {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border-color: #374151;
}

.timeline-content:hover {
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
}

.dark .timeline-content:hover {
  box-shadow: 0 12px 24px rgba(96, 165, 250, 0.2);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.timeline-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.dark .timeline-title {
  color: #f9fafb;
}

.timeline-badge {
  padding: 0.25rem 0.75rem;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.dark .timeline-badge {
  background: #1e3a5f;
  color: #60a5fa;
}

.timeline-organization {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.dark .timeline-organization {
  color: #d1d5db;
}

.timeline-period {
  color: #6b7280;
  margin-bottom: 1rem;
}

.dark .timeline-period {
  color: #9ca3af;
}

.timeline-description {
  list-style: none;
  padding-left: 0;
}

.timeline-description li {
  padding-left: 1.5rem;
  position: relative;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.dark .timeline-description li {
  color: #9ca3af;
}

.timeline-description li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-weight: bold;
}

/* Experience Images */
.experience-images {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.dark .experience-images {
  border-top-color: #374151;
}

.images-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 1rem;
}

.dark .images-title {
  color: #9ca3af;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.image-placeholder-box {
  aspect-ratio: 4/3;
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.dark .image-placeholder-box {
  background: #1f2937;
  border-color: #4b5563;
}

.image-placeholder-box:hover {
  background: #e5e7eb;
  border-color: #3b82f6;
}

.dark .image-placeholder-box:hover {
  background: #374151;
  border-color: #60a5fa;
}

.placeholder-icon-small {
  width: 2.5rem;
  height: 2.5rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.dark .placeholder-icon-small {
  color: #6b7280;
}

.placeholder-text-small {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

.dark .placeholder-text-small {
  color: #9ca3af;
}

/* Achievements */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.achievement-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
}

.dark .achievement-card {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border-color: #374151;
}

.achievement-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
}

.dark .achievement-card:hover {
  box-shadow: 0 12px 24px rgba(96, 165, 250, 0.2);
}

.achievement-category {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark .achievement-category {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  color: #93c5fd;
}

.achievement-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.dark .achievement-title {
  color: #f3f4f6;
}

.achievement-description {
  color: #6b7280;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 0.75rem;
}

.dark .achievement-description {
  color: #9ca3af;
}

.achievement-role {
  color: #2563eb;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.dark .achievement-role {
  color: #93c5fd;
}

.achievement-period {
  color: #6b7280;
  font-size: 0.813rem;
  margin-bottom: 0.5rem;
}

.dark .achievement-period {
  color: #9ca3af;
}

.achievement-year {
  color: #2563eb;
  font-weight: 700;
  font-size: 0.875rem;
}

.dark .achievement-year {
  color: #93c5fd;
}

/* Contact Section */
.contact-content {
  max-width: 800px;
  margin: 0 auto;
}

.contact-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.contact-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.dark .contact-card {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border-color: #374151;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
}

.dark .contact-card:hover {
  box-shadow: 0 12px 24px rgba(96, 165, 250, 0.2);
}

.contact-icon {
  width: 3rem;
  height: 3rem;
  color: #3b82f6;
  flex-shrink: 0;
}

.contact-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.dark .contact-title {
  color: #f9fafb;
}

.contact-text {
  color: #6b7280;
}

.dark .contact-text {
  color: #9ca3af;
}

/* Responsive Design */

/* Mobile Small (360px - 480px) */
@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .section {
    padding: 3rem 0;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .hero {
    min-height: auto;
    padding: 6rem 0 4rem;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero-text {
    order: 2;
  }

  .hero-image {
    order: 1;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-description {
    font-size: 0.938rem;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .image-placeholder {
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }

  .placeholder-icon {
    width: 60px;
    height: 60px;
  }

  .placeholder-text {
    font-size: 0.875rem;
  }

  .about-text {
    font-size: 0.938rem;
  }

  .edu-degree {
    font-size: 1.125rem;
  }

  .edu-institution {
    font-size: 0.938rem;
  }

  .skills-container {
    gap: 1.5rem;
  }

  .skill-category {
    padding: 1.25rem;
  }

  .category-title {
    font-size: 1rem;
  }

  .skill-tag {
    font-size: 0.813rem;
    padding: 0.4rem 0.75rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .project-card {
    padding: 1.25rem;
  }

  .project-title {
    font-size: 1.125rem;
  }

  .project-description {
    font-size: 0.875rem;
  }

  .timeline-item {
    padding-left: 35px;
  }

  .timeline-marker {
    left: 10px;
    width: 12px;
    height: 12px;
  }

  .timeline-content {
    padding: 1.25rem;
  }

  .timeline-title {
    font-size: 1.125rem;
  }

  .timeline-organization,
  .timeline-period {
    font-size: 0.875rem;
  }

  .timeline-description li {
    font-size: 0.875rem;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .achievement-card {
    padding: 1.25rem;
  }

  .achievement-title {
    font-size: 1.063rem;
  }

  .achievement-description {
    font-size: 0.875rem;
  }

  .contact-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .contact-icon {
    width: 2.5rem;
    height: 2.5rem;
  }
}

/* Tablet (481px - 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .container {
    padding: 0 1.5rem;
  }

  .section {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2.5rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-buttons {
    justify-content: center;
  }

  .image-placeholder {
    width: 250px;
    height: 250px;
    margin: 0 auto;
  }

  .placeholder-icon {
    width: 70px;
    height: 70px;
  }

  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .timeline-item {
    padding-left: 45px;
  }

  .timeline-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

/* Mobile and Tablet Common (max-width: 768px) */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
  }

  .subsection-title {
    font-size: 1.25rem;
  }

  .card-title {
    font-size: 1.125rem;
  }

  /* Ensure tap targets are large enough */
  .btn,
  .nav-link,
  .theme-toggle,
  .hamburger {
    min-height: 44px;
    min-width: 44px;
  }

  /* Remove hover effects on touch devices */
  .project-card:hover,
  .achievement-card:hover,
  .contact-card:hover {
    transform: none;
  }

  /* Stack contact cards */
  .contact-links {
    gap: 1rem;
  }
}

/* Desktop Small (769px - 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .container {
    padding: 0 2rem;
  }

  .hero-content {
    gap: 3rem;
  }

  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

/* Desktop Large (min-width: 1025px) */
@media (min-width: 1025px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .achievements-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Landscape Mobile */
@media (max-height: 500px) and (orientation: landscape) {
  .hero {
    min-height: auto;
    padding: 2rem 0;
  }

  .section {
    padding: 3rem 0;
  }
}

/* Prevent horizontal scroll */
* {
  max-width: 100%;
}

img,
svg {
  max-width: 100%;
  height: auto;
}

/* Ensure text doesn't overflow */
.timeline-title,
.project-title,
.achievement-title,
.edu-degree {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

</style>
