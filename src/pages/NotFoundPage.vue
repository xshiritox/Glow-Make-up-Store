<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="text-center">
      <div class="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-8">
        <AlertCircle class="w-12 h-12 text-primary-600" />
      </div>
      
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Página no encontrada</h2>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/"
          class="btn-primary justify-center"
        >
          <Home class="w-4 h-4" />
          Ir al Inicio
        </router-link>
        
        <router-link
          to="/products"
          class="btn-outline justify-center"
        >
          <Package class="w-4 h-4" />
          Ver Productos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, Home, Package } from 'lucide-vue-next'
</script>