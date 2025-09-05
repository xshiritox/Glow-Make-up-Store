<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Reportar Contenido</h3>
        <button @click="close" class="text-gray-400 hover:text-gray-600">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Motivo del reporte *
          </label>
          <select
            v-model="form.reason"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Selecciona un motivo</option>
            <option value="spam">Spam o contenido repetitivo</option>
            <option value="inappropriate">Contenido inapropiado</option>
            <option value="fake">Información falsa</option>
            <option value="scam">Posible estafa</option>
            <option value="copyright">Violación de derechos de autor</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Descripción adicional
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Proporciona más detalles sobre el problema..."
          ></textarea>
        </div>

        <div class="flex gap-3 justify-end">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading || !form.reason"
            class="btn-primary"
          >
            <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
            {{ loading ? 'Enviando...' : 'Enviar Reporte' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import { useReports } from '../composables/useReports'

interface Props {
  isOpen: boolean
  type: 'product' | 'property' | 'service' | 'user'
  targetId: string
  userId?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'reported'])

const { createReport, loading } = useReports()

const form = reactive({
  reason: '',
  description: ''
})

const close = () => {
  form.reason = ''
  form.description = ''
  emit('close')
}

const handleSubmit = async () => {
  const reportData: any = {
    reason: form.reason,
    description: form.description
  }

  if (props.type === 'user') {
    reportData.reported_user_id = props.userId
  } else if (props.type === 'product') {
    reportData.product_id = props.targetId
  } else if (props.type === 'property') {
    reportData.property_id = props.targetId
  } else if (props.type === 'service') {
    reportData.service_id = props.targetId
  }

  const success = await createReport(reportData)
  
  if (success) {
    emit('reported')
    close()
  }
}

watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    form.reason = ''
    form.description = ''
  }
})
</script>