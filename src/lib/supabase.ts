// Mock data for local development without Supabase
export interface MockUser {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  phone?: string
  location?: string
  badge?: 'destacado' | 'colaborador' | 'vip' | 'moderador' | 'admin' | null
  bio?: string
  website?: string
  verified: boolean
  created_at: string
  updated_at: string
}

export interface MockProduct {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: 'nuevo' | 'usado' | 'reacondicionado'
  images: string[]
  location: string
  user_id: string
  status: 'active' | 'sold' | 'inactive' | 'pending'
  featured: boolean
  views: number
  created_at: string
  updated_at: string
  profiles?: MockUser
}

// Mock data storage
let mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'usuario@ejemplo.com',
    full_name: 'Usuario Demo',
    phone: '+57 300 123 4567',
    location: 'Bogotá',
    badge: 'vip',
    verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

let mockProducts: MockProduct[] = [
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
    profiles: mockUsers[0]
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
    profiles: mockUsers[0]
  }
]

let mockProperties: any[] = [
  {
    id: '1',
    title: 'Apartamento 3 habitaciones en Chapinero',
    description: 'Hermoso apartamento con vista panorámica, cerca al transporte público.',
    price: 450000000,
    property_type: 'apartamento',
    transaction_type: 'venta',
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'],
    location: 'Bogotá',
    address: 'Carrera 13 #63-45',
    user_id: '1',
    status: 'active',
    featured: false,
    views: 67,
    amenities: ['Gimnasio', 'Piscina', 'Portería 24h'],
    parking_spaces: 1,
    stratum: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: mockUsers[0]
  }
]

let mockServices: any[] = [
  {
    id: '1',
    title: 'Reparación de electrodomésticos',
    description: 'Servicio técnico especializado en reparación de neveras, lavadoras y más.',
    category: 'Reparaciones y Mantenimiento',
    price_from: 50000,
    price_to: 200000,
    price_type: 'fixed',
    images: ['https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg'],
    location: 'Bogotá',
    user_id: '1',
    status: 'active',
    featured: false,
    views: 34,
    rating: 4.8,
    reviews_count: 15,
    availability: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    response_time: '24h',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profile: mockUsers[0]
  }
]

let mockFavorites: any[] = []
let mockMessages: any[] = []

// Mock authentication state
let currentUser: MockUser | null = null
let isAuthenticated = false

// Mock Supabase client
export const supabase = {
  auth: {
    signUp: async ({ email, password, options }: any) => {
      const newUser = {
        id: Date.now().toString(),
        email,
        full_name: options?.data?.full_name || email,
        verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      mockUsers.push(newUser)
      return { data: { user: newUser }, error: null }
    },
    
    signInWithPassword: async ({ email, password }: any) => {
      const user = mockUsers.find(u => u.email === email)
      if (user) {
        currentUser = user
        isAuthenticated = true
        return { data: { user, session: { user } }, error: null }
      }
      return { data: null, error: { message: 'Credenciales inválidas' } }
    },
    
    signOut: async () => {
      currentUser = null
      isAuthenticated = false
      return { error: null }
    },
    
    getSession: async () => {
      return { 
        data: { 
          session: currentUser ? { user: currentUser } : null 
        }, 
        error: null 
      }
    },
    
    onAuthStateChange: (callback: Function) => {
      // Mock auth state change listener
      return { data: { subscription: { unsubscribe: () => {} } } }
    },
    
    resetPasswordForEmail: async (email: string) => {
      return { error: null }
    },
    
    verifyOtp: async () => {
      return { error: null }
    },
    
    updateUser: async (updates: any) => {
      if (currentUser) {
        Object.assign(currentUser, updates)
      }
      return { data: { user: currentUser }, error: null }
    }
  },
  
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          if (table === 'profiles') {
            const profile = mockUsers.find(u => u[column as keyof MockUser] === value)
            return { data: profile, error: profile ? null : { message: 'Not found' } }
          }
          if (table === 'products') {
            const product = mockProducts.find(p => p[column as keyof MockProduct] === value)
            return { data: product, error: product ? null : { message: 'Not found' } }
          }
          return { data: null, error: { message: 'Not found' } }
        },
        order: (column: string, options?: any) => ({
          limit: (count: number) => ({
            then: async (callback: Function) => {
              let data: any[] = []
              if (table === 'products') data = mockProducts.slice(0, count)
              if (table === 'properties') data = mockProperties.slice(0, count)
              if (table === 'services') data = mockServices.slice(0, count)
              return callback({ data, error: null })
            }
          })
        })
      }),
      order: (column: string, options?: any) => ({
        limit: (count: number) => ({
          then: async (callback: Function) => {
            let data: any[] = []
            if (table === 'products') data = mockProducts.slice(0, count)
            if (table === 'properties') data = mockProperties.slice(0, count)
            if (table === 'services') data = mockServices.slice(0, count)
            return callback({ data, error: null })
          }
        }),
        then: async (callback: Function) => {
          let data: any[] = []
          if (table === 'products') data = mockProducts
          if (table === 'properties') data = mockProperties
          if (table === 'services') data = mockServices
          if (table === 'profiles') data = mockUsers
          if (table === 'favorites') data = mockFavorites
          if (table === 'messages') data = mockMessages
          return callback({ data, error: null })
        }
      }),
      then: async (callback: Function) => {
        let data: any[] = []
        if (table === 'products') data = mockProducts
        if (table === 'properties') data = mockProperties
        if (table === 'services') data = mockServices
        if (table === 'profiles') data = mockUsers
        if (table === 'favorites') data = mockFavorites
        if (table === 'messages') data = mockMessages
        return callback({ data, error: null })
      }
    }),
    
    insert: (data: any) => ({
      select: () => ({
        single: async () => {
          const newItem = { ...data, id: Date.now().toString(), created_at: new Date().toISOString() }
          if (table === 'products') mockProducts.unshift(newItem)
          if (table === 'properties') mockProperties.unshift(newItem)
          if (table === 'services') mockServices.unshift(newItem)
          if (table === 'favorites') mockFavorites.unshift(newItem)
          if (table === 'messages') mockMessages.unshift(newItem)
          return { data: newItem, error: null }
        }
      })
    }),
    
    update: (updates: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => {
            let item: any = null
            if (table === 'profiles') {
              item = mockUsers.find(u => u[column as keyof MockUser] === value)
              if (item) Object.assign(item, updates, { updated_at: new Date().toISOString() })
            }
            if (table === 'products') {
              item = mockProducts.find(p => p[column as keyof MockProduct] === value)
              if (item) Object.assign(item, updates, { updated_at: new Date().toISOString() })
            }
            return { data: item, error: item ? null : { message: 'Not found' } }
          }
        })
      })
    }),
    
    delete: () => ({
      eq: (column: string, value: any) => ({
        then: async (callback: Function) => {
          if (table === 'products') {
            const index = mockProducts.findIndex(p => p[column as keyof MockProduct] === value)
            if (index > -1) mockProducts.splice(index, 1)
          }
          if (table === 'properties') {
            const index = mockProperties.findIndex(p => p[column] === value)
            if (index > -1) mockProperties.splice(index, 1)
          }
          if (table === 'services') {
            const index = mockServices.findIndex(s => s[column] === value)
            if (index > -1) mockServices.splice(index, 1)
          }
          return callback({ error: null })
        }
      })
    })
  }),
  
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        // Mock file upload - return success
        return { error: null }
      },
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `https://mock-storage.com/${bucket}/${path}` }
      }),
      remove: async (paths: string[]) => {
        return { error: null }
      }
    })
  },
  
  rpc: async (functionName: string, params: any) => {
    return { error: null }
  }
}

// Export mock admin client (same as regular client for local development)
export const supabaseAdmin = supabase

// Mock helper functions
export const incrementViews = async (tableName: string, recordId: string) => {
  // Mock implementation
  console.log(`Incrementing views for ${tableName}:${recordId}`)
}

export const uploadImage = async (file: File, bucket: string, path: string) => {
  // Mock image upload
  return `https://mock-storage.com/${bucket}/${path}`
}

export const deleteImage = async (bucket: string, path: string) => {
  // Mock image deletion
  console.log(`Deleting image: ${bucket}/${path}`)
}

// Export types for compatibility
export type Database = any