<template>
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
</template>

<script setup>
import { skills } from '../../data/portfolio.js';
</script>

<style scoped>
@import '../../styles/sections/skills.css';
</style>
