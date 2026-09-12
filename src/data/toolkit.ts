/** Herramientas y capacidades. Alimenta la rejilla de skills.
 *  Los nombres de programa no se traducen; el resto sí. */
import type { Lang } from '@i18n';

export type ToolkitGroup = Record<Lang, { label: string; items: string[] }>;

export const toolkit: ToolkitGroup[] = [
  {
    es: {
      label: 'Diseño',
      items: ['Figma', 'Wireframing', 'Prototipado hi-fi', 'Flujos UX', 'Diseño responsive', 'Design systems'],
    },
    en: {
      label: 'Design',
      items: ['Figma', 'Wireframing', 'Hi-fi prototyping', 'UX flows', 'Responsive design', 'Design systems'],
    },
  },
  {
    es: {
      label: 'Visual',
      items: ['Illustrator', 'Photoshop', 'Identidad de marca', 'Ilustración digital', 'Iconografía'],
    },
    en: {
      label: 'Visual',
      items: ['Illustrator', 'Photoshop', 'Brand identity', 'Digital illustration', 'Iconography'],
    },
  },
  {
    es: {
      label: 'Movimiento',
      items: ['After Effects', 'Premiere', 'Micro-interacción', 'Edición de video'],
    },
    en: {
      label: 'Motion',
      items: ['After Effects', 'Premiere', 'Micro-interaction', 'Video editing'],
    },
  },
  {
    es: {
      label: 'Construcción',
      items: ['WordPress', 'HTML / CSS', 'Astro', 'Handoff a desarrollo'],
    },
    en: {
      label: 'Build',
      items: ['WordPress', 'HTML / CSS', 'Astro', 'Developer handoff'],
    },
  },
];

/** Cinta en bucle. Frases cortas: se leen en movimiento. */
export const marqueeWords: Record<Lang, readonly string[]> = {
  es: [
    'Interfaz',
    'Producto',
    'Sistema de diseño',
    'Identidad',
    'Ilustración',
    'Motion',
    'Investigación',
    'Prototipo',
  ],
  en: [
    'Interface',
    'Product',
    'Design system',
    'Identity',
    'Illustration',
    'Motion',
    'Research',
    'Prototype',
  ],
};
