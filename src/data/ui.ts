/**
 * Redacción de la interfaz, en los dos idiomas.
 *
 * Aquí vive todo el texto que NO es un dato de contenido (proyectos,
 * servicios, trayecto…): rótulos de sección, botones, titulares y microcopia.
 * Ningún `.astro` escribe una frase suelta; todos leen de aquí.
 *
 * Los asteriscos de `titulo`/`lines` son la convención de <SplitText>:
 * *así* se marca la palabra que va en cursiva de acento.
 *
 * El español es la referencia: `ui` obliga a que el inglés tenga exactamente
 * las mismas claves, así que si añades una frase y olvidas traducirla, el
 * `npm run check` lo dice.
 */
import type { Lang } from '@i18n';

const es = {
  skip: 'Saltar al contenido',

  header: {
    brandTag: 'Diseño UI/UX',
    brandAria: 'ir al inicio',
    cta: 'Hablemos',
    menu: 'Menú',
    navAria: 'Secciones',
    langAria: 'Idioma',
  },

  hero: {
    title: ['Interfaces', 'pensadas para', 'el *mundo real.*'],
    stamp: 'Años de oficio',
    lead:
      'Hola, soy Juan Pablo. Como diseñador UI/UX e ingeniero multimedia, ayudo a dar sentido a ideas complejas para convertirlas en pantallas que cualquiera pueda usar sin pensarlo demasiado. Investigo, organizo, armo prototipos en Figma y, si el proyecto lo pide, también me encargo de construirlas en el navegador.',
    mail: 'Escríbeme',
    scroll: 'Desplázate',
    focus: 'Enfoque',
    focusValue: 'Producto · Interfaz · Marca',
  },

  manifesto: {
    label: 'Enfoque',
    text:
      'Mi prioridad no es hacer pantallas bonitas en el primer intento, sino pantallas que funcionen. Diseño pensando en el contenido real y en las iteraciones que todo proyecto necesita. Lo visual llega después, y fluye mucho mejor cuando *la base está en orden.*',
  },

  work: {
    label: 'Trabajo seleccionado',
    projects: 'proyectos',
    span: '2021 — 2026',
    open: 'Ver proyecto',
    cursor: 'Ver',
    note: 'El detalle de cada proyecto va bajo NDA en varios casos. Lo enseño en llamada.',
    cta: 'Pedir el portafolio completo',
    /** Escena a pantalla completa. */
    back: 'Volver',
    shot: 'imagen',
    of: 'de',
  },

  services: { label: 'Servicios' },

  process: {
    label: 'Cómo trabajo',
    lede: 'Cinco fases. Porque diseñar basándonos en suposiciones siempre sale caro al final.',
  },

  trajectory: {
    label: 'Trayecto',
    since: 'Desde',
    sinceYear: '2017',
    rail:
      'Medellín, Madrid y de vuelta. Agencia, institución y encargo independiente: tres formas muy distintas de que un diseño llegue a producción.',
  },

  toolkit: { label: 'Caja de herramientas' },

  contact: {
    title: ['Cuéntame qué', 'estás *construyendo*'],
    mailSubject: 'Proyecto de diseño',
    copy: 'Copiar',
    copied: 'Copiado',
    copyStatus: 'Correo copiado',
    whatsapp: 'Escribir por WhatsApp',
    availability: 'Disponibilidad',
    location: 'Ubicación',
  },

  footer: {
    craft: 'Diseñado y construido a mano',
    top: 'Volver arriba',
  },

  media: { plate: 'Imagen' },
};

const en: typeof es = {
  skip: 'Skip to content',

  header: {
    brandTag: 'UI/UX Design',
    brandAria: 'back to top',
    cta: "Let's talk",
    menu: 'Menu',
    navAria: 'Sections',
    langAria: 'Language',
  },

  hero: {
    title: ['Interfaces', 'built for', 'the *real world.*'],
    stamp: 'Years in the craft',
    lead:
      "Hi, I'm Juan Pablo. As a UI/UX designer and multimedia engineer, I help make sense of complex ideas and turn them into screens anyone can use without thinking twice. I research, organise, build prototypes in Figma and, when the project calls for it, I also build them in the browser.",
    mail: 'Write to me',
    scroll: 'Scroll',
    focus: 'Focus',
    focusValue: 'Product · Interface · Brand',
  },

  manifesto: {
    label: 'Approach',
    text:
      'My priority is not pretty screens on the first try, but screens that work. I design around real content and the iterations every project needs. The visual layer comes later, and it flows much better once *the groundwork is in order.*',
  },

  work: {
    label: 'Selected work',
    projects: 'projects',
    span: '2021 — 2026',
    open: 'View project',
    cursor: 'View',
    note: 'Several of these are under NDA in detail. I walk through them on a call.',
    cta: 'Ask for the full portfolio',
    back: 'Back',
    shot: 'image',
    of: 'of',
  },

  services: { label: 'Services' },

  process: {
    label: 'How I work',
    lede: 'Five phases. Because designing on assumptions always gets expensive in the end.',
  },

  trajectory: {
    label: 'Career',
    since: 'Since',
    sinceYear: '2017',
    rail:
      'Medellín, Madrid and back. Agency, public institution and independent work: three very different ways of getting a design into production.',
  },

  toolkit: { label: 'Toolkit' },

  contact: {
    title: ['Tell me what', "you are *building*"],
    mailSubject: 'Design project',
    copy: 'Copy',
    copied: 'Copied',
    copyStatus: 'Email copied',
    whatsapp: 'Message me on WhatsApp',
    availability: 'Availability',
    location: 'Location',
  },

  footer: {
    craft: 'Designed and built by hand',
    top: 'Back to top',
  },

  media: { plate: 'Image' },
};

export const ui: Record<Lang, typeof es> = { es, en };
