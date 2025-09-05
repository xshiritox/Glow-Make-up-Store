<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ user?.id ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h2>
          <button 
            @click="$emit('close')" 
            class="text-gray-400 hover:text-gray-500"
          >
            <span class="sr-only">Cerrar</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="full_name" class="block text-sm font-medium text-gray-700">Nombre completo</label>
            <input
              type="text"
              id="full_name"
              v-model="formData.full_name"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Teléfono (opcional)</label>
            <input
              type="tel"
              id="phone"
              v-model="formData.phone"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="badge" class="block text-sm font-medium text-gray-700">Rol/Insignia</label>
            <select
              id="badge"
              v-model="formData.badge"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option :value="undefined">Sin rol</option>
              <option value="destacado">Destacado</option>
              <option value="colaborador">Colaborador</option>
              <option value="vip">VIP</option>
              <option value="moderador">Moderador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface User {
  id?: string
  email: string
  full_name: string
  phone?: string
  badge?: string | null
}

const props = defineProps<{
  user: User | null
}>()

const emit = defineEmits(['saved', 'close'])

const formData = ref<User>({
  email: '',
  full_name: '',
  phone: '',
  badge: undefined
})

const isSubmitting = ref(false)

// Update form data when user prop changes
watch(() => props.user, (newUser) => {
  if (newUser) {
    formData.value = { ...newUser }
  } else {
    formData.value = { email: '', full_name: '', phone: '', badge: undefined }
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    const userData = { ...formData.value }
    // Si no hay badge seleccionado, asignamos null
    if (!userData.badge) {
      userData.badge = null
    }
    emit('saved', userData)
  } finally {
    isSubmitting.value = false
  }
}
</script>