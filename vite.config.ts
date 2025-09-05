import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { resolve } from 'path'
import { existsSync, copyFileSync, mkdirSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-sitemap',
      closeBundle() {
        const publicDir = resolve(__dirname, 'public')
        const outDir = resolve(__dirname, 'dist')
        
        // Asegurarse de que el directorio de salida existe
        if (!existsSync(outDir)) {
          mkdirSync(outDir, { recursive: true })
        }
        
        // Copiar sitemap.xml
        const sitemapPath = resolve(publicDir, 'sitemap.xml')
        const sitemapOutPath = resolve(outDir, 'sitemap.xml')
        if (existsSync(sitemapPath)) {
          copyFileSync(sitemapPath, sitemapOutPath)
        }
        
        // Copiar robots.txt
        const robotsPath = resolve(publicDir, 'robots.txt')
        const robotsOutPath = resolve(outDir, 'robots.txt')
        if (existsSync(robotsPath)) {
          copyFileSync(robotsPath, robotsOutPath)
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    chunkSizeWarningLimit: 2000, // Aumentar el límite de advertencia
    outDir: 'dist',
    rollupOptions: {
      // Asegurarse de copiar el sitemap.xml
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  base: './'
})