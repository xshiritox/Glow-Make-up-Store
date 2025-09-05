<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden card-hover">
    <!-- Product Image -->
    <div class="relative h-48 bg-gray-100 overflow-hidden">
      <div v-if="!product.images?.[0]" class="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
        <IconImageOff class="w-12 h-12 mb-2" />
        <span class="text-sm">Sin imagen disponible</span>
      </div>
      <img 
        v-else 
        :src="product.images[0]" 
        :alt="`${product.title} - ${product.condition} en Kroma Store`" 
        class="w-full h-full object-cover"
        :title="`${product.title} - ${product.condition === 'nuevo' ? 'Nuevo' : 'Usado'} en Kroma Store`"
      >
      <!-- Favorite Button -->
      <div class="absolute top-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100" @click.stop="toggleFavorite">
        <IconHeart 
          :class="[isFavoriteProduct ? 'text-red-500 fill-current' : 'text-gray-400']" 
          class="w-5 h-5 transition-colors duration-200" 
        />
      </div>
      <div class="absolute top-2 left-2 flex flex-col gap-2">
        <div v-if="product.featured">
          <span
            class="bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
          >
            <Star class="w-3 h-3" />
            Destacado
          </span>
        </div>
        <div>
          <span
            :class="conditionClass"
            class="px-2 py-1 rounded-full text-xs font-medium text-white"
          >
            {{ conditionText }}
          </span>
        </div>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-semibold text-gray-900 truncate">{{ product.title }}</h3>
        <span class="text-lg font-bold text-primary-600">
          ${{ formatPrice(product.price) }}
        </span>
      </div>

      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div class="flex items-center text-sm text-gray-500">
          <IconMapPin class="w-4 h-4 mr-1" />
          <span>{{ product.location || 'Ubicación no especificada' }}</span>
        </div>
        <div class="flex items-center text-sm text-gray-500">
          <IconClock class="w-4 h-4 mr-1" />
          <span>{{ formatDate(product.created_at) }}</span>
        </div>
      </div>

      <!-- Seller Info -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <IconStar class="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span class="text-gray-600 text-sm">5.0</span>
          <span class="text-gray-400 text-sm ml-1"></span>
        </div>
        <span class="text-sm text-gray-600">{{ product.profiles?.full_name }}</span>
      </div>
        
      <div v-if="product.profiles?.badge" class="flex items-center">
        <span
          :class="badgeClass"
          class="px-2 py-1 rounded-full text-xs font-medium text-white"
        >
          {{ badgeText }}
        </span>
      </div>

      <!-- Action Button -->
      <div class="mt-4">
        <router-link
          :to="{ name: 'product-detail', params: { id: product.id } }"
          class="w-full btn-primary justify-center"
        >
          Ver Detalles
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { 
  Star as IconStar, 
  MapPin as IconMapPin, 
  Clock as IconClock, 
  ImageOff as IconImageOff, 
  Heart as IconHeart 
} from 'lucide-vue-next'
import { useFavorites } from '@/composables/useFavorites'

interface Props {
  product: any
}

const props = defineProps<Props>()
const { 
  addToFavorites, 
  removeFromFavorites, 
  isFavorite, 
  loadFavorites, 
  favorites 
} = useFavorites()
const isFavoriteProduct = ref(false)

// Watch for changes in favorites and update the local state
watch(favorites, () => {
  isFavoriteProduct.value = isFavorite('product', props.product.id)
}, { immediate: true })

// Load favorites on component mount
onMounted(async () => {
  try {
    await loadFavorites()
    isFavoriteProduct.value = isFavorite('product', props.product.id)
  } catch (error) {
    console.error('Error loading favorites:', error)
  }
})

const toggleFavorite = async (event: Event) => {
  event.stopPropagation()
  
  try {
    if (isFavoriteProduct.value) {
      // Find the favorite to remove it
      const favorite = favorites.value.find(fav => fav.product_id === props.product.id)
      if (favorite) {
        await removeFromFavorites(favorite.id)
      }
    } else {
      await addToFavorites('product', props.product.id)
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}

const conditionClass = computed(() => {
  switch (props.product.condition) {
    case 'nuevo':
      return 'bg-green-500'
    case 'usado':
      return 'bg-yellow-500'
    case 'reacondicionado':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
})

const conditionText = computed(() => {
  switch (props.product.condition) {
    case 'nuevo':
      return 'Nuevo'
    case 'usado':
      return 'Usado'
    case 'reacondicionado':
      return 'Reacondicionado'
    default:
      return 'N/A'
  }
})

const badgeClass = computed(() => {
  switch (props.product.profiles?.badge) {
    case 'destacado':
      return 'badge-destacado'
    case 'colaborador':
      return 'badge-colaborador'
    case 'vip':
      return 'badge-vip'
    case 'moderador':
      return 'badge-moderador'
    case 'admin':
      return 'badge-admin'
    default:
      return 'bg-gray-500'
  }
})

const badgeText = computed(() => {
  switch (props.product.profiles?.badge) {
    case 'destacado':
      return 'Destacado'
    case 'colaborador':
      return 'Colaborador'
    case 'vip':
      return 'VIP'
    case 'moderador':
      return 'Moderador'
    case 'admin':
      return 'Admin'
    default:
      return ''
  }
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO').format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CO', { 
    day: 'numeric', 
    month: 'short' 
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  display: -webkit-flex;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>