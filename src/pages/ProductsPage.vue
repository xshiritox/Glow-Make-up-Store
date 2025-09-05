<template>
  <div class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
        <div class="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-radial from-white/10 to-transparent rounded-full"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Nuestros Productos
          </h1>
          <p class="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Descubre una amplia variedad de productos de nuestra comunidad. Encuentra lo que necesitas o vende lo que ya no usas.
          </p>
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

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="container mx-auto">
        <!-- Filters -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Filtros de búsqueda</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
          <div class="relative">
            <input
              v-model="searchInput"
              @input="handleSearch"
              type="text"
              placeholder="Buscar productos..."
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm hover:shadow-md"
            />
            <Search class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
          <select
            v-model="selectedCategoryLocal"
            @change="handleCategoryChange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Price Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Precio</label>
          <select
            v-model="priceRange"
            @change="handlePriceFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Cualquier precio</option>
            <option value="0-100000">Hasta $100,000</option>
            <option value="100000-500000">$100,000 - $500,000</option>
            <option value="500000-1000000">$500,000 - $1,000,000</option>
            <option value="1000000-5000000">$1,000,000 - $5,000,000</option>
            <option value="5000000+">Más de $5,000,000</option>
          </select>
        </div>

        <!-- Sort -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
          <select
            v-model="sortByLocal"
            @change="handleSortChange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="created_at">Más recientes</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>
    </div>

      </div>
      
      <div class="container mx-auto">
        <!-- Results Info -->
        <div class="flex justify-between items-center mb-6">
          <p class="text-gray-600">
            Mostrando {{ filteredProducts.length }} productos
            <span v-if="searchQuery">de "{{ searchQuery }}"</span>
            <span v-if="selectedCategory">en {{ selectedCategory }}</span>
          </p>
          
          <router-link
            v-if="isAuthenticated"
            to="/post-product"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus class="w-4 h-4" />
            Publicar Producto
          </router-link>
        </div>

        <!-- Products Grid -->
        <div v-if="loading">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div v-for="n in 8" :key="n" class="animate-pulse bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div class="bg-gray-200 rounded-xl h-48 mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="h-8 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="mt-12 text-center py-16 bg-gray-50 rounded-2xl">
          <div class="max-w-md mx-auto">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 mb-4">
              <Package class="h-10 w-10 text-primary-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
            <p class="text-gray-600 mb-6">Intenta ajustar tus filtros de búsqueda o vuelve a intentarlo más tarde.</p>
            <button 
              @click="resetFilters"
              class="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Restablecer filtros
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            class="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Package, Plus } from 'lucide-vue-next'
import ProductCard from '../components/ProductCard.vue'
import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'

const route = useRoute()
const { isAuthenticated } = useAuth()
const { 
  getProducts, 
  filteredProducts, 
  loading, 
  categories, 
  searchQuery, 
  selectedCategory,
  searchProducts, 
  filterByCategory, 
  setSortBy,
  setPriceRange 
} = useProducts()

const searchInput = ref('')
const selectedCategoryLocal = ref('')
const sortByLocal = ref('created_at')
const priceRange = ref('')

const handleSearch = () => {
  searchProducts(searchInput.value)
}

const handleCategoryChange = () => {
  filterByCategory(selectedCategoryLocal.value)
}

const handleSortChange = () => {
  setSortBy(sortByLocal.value)
}

const handlePriceFilter = () => {
  setPriceRange(priceRange.value)
}

const resetFilters = () => {
  searchInput.value = ''
  selectedCategoryLocal.value = ''
  sortByLocal.value = 'created_at'
  priceRange.value = ''
  
  // Reset all filters
  searchProducts('')
  filterByCategory('')
  setSortBy('created_at')
  setPriceRange('')
}

// Initialize from route params
onMounted(async () => {
  await getProducts()
  
  // Check for search or category from route query
  if (route.query.search) {
    searchInput.value = route.query.search as string
    searchProducts(searchInput.value)
  }
  
  if (route.query.category) {
    selectedCategoryLocal.value = route.query.category as string
    filterByCategory(selectedCategoryLocal.value)
  }
})

// Watch for route changes
watch(() => route.query, (newQuery) => {
  if (newQuery.search) {
    searchInput.value = newQuery.search as string
    searchProducts(searchInput.value)
  }
  
  if (newQuery.category) {
    selectedCategoryLocal.value = newQuery.category as string
    filterByCategory(selectedCategoryLocal.value)
  }
}, { immediate: true })
</script>