/** Servicios. El orden en el array es el orden en pantalla.
 *  Cada servicio lleva sus dos idiomas al lado: se editan juntos. */
import type { Lang } from '@i18n';

export interface ServiceCopy {
  title: string;
  claim: string;
  body: string;
  deliverables: string[];
}

export type Service = { id: string; index: string } & Record<Lang, ServiceCopy>;

export const services: Service[] = [
  {
    id: 'producto',
    index: '01',
    es: {
      title: 'Diseño de producto digital',
      claim: 'Del caos a una pantalla clara.',
      body:
        'Me encargo de todo el recorrido: entiendo qué problema necesitas resolver, organizo la información y armo prototipos en Figma. Ninguna idea pasa a desarrollo sin tener la certeza de que funciona para el usuario.',
      deliverables: ['Auditoría UX', 'Arquitectura de información', 'Wireframes', 'Prototipo navegable'],
    },
    en: {
      title: 'Digital product design',
      claim: 'From chaos to one clear screen.',
      body:
        'I take the whole route: I work out which problem you need solved, organise the information and build prototypes in Figma. No idea reaches development before we are sure it works for the user.',
      deliverables: ['UX audit', 'Information architecture', 'Wireframes', 'Clickable prototype'],
    },
  },
  {
    id: 'interfaz',
    index: '02',
    es: {
      title: 'Interfaz y sistemas de diseño',
      claim: 'Sistemas para que tu equipo trabaje más rápido.',
      body:
        'Creo librerías y componentes ordenados para que no tengas que resolver las mismas dudas de diseño dos veces. Documento las decisiones para que cualquier persona del equipo pueda usar el sistema sin perderse.',
      deliverables: ['Design tokens', 'Librería de componentes', 'Guía de uso', 'Handoff a desarrollo'],
    },
    en: {
      title: 'Interface and design systems',
      claim: 'Systems so your team moves faster.',
      body:
        'I build tidy libraries and components so the same design questions never have to be answered twice. I document the decisions so anyone on the team can use the system without getting lost.',
      deliverables: ['Design tokens', 'Component library', 'Usage guide', 'Developer handoff'],
    },
  },
  {
    id: 'web',
    index: '03',
    es: {
      title: 'Sitios y landings',
      claim: 'Diseño y desarrollo, sin cortocircuitos.',
      body:
        'Diseño tu sitio y me encargo de dejarlo funcionando, ya sea en WordPress o con código a medida. Al hacer ambas cosas, me aseguro de que el resultado en el navegador sea exactamente el que aprobaste en Figma.',
      deliverables: ['Diseño responsive', 'Montaje y publicación', 'Optimización de carga', 'SEO técnico base'],
    },
    en: {
      title: 'Sites and landing pages',
      claim: 'Design and build, with nothing lost in between.',
      body:
        'I design your site and get it running, either on WordPress or in hand-written code. Doing both is what guarantees the result in the browser is exactly the one you approved in Figma.',
      deliverables: ['Responsive design', 'Build and launch', 'Load-time optimisation', 'Technical SEO baseline'],
    },
  },
  {
    id: 'marca',
    index: '04',
    es: {
      title: 'Identidad de marca',
      claim: 'Un sistema visual que aguanta salir de la presentación.',
      body:
        'Concepto, logotipo, paleta, tipografía y manual. Pensado desde el inicio para sobrevivir a un feed de Instagram, a una factura y a una pantalla de carga.',
      deliverables: ['Concepto y territorio', 'Logotipo y variantes', 'Sistema visual', 'Manual de marca'],
    },
    en: {
      title: 'Brand identity',
      claim: 'A visual system that survives leaving the deck.',
      body:
        'Concept, logotype, palette, type and guidelines. Built from the start to hold up on an Instagram feed, on an invoice and on a loading screen.',
      deliverables: ['Concept and territory', 'Logotype and variants', 'Visual system', 'Brand guidelines'],
    },
  },
  {
    id: 'motion',
    index: '05',
    es: {
      title: 'Ilustración y motion',
      claim: 'El detalle que hace que un producto se sienta vivo.',
      body:
        'Ilustración digital, iconografía a medida y piezas en movimiento para producto o campaña. Después de siete años en Premiere y After Effects, sé cuándo el movimiento suma y cuándo sólo estorba.',
      deliverables: ['Ilustración digital', 'Sistema de iconos', 'Micro-animación de UI', 'Edición y motion'],
    },
    en: {
      title: 'Illustration and motion',
      claim: 'The detail that makes a product feel alive.',
      body:
        'Digital illustration, custom iconography and moving pieces for product or campaign. After seven years in Premiere and After Effects, I know when motion adds something and when it only gets in the way.',
      deliverables: ['Digital illustration', 'Icon system', 'UI micro-animation', 'Editing and motion'],
    },
  },
];
