<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <NavBar />
    <main class="pb-16">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import { useAuth } from './composables/useAuth'

const { initialize } = useAuth()

onMounted(async () => {
  await initialize()
})
</script>