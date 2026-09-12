/** Trayectoria profesional. Orden descendente por fecha.
 *  Empresa, lugar y fechas son iguales en los dos idiomas; el cargo y los
 *  logros llevan su versión al lado. */
import type { Lang } from '@i18n';

export interface RoleCopy {
  title: string;
  /** «Hoy» / «Today» en el puesto actual; en los demás es el año. */
  to: string;
  bullets: string[];
}

export type Role = {
  company: string;
  place: string;
  from: string;
  current?: boolean;
} & Record<Lang, RoleCopy>;

export const experience: Role[] = [
  {
    company: 'ABCW',
    place: 'Medellín, CO',
    from: '2023',
    current: true,
    es: {
      title: 'Jr. Web Designer',
      to: 'Hoy',
      bullets: [
        'Diseño interfaces completas: del wireframe al prototipo de alta fidelidad en Figma.',
        'Propongo estructuras de sitio, landings y flujos UX en los proyectos más complejos del equipo.',
        'Reviso el trabajo visual del equipo para sostener el estándar de calidad.',
        'Traduzco pedidos de cliente en decisiones de diseño alineadas al objetivo de negocio.',
      ],
    },
    en: {
      title: 'Jr. Web Designer',
      to: 'Today',
      bullets: [
        'I design complete interfaces: from wireframe to high-fidelity prototype in Figma.',
        'I propose site structures, landing pages and UX flows on the team’s most complex projects.',
        'I review the team’s visual work to hold the quality standard.',
        'I turn client requests into design decisions aligned with the business goal.',
      ],
    },
  },
  {
    company: 'SOMOS',
    place: 'Madrid, ES',
    from: '2020',
    es: {
      title: 'Diseñador Web y Gráfico',
      to: '2022',
      bullets: [
        'Identidades de marca de extremo a extremo, del concepto al manual.',
        'Diseño de sitios web e interfaces digitales completas.',
        'Presentaciones corporativas, brochures y portafolios de cliente.',
        'Piezas para redes y producción/edición de video.',
      ],
    },
    en: {
      title: 'Web and Graphic Designer',
      to: '2022',
      bullets: [
        'End-to-end brand identities, from concept to guidelines.',
        'Design of websites and complete digital interfaces.',
        'Corporate decks, brochures and client portfolios.',
        'Social media pieces and video production/editing.',
      ],
    },
  },
  {
    company: 'SENA',
    place: 'Medellín, CO',
    from: '2021',
    es: {
      title: 'Auxiliar de Contenidos',
      to: '2021',
      bullets: [
        'Lideré un equipo de 2 a 3 aprendices en un videojuego de realidad aumentada.',
        'Desarrollé el arte conceptual y el diseño web del proyecto.',
        'Construí y publiqué el sitio del proyecto.',
      ],
    },
    en: {
      title: 'Content Assistant',
      to: '2021',
      bullets: [
        'Led a team of two to three trainees on an augmented reality video game.',
        'Developed the concept art and the web design for the project.',
        'Built and shipped the project site.',
      ],
    },
  },
  {
    company: 'Independiente',
    place: 'Freelance',
    from: '2017',
    es: {
      title: 'Ingeniero Multimedia',
      to: '2022',
      bullets: [
        'Marca e identidad visual para pymes y clientes independientes.',
        'Ilustración digital, incluidas colecciones NFT.',
        'Diseño y desarrollo de sitios en WordPress.',
        'Interfaces de aplicación, motion y piezas para campaña.',
      ],
    },
    en: {
      title: 'Multimedia Engineer',
      to: '2022',
      bullets: [
        'Brand and visual identity for small businesses and independent clients.',
        'Digital illustration, including NFT collections.',
        'Design and development of WordPress sites.',
        'App interfaces, motion and campaign pieces.',
      ],
    },
  },
];

export const education: (Record<Lang, { title: string; place: string }> & {
  school: string;
  years: string;
})[] = [
  {
    school: 'Universidad San Buenaventura',
    years: '2017 — 2022',
    es: { title: 'Ingeniería Multimedia', place: 'Medellín' },
    en: { title: 'Multimedia Engineering', place: 'Medellín' },
  },
  {
    school: 'SENA',
    years: '—',
    es: { title: 'Tecnología en Producción Multimedia', place: 'Medellín' },
    en: { title: 'Multimedia Production Technologist', place: 'Medellín' },
  },
];
