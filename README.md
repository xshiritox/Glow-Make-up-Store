# Kroma

Una plataforma moderna de clasificados donde los usuarios pueden comprar y vender productos, propiedades y servicios.

## Características

- **Marketplace completo**: Productos, propiedades y servicios
- **Autenticación segura**: Registro e inicio de sesión con Supabase
- **Sistema de insignias**: Destacado, Colaborador, VIP, Moderador, Admin
- **Diseño responsivo**: Optimizado para móvil y desktop
- **Búsqueda avanzada**: Filtros por categoría, precio, ubicación
- **Panel de administración**: Gestión de usuarios y contenido
- **Diseño moderno**: Interfaz limpia inspirada en los mejores marketplaces
- 📱 **Diseño responsivo**: Optimizado para móvil y desktop
- 🔍 **Búsqueda avanzada**: Filtros por categoría, precio, ubicación
- 👥 **Panel de administración**: Gestión de usuarios y contenido
- 🎨 **Diseño moderno**: Interfaz limpia inspirada en los mejores marketplaces

## Tecnologías

- **Frontend**: Vue.js 3 + TypeScript
- **Styling**: TailwindCSS
- **Router**: Vue Router
- **Backend**: Supabase (Database, Auth, Storage)
- **Icons**: Lucide Vue
- **Notifications**: Vue Toastification

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Copia `.env.example` a `.env`
   - Configura tu proyecto de Supabase

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Configuración de Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Configura las tablas de la base de datos
3. Habilita la autenticación por email
4. Configura las políticas de Row Level Security (RLS)

## Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
├── composables/       # Composables de Vue
├── pages/            # Páginas de la aplicación
├── lib/              # Configuraciones y utilidades
├── router/           # Configuración de rutas
└── styles/           # Estilos globales
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## Licencia

MIT License