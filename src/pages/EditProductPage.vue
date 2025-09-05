<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Editar Producto</h1>
        <p class="text-gray-600">Actualiza la información de tu producto</p>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando producto...</p>
      </div>

      <div v-else-if="!product" class="text-center py-8">
        <p class="text-gray-600">Producto no encontrado</p>
        <router-link to="/profile" class="btn-primary mt-4">
          Volver al Perfil
        </router-link>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Formulario similar al de PostProductPage pero con datos precargados -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Título del producto *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
              Precio (COP) *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                id="price"
                v-model="form.price"
                type="number"
                required
                min="0"
                step="1000"
                class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- Más campos del formulario... -->
        <div class="flex flex-col sm:flex-row gap-4 justify-end">
          <router-link
            to="/profile"
            class="btn-outline"
          >
            Cancelar
          </router-link>
          
          <button
            type="submit"
            :disabled="saving"
            class="btn-primary"
          >
            <Loader2 v-if="saving" class="animate-spin w-4 h-4" />
            {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const product = ref<any>(null)
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  title: '',
  price: null as number | null,
  category: '',
  condition: '',
  location: '',
  description: ''
})

const loadProduct = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error

    product.value = data
    
    // Precargar formulario
    form.title = data.title
    form.price = data.price
    form.category = data.category
    form.condition = data.condition
    form.location = data.location
    form.description = data.description
  } catch (error) {
    console.error('Error loading product:', error)
    toast.error('Error al cargar el producto')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  try {
    const { error } = await supabase
      .from('products')
      .update({
        title: form.title,
        price: form.price,
        category: form.category,
        condition: form.condition,
        location: form.location,
        description: form.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', route.params.id)

    if (error) throw error

    toast.success('Producto actualizado exitosamente')
    router.push('/profile')
  } catch (error: any) {
    console.error('Error updating product:', error)
    toast.error('Error al actualizar el producto')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>