<template>
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
</template>

<script setup>
import { achievements } from '../../data/portfolio.js';
</script>

<style scoped>
@import '../../styles/sections/achievements.css';
</style>
