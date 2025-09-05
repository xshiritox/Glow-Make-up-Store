import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

// Mock user data
const mockUser = {
  id: '1',
  email: 'usuario@ejemplo.com',
  full_name: 'Usuario Demo',
  phone: '+57 300 123 4567',
  location: 'Bogotá',
  badge: 'vip' as const,
  verified: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const user = ref<any>(null)
const profile = ref<any>(null)
const loading = ref(false)

export const useAuth = () => {
  const toast = useToast()

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.badge === 'admin')
  const isModerator = computed(() => profile.value?.badge === 'moderador' || profile.value?.badge === 'admin')
  const isVip = computed(() => profile.value?.badge === 'vip')
  const isColaborador = computed(() => profile.value?.badge === 'colaborador')
  const isDestacado = computed(() => profile.value?.badge === 'destacado')
  const hasNoBadge = computed(() => !profile.value?.badge)

  const signUp = async (email: string, password: string, fullName: string) => {
    loading.value = true
    try {
      // Simulate successful registration
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newUser = {
        ...mockUser,
        email,
        full_name: fullName,
        id: Date.now().toString()
      }
      
      toast.success('¡Cuenta creada exitosamente!')
      return { data: { user: newUser }, error: null }
    } catch (error: any) {
      toast.error('Error al crear la cuenta')
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    try {
      // Simulate login
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      user.value = mockUser
      profile.value = mockUser
      
      toast.success('¡Bienvenido de vuelta!')
      return { data: { user: mockUser }, error: null }
    } catch (error: any) {
      toast.error('Error al iniciar sesión')
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      user.value = null
      profile.value = null
      
      toast.success('Sesión cerrada exitosamente')
    } catch (error: any) {
      console.error('Error en signOut:', error)
    } finally {
      loading.value = false
    }
  }

  const getProfile = async () => {
    if (!user.value) return null
    profile.value = user.value
    return profile.value
  }

  const updateProfile = async (updates: any) => {
    if (!user.value) return null

    try {
      Object.assign(profile.value, updates, { updated_at: new Date().toISOString() })
      toast.success('Perfil actualizado exitosamente')
      return profile.value
    } catch (error: any) {
      toast.error('Error al actualizar el perfil')
      return null
    }
  }

  const initialize = async () => {
    try {
      // Auto-login for demo purposes
      user.value = mockUser
      profile.value = mockUser
    } catch (error) {
      console.error('Error en initialize auth:', error)
    }
  }

  const handleInvalidSession = async () => {
    user.value = null
    profile.value = null
  }

  return {
    user: computed(() => user.value),
    profile: computed(() => profile.value),
    loading: computed(() => loading.value),
    isAuthenticated,
    isAdmin,
    isModerator,
    isVip,
    isColaborador,
    isDestacado,
    hasNoBadge,
    signUp,
    signIn,
    signOut,
    getProfile,
    updateProfile,
    initialize,
    handleInvalidSession
  }
}