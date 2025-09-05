<template>
  <div class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
        <div class="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-radial from-white/10 to-transparent rounded-full"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div class="text-center max-w-4xl mx-auto">
          
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Descubre y compra en
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary-200 to-white">Glow Make-up Store</span>
          </h1>
          
          <p class="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Descubre una tienda en línea segura, rápida y fácil de usar. Explora nuestro catálogo y encuentra justo lo que necesitas, con la comodidad de comprar desde cualquier lugar.
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto">
            <div class="relative shadow-2xl rounded-xl overflow-hidden">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search class="w-5 h-5 text-gray-400" />
              </div>
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="¿Qué estás buscando?"
                class="w-full px-12 py-4 text-gray-900 focus:outline-none text-lg"
              />
              <button
                @click="handleSearch"
                class="absolute right-2 top-2 px-6 py-2.5 bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Wave divider -->
      <div class="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16 md:h-24">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512,52,583,67.3c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                opacity="0.25" class="fill-white"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,141.56,72.41,11.5,20.05,17.58,40.49,21.91,64.18V0Z" 
                opacity="0.5" class="fill-white"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,86c57.52-8.08,108.87-34.5,145.24-68.21,14-12.93,27.95-25.77,43.56-34.69V0Z" 
                class="fill-white"></path>
        </svg>
      </div>
    </section>

    <!-- Recent Listings Section -->
    <section class="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden opacity-10">
        <div class="absolute -right-1/4 -top-1/4 w-full h-full bg-gradient-radial from-primary-500/20 to-transparent rounded-full"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-full mb-4">
            Productos recientes
          </span>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Descubre lo más nuevo</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Las últimas publicaciones de productos de nuestra tienda
          </p>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div class="animate-pulse">
              <div class="bg-gray-200 h-48 w-full"></div>
              <div class="p-4 space-y-3">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded w-full"></div>
                <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                <div class="flex justify-between items-center pt-4">
                  <div class="h-6 bg-gray-200 rounded w-20"></div>
                  <div class="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Listings Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="listing in allListings" 
            :key="`${listing.type}-${listing.id}`"
            class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer"
            @click="navigateToListing(listing)"
          >
            <div class="relative pb-[75%] bg-gray-100 overflow-hidden">
              <img 
                v-if="listing.images?.[0]"
                :src="listing.images[0]" 
                :alt="`${listing.title} - ${listing.type === 'product' ? 'Producto' : listing.type === 'property' ? 'Propiedad' : 'Servicio'} en venta en Kroma Store`"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              >
              <div v-else class="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                <component :is="getTypeIcon(listing.type)" class="w-12 h-12 mb-2" />
                <span class="text-sm">Sin imagen</span>
              </div>
              
              <!-- Type Badge -->
              <div class="absolute top-2 left-2">
                <span :class="getTypeBadgeClass(listing.type)" class="px-2 py-1 rounded-full text-xs font-medium text-white">
                  {{ getTypeLabel(listing.type) }}
                </span>
              </div>
              
              <!-- Featured Badge -->
              <div v-if="listing.featured" class="absolute top-2 right-2">
                <span class="bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star class="w-3 h-3" />
                  Destacado
                </span>
              </div>
              
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span class="text-white font-medium">Ver detalles</span>
              </div>
            </div>
            
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-1 line-clamp-1">{{ listing.title }}</h3>
              <p class="text-sm text-gray-500 mb-2 line-clamp-2 h-10">{{ listing.description }}</p>
              
              <div class="flex items-center justify-between mt-3">
                <span class="text-lg font-bold text-gray-900">
                  ${{ formatPrice(listing.price || listing.price_from) }}
                </span>
                <div class="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin class="w-3 h-3" />
                  <span class="truncate max-w-20">{{ listing.location }}</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>{{ formatDate(listing.created_at) }}</span>
                <span>{{ listing.profiles?.full_name || 'Usuario' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -left-1/4 -bottom-1/4 w-full h-full bg-gradient-radial from-primary-500/5 to-transparent rounded-full"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-full mb-4">
            Nuestras Ventajas
          </span>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir Glow Make-up Store?</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            La plataforma más confiable para compraren Colombia
          </p>
        </div>

        <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          <!-- Feature 1 - Seguridad -->
          <div class="relative group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-100 w-full sm:w-72 md:w-80 flex-1 min-w-[280px] max-w-sm">
            <div class="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Seguridad Total</h3>
            <p class="text-gray-600 mb-4">Procesos de pago seguros y protección de datos garantizada.</p>
            <div class="absolute bottom-6 left-6 w-8 h-0.5 bg-gradient-to-r from-primary-500 to-transparent transition-all duration-300 group-hover:w-12"></div>
          </div>

          <!-- Feature 2 - Facilidad -->
          <div class="relative group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-accent-100 w-full sm:w-72 md:w-80 flex-1 min-w-[280px] max-w-sm">
            <div class="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Compra Fácil</h3>
            <p class="text-gray-600 mb-4">Navegación intuitiva y proceso de compra rápido y sencillo.</p>
            <div class="absolute bottom-6 left-6 w-8 h-0.5 bg-gradient-to-r from-accent-500 to-transparent transition-all duration-300 group-hover:w-12"></div>
          </div>

          <!-- Feature 3 - Calidad -->
          <div class="relative group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-100 w-full sm:w-72 md:w-80 flex-1 min-w-[280px] max-w-sm">
            <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Award class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Calidad Garantizada</h3>
            <p class="text-gray-600 mb-4">Productos seleccionados con los más altos estándares de calidad.</p>
            <div class="absolute bottom-6 left-6 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent transition-all duration-300 group-hover:w-12"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative py-20 bg-gradient-to-br from-primary-700 to-secondary-600 text-white overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
        <div class="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-radial from-white/10 to-transparent rounded-full"></div>
      </div>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6">
          <span class="text-sm font-medium">¡Únete a nuestra tienda!</span>
        </div>
        
        <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          ¿Listo para comenzar a comprar?
        </h2>
        
        <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Únete a miles de usuarios que ya están disfrutando de la mejor experiencia de compra en línea
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <template v-if="!isAuthenticated">
            <router-link
              to="/register"
              class="group relative bg-white text-primary-600 hover:bg-gray-50 font-medium py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 justify-center text-lg hover:shadow-2xl hover:-translate-y-1"
            >
              <span class="relative z-10 flex items-center gap-2">
                <UserPlus class="w-5 h-5" />
                Crear Cuenta Gratis
              </span>
              <span class="absolute inset-0 rounded-xl bg-gradient-to-r from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </router-link>
          </template>
          
          <template v-else>
            <div class="flex flex-col items-center gap-4 w-full">
              <div class="flex flex-wrap gap-4 justify-center w-full">
                
              </div>
              
              <router-link
                to="/how-it-works"
                class="group relative bg-transparent border-2 border-white/20 hover:border-white/40 text-white hover:bg-white/10 font-medium py-4 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 justify-center text-lg w-full sm:w-auto"
              >
                <span class="relative z-10 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Cómo funciona
                </span>
              </router-link>
            </div>
          </template>
        </div>
      </div>
      
      <!-- Wave divider -->
      <div class="absolute bottom-0 left-0 right-0 overflow-hidden rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16 md:h-24">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512,52,583,67.3c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                opacity="0.25" class="fill-white"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,141.56,72.41,11.5,20.05,17.58,40.49,21.91,64.18V0Z" 
                opacity="0.5" class="fill-white"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,86c57.52-8.08,108.87-34.5,145.24-68.21,14-12.93,27.95-25.77,43.56-34.69V0Z" 
                class="fill-white"></path>
        </svg>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { 
  Search, UserPlus, Shield, ShoppingCart, Award, MapPin, Package, Home, Wrench
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { isAuthenticated } = useAuth()

const searchQuery = ref('')
const loading = ref(true)
const allListings = ref<any[]>([])

const formatPrice = (price: number): string => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CO').format(price)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Hoy'
  if (diffDays === 2) return 'Ayer'
  if (diffDays <= 7) return `Hace ${diffDays} días`
  
  return date.toLocaleDateString('es-CO', { 
    day: 'numeric', 
    month: 'short' 
  })
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'product': return Package
    case 'property': return Home
    case 'service': return Wrench
    default: return Package
  }
}

const getTypeBadgeClass = (type: string) => {
  switch (type) {
    case 'product': return 'bg-blue-500'
    case 'property': return 'bg-green-500'
    case 'service': return 'bg-purple-500'
    default: return 'bg-gray-500'
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'product': return 'Producto'
    case 'property': return 'Propiedad'
    case 'service': return 'Servicio'
    default: return 'Producto'
  }
}

const navigateToListing = (listing: any) => {
  switch (listing.type) {
    case 'product':
      router.push(`/product/${listing.id}`)
      break
    case 'property':
      router.push(`/property/${listing.id}`)
      break
    case 'service':
      router.push(`/service/${listing.id}`)
      break
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'products', query: { search: searchQuery.value } })
  }
}

const loadRecentListings = async () => {
  try {
    loading.value = true
    
    // Cargar productos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url,
          badge
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(20)

    if (productsError) throw productsError

    // Cargar propiedades
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url,
          badge
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(20)

    if (propertiesError) throw propertiesError

    // Cargar servicios
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url,
          badge
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(20)

    if (servicesError) throw servicesError

    // Combinar y marcar el tipo
    const combinedListings = [
      ...(products || []).map(item => ({ ...item, type: 'product' })),
      ...(properties || []).map(item => ({ ...item, type: 'property' })),
      ...(services || []).map(item => ({ ...item, type: 'service' }))
    ]

    // Ordenar por fecha de creación (más recientes primero)
    combinedListings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Tomar solo los primeros 24 elementos
    allListings.value = combinedListings.slice(0, 24)
    
  } catch (error) {
    console.error('Error loading recent listings:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRecentListings()
})
</script>