<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Modal de mensaje -->
    <MessageModal
      v-if="showMessageModal"
      :isOpen="showMessageModal"
      :recipient-id="replyData.recipientId"
      :recipient-name="replyData.recipientName"
      :is-reply="replyData.isReply"
      :original-message="replyData.originalMessage"
      @close="showMessageModal = false"
      @sent="handleMessageSent"
    />
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Profile Header -->
      <div class="bg-gradient-to-r from-primary-600 to-secondary-500 px-6 py-8">
        <div class="flex items-center space-x-4">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <IconUser class="w-10 h-10 text-primary-600" />
          </div>
          <div class="text-white">
            <h1 class="text-2xl font-bold">{{ profile?.full_name }}</h1>
            <p class="text-primary-100">{{ profile?.email }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span
                v-if="profile?.badge"
                :class="badgeClass"
                class="px-3 py-1 rounded-full text-sm font-medium text-white"
              >
                {{ badgeText }}
              </span>
              <span v-else class="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                Sin rol asignado
              </span>
              <button 
                v-if="!isVIP"
                disabled
                class="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-400 text-white cursor-not-allowed transition-colors"
                title="Próximamente"
              >
                <IconCrown class="w-4 h-4" />
                VIP (Próximamente)
              </button>
              <span class="text-primary-100 text-sm">
                Miembro desde {{ formatDate(profile?.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Profile Form -->
          <div class="lg:col-span-2">
            <div class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Información Personal</h2>
              
              <form @submit.prevent="handleUpdateProfile" class="space-y-6">
                <div>
                  <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    id="fullName"
                    v-model="form.full_name"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    disabled
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Número de teléfono"
                  />
                </div>

                <div>
                  <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <select
                    id="location"
                    v-model="form.location"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Selecciona tu ciudad</option>
                    <option v-for="city in colombianCities" :key="city" :value="city">
                      {{ city }}
                    </option>
                  </select>
                </div>

                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="loading"
                    class="btn-primary"
                  >
                    <IconLoader2 v-if="loading" class="animate-spin w-4 h-4" />
                    {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Statistics -->
          <div>
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <IconPackage class="w-4 h-4 text-primary-600" />
                    <span class="text-sm text-gray-600">Productos publicados</span>
                  </div>
                  <span class="font-semibold text-gray-900">{{ userStats.products }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <IconHome class="w-4 h-4 text-blue-600" />
                    <span class="text-sm text-gray-600">Propiedades publicadas</span>
                  </div>
                  <span class="font-semibold text-gray-900">{{ userStats.properties }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <IconWrench class="w-4 h-4 text-green-600" />
                    <span class="text-sm text-gray-600">Servicios publicados</span>
                  </div>
                  <span class="font-semibold text-gray-900">{{ userStats.services }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <IconShoppingCart class="w-4 h-4 text-green-600" />
                    <span class="text-sm text-gray-600">Productos vendidos</span>
                  </div>
                  <span class="font-semibold text-gray-900">{{ userStats.sold }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <IconStar class="w-4 h-4 text-yellow-500" />
                    <span class="text-sm text-gray-600">Calificación</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="font-semibold text-gray-900">{{ userStats.rating }}</span>
                    <IconStar class="w-3 h-3 text-yellow-500 fill-current" />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <div class="space-y-3">
                <button
                  @click="handleSignOut"
                  class="w-full btn-outline justify-center"
                >
                  <IconLogOut class="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs for user content -->
    <div class="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div class="border-b border-gray-200 overflow-x-auto">
        <nav class="flex w-max min-w-full">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              'flex-shrink-0 flex items-center',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <component :is="iconComponents[tab.icon]" class="w-4 h-4 mr-1.5" />
            <span class="text-xs sm:text-sm">{{ tab.name }}</span>
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Messages Tab -->
        <div v-if="activeTab === 'messages'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Mis Mensajes</h2>
          </div>
          
          <div class="flex border-b border-gray-200 mb-6">
            <button
              v-for="tab in messageTabs"
              :key="tab.id"
              @click="activeMessageTab = tab.id"
              :class="[
                'flex items-center px-4 py-2 text-sm font-medium border-b-2',
                activeMessageTab === tab.id 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <component :is="iconComponents[tab.icon]" class="w-4 h-4 mr-1.5" />
              {{ tab.name }}
              <span 
                v-if="tab.id === 'inbox' && unreadCount > 0"
                class="ml-1.5 py-0.5 px-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-medium"
              >
                {{ unreadCount }}
              </span>
            </button>
          </div>
          
          <MessagesList 
            :type="activeMessageTab" 
            @message-opened="openMessage"
            @reply-to-message="handleReplyToMessage"
            @toggle-message-type="messageType = $event"
          />
        </div>
        
        <!-- Products Tab -->
        <div v-else-if="activeTab === 'products'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Mis Productos</h2>
            <router-link
              to="/post-product"
              class="btn-primary"
            >
              <IconPlus class="w-4 h-4" />
              Nuevo Producto
            </router-link>
          </div>

          <div v-if="userProducts.length === 0" class="text-center py-8">
            <IconPackage class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No tienes productos publicados</h3>
            <p class="text-gray-600 mb-4">Comienza a vender publicando tu primer producto</p>
            <router-link
              to="/post-product"
              class="btn-primary"
            >
              <IconPlus class="w-4 h-4" />
              Publicar Producto
            </router-link>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="product in userProducts"
              :key="product.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div v-if="!product.images?.[0]" class="w-full h-48 bg-gray-100 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                <IconImageOff class="w-8 h-8 mb-2" />
                <span class="text-sm">Sin imagen</span>
              </div>
              <img
                v-else
                :src="product.images[0]"
                :alt="product.title"
                class="w-full h-48 object-cover rounded-lg"
              />
              <h3 class="font-semibold text-gray-900 mb-1 mt-3">{{ product.title }}</h3>
              <p class="text-primary-600 font-bold mb-2">${{ formatPrice(product.price) }}</p>
              <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <span :class="statusClass(product.status)">{{ statusText(product.status) }}</span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editProduct(product.id)"
                  class="flex-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                >
                  Editar
                </button>
                <button
                  @click="deleteProduct(product.id)"
                  class="flex-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Properties Tab -->
        <div v-if="activeTab === 'properties'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Mis Propiedades</h2>
            <router-link
              to="/post-property"
              class="btn-primary"
            >
              <IconPlus class="w-4 h-4" />
              Nueva Propiedad
            </router-link>
          </div>

          <div v-if="userProperties.length === 0" class="text-center py-8">
            <IconHome class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No tienes propiedades publicadas</h3>
            <p class="text-gray-600 mb-4">Comienza a ofrecer propiedades publicando tu primera propiedad</p>
            <router-link
              to="/post-property"
              class="btn-primary"
            >
              <IconPlus class="w-4 h-4" />
              Publicar Propiedad
            </router-link>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="property in userProperties"
              :key="property.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div v-if="!property.images?.[0]" class="w-full h-48 bg-gray-100 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                <IconImageOff class="w-8 h-8 mb-2" />
                <span class="text-sm">Sin imagen</span>
              </div>
              <img
                v-else
                :src="property.images[0]"
                :alt="property.title"
                class="w-full h-48 object-cover rounded-lg"
              />
              <h3 class="font-semibold text-gray-900 mb-1 mt-3">{{ property.title }}</h3>
              <p class="text-primary-600 font-bold mb-2">${{ formatPrice(property.price) }}</p>
              <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <span :class="statusClass(property.status)">{{ statusText(property.status) }}</span>
                <span class="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                  {{ property.transaction_type === 'venta' ? 'Venta' : 'Alquiler' }}
                </span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editProperty(property.id)"
                  class="flex-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                >
                  Editar
                </button>
                <button
                  @click="deleteProperty(property.id)"
                  class="flex-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Services Tab -->
        <div v-if="activeTab === 'services'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Mis Servicios</h2>
            <router-link
              to="/post-service"
              class="btn-primary"
            >
              <IconPlus class="w-4 h-4" />
              Nuevo Servicio
            </router-link>
          </div>

          <div v-if="userServices.length === 0" class="text-center py-8">
            <IconWrench class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No tienes servicios publicados</h3>
            <p class="text-gray-600 mb-4">Comienza a ofrecer servicios publicando tu primer servicio</p>
            <router-link
              to="/post-service"
              class="btn-primary"
            >
              <IconPlus class="w-4 h-4" />
              Publicar Servicio
            </router-link>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="service in userServices"
              :key="service.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div v-if="!service.images?.[0]" class="w-full h-48 bg-gray-100 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                <IconImageOff class="w-8 h-8 mb-2" />
                <span class="text-sm">Sin imagen</span>
              </div>
              <img
                v-else
                :src="service.images[0]"
                :alt="service.title"
                class="w-full h-48 object-cover rounded-lg"
              />
              <h3 class="font-semibold text-gray-900 mb-1 mt-3">{{ service.title }}</h3>
              <p class="text-primary-600 font-bold mb-2">
                Desde ${{ formatPrice(service.price_from) }}
              </p>
              <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <span :class="statusClass(service.status)">{{ statusText(service.status) }}</span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editService(service.id)"
                  class="flex-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                >
                  Editar
                </button>
                <button
                  @click="deleteService(service.id)"
                  class="flex-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Favorites Tab -->
        <div v-if="activeTab === 'favorites'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Mis Favoritos</h2>
          </div>

          <div v-if="loadingFavorites" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>

          <div v-else>
            <div v-if="favorites.length === 0" class="text-center py-12">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                <IconHeart class="h-6 w-6 text-gray-400" />
              </div>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No hay favoritos</h3>
              <p class="mt-1 text-sm text-gray-500">Guarda tus productos, propiedades y servicios favoritos aquí.</p>
            </div>

            <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <!-- Product Favorites -->
              <div 
                v-for="favorite in favorites.filter(f => f.product_id)" 
                :key="`product-${favorite.id}`" 
                class="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                @click="goToDetail('product', favorite.product_id)"
              >
                <div class="p-4">
                  <div class="flex justify-between items-start">
                    <h3 class="text-lg font-medium text-gray-900">{{ favorite.products?.title }}</h3>
                    <span class="text-sm font-medium text-primary-600">${{ formatPrice(favorite.products?.price) }}</span>
                  </div>
                  <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ favorite.products?.description }}</p>
                  <div class="mt-4 flex justify-between items-center">
                    <span class="text-xs text-gray-500">Producto</span>
                    <button
                      @click.stop="removeFromFavorites(favorite.id)"
                      class="text-gray-400 hover:text-red-500"
                      title="Quitar de favoritos"
                    >
                      <IconHeart class="h-5 w-5 fill-current text-red-500" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Property Favorites -->
              <div 
                v-for="favorite in favorites.filter(f => f.property_id)" 
                :key="`property-${favorite.id}`" 
                class="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                @click="goToDetail('property', favorite.property_id)"
              >
                <div class="p-4">
                  <div class="flex justify-between items-start">
                    <h3 class="text-lg font-medium text-gray-900">{{ favorite.properties?.title }}</h3>
                    <span class="text-sm font-medium text-primary-600">${{ formatPrice(favorite.properties?.price) }}</span>
                  </div>
                  <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ favorite.properties?.description }}</p>
                  <div class="mt-4 flex justify-between items-center">
                    <span class="text-xs text-gray-500">Propiedad</span>
                    <button
                      @click.stop="removeFromFavorites(favorite.id)"
                      class="text-gray-400 hover:text-red-500"
                      title="Quitar de favoritos"
                    >
                      <IconHeart class="h-5 w-5 fill-current text-red-500" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Service Favorites -->
              <div 
                v-for="favorite in favorites.filter(f => f.service_id)" 
                :key="`service-${favorite.id}`" 
                class="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                @click="goToDetail('service', favorite.service_id)"
              >
                <div class="p-4">
                  <div class="flex justify-between items-start">
                    <h3 class="text-lg font-medium text-gray-900">{{ favorite.services?.title }}</h3>
                    <span class="text-sm font-medium text-primary-600">${{ formatPrice(favorite.services?.price) }}</span>
                  </div>
                  <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ favorite.services?.description }}</p>
                  <div class="mt-4 flex justify-between items-center">
                    <span class="text-xs text-gray-500">Servicio</span>
                    <button
                      @click.stop="removeFromFavorites(favorite.id)"
                      class="text-gray-400 hover:text-red-500"
                      title="Quitar de favoritos"
                    >
                      <IconHeart class="h-5 w-5 fill-current text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- VIP Upgrade Modal -->
    <VIPUpgradeModal 
      :is-open="showVIPModal" 
      @close="showVIPModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, type Component } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'
import { useMessages } from '../composables/useMessages'
import { useFavorites } from '../composables/useFavorites'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'
// Importar iconos directamente
import { 
  User as IconUser,
  Package as IconPackage,
  Home as IconHome,
  Wrench as IconWrench,
  Heart as IconHeart,
  Settings as IconSettings,
  Send as IconSend,
  Loader2 as IconLoader2,
  ShoppingCart as IconShoppingCart,
  Star as IconStar,
  LogOut as IconLogOut,
  Plus as IconPlus,
  ImageOff as IconImageOff,
  Inbox as IconInbox,
  Crown as IconCrown
} from 'lucide-vue-next'
import MessageModal from '../components/MessageModal.vue'
import MessagesList from '../components/MessagesList.vue'
import VIPUpgradeModal from '../components/VIPUpgradeModal.vue'

const router = useRouter()
const { profile, loading, updateProfile, signOut } = useAuth()
const { deleteProduct: deleteProductFromStore } = useProducts()
const { unreadCount, loadMessages } = useMessages()
const { favorites, loading: loadingFavorites, loadFavorites, removeFromFavorites } = useFavorites()
const toast = useToast()

const activeTab = ref('messages')
const isVIP = computed(() => profile.value?.badge === 'vip')
const showVIPModal = ref(false)

// Handle VIP upgrade
// VIP upgrade is now handled by the VIPUpgradeModal component
const showMessageModal = ref(false)
const replyData = reactive({
  recipientId: '',
  recipientName: '',
  isReply: false,
  originalMessage: null as any
})
const activeMessageTab = ref('inbox')
const messageTabs = [
  { id: 'inbox', name: 'Bandeja de entrada', icon: 'Inbox' },
  { id: 'sent', name: 'Enviados', icon: 'Send' }
]

// Cargar mensajes al cambiar entre pestañas
watch(activeMessageTab, () => {
  loadMessages()
})

// Handle message sent event
const handleMessageSent = () => {
  showMessageModal.value = false
  // Recargar mensajes después de enviar
  loadMessages()
}

// Handle reply to message
const handleReplyToMessage = (data: any) => {
  replyData.recipientId = data.recipientId
  replyData.recipientName = data.recipientName
  replyData.isReply = data.isReply
  replyData.originalMessage = data.originalMessage
  showMessageModal.value = true
}

// Open message in a modal
const openMessage = (message: any) => {
  // Aquí podrías implementar la lógica para abrir el mensaje en un modal
  console.log('Abrir mensaje:', message)
}

// Message type state (for mobile)
const messageType = ref('inbox')
const userProducts = ref<any[]>([])
const userProperties = ref<any[]>([])
const userServices = ref<any[]>([])
const userStats = ref({
  products: 0,
  properties: 0,
  services: 0,
  sold: 0,
  rating: 5.0
})

// Define the type for our icon components
interface IconComponents {
  [key: string]: string | Component;
}

// Map of icon names to their components
const iconComponents: IconComponents = {
  Inbox: IconInbox,
  Package: IconPackage,
  Home: IconHome,
  Wrench: IconWrench,
  Heart: IconHeart,
  Settings: IconSettings,
  Send: IconSend
}

const tabs = [
  { id: 'messages', name: 'Mensajes', icon: 'Inbox' },
  { id: 'products', name: 'Productos', icon: 'Package' },
  { id: 'properties', name: 'Propiedades', icon: 'Home' },
  { id: 'services', name: 'Servicios', icon: 'Wrench' },
  { id: 'favorites', name: 'Favoritos', icon: 'Heart' },
  { id: 'settings', name: 'Configuración', icon: 'Settings' }
]



const form = reactive({
  full_name: '',
  email: '',
  phone: '',
  bio: '',
  location: ''
})

const colombianCities = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta',
  'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Pasto', 'Manizales',
  'Neiva', 'Soledad', 'Armenia', 'Villavicencio', 'Montería', 'Valledupar', 'Granada'
]

const badgeClass = computed(() => {
  switch (profile.value?.badge) {
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
  switch (profile.value?.badge) {
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
      return 'Sin rol'
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CO', { 
    year: 'numeric', 
    month: 'long' 
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO').format(price)
}

const statusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100 px-2 py-1 rounded-full'
    case 'sold':
    case 'rented':
      return 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full'
    case 'inactive':
      return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full'
    default:
      return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full'
  }
}

const statusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Activo'
    case 'sold':
      return 'Vendido'
    case 'rented':
      return 'Alquilado'
    case 'inactive':
      return 'Inactivo'
    default:
      return 'Desconocido'
  }
}

const handleUpdateProfile = async () => {
  await updateProfile(form)
}

const handleSignOut = async () => {
  await signOut()
  router.push('/')
}

// Navegar a la página de detalle correspondiente
const goToDetail = (type: string, id: string) => {
  if (type === 'product') {
    router.push(`/product/${id}`)
  } else if (type === 'property') {
    router.push(`/property/${id}`)
  } else if (type === 'service') {
    router.push(`/service/${id}`)
  }
}

const editProduct = (productId: string) => {
  router.push(`/product/${productId}/edit`)
}

const editProperty = (propertyId: string) => {
  router.push(`/property/${propertyId}/edit`)
}

const editService = (serviceId: string) => {
  router.push(`/service/${serviceId}/edit`)
}

const deleteProduct = async (productId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    await deleteProductFromStore(productId)
    await loadUserProducts()
  }
}

const deleteProperty = async (propertyId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
    try {
      // Get the property to access its images
      const { data: property, error: fetchError } = await supabase
        .from('properties')
        .select('images')
        .eq('id', propertyId)
        .single()

      if (fetchError) throw fetchError

      // Delete the property from the database
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)

      if (error) throw error

      // Delete associated images from storage if they exist
      if (property?.images?.length > 0) {
        try {
          const imageUrls = property.images as string[]
          const pathsToDelete = imageUrls.map(url => {
            try {
              if (url.startsWith('http')) {
                const urlObj = new URL(url)
                const pathParts = urlObj.pathname.split('/')
                const bucketIndex = pathParts.indexOf('property-images')
                if (bucketIndex !== -1) {
                  return pathParts.slice(bucketIndex + 1).join('/')
                }
                const match = urlObj.pathname.match(/property-images\/(.+)$/)
                return match ? match[1] : ''
              } else {
                return url.replace(/^property-images\//, '')
              }
            } catch (e) {
              console.error('Error processing image URL:', url, e)
              return ''
            }
          }).filter(Boolean)

          if (pathsToDelete.length > 0) {
            const { error: storageError } = await supabase.storage
              .from('property-images')
              .remove(pathsToDelete)

            if (storageError) {
              console.error('Error deleting images from storage:', storageError)
            }
          }
        } catch (e) {
          console.error('Error during image deletion:', e)
        }
      }

      await loadUserProperties()
    } catch (error: any) {
      console.error('Error deleting property:', error)
    }
  }
}

const deleteService = async (serviceId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
    try {
      // Get the service to access its images
      const { data: service, error: fetchError } = await supabase
        .from('services')
        .select('images')
        .eq('id', serviceId)
        .single()

      if (fetchError) throw fetchError

      // Delete the service from the database
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)

      if (error) throw error

      // Delete associated images from storage if they exist
      if (service?.images?.length > 0) {
        try {
          const imageUrls = service.images as string[]
          const pathsToDelete = imageUrls.map(url => {
            try {
              if (url.startsWith('http')) {
                const urlObj = new URL(url)
                const pathParts = urlObj.pathname.split('/')
                const bucketIndex = pathParts.indexOf('service-images')
                if (bucketIndex !== -1) {
                  return pathParts.slice(bucketIndex + 1).join('/')
                }
                const match = urlObj.pathname.match(/service-images\/(.+)$/)
                return match ? match[1] : ''
              } else {
                return url.replace(/^service-images\//, '')
              }
            } catch (e) {
              console.error('Error processing image URL:', url, e)
              return ''
            }
          }).filter(Boolean)

          if (pathsToDelete.length > 0) {
            const { error: storageError } = await supabase.storage
              .from('service-images')
              .remove(pathsToDelete)

            if (storageError) {
              console.error('Error deleting images from storage:', storageError)
            }
          }
        } catch (e) {
          console.error('Error during image deletion:', e)
        }
      }

      await loadUserServices()
    } catch (error: any) {
      console.error('Error deleting service:', error)
    }
  }
}

const loadUserProducts = async () => {
  if (!profile.value) return

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', profile.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    userProducts.value = data || []
    userStats.value.products = data?.length || 0
    userStats.value.sold = data?.filter(p => p.status === 'sold').length || 0
  } catch (error) {
    console.error('Error loading user products:', error)
  }
}

const loadUserProperties = async () => {
  if (!profile.value) return

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', profile.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    userProperties.value = data || []
    userStats.value.properties = data?.length || 0
  } catch (error) {
    console.error('Error loading user properties:', error)
  }
}

const loadUserServices = async () => {
  if (!profile.value) return

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', profile.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    userServices.value = data || []
    userStats.value.services = data?.length || 0
  } catch (error) {
    console.error('Error loading user services:', error)
  }
}

onMounted(async () => {
  if (profile.value) {
    form.full_name = profile.value.full_name || ''
    form.email = profile.value.email || ''
    form.phone = profile.value.phone || ''
    form.location = profile.value.location || ''
    form.bio = profile.value.bio || ''
    
    await Promise.all([
      loadUserProducts(),
      loadUserProperties(),
      loadUserServices()
    ])
  }
})

// Watch for tab changes to load favorites when the tab is active
watch(activeTab, async (newTab) => {
  if (newTab === 'favorites' && favorites.value.length === 0) {
    await loadFavoritesList()
  }
})

// Load favorites list
const loadFavoritesList = async () => {
  try {
    await loadFavorites()
  } catch (error: any) {
    console.error('Error loading favorites:', error)
    toast.error(error.message || 'Error al cargar los favoritos')
  }
}
</script>