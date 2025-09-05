<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <img src="/Logo.webp" alt="Kroma Logo" class="h-16 w-auto transition-transform duration-300 hover:scale-105 rounded-lg">
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        Iniciar Sesión
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        ¿No tienes una cuenta?
        <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
          Regístrate aquí
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="tu@email.com"
                :disabled="loading"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div class="text-sm">
                <router-link to="/forgot-password" class="font-medium text-primary-600 hover:text-primary-500">
                  ¿Olvidaste tu contraseña?
                </router-link>
              </div>
            </div>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Tu contraseña"
                :disabled="loading"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="showPassword = !showPassword"
                :disabled="loading"
              >
                <Eye v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-500" />
                <EyeOff v-else class="h-5 w-5 text-gray-400 hover:text-gray-500" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                :disabled="loading"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Recordar sesión
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock class="h-5 w-5 text-primary-500 group-hover:text-primary-400" />
              </span>
              {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
            </button>
          </div>


        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { useToast } from 'vue-toastification';
import { Mail, Eye, EyeOff, Lock } from 'lucide-vue-next';
import { supabase } from '@/lib/supabase';

const router = useRouter();
const route = useRoute() as RouteLocationNormalizedLoaded;
const toast = useToast();
const loading = ref(false);
const showPassword = ref(false);

const form = ref({
  email: '',
  password: '',
  remember: false
});

// Mostrar mensaje si se redirige después de cambiar la contraseña
onMounted(() => {
  if (route.query.password_changed === 'true') {
    toast.success('¡Tu contraseña ha sido actualizada correctamente! Por favor inicia sesión con tu nueva contraseña.');
    // Limpiar el query param para que no se muestre el mensaje si se recarga la página
    router.replace({ query: {} });
  }
});

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    toast.error('Por favor completa todos los campos');
    return;
  }

  try {
    loading.value = true;
    
    // Primero intentamos iniciar sesión
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password,
    });

    if (error) throw error;
    
    // Verificamos si el correo está confirmado
    const user = data.user;
    if (user && !user.email_confirmed_at) {
      // Cerrar sesión si el correo no está verificado
      await supabase.auth.signOut();
      throw new Error('Por favor verifica tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada o la carpeta de spam.');
    }
    
    toast.success(`¡Bienvenido de nuevo!`);
    router.push('/');
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error);
    
    // Mensajes de error personalizados
    if (error.message.includes('Email not confirmed')) {
      toast.error('Por favor verifica tu correo electrónico antes de iniciar sesión.');
    } else if (error.message.includes('Invalid login credentials')) {
      toast.error('Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    } else {
      toast.error(error.message || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Estilos específicos del componente */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Mejora la accesibilidad del foco */
button:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

/* Transiciones suaves para los botones */
button {
  transition: all 0.2s ease-in-out;
}
</style>