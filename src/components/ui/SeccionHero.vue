<template>
  <div class="contenedor mx-auto px-4">
    <!-- PÁGINA DE INICIO -->
    <div v-if="esInicio" class="flex flex-col py-0 sm:py-0 lg:py-0 gap-16 sm:gap-y-24 min-h-[calc(100vh_-_128px)] justify-center items-center">
      <div class="text-center">
        <div class="flex items-center gap-2 w-full justify-center mb-4">
          <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {{ tituloInicio }}
          </span>
        </div>
        
        <h1 class="text-4xl sm:text-4xl font-semibold text-gray-900 mb-4">
          {{ subtitulo }}
        </h1>
        
        <div class="flex flex-col gap-8 max-w-3xl">
          <p class="text-gray-600 text-lg font-normal">
            {{ descripcion }}
          </p>
          
          <div v-if="sesion" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full md:w-[672px]">
            <div class="space-y-6">
              <div v-for="(servicio, indice) in servicios" :key="indice" class="space-y-4">
                <div class="grid grid-cols-2 gap-6">
                  <div class="flex flex-col justify-start items-start text-left">
                    <span class="text-sm font-medium text-gray-900">
                      {{ servicio.titulo }}
                    </span>
                    <div class="flex justify-start items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span class="text-gray-600 text-sm">
                        {{ servicio.descripcion }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                      <div class="bg-green-600 h-2.5 rounded-full" style="width: 100%"></div>
                    </div>
                  </div>
                </div>
                <hr v-if="indice < servicios.length - 1" class="my-4 border-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PÁGINA DE AUTENTICACIÓN -->
    <div v-else class="max-w-4xl mx-auto lg:flex justify-center items-center">
      <div class="text-center lg:text-left">
        <div class="flex items-center gap-2 w-full justify-center lg:justify-start">
          <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {{ mensajeEstado }}
          </span>
        </div>
        
        <h1 class="text-4xl sm:text-4xl font-semibold text-gray-900 mt-4">
          {{ subtitulo }}
        </h1>
        
        <div class="mt-4">
          <p class="text-lg text-gray-600">
            {{ descripcion }}
            <span v-if="instrucciones" class="block mt-2 text-blue-600">
              {{ instrucciones }}
            </span>
          </p>
          
          <div v-if="!esInicio" class="mt-6">
            <slot name="boton">
              <router-link 
                :to="`/login`" 
                class="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                ← Volver al inicio de sesión
              </router-link>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{
  tituloInicio?: string;
  titulo?: string;
  mensajeEstado?: string;
  subtitulo: string;
  descripcion?: string;
  instrucciones?: string;
  esInicio?: boolean;
  mostrarSesion?: boolean;
}>(), {
  tituloInicio: 'Nuevo en WebProMercado',
  mensajeEstado: 'Estado',
  descripcion: '',
  instrucciones: '',
  esInicio: false,
  mostrarSesion: false
});

const sesion = ref(props.mostrarSesion);

const servicios = ref([
  {
    titulo: "Servicio de Ecommerce",
    descripcion: "Servicio en línea y completamente operativo",
  },
  {
    titulo: "Servicio de Suscripción",
    descripcion: "Servicio en línea y completamente operativo",
  },
  {
    titulo: "Servicio de Administración",
    descripcion: "Servicio en línea y completamente operativo",
  },
]);
</script>

<style scoped>
.contenedor {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
}
</style>
