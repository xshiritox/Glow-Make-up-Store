<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="messages.length === 0" class="text-center py-8">
      <component 
        :is="type === 'inbox' ? Inbox : Send" 
        class="w-12 h-12 text-gray-400 mx-auto mb-4" 
      />
      <p class="text-gray-600">
        {{ type === 'inbox' ? 'No tienes mensajes recibidos' : 'No has enviado ningún mensaje' }}
      </p>
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="[ 
          'border rounded-lg p-4 transition-all hover:shadow-md group',
          !message.read ? 'border-primary-300 bg-primary-50' : 'border-gray-200'
        ]"
      >
        <div class="flex justify-between items-start">
          <div 
            class="flex-1 min-w-0 cursor-pointer"
            @click="openMessage(message)"
          >
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-medium text-gray-900 truncate">
                {{ type === 'inbox' 
                  ? message.sender?.full_name || 'Usuario' 
                  : message.recipient?.full_name || 'Destinatario'
                }}
              </h3>
              <span class="text-xs text-gray-500">
                {{ formatDate(message.created_at) }}
              </span>
            </div>
            <p class="text-sm font-medium text-gray-900 mt-1">
              {{ message.subject }}
            </p>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">
              {{ message.content }}
            </p>
            
            <div class="flex justify-between items-center mt-2">
              <div v-if="message.product || message.property || message.service" class="flex-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ getItemType(message) }}
                </span>
                <span class="ml-2 text-sm text-gray-600">
                  {{ getItemTitle(message) }}
                </span>
              </div>
              
              <div class="flex items-center gap-2">
                <button
                  v-if="type === 'inbox'"
                  @click.stop="replyToMessage(message)"
                  class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary-600 transition-opacity"
                  title="Responder"
                >
                  <Reply class="w-4 h-4" />
                </button>
                
                <button
                  @click.stop="confirmDelete(message.id)"
                  :disabled="isDeleting[message.id]"
                  class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  :title="isDeleting[message.id] ? 'Eliminando...' : 'Eliminar mensaje'"
                >
                  <Trash2 v-if="!isDeleting[message.id]" class="w-4 h-4" />
                  <span v-else class="loading loading-spinner loading-xs"></span>
                </button>
              </div>
            </div>
            <div v-if="type === 'inbox' && !message.read" class="ml-1">
              <span class="inline-flex items-center justify-center w-2 h-2 rounded-full bg-primary-600"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineEmits } from 'vue'
import { useMessages } from '../composables/useMessages'
import { useToast } from 'vue-toastification'
import { Trash2, Inbox, Send, Reply } from 'lucide-vue-next'

const emit = defineEmits(['message-opened', 'reply-to-message'])

const props = defineProps({
  type: {
    type: String,
    default: 'inbox',
    validator: (value: string) => ['inbox', 'sent'].includes(value)
  }
})

const toast = useToast()
const { 
  messages, 
  loading, 
  loadMessages, 
  markAsRead, 
  deleteMessage, 
  setActiveMessageType 
} = useMessages()

// Actualizar el tipo de mensaje activo cuando cambie la prop
watch(() => props.type, (newType) => {
  if (newType === 'inbox' || newType === 'sent') {
    setActiveMessageType(newType)
  }
}, { immediate: true })

const getItemType = (message: any) => {
  if (message.product_id) return 'Producto'
  if (message.property_id) return 'Propiedad'
  if (message.service_id) return 'Servicio'
  return ''
}

const getItemTitle = (message: any) => {
  if (message.products) return message.products.title
  if (message.properties) return message.properties.title
  if (message.services) return message.services.title
  return ''
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const openMessage = (message: any) => {
  // Marcar como leído si es un mensaje entrante
  if (props.type === 'inbox' && !message.read) {
    markAsRead(message.id)
  }
  
  // Emitir el evento para abrir el mensaje en el modal
  emit('message-opened', message)
}

// Función para manejar la acción de responder a un mensaje
const replyToMessage = (message: any) => {
  // Emitir el evento con los datos necesarios para la respuesta
  emit('reply-to-message', {
    recipientId: message.sender_id,
    recipientName: message.sender?.full_name || 'Usuario',
    isReply: true,
    originalMessage: message
  })
}

const isDeleting = ref<{[key: string]: boolean}>({});

const confirmDelete = async (messageId: string) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este mensaje? Esta acción no se puede deshacer.')) {
    return;
  }

  isDeleting.value[messageId] = true;
  
  try {
    const success = await deleteMessage(messageId);
    
    if (success) {
      toast.success('Mensaje eliminado correctamente');
      
      // Actualizar la lista de mensajes
      await loadMessages();
    }
  } catch (error: any) {
    console.error('Error al eliminar mensaje:', error);
    
    // Mostrar mensaje de error específico si está disponible
    const errorMessage = error.message || 'Ocurrió un error al eliminar el mensaje';
    
    // Si es un error de CORS, mostrar un mensaje más amigable
    if (error.message?.includes('Failed to fetch')) {
      toast.error('Error de conexión. Por favor, verifica tu conexión a internet.');
    } else {
      toast.error(errorMessage);
    }
  } finally {
    isDeleting.value[messageId] = false;
  }
}

// Cargar mensajes al montar el componente
onMounted(() => {
  loadMessages()
})
</script>
