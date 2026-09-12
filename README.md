# Portafolio · Juan Pablo Sierra Tejada

Diseñador UI/UX e Ingeniero Multimedia. Sitio de una sola página, estático,
construido con Astro. En producción: **https://juansxt.com**

```bash
npm install
npm run dev        # localhost:4321
npm run build      # → dist/
npm run preview    # sirve dist/
npm run check      # diagnóstico de tipos
```

---

## 1. Qué editar y dónde

| Quiero cambiar…                     | Archivo                    |
| ----------------------------------- | -------------------------- |
| Colores, tipografía, ritmo, tiempos | `src/styles/tokens.css`    |
| Nombre, correo, teléfono, redes     | `src/data/site.ts`         |
| Textos de la interfaz (ES / EN)     | `src/data/ui.ts`           |
| Proyectos de la baraja de trabajo   | `src/data/projects.ts`     |
| Servicios y entregables             | `src/data/services.ts`     |
| Fases del proceso                   | `src/data/process.ts`      |
| Trayectoria y formación             | `src/data/experience.ts`   |
| Herramientas y cinta en bucle       | `src/data/toolkit.ts`      |
| Orden de las secciones              | `src/components/Home.astro`|

La maqueta y los estilos están separados a propósito: los `.astro` no llevan
ni un bloque `<style>`. Ver `CLAUDE.md` para la convención completa.

El sitio está en **español (`/`) e inglés (`/en/`)**. Son dos páginas reales
generadas en el build. En las listas de contenido cada entrada lleva sus dos
versiones al lado, en bloques `es` / `en`; si añades una frase en español y
olvidas traducirla, `npm run check` lo dice.

---

## 2. Imágenes y vídeo

Los huecos ya están reservados con su proporción exacta, así que **al cambiar
los archivos no se mueve nada de sitio**. Si un archivo falta, se ve una placa
técnica con el nombre esperado; en cuanto aparece, la placa queda tapada sin
tocar código.

El nombre de los archivos es el `id` del proyecto en `src/data/projects.ts`.
Si renombras uno, renombra el otro:

| `id`                 | Archivos en `public/media/work/`                  |
| -------------------- | ------------------------------------------------- |
| `yamaha-mexico`      | `.webp` + `-01…-03.webp` + `.mp4`                 |
| `landing-conversion` | `.webp` + `-01…-03.webp` + `.mp4`                 |
| `identidad-marca`    | `.webp` + `-01…-03.webp` + `.mp4`                 |
| `diseno-web`         | `.webp` + `-01…-03.webp`                          |
| `ilustracion`        | `.webp` + `-01…-03.webp`                          |

El `.webp` suelto es la portada de la ficha; los `-01…-03` son las tres
capturas de la escena a pantalla completa.

**Todas en 4 / 3 — 1600 × 1200.** Las fichas del mazo miden lo mismo (70 % del
alto de la pantalla), así que la imagen se recorta centrada a esa proporción;
exportar otra forma sólo pierde encuadre. Deja algo de aire alrededor del
motivo principal.

**Formato:** WebP o AVIF, calidad 78–82, peso objetivo < 250 KB cada una.

### Movimiento en las previsualizaciones

Si quieres que una ficha muestre movimiento, deja un `.mp4` con el mismo
nombre junto a la imagen y declara su ruta en `motion`.

- 3–10 segundos, en bucle, **sin audio**. El encuadre da igual: la ficha usa
  `object-fit: cover` y recorta sola.
- H.264, 1280 px de ancho como mucho, 30 fps, **< 1,5 MB**. Ese límite va en
  serio: ver abajo.
- Van con `preload="none"`: **no se descargan al cargar la página**, sólo
  cuando el puntero lleva 140 ms dentro de la ficha. Por eso no penalizan la
  carga inicial ni se disparan al cruzar la baraja de un tirón.
- En móvil no se reproducen: sin hover, se queda la imagen fija. Tampoco se
  reproducen con el ahorro de datos del navegador activado.
- **Declara `motion` sólo si el archivo existe.** Apuntar a un archivo que no
  está es un 404 en el primer hover, y no se nota hasta que alguien lo prueba.
- **No uses GIF.** Un GIF de 5 s pesa 10–20× lo que el mismo clip en MP4 y no
  se puede pausar.

Los tres clips actuales ya están recodificados y dentro del presupuesto
(`landing-conversion.mp4` 1,37 MB, `yamaha-mexico.mp4` 1,23 MB,
`identidad-marca.mp4` 0,22 MB). Venían de exportación directa —uno de ellos
era 4K a 60 fps para una ficha que se ve a ~700 px— y sumaban 27 MB. Si
añades uno nuevo, pásalo por aquí antes de subirlo:

```bash
ffmpeg -i entrada.mp4 -an \
       -vf "fps=30,scale=1280:-2:flags=lanczos" \
       -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p \
       -movflags +faststart salida.mp4
```

`-an` quita el audio (no se usa y pesa); `-crf 30` es el mando de calidad
—sube el número si aún pesa, bájalo si se ve sucio—; `fps=30` baja los clips
que vengan a 60; y `+faststart` pone el índice al principio para que empiece a
verse sin esperar al archivo completo. No hace falta recortar al 4/3: el CSS
usa `object-fit: cover` y encuadra solo.

### Imagen para compartir en redes

`public/media/og.png` (1200 × 630) es la previsualización de WhatsApp,
LinkedIn y X. Se generó con los tipos del propio sitio. Si cambias el nombre o
el dominio, regenérala y actualiza `site.ogImage` en `src/data/site.ts`.

---

## 3. Publicación

El sitio compila a HTML estático: sirve tal cual en Vercel, Netlify,
Cloudflare Pages o cualquier hosting de archivos. No necesita servidor.

El dominio vive en **dos** sitios y tienen que coincidir, porque de ahí salen
la URL canónica, los `hreflang`, el JSON-LD, el `og:url` y el sitemap:

- `site` en `astro.config.mjs`
- `site.url` en `src/data/site.ts`

`/sitemap.xml` se genera solo en el build (`src/pages/sitemap.xml.ts`) a partir
de la lista de idiomas, y `public/robots.txt` lo anuncia.

### Pendientes

- [ ] Confirmar la fecha de disponibilidad en `site.availability`
      (`src/data/site.ts`).
- [ ] Faltan `public/media/torneo/subcampeones.png` y `coming-soon.png`: la
      página interna del torneo enseña la placa técnica en su lugar.
- [ ] Añadir foto o logo si finalmente se decide (hoy el sitio funciona sin
      ninguna de las dos).

---

## 4. Cómo está hecho

**Astro 7** · sin framework de UI · sin CSS utilitario · TypeScript propio.

**Tipografías auto-alojadas**, sin una sola petición a terceros. Los cuatro
archivos están en `public/fonts/` y los declara `src/styles/fonts.css`:

| Archivo          | Familia        | Uso                            |
| ---------------- | -------------- | ------------------------------ |
| `titulos.woff2`  | Salty Ages     | titulares                      |
| `parrafos.woff2` | Berkelium Sans | texto e interfaz               |
| `enfasis.woff2`  | Gothicfed      | palabras entre `*asteriscos*`  |
| `mono.woff2`     | Geist Mono     | etiquetas, cifras y meta       |

Las tres primeras se precargan desde el `<head>`: salen por encima del
pliegue.

**El movimiento se apoya en el navegador antes que en librerías.** Revelados
con un solo `IntersectionObserver`; baraja de proyectos con `position: sticky`
puro, sin JavaScript y sin nada que recalcular por frame; desenfoque
progresivo bajo la cabecera con ocho capas de `backdrop-filter` enmascaradas;
cinta con una animación CSS; acordeón con `<details>` nativo; y el campo de
líneas del hero es un shader propio en WebGL crudo, sin librería 3D.

**Un único bucle `requestAnimationFrame` en todo el sitio** (`scripts/env.ts`),
compartido por el cursor, los imanes, el foco del hero y el scroll suave.
`lenis` es la única dependencia de runtime y se importa bajo demanda: en móvil
y con «reducir movimiento» nunca llega a descargarse.

**El CSS viaja dentro del HTML** (`inlineStylesheets: 'always'`), así que no
hay ninguna hoja de estilos bloqueando el primer pintado. A cambio se pierde
la caché compartida del archivo de estilos: si el sitio creciera a muchas
páginas, eso vuelve a `'auto'` en `astro.config.mjs`.

Todo respeta `prefers-reduced-motion`.
