<template>
  <div class="home">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <SkillsSection />
    <ProjectsSection />
    <ExperienceSection />
    <AchievementsSection />
    <ContactSection />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '../components/layout/Navbar.vue';
import Footer from '../components/layout/Footer.vue';
import HeroSection from '../components/sections/HeroSection.vue';
import AboutSection from '../components/sections/AboutSection.vue';
import SkillsSection from '../components/sections/SkillsSection.vue';
import ProjectsSection from '../components/sections/ProjectsSection.vue';
import ExperienceSection from '../components/sections/ExperienceSection.vue';
import AchievementsSection from '../components/sections/AchievementsSection.vue';
import ContactSection from '../components/sections/ContactSection.vue';
</script>

<style scoped>
.home {
  min-height: 100vh;
}
</style>
