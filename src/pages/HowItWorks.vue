<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
        <div class="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-radial from-white/10 to-transparent rounded-full"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Cómo comprar en
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary-200 to-white">Glow Make-up Store</span>
          </h1>
          <p class="text-xl text-blue-100 max-w-2xl mx-auto">
            Descubre lo fácil que es encontrar y comprar los mejores productos
          </p>
        </div>
      </div>
      
      <!-- Wave divider -->
      <div class="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16 md:h-24">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512,52,583,67.3c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                opacity="0.25" class="fill-white"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,141.56,72.41,11.5,20.05,17.58,40.49,21.91,64.18V0Z" 
                opacity="0.5" class="fill-white"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,86c57.52-8.08,108.87-34.5,145.24-68.21,14-12.93,27.95-25.77,43.56-34.69V0Z" 
                class="fill-white"></path>
        </svg>
      </div>
    </section>

    <!-- Steps Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">
            Compra en 3 sencillos pasos
          </h2>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Así de fácil es encontrar y comprar los mejores productos en Glow Make-up Store.
          </p>
        </div>

        <div class="mt-20">
          <div class="space-y-20">
            <!-- Step 1 -->
            <div class="md:flex md:items-center md:space-x-8">
              <div class="md:w-1/2">
                <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white text-lg font-bold">
                  1
                </div>
                <h3 class="mt-6 text-2xl font-bold text-gray-900">1. Crea tu cuenta</h3>
                <p class="mt-4 text-base text-gray-500">
                  Regístrate en segundos con tu correo electrónico. Es rápido, seguro y completamente gratuito.
                </p>
              </div>
              <div class="mt-8 md:mt-0 md:w-1/2">
                <div class="bg-gray-100 rounded-lg overflow-hidden shadow-lg flex items-center justify-center p-8">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-40 w-40 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="md:flex md:flex-row-reverse md:items-center md:space-x-reverse md:space-x-8">
              <div class="md:w-1/2">
                <div class="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-500 text-white text-lg font-bold">
                  2
                </div>
                <h3 class="mt-6 text-2xl font-bold text-gray-900">2. Encuentra tu producto</h3>
                <p class="mt-4 text-base text-gray-500">
                  Navega por nuestro catálogo y usa los filtros para encontrar exactamente lo que necesitas. Tenemos una amplia variedad de productos para ti.
                </p>
              </div>
              <div class="mt-8 md:mt-0 md:w-1/2">
                <div class="bg-gray-100 rounded-lg overflow-hidden shadow-lg flex items-center justify-center p-8">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-40 w-40 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="md:flex md:items-center md:space-x-8">
              <div class="md:w-1/2">
                <div class="flex items-center justify-center h-12 w-12 rounded-md bg-accent-500 text-white text-lg font-bold">
                  3
                </div>
                <h3 class="mt-6 text-2xl font-bold text-gray-900">3. Realiza tu compra</h3>
                <p class="mt-4 text-base text-gray-500">
                  Paga de forma segura con tu método de pago preferido. Ofrecemos múltiples opciones de pago y envíos rápidos a todo el país.
                </p>
              </div>
              <div class="mt-8 md:mt-0 md:w-1/2">
                <div class="bg-gray-100 rounded-lg overflow-hidden shadow-lg flex items-center justify-center p-8">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-40 w-40 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Resolvemos tus dudas sobre compras en Glow Make-up Store.
          </p>
        </div>

        <div class="mt-12 max-w-3xl mx-auto">
          <div class="space-y-6">
            <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-lg shadow overflow-hidden">
              <button 
                @click="toggleFaq(index)"
                class="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center"
                :aria-expanded="activeFaq === index"
                :aria-controls="'faq-content-' + index"
              >
                <span class="text-lg font-medium text-gray-900">{{ faq.question }}</span>
                <svg 
                  class="h-5 w-5 text-gray-400 transform transition-transform duration-200" 
                  :class="{ 'rotate-180': activeFaq === index }" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <div 
                v-show="activeFaq === index" 
                :id="'faq-content-' + index"
                class="px-6 pb-4 text-gray-500"
              >
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl shadow-xl overflow-hidden">
          <div class="px-6 py-12 sm:p-16">
            <div class="text-center">
              <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
                <span class="block">¿Listo para comprar?</span>
                <span class="block text-primary-100 mt-2">Únete a miles de clientes satisfechos en Glow Make-up Store</span>
              </h2>
              <div class="mt-8 flex justify-center">
                <div class="inline-flex rounded-md shadow">
                  <router-link to="/register" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50">
                    Crear cuenta gratis
                  </router-link>
                </div>
                <div class="ml-3 inline-flex">
                  <a href="mailto:web.kroma.store@gmail.com?subject=Consulta%20sobre%20Kroma%20Store" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 bg-opacity-60 hover:bg-opacity-40">
                    Contáctanos
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeFaq = ref<number | null>(null);

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};

const faqs = [
  {
    question: '¿Cuáles son los métodos de pago aceptados?',
    answer: 'Aceptamos tarjetas de crédito, débito, transferencias bancarias y otros métodos de pago electrónicos. Todos los pagos son procesados de forma segura.'
  },
  {
    question: '¿Cuál es el tiempo de entrega?',
    answer: 'El tiempo de entrega varía según tu ubicación. Generalmente, los envíos dentro de la ciudad tardan de 1 a 3 días hábiles, y a nivel nacional de 3 a 7 días hábiles.'
  },
  {
    question: '¿Ofrecen envíos internacionales?',
    answer: 'Por el momento solo realizamos envíos a nivel nacional en Colombia. Próximamente ofreceremos envíos internacionales.'
  },
  {
    question: '¿Cómo puedo contactar al servicio al cliente?',
    answer: 'Puedes contactarnos a través del formulario de contacto en nuestro sitio web, por WhatsApp o enviando un correo a nuestro equipo de soporte que está disponible las 24/7.'
  },
];
</script>

<style scoped>
/* Smooth accordion transitions */
[role="region"] {
  transition: max-height 0.3s ease-in-out;
  overflow: hidden;
}
</style>
