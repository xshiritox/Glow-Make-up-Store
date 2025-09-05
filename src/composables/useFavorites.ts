import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

// Mock favorites data
const mockFavorites = ref<any[]>([])

const favorites = ref<any[]>([])
const loading = ref(false)

export const useFavorites = () => {
  const toast = useToast()

  const userFavorites = computed(() => mockFavorites.value)

  const loadFavorites = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      favorites.value = mockFavorites.value
    } catch (error: any) {
      toast.error('Error al cargar favoritos')
    } finally {
      loading.value = false
    }
  }

  const addToFavorites = async (type: 'product' | 'property' | 'service', id: string) => {
    try {
      const favoriteData: any = {
        id: Date.now().toString(),
        user_id: '1',
        created_at: new Date().toISOString()
      }

      if (type === 'product') favoriteData.product_id = id
      else if (type === 'property') favoriteData.property_id = id
      else if (type === 'service') favoriteData.service_id = id

      mockFavorites.value.push(favoriteData)
      toast.success('Agregado a favoritos')
      return true
    } catch (error: any) {
      toast.error('Error al agregar a favoritos')
      return false
    }
  }

  const removeFromFavorites = async (favoriteId: string) => {
    try {
      const index = mockFavorites.value.findIndex(f => f.id === favoriteId)
      if (index > -1) {
        mockFavorites.value.splice(index, 1)
        toast.success('Eliminado de favoritos')
        return true
      }
      return false
    } catch (error: any) {
      toast.error('Error al eliminar de favoritos')
      return false
    }
  }

  const isFavorite = (type: 'product' | 'property' | 'service', id: string) => {
    return mockFavorites.value.some(fav => {
      if (type === 'product') return fav.product_id === id
      if (type === 'property') return fav.property_id === id
      if (type === 'service') return fav.service_id === id
      return false
    })
  }

  return {
    favorites: userFavorites,
    loading: computed(() => loading.value),
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  }
}