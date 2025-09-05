import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './style.css'
import App from './App.vue'
import { routes } from './router'
import { useAuth } from './composables/useAuth'
import { 
  User, Package, Home, Wrench, Heart, Settings, Send, 
  Loader2, ShoppingCart, Star, LogOut, Plus, ImageOff, MessageSquare 
} from 'lucide-vue-next'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for protected routes
router.beforeEach(async (to, _from, next) => {
  const { isAuthenticated, isAdmin, profile, initialize } = useAuth()
  
  // Initialize auth if not already done
  if (!profile.value && !isAuthenticated.value) {
    await initialize()
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
    return
  }
  
  // Check if route requires admin privileges
  if (to.meta.requiresAdmin && !isAdmin.value) {
    next('/')
    return
  }
  
  next()
})

const app = createApp(App)

// Registrar componentes globalmente
app.component('UserIcon', User)
app.component('PackageIcon', Package)
app.component('HomeIcon', Home)
app.component('WrenchIcon', Wrench)
app.component('HeartIcon', Heart)
app.component('SettingsIcon', Settings)
app.component('SendIcon', Send)
app.component('Loader2', Loader2)
app.component('ShoppingCart', ShoppingCart)
app.component('Star', Star)
app.component('LogOut', LogOut)
app.component('Plus', Plus)
app.component('ImageOff', ImageOff)
app.component('MessageIcon', MessageSquare)

app.use(router)
app.use(Toast, {
  position: 'top-right',
  timeout: 4000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
})

app.mount('#app')