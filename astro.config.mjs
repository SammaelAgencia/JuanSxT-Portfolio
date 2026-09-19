import { defineConfig } from 'astro/config';

/* -----------------------------------------------------------------------------
   PREFIJOS DE NAVEGADOR

   REGLA: en el CSS NO se escriben prefijos a mano. Los pone Lightning CSS a
   partir de estos suelos.

   El motivo no es comodidad. Lightning CSS trata la forma prefijada y la
   estándar como la MISMA propiedad: si encuentra la estándar y detrás un
   `-webkit-` escrito a mano, colapsa el par y se queda con el prefijo,
   BORRANDO la estándar del build. Eso es lo que tuvo al desenfoque progresivo
   saliendo sólo como `-webkit-backdrop-filter` —invisible en Firefox, que
   nunca ha entendido ese alias— mientras en `dev`, que no minifica, se veía
   perfecto. Se escribe la estándar y punto.

   El suelo de Safari es el que obliga a casi todo: `backdrop-filter` y
   `mask-*` no fueron propiedades sin prefijo allí hasta la 18 y la 15.4.
----------------------------------------------------------------------------- */
const suelos = {
  chrome:  100,
  edge:    100,
  firefox: 103,   // la primera con `backdrop-filter` sin prefijo
  safari:   15,
};

/* Los mismos suelos en los dos formatos que hacen falta, para que no puedan
   descuadrarse. Lightning CSS los quiere como `major << 16`; Vite, para el
   paso de minificado, los quiere como cadenas al estilo de esbuild.

   Hacen falta LOS DOS: Vite esparce `css.lightningcss` al minificar pero acto
   seguido pisa la clave `targets` con lo que salga de `build.cssTarget` (ver
   `minifyCSS` en vite/dist/node). Con `cssTarget` sin definir, el minificado
   corre sin suelos, da por moderno a todo el mundo y tira los prefijos que
   había puesto el transformador. */
const targets = Object.fromEntries(
  Object.entries(suelos).map(([nombre, version]) => [nombre, version << 16]),
);
const cssTarget = Object.entries(suelos).map(([nombre, version]) => `${nombre}${version}`);

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
    css: {
      /* Lightning CSS transforma además de minificar. Importa que lo haga
         también en `dev`: el fallo de los prefijos no se veía en local
         precisamente porque `dev` no pasaba por aquí, y lo que se mira
         mientras se trabaja debe ser lo que se publica. */
      transformer: 'lightningcss',
      lightningcss: { targets },
    },
    build: {
      cssTarget,
      cssMinify: 'lightningcss',
    },
  },
});
