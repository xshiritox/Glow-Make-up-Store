<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isLinkExpired ? '¡Ups! Enlace no disponible' : 'Cambiar contraseña' }}
        </h2>
        <p v-if="!isLinkExpired" class="mt-2 text-center text-sm text-gray-600">
          Crea una nueva contraseña segura para tu cuenta
        </p>
      </div>
      
      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="rounded-md p-4 mb-6" :class="isLinkExpired ? 'bg-yellow-50' : 'bg-red-50'">
        <div class="flex">
          <div class="flex-shrink-0">
            <AlertTriangleIcon 
              class="h-5 w-5" 
              :class="isLinkExpired ? 'text-yellow-400' : 'text-red-400'" 
              aria-hidden="true" 
            />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium" :class="isLinkExpired ? 'text-yellow-800' : 'text-red-800'">
              {{ errorMessage }}
            </h3>
            <div v-if="isLinkExpired" class="mt-2 text-sm text-yellow-700">
              <p class="mb-3">
                Por seguridad, los enlaces de recuperación solo son válidos por 1 hora.
              </p>
              <router-link 
                to="/forgot-password" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <RefreshIcon class="-ml-1 mr-2 h-4 w-4" />
                Solicitar nuevo enlace
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <div class="relative">
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="form.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                required
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mínimo 8 caracteres"
                :disabled="loading"
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                @click="showNewPassword = !showNewPassword"
                :disabled="loading"
              >
                <EyeOffIcon v-if="showNewPassword" class="h-5 w-5 text-gray-500" />
                <EyeIcon v-else class="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div class="relative">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nueva contraseña
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirma tu contraseña"
                :disabled="loading"
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                @click="showConfirmPassword = !showConfirmPassword"
                :disabled="loading"
              >
                <EyeOffIcon v-if="showConfirmPassword" class="h-5 w-5 text-gray-500" />
                <EyeIcon v-else class="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="p-4 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm animate-fade-in">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ errorMessage }}</p>
                <p v-if="errorMessage.includes('enlace de recuperación')" class="mt-2">
                  <router-link to="/forgot-password" class="font-medium text-red-600 hover:text-red-500">
                    ¿Solicitar un nuevo enlace de recuperación?
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockIcon class="h-5 w-5 text-indigo-200 group-hover:text-indigo-100" />
            </span>
            {{ loading ? 'Actualizando contraseña...' : 'Cambiar contraseña' }}
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { supabase } from '@/lib/supabase';
import { 
  Eye as EyeIcon, 
  EyeOff as EyeOffIcon,
  AlertTriangle as AlertTriangleIcon,
  RefreshCw as RefreshIcon,
  Lock as LockIcon
} from 'lucide-vue-next';

interface FormState {
  newPassword: string;
  confirmPassword: string;
}

const router = useRouter();
const toast = useToast();

// Estado del formulario
const form = reactive<FormState>({
  newPassword: '',
  confirmPassword: ''
});

const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const isAuthenticated = ref(false);
const isLinkExpired = ref(false);

// Props
const props = defineProps({
  access_token: { 
    type: String, 
    default: '' 
  },
  type: { 
    type: String, 
    default: '' 
  },
  next: { 
    type: String, 
    default: '' 
  }
});

// Verificar el token cuando cambien los props
const verifyToken = async (accessToken: string, type: string) => {
  try {
    console.log('Iniciando verificación de token...');
    loading.value = true;
    errorMessage.value = '';
    
    // Validaciones iniciales
    if (!accessToken) {
      console.error('No se proporcionó un token de acceso');
      throw new Error('Enlace de recuperación inválido: falta el token de acceso');
    }
    
    if (type !== 'recovery') {
      console.error('Tipo de autenticación inválido:', type);
      throw new Error('Este enlace no es para recuperación de contraseña');
    }
    
    let email = '';
    let tokenExp = 0;
    let tokenIssuedAt = 0;
    
    try {
      // Extraer información del token JWT
      console.log('Procesando token JWT...');
      
      // Verificar el formato del token
      const tokenParts = accessToken.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Formato de token inválido');
      }
      
      // Decodificar el payload
      const payload = JSON.parse(atob(tokenParts[1]));
      email = payload.email || '';
      tokenExp = payload.exp || 0;
      tokenIssuedAt = payload.iat || 0;
      
      console.log('Información del token:', { 
        email, 
        exp: new Date(tokenExp * 1000).toISOString(),
        iat: new Date(tokenIssuedAt * 1000).toISOString()
      });
      
      // Verificar si el token ha expirado
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenAge = currentTime - tokenIssuedAt;
      const maxTokenAge = 3600; // 1 hora en segundos
      
      if (tokenExp && currentTime > tokenExp) {
        throw new Error('El enlace de recuperación ha expirado. Por seguridad, los enlaces solo son válidos por 1 hora.');
      }
      
      // Verificar si el token es demasiado viejo
      if (tokenAge > maxTokenAge) {
        throw new Error('El enlace de recuperación ha expirado. Por favor, solicita un nuevo enlace.');
      }
      
      if (!email) {
        throw new Error('No se pudo obtener el correo electrónico del token');
      }
      
    } catch (e: any) {
      console.error('Error al procesar el token JWT:', e);
      if (e.message.includes('expired') || e.message.includes('expirado')) {
        isLinkExpired.value = true;
        throw new Error('El enlace de recuperación ha expirado. Por favor, solicita un nuevo enlace.');
      }
      throw new Error('El enlace de recuperación no es válido o está dañado. Por favor, solicita un nuevo enlace.');
    }
    
    // Función para verificar el OTP con manejo de reintentos
    const verifyOTP = async (attempt = 1): Promise<{ error: any }> => {
      console.log(`Verificando OTP con Supabase (intento ${attempt})...`);
      try {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: accessToken,
          type: 'recovery'
        });
        return { error };
      } catch (error: any) {
        console.error(`Error en el intento ${attempt}:`, error);
        
        // Si es un error de red, reintentar
        if (error.message?.toLowerCase().includes('network') && attempt < 2) {
          console.log('Error de red, reintentando...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return verifyOTP(attempt + 1);
        }
        
        // Si es un error de token inválido o expirado, no reintentar
        if (error.message?.toLowerCase().includes('invalid') || 
            error.message?.toLowerCase().includes('expired')) {
          isLinkExpired.value = true;
          throw error;
        }
        
        throw error;
      }
    };
    
    // Intentar verificar el token con Supabase
    console.log('Iniciando verificación de token con Supabase...');
    const result = await verifyOTP();
    
    if (result.error) {
      const errorMsg = result.error.message || '';
      console.error('Error en la verificación del token:', result.error);
      
      // Mapear errores comunes a mensajes amigables
      const errorMap: Record<string, string> = {
        'token has expired': 'El enlace de recuperación ha expirado. Por favor, solicita uno nuevo.',
        'invalid token': 'El enlace de recuperación no es válido o ya ha sido utilizado.',
        'token revoked': 'Este enlace ya ha sido utilizado. Por seguridad, los enlaces de recuperación solo se pueden usar una vez.',
        'auth link is invalid or has expired': 'El enlace de recuperación no es válido o ha expirado.',
        'invalid oauth session': 'La sesión de recuperación no es válida. Por favor, solicita un nuevo enlace.',
        'network': 'Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.'
      };
      
      // Buscar el mensaje de error más apropiado
      const lowerErrorMsg = errorMsg.toLowerCase();
      const matchedError = Object.entries(errorMap).find(([key]) => lowerErrorMsg.includes(key));
      
      if (matchedError) {
        throw new Error(matchedError[1]);
      }
      
      // Para errores de tiempo/sincronización
      if (lowerErrorMsg.includes('future') || lowerErrorMsg.includes('skew')) {
        throw new Error('Error de sincronización de tiempo. Por favor, verifica que la fecha y hora de tu dispositivo sean correctas.');
      }
      
      // Para otros errores inesperados
      throw new Error('No se pudo verificar el enlace de recuperación. Por favor, inténtalo de nuevo o solicita un nuevo enlace.');
    }
    
    // Si llegamos aquí, la verificación fue exitosa
    console.log('Token verificado exitosamente');
    isAuthenticated.value = true;
    
    // Limpiar la URL después de la verificación exitosa
    const cleanUrl = window.location.pathname;
    console.log('Limpiando URL:', cleanUrl);
    window.history.replaceState({}, document.title, cleanUrl);
    
  } catch (error: any) {
    console.error('Error al verificar el token:', error);
    
    // Manejar diferentes tipos de errores
    const errorMsg = error.message || '';
    
    if (errorMsg.includes('expired') || errorMsg.includes('invalid') || errorMsg.includes('used') || errorMsg.includes('403')) {
      isLinkExpired.value = true;
      errorMessage.value = 'El enlace de recuperación ha expirado o ya ha sido utilizado. Por seguridad, los enlaces de recuperación solo son válidos por 1 hora.';
    } else if (errorMsg.includes('token') || errorMsg.includes('malformed')) {
      isLinkExpired.value = true;
      errorMessage.value = 'El enlace de recuperación no es válido. Por favor, verifica que el enlace sea correcto.';
    } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
      errorMessage.value = 'Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.';
    } else if (errorMsg.includes('user') || errorMsg.includes('not found')) {
      errorMessage.value = 'No se encontró una cuenta asociada a este correo electrónico. Verifica el correo o regístrate para crear una cuenta.';
    } else if (errorMsg.includes('403') || errorMsg.includes('forbidden')) {
      errorMessage.value = 'No tienes permiso para realizar esta acción. El enlace puede haber expirado o ya haber sido utilizado.';
    } else {
      errorMessage.value = `Ocurrió un error inesperado: ${errorMsg || 'Por favor, inténtalo de nuevo más tarde.'}`;
    }
    
    toast.error(errorMessage.value, { 
      timeout: 10000, // 10 segundos
      closeOnClick: false,
      pauseOnFocusLoss: true,
      pauseOnHover: true
    });
    
    // Redirigir a la página de recuperación después de mostrar el mensaje
    setTimeout(() => {
      router.push('/forgot-password');
    }, 5000);
  } finally {
    loading.value = false;
  }
};

// Función para extraer parámetros del hash de la URL
const extractParamsFromUrl = () => {
  // Obtener el hash o la búsqueda de la URL
  const hash = window.location.hash.substring(1) || window.location.search.substring(1);
  
  if (!hash) {
    console.log('No se encontraron parámetros en la URL');
    return null;
  }
  
  // Convertir los parámetros en un objeto
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const type = params.get('type');
  
  console.log('Parámetros extraídos de la URL:', { accessToken, type });
  
  if (!accessToken || !type) {
    console.error('Faltan parámetros requeridos en la URL');
    return null;
  }
  
  return { accessToken, type };
};

// Ejecutar la verificación cuando el componente se monte
onMounted(async () => {
  try {
    // Mostrar mensaje de carga
    loading.value = true;
    
    // Intentar extraer parámetros de la URL
    const urlParams = extractParamsFromUrl();
    
    if (urlParams) {
      console.log('Parámetros encontrados en la URL, iniciando verificación...');
      await verifyToken(urlParams.accessToken, urlParams.type);
    } else if (props.access_token && props.type) {
      // Usar los props si vienen de la ruta
      console.log('Usando parámetros de las props, iniciando verificación...');
      await verifyToken(props.access_token, props.type);
    } else {
      console.error('No se encontraron parámetros de recuperación válidos');
      isLinkExpired.value = true;
      errorMessage.value = 'Enlace de recuperación inválido o incompleto. Por favor, verifica el enlace o solicita uno nuevo.';
      toast.error(errorMessage.value, { 
        timeout: 10000,
        closeOnClick: false,
        pauseOnFocusLoss: true,
        pauseOnHover: true
      });
    }
  } catch (error: any) {
    console.error('Error al procesar la URL de recuperación:', error);
    
    // Manejar diferentes tipos de errores
    const errorMsg = error?.message?.toLowerCase() || '';
    
    if (errorMsg.includes('expired') || errorMsg.includes('expirado')) {
      isLinkExpired.value = true;
      errorMessage.value = 'El enlace de recuperación ha expirado. Por seguridad, los enlaces solo son válidos por 1 hora.';
    } else if (errorMsg.includes('sincronización') || errorMsg.includes('tiempo') || errorMsg.includes('skew')) {
      errorMessage.value = 'Error de sincronización de tiempo. Por favor, verifica que la fecha y hora de tu dispositivo sean correctas y vuelve a intentarlo.';
    } else if (errorMsg.includes('inválido') || errorMsg.includes('invalid')) {
      isLinkExpired.value = true;
      errorMessage.value = 'El enlace de recuperación no es válido o ya ha sido utilizado. Por favor, solicita un nuevo enlace.';
    } else {
      errorMessage.value = 'Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.';
    }
    
    toast.error(errorMessage.value, { 
      timeout: 10000,
      closeOnClick: false,
      pauseOnFocusLoss: true,
      pauseOnHover: true
    });
    
    // Redirigir a la página de recuperación después de 5 segundos
    setTimeout(() => {
      router.push('/forgot-password');
    }, 5000);
  }
});

const isFormValid = computed(() => {
  return (
    form.newPassword.length >= 8 &&
    form.newPassword === form.confirmPassword
  );
});

const handleSubmit = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Por favor, completa todos los campos correctamente.';
    toast.error(errorMessage.value, { timeout: 5000 });
    return;
  }
  
  try {
    loading.value = true;
    errorMessage.value = '';
    
    console.log('=== INICIANDO PROCEDIMIENTO DE CAMBIO DE CONTRASEÑA ===');
    
    // Verificar autenticación antes de continuar
    if (!isAuthenticated.value) {
      throw new Error('No se pudo autenticar. Por favor, solicita un nuevo enlace de recuperación.');
    }
    
    // Verificar que las contraseñas coincidan (doble verificación)
    if (form.newPassword !== form.confirmPassword) {
      throw new Error('Las contraseñas no coinciden. Por favor, verifica e inténtalo de nuevo.');
    }
    
    // Verificar la fortaleza de la contraseña
    if (form.newPassword.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres.');
    }
    
    // Verificar si la contraseña es demasiado común o insegura
    const commonPasswords = ['12345678', 'password', 'qwerty123', '123456789', '1234567890'];
    if (commonPasswords.includes(form.newPassword.toLowerCase())) {
      throw new Error('Por seguridad, elige una contraseña menos común.');
    }
    
    console.log('Verificando sesión actual...');
    // Obtener la sesión actual con manejo de errores mejorado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Error al obtener la sesión:', sessionError);
      throw new Error('La sesión ha expirado. Por favor, solicita un nuevo enlace de recuperación.');
    }
    
    console.log('Usuario autenticado:', session.user?.email);
    
    // Actualizar la contraseña del usuario con reintentos
    console.log('Actualizando contraseña...');
    const updatePasswordWithRetry = async (attempt = 1): Promise<{ data: any, error: any }> => {
      try {
        const result = await supabase.auth.updateUser({
          password: form.newPassword
        });
        return result;
      } catch (error) {
        console.error(`Error en el intento ${attempt} de actualizar la contraseña:`, error);
        if (attempt < 2) { // Máximo 2 intentos
          await new Promise(resolve => setTimeout(resolve, 1000));
          return updatePasswordWithRetry(attempt + 1);
        }
        throw error;
      }
    };
    
    const { data: updateData, error: updateError } = await updatePasswordWithRetry();
    
    if (updateError) {
      console.error('Error al actualizar la contraseña:', updateError);
      
      // Mapeo de errores a mensajes amigables
      const errorMap: Record<string, string> = {
        'password': 'La contraseña no cumple con los requisitos mínimos de seguridad.',
        'session': 'La sesión ha expirado. Por favor, solicita un nuevo enlace de recuperación.',
        'token': 'El enlace de recuperación no es válido o ha expirado.',
        'jwt': 'Error de autenticación. Por favor, solicita un nuevo enlace.',
        'network': 'Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.',
        'rate limit': 'Demasiados intentos. Por favor, espera unos minutos antes de intentarlo de nuevo.'
      };
      
      // Buscar el mensaje de error más apropiado
      const errorMsg = updateError.message.toLowerCase();
      const matchedError = Object.entries(errorMap).find(([key]) => errorMsg.includes(key));
      
      throw new Error(matchedError ? matchedError[1] : 'Error al actualizar la contraseña. Por favor, inténtalo de nuevo.');
    }
    
    console.log('Contraseña actualizada exitosamente:', updateData);
    
    // Mostrar mensaje de éxito
    const successMessage = '¡Contraseña actualizada correctamente! Redirigiendo al inicio de sesión...';
    toast.success(successMessage, {
      timeout: 5000,
      closeOnClick: false,
      pauseOnFocusLoss: false,
      pauseOnHover: false
    });
    
    // Cerrar sesión después de cambiar la contraseña
    console.log('Cerrando sesión...');
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.error('Error al cerrar sesión:', signOutError);
      // No lanzamos error aquí, ya que el cambio de contraseña fue exitoso
      toast.info('Tu contraseña ha sido actualizada, pero hubo un problema al cerrar la sesión. Por favor, cierra sesión manualmente.', {
        timeout: 8000
      });
    }
    
    // Redirigir al usuario a la página de inicio de sesión después de 3 segundos
    setTimeout(() => {
      console.log('Redirigiendo a la página de inicio de sesión...');
      router.push('/login');
    }, 3000);
    toast.success('¡Contraseña actualizada correctamente! Por favor inicia sesión con tu nueva contraseña.', { 
      timeout: 5000 
    });
    
    // Limpiar el formulario
    form.newPassword = '';
    form.confirmPassword = '';
    
    // Redirigir a la página de inicio de sesión
    router.push({ 
      path: '/login',
      query: { password_changed: 'true' } 
    });
    
  } catch (error: any) {
    console.error('Error en handleSubmit:', error);
    
    // Manejar diferentes tipos de errores
    if (error.status === 400) {
      errorMessage.value = 'La solicitud no es válida. Por favor, verifica los datos e inténtalo de nuevo.';
    } else if (error.status === 401) {
      errorMessage.value = 'La sesión ha expirado. Por favor, solicita un nuevo enlace de recuperación.';
    } else if (error.status === 500) {
      errorMessage.value = 'Error del servidor. Por favor, inténtalo de nuevo más tarde.';
    } else {
      errorMessage.value = error.message || 'Ocurrió un error al actualizar la contraseña. Por favor, inténtalo de nuevo.';
    }
    
    toast.error(errorMessage.value, { timeout: 5000 });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Estilos específicos del componente */
</style>
