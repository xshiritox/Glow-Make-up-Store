import type { RouteRecordRaw } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import ProductsPage from '../pages/ProductsPage.vue'
import ProductDetailPage from '../pages/ProductDetailPage.vue'
import PostProductPage from '../pages/PostProductPage.vue'
import EditProductPage from '../pages/EditProductPage.vue'
import VerificationPendingPage from '../pages/VerificationPendingPage.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
import ChangePasswordForm from '@/components/auth/ChangePasswordForm.vue'

// Carga diferida del componente AdminPage
const AdminPage = () => import('../pages/AdminPage.vue')
import NotFoundPage from '../pages/NotFoundPage.vue'
import HowItWorks from '../pages/HowItWorks.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'products',
    component: ProductsPage
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: ProductDetailPage
  },
  {
    path: '/product/:id/edit',
    name: 'edit-product',
    component: EditProductPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/post-product',
    name: 'post-product',
    component: PostProductPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true },
    beforeEnter: async (_to, _from, next) => {
      const { isAuthenticated, isAdmin, profile } = useAuth()
      
      // Verificar autenticación
      if (!isAuthenticated.value) {
        next('/login')
        return
      }
      
      // Verificar si el perfil está cargado
      if (!profile.value) {
        // Esperar un momento para que se cargue el perfil
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Verificar permisos de administrador
      if (!isAdmin.value) {
        next('/')
        return
      }
      
      next()
    }
  },
  {
    path: '/verification-pending',
    name: 'verification-pending',
    component: VerificationPendingPage,
    props: route => ({ email: route.query.email || '' })
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordForm
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: ChangePasswordForm,
    props: (route) => ({ 
      access_token: route.query.access_token,
      type: route.query.type,
      next: route.query.next
    })
  },
  {
    path: '/how-it-works',
    name: 'how-it-works',
    component: HowItWorks,
    meta: { title: 'Cómo funciona' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage
  }
]