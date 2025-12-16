<template>
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
</template>

<script setup>
import { projects } from '../../data/portfolio.js';
import ProjectCard from '../ui/ProjectCard.vue';
</script>

<style scoped>
@import '../../styles/sections/projects.css';
</style>
