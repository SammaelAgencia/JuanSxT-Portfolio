# Portafolio · Juan Pablo Sierra Tejada

Diseñador UI/UX e Ingeniero Multimedia. Sitio de una sola página, estático,
construido con Astro.

```bash
npm install
npm run dev        # localhost:4321
npm run build      # → dist/
```

---

## 1. Qué editar y dónde

| Quiero cambiar…                     | Archivo                                  |
| ----------------------------------- | ---------------------------------------- |
| Colores, tipografía, ritmo, tiempos | `src/styles/tokens.css`                  |
| Nombre, correo, teléfono, redes     | `src/data/site.ts`                        |
| Proyectos de la baraja de trabajo   | `src/data/projects.ts`                    |
| Servicios y entregables             | `src/data/services.ts`                    |
| Fases del proceso                   | `src/data/process.ts`                     |
| Trayectoria y formación             | `src/data/experience.ts`                  |
| Herramientas y cinta en bucle       | `src/data/toolkit.ts`                     |
| Orden de las secciones              | `src/pages/index.astro`                   |

La maqueta y los estilos están separados a propósito: los `.astro` no llevan
ni un bloque `<style>`. Ver `CLAUDE.md` para la convención completa.

---

## 2. Imágenes y vídeo pendientes

Los huecos ya están reservados con su proporción exacta, así que **al añadir
los archivos no se mueve nada de sitio**. Mientras no existan, se ve una placa
técnica con el nombre esperado; en cuanto el archivo aparece, la placa queda
tapada sin tocar código.

Deja los archivos en `public/media/work/` con estos nombres:

| Archivo                   |
| ------------------------- |
| `plataforma-b2b.webp`     |
| `landing-conversion.webp` |
| `identidad-marca.webp`    |
| `realidad-aumentada.webp` |
| `ilustracion-nft.webp`    |

**Las cinco en 4 / 3 — 1600 × 1200.** Todas las fichas del mazo miden lo
mismo (70 % del alto de la pantalla), así que la imagen se recorta centrada a
esa proporción; exportar otra forma sólo pierde encuadre. Deja algo de aire
alrededor del motivo principal.

**Formato:** WebP o AVIF, calidad 78–82, peso objetivo < 250 KB cada una.

### Movimiento en las previsualizaciones

Si quieres que una ficha muestre movimiento en vez de una imagen fija, deja un
`.mp4` con el mismo nombre junto a la imagen:

```
public/media/work/plataforma-b2b.mp4
```

- 3–6 segundos, en bucle, **sin audio**, mismo encuadre 4 / 3.
- H.264, 960 × 720 aprox., < 1,5 MB.
- Van con `preload="none"`: **no se descargan al cargar la página**, sólo
  cuando el puntero entra en la ficha. Por eso no penalizan la carga.
- En móvil no se reproducen: sin hover, se queda la imagen fija.
- **No uses GIF.** Un GIF de 5 s pesa 10–20× lo que el mismo clip en MP4 y no
  se puede pausar. Si tienes el material en GIF, conviértelo:
  ```bash
  ffmpeg -i entrada.gif -movflags faststart -pix_fmt yuv420p \
         -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" salida.mp4
  ```

Si un proyecto no tiene vídeo, borra su línea `motion` en `projects.ts`.

### Imagen para compartir en redes

Falta `public/media/og.png` (1200 × 630). Hasta que exista, los enlaces
compartidos en WhatsApp o LinkedIn saldrán sin previsualización.

---

## 3. Antes de publicar

- [ ] Cambiar `site` en `astro.config.mjs` y `site.url` en `src/data/site.ts`
      por el dominio real (ahora hay un placeholder).
- [ ] Añadir `public/media/og.png`.
- [ ] Revisar `src/data/projects.ts`: los títulos y las métricas están
      redactados a partir del CV. Ajústalos a lo que puedas publicar
      (varios trabajos de agencia suelen ir bajo NDA).
- [ ] Confirmar la fecha de disponibilidad en `site.availability`.
- [ ] Añadir foto o logo si finalmente se decide (hoy el sitio funciona sin
      ninguna de las dos).

El sitio compila a HTML estático: sirve tal cual en Netlify, Vercel, Cloudflare
Pages o cualquier hosting de archivos. No necesita servidor.

---

## 4. Cómo está hecho

**Astro 7** · sin framework de UI · sin CSS utilitario · TypeScript propio.

Tipografías auto-alojadas (Fontsource, sin peticiones a Google):
Bricolage Grotesque (eje de tamaño óptico) para titulares, Geist para texto,
Geist Mono para etiquetas e Instrument Serif itálica para los acentos.

El movimiento se apoya en el navegador antes que en librerías: revelados con
un solo `IntersectionObserver`, baraja de proyectos con `position: sticky`
puro (sin JavaScript y sin nada que recalcular por frame), desenfoque
progresivo bajo la cabecera con ocho capas de `backdrop-filter` enmascaradas,
cinta con una animación CSS y acordeón con `<details>` nativo. Sólo hay un bucle
`requestAnimationFrame` en todo el sitio, compartido por el cursor y el foco
del hero. `lenis` es la única dependencia de runtime y se importa bajo
demanda: en móvil nunca se descarga.

Todo respeta `prefers-reduced-motion`.
