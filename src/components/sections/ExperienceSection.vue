<template>
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
</template>

<script setup>
import { experience } from '../../data/portfolio.js';
</script>

<style scoped>
@import '../../styles/sections/experience.css';
</style>
