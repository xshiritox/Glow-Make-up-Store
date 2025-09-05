const fs = require('fs');
const path = require('path');

// Crear una versión simple del logo en diferentes tamaños
const logoContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <path 
    d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z" 
    fill="url(#gradient)" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
  />
  <path 
    d="M3 6H21" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
  />
  <path 
    d="M16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    fill="none"
  />
</svg>`;

// Crear los archivos necesarios
const files = [
  { path: 'public/logo.svg', content: logoContent },
  { path: 'public/favicon.ico', content: '' }, // Este será un archivo vacío, necesitarás reemplazarlo manualmente
  { path: 'public/icon-192x192.png', content: '' }, // Este será un archivo vacío
  { path: 'public/icon-512x512.png', content: '' }, // Este será un archivo vacío
  { path: 'public/apple-touch-icon.png', content: '' } // Este será un archivo vacío
];

// Crear los archivos
files.forEach(({ path: filePath, content }) => {
  const fullPath = path.join(__dirname, '..', filePath);
  const dir = path.dirname(fullPath);
  
  // Asegurarse de que el directorio exista
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Escribir el archivo
  fs.writeFileSync(fullPath, content);
  console.log(`Created: ${filePath}`);
});

console.log('\n¡Listo! Se han creado los archivos del logo.');
console.log('Nota: Para obtener los mejores resultados, te recomiendo:');
console.log('1. Visitar https://realfavicongenerator.net/');
console.log('2. Subir el archivo public/logo.svg');
console.log('3. Descargar el paquete generado y reemplazar los archivos en la carpeta public/');
