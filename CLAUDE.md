# Portafolio — Juan Pablo Sierra Tejada

Sitio estático de una sola página construido con **Astro 7**, sin framework de UI
y sin CSS utilitario. Todo el JavaScript es TypeScript propio salvo `lenis`
(scroll suave), que se carga bajo demanda.

## Comandos

```bash
npm run dev       # servidor de desarrollo → localhost:4321
npm run build     # build estático a dist/
npm run preview   # sirve dist/
npm run check     # diagnóstico de tipos de Astro
```

## Regla principal: el estilo no vive en la maqueta

Los `.astro` **no llevan bloques `<style>`**. Toda la presentación está en
`src/styles/`, y toda la redacción en `src/data/`. Un `.astro` sólo debe
contener estructura y clases.

Si necesitas un estilo nuevo:

1. ¿Es un valor de diseño (color, tamaño, ritmo, duración)? → `styles/tokens.css`.
2. ¿Es una pieza reutilizable? → `styles/components/<pieza>.css`.
3. ¿Es un bloque concreto de la página? → `styles/sections/<bloque>.css`.
4. Registra el archivo nuevo en `styles/index.css`.

Nunca escribas un color, un tamaño de fuente o una curva de easing a pelo:
usa la variable de `tokens.css`. Recolorear el sitio entero debe seguir siendo
una edición de un solo archivo.

## Mapa

```
src/
├─ data/                  Contenido. Editar aquí cambia lo que se lee.
│  ├─ ui.ts               redacción de la interfaz, en los dos idiomas
│  ├─ site.ts             identidad, nav, redes, ficha técnica
│  ├─ projects.ts         proyectos de la baraja + capturas de su escena
│  ├─ services.ts         servicios (el orden del array = orden en pantalla)
│  ├─ process.ts          fases de trabajo
│  ├─ experience.ts       trayectoria y formación
│  ├─ toolkit.ts          herramientas y palabras de la cinta
│  └─ pokemon.ts          página interna del torneo (sólo español)
│
├─ i18n/index.ts          idiomas: tipo Lang, langOf(ruta), homePath()
│
├─ styles/
│  ├─ index.css           punto de entrada; el ORDEN de los @import importa
│  │                      SÓLO lo que usa la portada: pokemon.css no está
│  ├─ tokens.css          ← variables de diseño
│  ├─ fonts.css           las cuatro tipografías auto-alojadas
│  ├─ reset.css  base.css  utilities.css  animations.css
│  ├─ components/         intro, cursor, header, progressive-blur, button,
│  │                      label, media, marquee, footer, scene, slider
│  └─ sections/           hero, manifesto, work, services, process,
│                         trajectory, toolkit, contact, pokemon
│                         (pokemon.css lo importa pages/pokemon.astro)
│
├─ scripts/               TypeScript de navegador
│  ├─ env.ts              media queries + ÚNICO bucle rAF compartido
│  ├─ reveal.ts           un IntersectionObserver para todo el documento
│  ├─ cursor.ts           cursor a medida + imanes
│  ├─ field.ts            foco reactivo del hero
│  ├─ chrome.ts           intro, cabecera, menú, scroll-spy, copiar, reloj,
│  │                      clips de proyecto bajo demanda
│  ├─ scene.ts            abre y cierra la ficha a pantalla completa
│  ├─ slider.ts           carruseles de láminas (scroll-snap + botones)
│  ├─ torneo.ts           pestañas y música de /pokemon
│  ├─ secret.ts           acceso oculto a /pokemon desde la portada
│  ├─ waves.ts            campo de líneas WebGL del hero (carga diferida)
│  └─ main.ts             orquestación y carga diferida
│
├─ components/
│  ├─ Home.astro          el orden de las secciones (lo comparten las dos portadas)
│  ├─ ui/                 SplitText, Label, MediaSlot, Marquee,
│  │                      ProgressiveBlur, Scene
│  ├─ layout/             Intro, Cursor, Header, Footer
│  └─ sections/           una sección por archivo
│
├─ layouts/Base.astro     <head>, metadatos, JSON-LD, hreflang, cromo global
└─ pages/
   ├─ index.astro         portada en español
   ├─ en/index.astro      portada en inglés
   ├─ pokemon.astro       página interna, sin nav y con noindex
   └─ sitemap.xml.ts      sitemap generado en el build desde `langs`
```

## Reglas de rendimiento que no se rompen

- **Ninguna hoja de estilos bloquea el primer pintado.** `inlineStylesheets:
  'always'` mete el CSS dentro del HTML: el navegador no tiene que descubrir
  un `<link>`, abrir otra petición y esperar a que vuelva para pintar. El
  precio es que ese CSS no se comparte entre páginas, y por eso **el índice de
  estilos sólo lleva lo que usa la portada**. `sections/pokemon.css` son 20 kB
  para una página interna a la que no se llega por enlace: lo importa
  `pages/pokemon.astro` y no `styles/index.css`. Si añades una sección que sólo
  vive en una página, hazlo igual.
- **Un solo bucle `requestAnimationFrame`** para todo (`scripts/env.ts`). Si
  añades algo animado por puntero, regístralo con `onTick`, no crees otro rAF.
  Lenis también va por ahí: `onTick` pasa `(dt, now)` justo para eso, y copiar
  el `requestAnimationFrame` recursivo de su ejemplo deja dos bucles pidiendo
  frames a la vez.
- **Nada lee geometría mientras el bucle escribe.** Un `getBoundingClientRect`
  —o un `offsetWidth`, o un `scrollY`— después de haber tocado estilos obliga
  al navegador a recalcular el layout en medio del frame; con un listener de
  scroll son decenas de recálculos por gesto. La regla práctica: mide **cuando
  algo cambia de tamaño**, no cuando algo se mueve. El campo del hero guarda su
  caja en coordenadas de documento y lee el puntero con `pageX`/`pageY`, que el
  scroll no altera; los imanes miden al entrar el puntero y sólo vuelven a
  medir si ha habido scroll de por medio. Y como `getBoundingClientRect`
  devuelve la caja YA transformada, el imán se resta su propio desplazamiento
  antes de guardarla: si no, se mide a sí mismo movido y se frena solo.
- **La baraja de proyectos es `position: sticky` puro**, sin JavaScript. Las
  fichas son hermanas del mismo contenedor y cada una se ancla un escalón más
  abajo, así que se acumulan en vez de despegarse. Se ajusta con cinco
  variables en `.pieces` (`styles/sections/work.css`):
  `--piece-height` es el alto de la ficha activa (70vh) y marca a la vez el
  recorrido de scroll de cada proyecto; `--piece-step` es el canto que asoma
  de cada tarjeta del mazo; `--piece-top` dónde se ancla la primera; y
  `--piece-gap` la separación, que en escritorio es 0 —el recorrido ya lo da
  el propio alto— y sólo se usa en móvil; y `--piece-tail`, el recorrido en el
  que el mazo completo se queda quieto antes de soltarse. Súbelo todo con
  cuidado: `--piece-height` + el escalón acumulado debe caber en la pantalla.
  **Nunca pongas un `margin-block-end` en la última ficha** para darle esa
  pausa: los márgenes del propio elemento recortan el rectángulo que confina
  un `sticky`, así que la suelta antes de tiempo y se sube por encima del
  mazo. Esa cola va como espacio del contenedor (`.pieces::after`).
- **Sólo se animan `transform`, `opacity` y `clip-path`.** Nada que dispare
  layout (width, height, top, left, margin). El pulgar de la cápsula de la nav
  es el caso de manual: sus casillas son de ancho igual (`grid-auto-columns:
  1fr`) justamente para que moverlo sea un `translate` de un ancho por
  posición y no haga falta medir nada en JS. Quién está activo lo resuelve
  `:has()` en CSS a partir del `data-current` que ya pone el scroll-spy; si
  crece `nav` en `data/site.ts`, añade el escalón de `--pod-i` que falte en
  `styles/components/header.css`.
- **Un solo `IntersectionObserver`** para los revelados (`scripts/reveal.ts`).
  Marca el elemento con `data-reveal` y deja la forma de la animación al CSS.
- **`preload="none"` en todo `<video>`.** La descarga arranca en el primer
  hover real, nunca al cargar la página, y ni siquiera entonces de inmediato:
  hacen falta 140 ms de puntero quieto dentro de la ficha. Cruzar la baraja de
  arriba abajo pasa por las cinco, y sin esa espera el gesto dispara cinco
  descargas de vídeo que nadie pidió. Con el ahorro de datos del navegador
  activado no se reproduce ninguno.
- **`backdrop-filter` sólo en tres sitios, y los tres están medidos.** El
  primero es la banda de desenfoque progresivo (`ProgressiveBlur`), ocho capas
  apiladas que se recomponen en cada frame de scroll: por eso la banda es
  estrecha, se apaga con `visibility` mientras estás arriba del todo y no se
  pinta por debajo de 900 px. El segundo es la cápsula de la navegación
  (`.nav__pod`), una sola capa sobre una píldora de ~46 px que además sólo
  existe en escritorio —en móvil la nav no se muestra, y el botón de menú se
  queda con la misma superficie de cristal pero sin desenfoque—. Lo que no se
  hace es poner fondo o `backdrop-filter` **a lo ancho de la barra**: eso
  devuelve el corte duro en el borde inferior que la banda existe para evitar.
  El tercero es el sello girado del hero (`.hero__stamp`), 6 px sobre una
  ficha del tamaño de un sello que además no se mueve con el scroll.
- **Las escenas de proyecto están en el HTML desde el build, pero cerradas
  son `display: none`.** No es sólo por esconderlas: dentro de un elemento sin
  caja el `loading="lazy"` de las imágenes no dispara, así que las quince
  capturas no se descargan mientras nadie abra una escena. El script la monta
  un frame antes de pedir la transición —`display` y `clip-path` en el mismo
  frame no animan— y la desmonta al cerrar. Van **fuera** de
  `<section class="work">`: `.piece__card` lleva `transform` en escritorio, y un
  ancestro transformado ancla cualquier `position: fixed` de dentro a la
  tarjeta en vez de a la ventana.
- **El carrusel de la escena es `scroll-snap` + una tira triplicada.** El alto
  de cada captura va en la FILA (`grid-auto-rows`), no en la ficha: un
  porcentaje sobre el ítem se resolvería contra una fila `auto` y, como
  `.slot` sólo tiene hijos absolutos, colapsaría a cero. Lo que sobra de
  `--shot-h` es el canto que asoma de las vecinas. El bucle lo cierra
  `scene.ts`: clona la tira tres veces y mantiene el scroll dentro del tercio
  del medio, saltando un tercio entero al pasarse. Como los tres son
  idénticos, el salto no se ve. Se mide una vez al abrir; el listener de
  scroll sólo compara dos números.
- **Con una escena abierta, el cursor lo manda ella.** `data-cursor-lock` en
  `<html>` congela el estado del cursor: sin ese candado, el primer
  `pointerout` sobre la tarjeta que quedó debajo borraría la X. Cualquier clic
  dentro de la escena cierra —es lo que el aspa está prometiendo—, y el botón
  «Volver» existe porque en táctil no hay cursor que prometa nada.
- Lo secundario se inicializa dentro de `requestIdleCallback`.
- `lenis` se importa dinámicamente y **sólo** en escritorio sin
  «reducir movimiento»: en móvil nunca llega a descargarse.
- **El campo de líneas del hero es un shader propio, sin librería 3D**
  (`scripts/waves.ts`): un triángulo a pantalla completa y WebGL crudo. Sigue
  las mismas reglas que todo lo demás —se dibuja desde `onTick`, no desde su
  propio rAF— y **deja de pintar en cuanto el hero sale de pantalla**, que con
  un lienzo del tamaño de la ventana no es un detalle. Se importa dinámicamente
  como `lenis`: en móvil no se descarga. Vive dentro de `.field` para heredar
  su máscara, y sus colores salen de `tokens.css` leídos en caliente. El mando
  de coste es `maxDpr` en `CFG`.

## Accesibilidad

- `prefers-reduced-motion: reduce` desactiva intro, cursor, parallax, cinta,
  apilado pegajoso y el campo de líneas del hero. Cada archivo de estilo trae su propio bloque.
- El acordeón de servicios usa `<details>` nativo: funciona sin JavaScript.
- El cursor a medida sólo oculta el puntero nativo cuando ya está en pantalla,
  así un fallo de JS nunca deja al usuario sin cursor.
- Los textos troceados por `SplitText` se cortan en build: el HTML llega
  completo y legible para lectores de pantalla y buscadores.

## Convención de movimiento

Las palabras entre `*asteriscos*` en `SplitText` se renderizan en cursiva de
acento (Gothicfed, `--f-serif`, color brasa):

```astro
<SplitText as="h1" lines={['Diseño interfaces', 'que *se sostienen*']} />
```

## Idiomas

El sitio principal está en **español (`/`) e inglés (`/en/`)**. Son dos páginas
generadas en el build, no un traductor en el navegador: cada URL pesa lo que
pesaba antes y funciona sin JavaScript.

- El idioma **no se pasa por props**: cada componente lo deduce de la ruta con
  `langOf(Astro.url.pathname)` (`src/i18n`). En el build es comparar cadenas.
- La redacción de la interfaz está en `data/ui.ts`, con el español como
  referencia: el objeto inglés se declara `typeof es`, así que si añades una
  frase y olvidas traducirla, `npm run check` lo dice.
- En las listas de contenido (proyectos, servicios, proceso, trayecto…) cada
  entrada lleva sus dos versiones al lado, en bloques `es` / `en`. Lo que no es
  texto —rutas de imagen, cliente, año, `id`— se escribe **una sola vez**.
- Los `id` de sección y los anclas **no se traducen** (`#trabajo`, `#servicios`…):
  así un enlace compartido no se rompe al cambiar de idioma, y el scroll-spy
  sirve igual para las dos portadas.
- Una sección nueva se añade en `components/Home.astro`, no en cada página.
- El selector de idioma son dos enlaces con `aria-current`, no un interruptor.

**Los comentarios del código y los nombres de clase siguen en español**, y la
página del torneo (`/pokemon`) es sólo española: es interna y no lleva selector.
