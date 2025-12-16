<template>
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
</template>

<script setup>
import { profile, education } from '../../data/portfolio.js';
</script>

<style scoped>
@import '../../styles/sections/about.css';
</style>
