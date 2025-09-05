import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

// Mock messages data
const mockMessages = ref<any[]>([])

const messages = ref<any[]>([])
const conversations = ref<any[]>([])
const loading = ref(false)

export const useMessages = () => {
  const toast = useToast()

  const receivedMessages = computed(() => 
    mockMessages.value.filter(msg => 
      msg.recipient_id === '1' && 
      !msg.deleted_by_recipient
    )
  )
  
  const sentMessages = computed(() => 
    mockMessages.value.filter(msg => 
      msg.sender_id === '1' && 
      !msg.deleted_by_sender
    )
  )
  
  const userMessages = computed(() => 
    activeMessageType.value === 'inbox' ? receivedMessages.value : sentMessages.value
  )
  
  const userConversations = computed(() => conversations.value)
  const unreadCount = computed(() => 
    mockMessages.value.filter(msg => !msg.read && msg.recipient_id === '1').length
  )
  
  const activeMessageType = ref<'inbox' | 'sent'>('inbox')
  
  const setActiveMessageType = (type: 'inbox' | 'sent') => {
    activeMessageType.value = type
  }

  const loadMessages = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      messages.value = mockMessages.value
    } catch (error: any) {
      toast.error('Error al cargar mensajes')
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (messageData: {
    recipient_id: string
    subject?: string
    content: string
    product_id?: string
    property_id?: string
    service_id?: string
  }) => {
    try {
      if (!messageData.content || !messageData.content.trim()) {
        toast.error('El mensaje no puede estar vacío')
        return false
      }

      if (!messageData.recipient_id) {
        toast.error('Debes especificar un destinatario')
        return false
      }

      const newMessage = {
        id: Date.now().toString(),
        sender_id: '1',
        recipient_id: messageData.recipient_id,
        subject: messageData.subject || 'Mensaje desde Kroma',
        content: messageData.content.trim(),
        read: false,
        deleted_by_sender: false,
        deleted_by_recipient: false,
        created_at: new Date().toISOString(),
        sender: {
          full_name: 'Usuario Demo',
          avatar_url: null
        },
        recipient: {
          full_name: 'Destinatario',
          avatar_url: null
        }
      }

      if (messageData.product_id) newMessage.product_id = messageData.product_id
      if (messageData.property_id) newMessage.property_id = messageData.property_id
      if (messageData.service_id) newMessage.service_id = messageData.service_id

      mockMessages.value.unshift(newMessage)
      toast.success('Mensaje enviado correctamente')
      return true
    } catch (error: any) {
      toast.error('Error al enviar el mensaje')
      return false
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const message = mockMessages.value.find(m => m.id === messageId)
      if (message) {
        message.read = true
      }
    } catch (error: any) {
      console.error('Error marking message as read:', error)
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      const messageIndex = mockMessages.value.findIndex(m => m.id === messageId)
      if (messageIndex > -1) {
        mockMessages.value.splice(messageIndex, 1)
        return true
      }
      throw new Error('Mensaje no encontrado')
    } catch (error: any) {
      throw error
    }
  }

  return {
    messages: userMessages,
    receivedMessages,
    sentMessages,
    conversations: userConversations,
    unreadCount,
    loading,
    loadMessages,
    sendMessage,
    markAsRead,
    deleteMessage,
    activeMessageType,
    setActiveMessageType
  }
}