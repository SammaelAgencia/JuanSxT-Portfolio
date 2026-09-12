/**
 * PROYECTOS DESTACADOS
 * --------------------------------------------------------------------------
 * Cada entrada alimenta el índice de trabajo y su previsualización.
 *
 * `cover`  → imagen estática (webp/avif). Deja el archivo en /public/media/work/
 *            Todas en 4/3: es la proporción que deja la ficha de escritorio,
 *            y también la que se usa tal cual en móvil.
 * `gallery` → las tres capturas de la escena a pantalla completa. Mismo sitio
 *            y misma proporción que `cover`. Mientras un archivo no exista, el
 *            hueco enseña una placa con su nombre: sabes exactamente qué soltar.
 * `motion` → mp4/webm opcional de 3-6 s, sin audio. Sólo se descarga cuando el
 *            puntero entra en la fila, así que no penaliza la carga inicial.
 *            Si no existe, la tarjeta usa `cover` sin problema.
 *
 * Las rutas de archivo, el cliente y el año se escriben UNA vez: sólo el texto
 * traducible (título, disciplinas, resumen y resultado) va por idioma, en los
 * bloques `es` / `en` de cada proyecto.
 *
 * Reemplaza títulos, métricas y nombres de cliente por los definitivos cuando
 * tengas permiso para publicarlos.
 */
import type { Lang } from '@i18n';

export interface ProjectCopy {
  title: string;
  discipline: string[];
  summary: string;
  outcome: string;
}

export type Project = {
  id: string;
  client: string;
  year: string;
  cover: string;
  /** Capturas de la escena a pantalla completa. Tres por proyecto. */
  gallery?: string[];
  motion?: string;
  ratio: string;
  href?: string;
  accent?: 'ember' | 'ultra' | 'lime' | 'clay';
} & Record<Lang, ProjectCopy>;

export const projects: Project[] = [
  {
    id: 'plataforma-b2b',
    client: 'ABCW',
    year: '2025',
    cover: '/media/work/plataforma-b2b.webp',
    gallery: [
      '/media/work/plataforma-b2b-01.webp',
      '/media/work/plataforma-b2b-02.webp',
      '/media/work/plataforma-b2b-03.webp',
    ],
    motion: '/media/work/plataforma-b2b.mp4',
    ratio: '4 / 3',
    accent: 'ultra',
    es: {
      title: 'YAMAHA MÉXICO',
      discipline: ['Diseño Web', 'UI', 'UX'],
      summary:
        'El sitio anterior contaba con un diseño obsoleto y estaba saturado de información. Lo transformé en una experiencia moderna y vanguardista, simplificando la navegación y alineando su estética visual con los estándares internacionales de los otros sitios de YAMAHA.',
      outcome: 'Un sitio web completamente rediseñado, limpio y a la altura de una marca global.',
    },
    en: {
      title: 'YAMAHA MÉXICO',
      discipline: ['Web Design', 'UI', 'UX'],
      summary:
        'The previous site had an obsolete design and was saturated with information. I transformed it into a modern, avant-garde experience, simplifying navigation and aligning its visual aesthetics with the international standards of other YAMAHA sites.',
      outcome: 'A completely redesigned website, clean and up to the standards of a global brand.',
    },
  },
  {
    id: 'landing-conversion',
    client: 'Cliente retail — ABCW',
    year: '2026',
    cover: '/media/work/landing-conversion.webp',
    gallery: [
      '/media/work/landing-conversion-01.webp',
      '/media/work/landing-conversion-02.webp',
      '/media/work/landing-conversion-03.webp',
    ],
    motion: '/media/work/landing-conversion.mp4',
    ratio: '4 / 3',
    accent: 'ember',
    es: {
      title: 'Landings de conversión',
      discipline: ['Estrategia UX', 'UI', 'Lead Generation'],
      summary:
        'Una landing page debe ser mucho más que un diseño atractivo. Creé páginas altamente optimizadas y conectadas directamente a campañas de Paid Media, donde la prioridad fue reducir la fricción y guiar al usuario para maximizar la generación de leads sin sacrificar la estética visual.',
      outcome: 'Flujos de captación optimizados y alineados para maximizar el ROI de las campañas publicitarias.',
    },
    en: {
      title: 'Conversion landing pages',
      discipline: ['UX strategy', 'UI', 'Lead generation'],
      summary:
        'A landing page must be much more than just visually appealing. I created highly optimized pages directly connected to Paid Media campaigns, prioritizing friction reduction and user guidance to maximize lead generation without sacrificing visual aesthetics.',
      outcome: 'Optimized capture flows aligned to maximize ad campaign ROI.',
    },
  },
  {
    id: 'identidad-marca',
    client: 'SOMOS — Madrid — Freelance',
    year: '2021',
    cover: '/media/work/identidad-marca.webp',
    gallery: [
      '/media/work/identidad-marca-01.webp',
      '/media/work/identidad-marca-02.webp',
      '/media/work/identidad-marca-03.webp',
    ],
    ratio: '4 / 3',
    accent: 'clay',
    es: {
      title: 'Identidad de marca',
      discipline: ['Branding', 'Diseño de Logos', 'Manuales de Marca'],
      summary:
        'Cuento con una amplia experiencia creando logotipos y manuales de identidad corporativa para empresas de múltiples sectores. Mi enfoque va desde la conceptualización hasta la estandarización, garantizando sistemas visuales sólidos que mantienen su coherencia y escalabilidad en cualquier punto de contacto.',
      outcome: 'Identidades visuales versátiles y manuales de marca detallados, listos para cualquier medio.',
    },
    en: {
      title: 'Brand identity',
      discipline: ['Branding', 'Logo Design', 'Brand Guidelines'],
      summary:
        'I have extensive experience creating logos and corporate identity guidelines for companies across multiple sectors. My approach ranges from conceptualization to standardization, ensuring solid visual systems that maintain their coherence and scalability across any touchpoint.',
      outcome: 'Versatile visual identities and detailed brand guidelines, ready for any medium.',
    },
  },
  {
    id: 'realidad-aumentada',
    client: 'SOMOS — ABCW — Freelance',
    year: '2017 - Actualidad',
    cover: '/media/work/realidad-aumentada.webp',
    gallery: [
      '/media/work/realidad-aumentada-01.webp',
      '/media/work/realidad-aumentada-02.webp',
      '/media/work/realidad-aumentada-03.webp',
    ],
    motion: '/media/work/realidad-aumentada.mp4',
    ratio: '4 / 3',
    accent: 'lime',
    es: {
      title: 'Diseño y Desarrollo Web',
      discipline: ['Diseño Web', 'Resolución de Problemas', 'UI/UX'],
      summary:
        'A lo largo de mi trayectoria he construido una gran cantidad de sitios web, enfrentándome a todo tipo de retos técnicos y visuales. Mi enfoque va más allá de la estética: me especializo en diagnosticar y resolver problemas complejos de interfaz y experiencia de usuario para entregar productos funcionales, escalables y optimizados.',
      outcome: 'Decenas de sitios web publicados y problemas críticos de diseño resueltos con éxito.',
    },
    en: {
      title: 'Web Design & Development',
      discipline: ['Web Design', 'Problem Solving', 'UI/UX'],
      summary:
        'Throughout my career, I have built a large number of websites, tackling all kinds of technical and visual challenges. My focus goes beyond aesthetics: I specialize in diagnosing and solving complex interface and user experience problems to deliver functional, scalable, and optimized products.',
      outcome: 'Dozens of websites launched and critical design problems successfully resolved.',
    },
  },
  {
    id: 'ilustracion-nft',
    client: 'Proyecto independiente',
    year: '2022 - Actualidad',
    cover: '/media/work/ilustracion-nft.webp',
    gallery: [
      '/media/work/ilustracion-nft-01.webp',
      '/media/work/ilustracion-nft-02.webp',
      '/media/work/ilustracion-nft-03.webp',
    ],
    ratio: '4 / 3',
    accent: 'ember',
    es: {
      title: 'Ilustración y Concept Art',
      discipline: ['Ilustración Digital', 'Concept Art', 'Desarrollo Visual'],
      summary:
        'Cuento con experiencia en la creación de ilustraciones digitales y arte conceptual con un alto nivel de detalle y acabado profesional. Abarco desde el diseño de personajes y entornos hasta el desarrollo visual completo para proyectos narrativos y cómics originales, aportando siempre una dirección artística sólida.',
      outcome: 'Piezas ilustradas y arte conceptual de calidad profesional, listas para producción.',
    },
    en: {
      title: 'Illustration & Concept Art',
      discipline: ['Digital Illustration', 'Concept Art', 'Visual Development'],
      summary:
        'I have experience creating digital illustrations and concept art with a high level of detail and a professional finish. I cover everything from character and environment design to complete visual development for narrative projects and original comics, always providing a solid artistic direction.',
      outcome: 'Illustrated pieces and professional-quality concept art, ready for production.',
    },
  },
];
