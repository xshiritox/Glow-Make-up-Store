<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Verificación de correo electrónico
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="mt-2 text-lg font-medium text-gray-900">¡Revisa tu correo electrónico!</h3>
          <div class="mt-2 text-sm text-gray-600">
            <p>Hemos enviado un enlace de verificación a <span class="font-medium">{{ email || 'tu correo electrónico' }}</span>.</p>
            <p class="mt-2">Por favor haz clic en el enlace para verificar tu cuenta y completar el registro.</p>
          </div>
          <div class="mt-6">
            <div class="text-sm font-medium text-gray-900">¿No has recibido el correo?</div>
            <div class="mt-1 text-sm text-gray-600">
              <p>Revisa tu carpeta de spam o correo no deseado.</p>
              <p class="mt-1">Si aún no lo encuentras, puedes <button @click="resendVerification" class="font-medium text-primary-600 hover:text-primary-500">reenviar el correo de verificación</button>.</p>
            </div>
          </div>
          <div class="mt-6">
            <router-link to="/login" class="text-sm font-medium text-primary-600 hover:text-primary-500">
              ← Volver al inicio de sesión
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { supabase } from '@/lib/supabase';

const route = useRoute();
const toast = useToast();

const email = ref('');

// Obtener el correo electrónico de los parámetros de la URL si está presente
onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email as string;
  }
});

const resendVerification = async () => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.value,
      options: {
        emailRedirectTo: `${window.location.origin}/login?verified=true`,
      },
    });

    if (error) throw error;
    
    toast.success('¡Correo de verificación reenviado! Por favor revisa tu bandeja de entrada.');
  } catch (error: any) {
    console.error('Error al reenviar el correo de verificación:', error);
    toast.error(error.message || 'Error al reenviar el correo de verificación');
  }
};
</script>
