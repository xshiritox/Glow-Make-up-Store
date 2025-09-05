<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Recuperar contraseña
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="relative">
            <label for="email-address" class="sr-only">Correo electrónico</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Correo electrónico registrado"
              :disabled="loading"
            >
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <Key class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
            </span>
            {{ loading ? 'Enviando enlace...' : 'Enviar enlace de recuperación' }}
          </button>
        </div>
      </form>
      
      <div class="text-center text-sm">
        <router-link 
          to="/login" 
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Volver al inicio de sesión
        </router-link>
      </div>
      
      <div v-if="message" 
           class="p-4 rounded-md"
           :class="{
             'bg-green-50 text-green-800': messageType === 'success',
             'bg-red-50 text-red-800': messageType === 'error'
           }"
      >
        <p class="text-sm">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Mail, Key } from 'lucide-vue-next';
import { supabase } from '@/lib/supabase';

const router = useRouter();
const email = ref('');
const loading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error' | null>(null);

const handleSubmit = async () => {
  if (!email.value) return;
  
  try {
    loading.value = true;
    message.value = '';
    
    // Construir la URL de redirección completa
    const protocol = window.location.protocol;
    const host = window.location.host;
    const redirectUrl = `${protocol}//${host}/change-password`;
    
    console.log('Enviando correo de recuperación a:', email.value);
    console.log('URL de redirección:', redirectUrl);
    
    // Verificar que la URL se construya correctamente
    if (!redirectUrl.startsWith('http')) {
      console.error('URL de redirección inválida:', redirectUrl);
      throw new Error('Error de configuración: URL de redirección inválida');
    }
    
      const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
        redirectTo: redirectUrl
      });
      
      if (error) {
        console.error('Error al enviar el correo de recuperación:', error);
        throw error;
      }
      
      message.value = 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña';
      messageType.value = 'success';
      email.value = '';
      
      // Opcional: Redirigir después de un tiempo
      setTimeout(() => {
        router.push('/login');
      }, 5000);
      
    } catch (error: any) {
      console.error('Error en el proceso de recuperación:', error);
      message.value = error.message || 'Error al enviar el correo de recuperación';
      messageType.value = 'error';
    } finally {
      loading.value = false;
    }
};
</script>

<style scoped>
/* Estilos específicos del componente si son necesarios */
</style>
