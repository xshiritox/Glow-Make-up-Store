<template>
  <div>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center">
          <img src="/Logo.webp" alt="Glow Make-up Store Logo" class="h-16 w-auto transition-transform duration-300 hover:scale-105 rounded-lg">
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Crear cuenta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Inicia sesión
          </router-link>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form @submit.prevent="handleRegister" class="space-y-6">
              <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User class="h-5 w-5 text-gray-400" />
                  </div>
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                required
                autocomplete="name"
                class="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Tu nombre completo"
                :disabled="loading"
              />
            </div>
          </div>

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
                required
                autocomplete="email"
                class="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="tu@email.com"
                :disabled="loading"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                class="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Mínimo 8 caracteres"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                :disabled="loading"
              >
                <Eye v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-500" />
                <EyeOff v-else class="h-5 w-5 text-gray-400 hover:text-gray-500" />
              </button>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmar contraseña
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                class="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Confirma tu contraseña"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                :disabled="loading"
              >
                <Eye v-if="!showConfirmPassword" class="h-5 w-5 text-gray-400 hover:text-gray-500" />
                <EyeOff v-else class="h-5 w-5 text-gray-400 hover:text-gray-500" />
              </button>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="form.acceptTerms"
                type="checkbox"
                required
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                :disabled="loading"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="font-medium text-gray-700">
                Acepto los <a href="/terms" class="text-primary-600 hover:text-primary-500">Términos de Servicio</a> y la <a href="/privacy" class="text-primary-600 hover:text-primary-500">Política de Privacidad</a>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading || !form.acceptTerms"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus class="h-5 w-5 text-primary-500 group-hover:text-primary-400" />
              </span>
              {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
          </div>


                    </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const passwordsMatch = computed(() => {
  return form.password === form.confirmPassword
})

const validateForm = () => {
  if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
    toast.error('Por favor completa todos los campos')
    return false
  }
  
  if (form.password.length < 8) {
    toast.error('La contraseña debe tener al menos 8 caracteres')
    return false
  }
  
  if (!passwordsMatch.value) {
    toast.error('Las contraseñas no coinciden')
    return false
  }
  
  if (!form.acceptTerms) {
    toast.error('Debes aceptar los términos y condiciones')
    return false
  }
  
  return true
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
        },
        // Forzar la verificación de correo electrónico
        emailRedirectTo: `${window.location.origin}/login?verified=true`,
      },
    })

    if (error) throw error
    
    if (data?.user?.identities?.length === 0) {
      throw new Error('Este correo ya está registrado')
    }
    
    // Mostrar mensaje más detallado sobre la verificación
    toast.success('¡Registro exitoso! Por favor revisa tu correo electrónico y haz clic en el enlace de verificación para activar tu cuenta. El enlace es válido por 24 horas.')
    
    // Redirigir a la página de verificación pendiente con el correo electrónico
    router.push({
      path: '/verification-pending',
      query: { email: form.email }
    })
  } catch (error: any) {
    console.error('Error al registrar:', error)
    toast.error(error.message || 'Error al crear la cuenta. Por favor intenta de nuevo.')
  } finally {
    loading.value = false
  }
}
</script>