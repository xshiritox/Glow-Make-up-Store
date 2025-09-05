import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

// Mock products data
const mockProducts = ref([
  {
    id: '1',
    title: 'iPhone 14 Pro Max 256GB',
    description: 'iPhone en excelente estado, poco uso, incluye cargador original y caja.',
    price: 4500000,
    category: 'Electrónicos',
    condition: 'usado',
    images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
    location: 'Bogotá',
    user_id: '1',
    status: 'active',
    featured: true,
    views: 125,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      full_name: 'Usuario Demo',
      avatar_url: null,
      badge: 'vip'
    }
  },
  {
    id: '2',
    title: 'MacBook Air M2 2022',
    description: 'Laptop en perfecto estado, ideal para trabajo y estudio.',
    price: 6800000,
    category: 'Electrónicos',
    condition: 'nuevo',
    images: ['https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg'],
    location: 'Medellín',
    user_id: '1',
    status: 'active',
    featured: false,
    views: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      full_name: 'Usuario Demo',
      avatar_url: null,
      badge: 'vip'
    }
  },
  {
    id: '3',
    title: 'Samsung Galaxy S23 Ultra',
    description: 'Teléfono nuevo en caja, nunca usado, con todos los accesorios.',
    price: 3200000,
    category: 'Electrónicos',
    condition: 'nuevo',
    images: ['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'],
    location: 'Cali',
    user_id: '1',
    status: 'active',
    featured: false,
    views: 56,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      full_name: 'Usuario Demo',
      avatar_url: null,
      badge: 'colaborador'
    }
  }
])

const products = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('created_at')
const priceRange = ref('')

export const useProducts = () => {
  const toast = useToast()

  const categories = [
    'Electrónicos',
    'Hogar y Jardín',
    'Moda y Belleza',
    'Deportes',
    'Libros y Música',
    'Otros'
  ]

  const filteredProducts = computed(() => {
    let filtered = [...mockProducts.value]

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query)
      )
    }

    if (selectedCategory.value) {
      filtered = filtered.filter(product => product.category === selectedCategory.value)
    }
    
    if (priceRange.value) {
      if (priceRange.value.endsWith('+')) {
        const min = Number(priceRange.value.replace('+', ''))
        filtered = filtered.filter(product => {
          const price = Number(product.price)
          return !isNaN(price) && price >= min
        })
      } else {
        const [min, max] = priceRange.value.split('-').map(Number)
        filtered = filtered.filter(product => {
          const price = Number(product.price)
          return !isNaN(price) && price >= min && price <= max
        })
      }
    }

    filtered.sort((a, b) => {
      if (sortBy.value === 'price_asc') return a.price - b.price
      if (sortBy.value === 'price_desc') return b.price - a.price
      if (sortBy.value === 'created_at') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return 0
    })

    return filtered
  })

  const getProducts = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      products.value = mockProducts.value
      return mockProducts.value
    } catch (error: any) {
      toast.error('Error al cargar productos')
      return []
    } finally {
      loading.value = false
    }
  }

  const getProduct = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockProducts.value.find(p => p.id === id) || null
    } catch (error: any) {
      toast.error('Error al cargar el producto')
      return null
    }
  }

  const createProduct = async (productData: any) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newProduct = {
        ...productData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0,
        status: 'active',
        profiles: {
          full_name: 'Usuario Demo',
          avatar_url: null,
          badge: 'vip'
        }
      }
      
      mockProducts.value.unshift(newProduct)
      toast.success('¡Producto publicado exitosamente!')
      return newProduct
    } catch (error: any) {
      toast.error('Error al publicar el producto')
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id: string, updates: any) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const productIndex = mockProducts.value.findIndex(p => p.id === id)
      if (productIndex > -1) {
        mockProducts.value[productIndex] = {
          ...mockProducts.value[productIndex],
          ...updates,
          updated_at: new Date().toISOString()
        }
        toast.success('Producto actualizado exitosamente')
        return mockProducts.value[productIndex]
      }
      
      throw new Error('Producto no encontrado')
    } catch (error: any) {
      toast.error('Error al actualizar el producto')
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id: string) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const productIndex = mockProducts.value.findIndex(p => p.id === id)
      if (productIndex > -1) {
        mockProducts.value.splice(productIndex, 1)
        toast.success('Producto eliminado exitosamente')
        return true
      }
      
      throw new Error('Producto no encontrado')
    } catch (error: any) {
      toast.error('Error al eliminar el producto')
      return false
    } finally {
      loading.value = false
    }
  }

  const searchProducts = (query: string) => {
    searchQuery.value = query
  }

  const filterByCategory = (category: string) => {
    selectedCategory.value = category
  }

  const setSortBy = (sort: string) => {
    sortBy.value = sort
  }

  const setPriceRange = (range: string) => {
    priceRange.value = range
  }

  return {
    products: computed(() => mockProducts.value),
    filteredProducts,
    loading: computed(() => loading.value),
    categories,
    searchQuery: computed(() => searchQuery.value),
    selectedCategory: computed(() => selectedCategory.value),
    sortBy: computed(() => sortBy.value),
    priceRange: computed(() => priceRange.value),
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterByCategory,
    setSortBy,
    setPriceRange
  }
}