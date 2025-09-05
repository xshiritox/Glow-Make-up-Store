<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ isReply ? 'Responder mensaje' : 'Enviar Mensaje' }}
        </h3>
        <button @click="close" class="text-gray-400 hover:text-gray-600">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 -mr-2">
        <!-- Mostrar mensaje original al que se responde -->
        <div v-if="isReply && originalMessage" class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h4 class="font-medium text-gray-900">
                  {{ originalMessage.sender?.full_name || 'Usuario' }}
                </h4>
                <span class="text-xs text-gray-500">
                  {{ formatDate(originalMessage.created_at) }}
                </span>
              </div>
              <p class="text-sm font-medium text-gray-900 mt-1">
                {{ originalMessage.subject }}
              </p>
              <p class="text-sm text-gray-700 mt-2 whitespace-pre-line">
                {{ originalMessage.content }}
              </p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="!isReply">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Para: {{ recipientName }}
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Asunto
            </label>
            <input
              v-model="form.subject"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              :placeholder="defaultSubject"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mensaje *
            </label>
            <textarea
              v-model="form.content"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Escribe tu mensaje aquí..."
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
              :disabled="loading || !form.content.trim()"
              class="btn-primary"
            >
              <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
              <Send v-else class="w-4 h-4" />
              {{ loading ? 'Enviando...' : 'Enviar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { X, Loader2, Send } from 'lucide-vue-next'
import { useMessages } from '../composables/useMessages'
import { useToast } from 'vue-toastification'

interface Message {
  id?: string
  sender_id?: string
  recipient_id?: string
  subject?: string
  content?: string
  created_at?: string
  sender?: {
    full_name?: string
    avatar_url?: string
  }
  product_id?: string
  property_id?: string
  service_id?: string
  product?: any
  property?: any
  service?: any
}

interface Props {
  isOpen: boolean
  recipientId?: string
  recipientName?: string
  itemType?: 'product' | 'property' | 'service'
  itemId?: string
  itemTitle?: string
  // Nuevas propiedades para respuestas
  isReply?: boolean
  originalMessage?: Message | null
}

const props = withDefaults(defineProps<Props>(), {
  isReply: false,
  originalMessage: null
})

const emit = defineEmits(['close', 'sent'])

const { sendMessage, loading } = useMessages()
const toast = useToast()

const form = reactive({
  subject: '',
  content: ''
})

// Formatear fecha para mostrar en el mensaje de respuesta
const formatDate = (dateString?: string | null) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const defaultSubject = computed(() => {
  // Si es una respuesta, agregar 'Re:' al asunto original
  if (props.isReply && props.originalMessage?.subject) {
    return props.originalMessage.subject.startsWith('Re:')
      ? props.originalMessage.subject
      : `Re: ${props.originalMessage.subject}`
  }
  
  // Si es un mensaje sobre un ítem
  if (props.itemTitle) {
    return `Consulta sobre: ${props.itemTitle}`
  }
  
  return 'Consulta desde ColombiaMarket'
})

// Inicializar el formulario cuando se abre el modal
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    // Si es una respuesta, inicializar el contenido con el formato de cita
    if (props.isReply && props.originalMessage) {
      const originalSender = props.originalMessage.sender?.full_name || 'Usuario'
      const originalDate = formatDate(props.originalMessage.created_at || '')
      
      form.content = `\n\n---\n*Mensaje original de ${originalSender} (${originalDate}):*\n${props.originalMessage.content}`
      
      // Si hay un ítem relacionado, incluirlo en la respuesta
      if (props.originalMessage.product) {
        form.content = `*Producto: ${props.originalMessage.product.title}*${form.content}`
      } else if (props.originalMessage.property) {
        form.content = `*Propiedad: ${props.originalMessage.property.title}*${form.content}`
      } else if (props.originalMessage.service) {
        form.content = `*Servicio: ${props.originalMessage.service.title}*${form.content}`
      }
    } else {
      form.content = ''
    }
    
    // Establecer el asunto por defecto
    form.subject = defaultSubject.value
  } else {
    // Limpiar el formulario al cerrar
    form.subject = ''
    form.content = ''
  }
})

const close = () => {
  form.subject = ''
  form.content = ''
  emit('close')
}

const handleSubmit = async () => {
  try {
    // Determinar el ID del destinatario
    let recipientId = props.recipientId
    let itemId = props.itemId
    let itemType = props.itemType
    
    // Si es una respuesta, el destinatario es el remitente del mensaje original
    if (props.isReply && props.originalMessage) {
      recipientId = props.originalMessage.sender_id
      
      // Si el mensaje original tenía un ítem asociado, incluirlo en la respuesta
      if (props.originalMessage.product_id) {
        itemId = props.originalMessage.product_id
        itemType = 'product'
      } else if (props.originalMessage.property_id) {
        itemId = props.originalMessage.property_id
        itemType = 'property'
      } else if (props.originalMessage.service_id) {
        itemId = props.originalMessage.service_id
        itemType = 'service'
      }
    }
    
    if (!recipientId) {
      throw new Error('No se pudo determinar el destinatario del mensaje')
    }
    
    const messageData: any = {
      recipient_id: recipientId,
      subject: form.subject || defaultSubject.value,
      content: form.content
      // Nota: La funcionalidad de respuestas (parent_message_id) está deshabilitada
      // ya que la columna no existe en la base de datos
    }
    
    // Incluir información del ítem si existe
    if (itemType && itemId) {
      if (itemType === 'product') {
        messageData.product_id = itemId
      } else if (itemType === 'property') {
        messageData.property_id = itemId
      } else if (itemType === 'service') {
        messageData.service_id = itemId
      }
    }
    
    console.log('Enviando mensaje:', messageData)
    const success = await sendMessage(messageData)
    
    if (success) {
      toast.success('Mensaje enviado correctamente')
      emit('sent')
      close()
    }
  } catch (error: any) {
    console.error('Error al enviar el mensaje:', error)
    toast.error(error.message || 'Ocurrió un error al enviar el mensaje')
  }
}

watch(() => props.isOpen, (newValue) => {
  if (newValue && props.itemTitle) {
    form.subject = defaultSubject.value
  } else if (!newValue) {
    form.subject = ''
    form.content = ''
  }
})
</script>