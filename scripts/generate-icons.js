const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputSvg = path.join(__dirname, '../public/logo.svg');
const outputDir = path.join(__dirname, '../public');

// Tamaños de icono estándar para PWA
const sizes = [
  { width: 192, height: 192, name: 'icon-192x192.png' },
  { width: 512, height: 512, name: 'icon-512x512.png' },
  { width: 180, height: 180, name: 'apple-touch-icon.png' },
  { width: 32, height: 32, name: 'favicon.ico' },
];

// Asegurarse de que el directorio de salida exista
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generar cada tamaño de icono
Promise.all(
  sizes.map(({ width, height, name }) => {
    const outputPath = path.join(outputDir, name);
    
    // Para favicon.ico necesitamos un enfoque diferente
    if (name === 'favicon.ico') {
      return sharp(inputSvg)
        .resize(width, height)
        .toFormat('ico')
        .toFile(outputPath)
        .then(() => console.log(`Generated ${outputPath}`))
        .catch(err => console.error(`Error generating ${outputPath}:`, err));
    }
    
    return sharp(inputSvg)
      .resize(width, height)
      .png()
      .toFile(outputPath)
      .then(() => console.log(`Generated ${outputPath}`))
      .catch(err => console.error(`Error generating ${outputPath}:`, err));
  })
)
.then(() => {
  console.log('All icons generated successfully!');
  // Actualizar el archivo index.html para incluir los favicons
  updateHtmlFile();
})
.catch(err => {
  console.error('Error generating icons:', err);
});

function updateHtmlFile() {
  const htmlPath = path.join(__dirname, '../index.html');
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // Añadir los favicons al head
  const faviconLinks = `
    <link rel="icon" href="/favicon.ico" sizes="32x32">
    <link rel="icon" href="/logo.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.json">
  `;
  
  // Insertar después de la etiqueta <title>
  htmlContent = htmlContent.replace(
    /(<title>.*?<\/title>)/,
    `$1${faviconLinks}`
  );
  
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log('Updated index.html with favicon links');
}
