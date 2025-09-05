import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

const isConnected = ref(true) // Always connected in mock mode
const connectionError = ref<string | null>(null)

export const useSupabase = () => {
  const toast = useToast()

  const checkConnection = async () => {
    try {
      // Mock connection check
      await new Promise(resolve => setTimeout(resolve, 100))
      isConnected.value = true
      connectionError.value = null
    } catch (error: any) {
      connectionError.value = error.message
      isConnected.value = false
      toast.error('Error de conexión simulado')
    }
  }

  const initializeDatabase = async () => {
    try {
      await checkConnection()
      
      if (isConnected.value) {
        toast.success('Modo demo activado - datos locales')
      }
    } catch (error: any) {
      console.error('Database initialization error:', error)
      toast.error('Error al inicializar la base de datos')
    }
  }

  return {
    isConnected: computed(() => isConnected.value),
    connectionError: computed(() => connectionError.value),
    checkConnection,
    initializeDatabase
  }
}