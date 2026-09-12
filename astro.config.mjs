import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://juansxt.com',
  compressHTML: true,
  build: {
    /* El CSS viaja DENTRO del HTML, no en un archivo aparte.
       Con 'auto' sólo se incrustaba lo que bajara de 4 kB, así que la portada
       abría con una hoja de ~45 kB que bloquea el renderizado: el navegador
       pide el HTML, lo lee, descubre el <link>, abre otra petición y no pinta
       nada hasta que vuelve. Incrustado desaparece ese viaje de ida y vuelta
       —es lo que PageSpeed cuenta como «solicitudes que bloquean el
       renderizado»— y las tipografías se descubren un tramo antes.
       Sale a cuenta porque son tres páginas que casi nadie visita dos veces:
       lo que se pierde es la caché compartida del archivo de estilos. Si el
       sitio creciera a muchas páginas, esto vuelve a 'auto'. */
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
