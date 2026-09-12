/** Fases de trabajo. Se pintan como bloques apilados con scroll pegajoso.
 *  Cada fase lleva sus dos idiomas al lado. */
import type { Lang } from '@i18n';

export interface StepCopy {
  title: string;
  duration: string;
  body: string;
}

export type Step = { step: string } & Record<Lang, StepCopy>;

export const process: Step[] = [
  {
    step: '01',
    es: {
      title: 'Escuchar',
      duration: '1 semana',
      body:
        'Antes de pensar en interfaces, nos sentamos a hablar. Necesito entender los objetivos del negocio, el alcance real del equipo y qué problema estamos tratando de resolver de fondo.',
    },
    en: {
      title: 'Listen',
      duration: '1 week',
      body:
        'Before thinking about interfaces, we sit down and talk. I need to understand the business goals, what the team can realistically take on, and which problem we are actually trying to solve.',
    },
  },
  {
    step: '02',
    es: {
      title: 'Investigar',
      duration: '1–2 semanas',
      body:
        'Aquí salimos a buscar respuestas para no diseñar a ciegas. Analizo a los usuarios, reviso cómo lo resuelve el mercado o audito los flujos que ya existen. Un buen diseño se sostiene en datos y observación, no en opiniones.',
    },
    en: {
      title: 'Research',
      duration: '1–2 weeks',
      body:
        'Here we go looking for answers so we are not designing blind. I study the users, review how the market solves it, or audit the flows you already have. Good design rests on data and observation, not on opinions.',
    },
  },
  {
    step: '03',
    es: {
      title: 'Ordenar',
      duration: '1–2 semanas',
      body:
        'Arquitectura, flujos y bocetos rápidos (wireframes). Aquí tomamos las decisiones críticas sobre qué va en dónde. Lo hacemos en baja fidelidad porque hacer cambios es rápido y barato mientras el diseño aún es un esquema gris.',
    },
    en: {
      title: 'Organise',
      duration: '1–2 weeks',
      body:
        'Architecture, flows and quick sketches (wireframes). This is where the critical decisions about what goes where get made. We do it in low fidelity because changes are fast and cheap while the design is still a grey outline.',
    },
  },
  {
    step: '04',
    es: {
      title: 'Crear',
      duration: '2–4 semanas',
      body:
        'Alta fidelidad, sistema de componentes y estados reales (vacío, error, carga). Armo prototipos que tú y tu equipo pueden navegar y probar. Es la etapa donde vemos exactamente cómo funcionará y se sentirá el producto final.',
    },
    en: {
      title: 'Create',
      duration: '2–4 weeks',
      body:
        'High fidelity, a component system and the real states (empty, error, loading). I build prototypes you and your team can navigate and test. This is the stage where we see exactly how the final product will work and feel.',
    },
  },
  {
    step: '05',
    es: {
      title: 'Entregar y acompañar',
      duration: 'Continuo',
      body:
        'Dejo todo documentado para que el equipo de desarrollo pueda trabajar sin fricciones. Además, hago acompañamiento mientras se construye, porque un diseño que no se supervisa pierde calidad al llegar al navegador.',
    },
    en: {
      title: 'Hand over and stay close',
      duration: 'Ongoing',
      body:
        'I leave everything documented so the development team can work without friction. I also stay involved while it gets built, because a design nobody supervises loses quality on its way to the browser.',
    },
  },
];
