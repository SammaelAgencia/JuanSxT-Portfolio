/**
 * Identidad del sitio. Todo lo que aparece en <head>, la nav y el pie
 * se edita únicamente desde aquí.
 *
 * Lo que no cambia de un idioma a otro —nombre, correo, teléfono, URLs— vive
 * una sola vez en `site`. Lo que sí cambia va en `siteCopy`, y en las listas
 * cada entrada lleva sus dos versiones al lado (`es` / `en`) para que no haya
 * dos arrays que se puedan desincronizar.
 */
import type { Lang } from '@i18n';

export const site = {
  name: 'Juan Pablo Sierra Tejada',
  shortName: 'JPST',
  email: 'juanpablos196@gmail.com',
  phone: '+57 318 482 1317',
  phoneHref: '+573184821317',
  url: 'https://juansxt.com',
  timezone: 'GMT-5',
  yearsExperience: 7,
  ogImage: '/media/og.png',
} as const;

export const siteCopy: Record<
  Lang,
  {
    role: string;
    jobTitle: string;
    location: string;
    title: string;
    description: string;
    availability: { open: boolean; label: string; detail: string };
  }
> = {
  es: {
    role: 'Diseñador UI/UX · Ingeniero Multimedia',
    jobTitle: 'Diseñador UI/UX',
    location: 'Bello, Antioquia — Colombia',
    title: 'Juan Pablo Sierra Tejada — Diseñador UI/UX & Ingeniero Multimedia',
    description:
      'Diseño interfaces web y de producto que se sostienen: investigación, wireframes y prototipos de alta fidelidad en Figma. Más de 7 años entre marca, ilustración y motion.',
    availability: {
      open: true,
      label: 'Agenda abierta',
      detail: 'Nuevos proyectos desde noviembre 2026',
    },
  },
  en: {
    role: 'UI/UX Designer · Multimedia Engineer',
    jobTitle: 'UI/UX Designer',
    location: 'Bello, Antioquia — Colombia',
    title: 'Juan Pablo Sierra Tejada — UI/UX Designer & Multimedia Engineer',
    description:
      'I design web and product interfaces that hold up: research, wireframes and high-fidelity prototypes in Figma. Over 7 years across brand, illustration and motion.',
    availability: {
      open: true,
      label: 'Open for work',
      detail: 'New projects from November 2026',
    },
  },
};

/** Navegación. El ancla y el índice son los mismos en los dos idiomas: los
 *  `id` de sección no se traducen, así que un enlace compartido nunca se
 *  rompe al cambiar de idioma. */
export const nav = [
  { href: '#trabajo',   index: '01', es: 'Trabajo',   en: 'Work' },
  { href: '#servicios', index: '02', es: 'Servicios', en: 'Services' },
  { href: '#proceso',   index: '03', es: 'Proceso',   en: 'Process' },
  { href: '#trayecto',  index: '04', es: 'Trayecto',  en: 'Career' },
] as const;

/** Entrada suelta del panel de menú móvil: contacto cierra la lista. */
export const navContact = { href: '#contacto', index: '05', es: 'Contacto', en: 'Contact' } as const;

export const socials = [
  { label: 'Behance',    handle: 'jpstdraws',        href: 'https://behance.net/jpstdraws' },
  { label: 'ArtStation', handle: 'juansierratejada', href: 'https://artstation.com/juansierratejada' },
] as const;

/** Datos sueltos que se leen como ficha técnica en varias secciones. */
export const facts = [
  { es: { label: 'Experiencia', value: '7+ años' },            en: { label: 'Experience', value: '7+ years' } },
  { es: { label: 'Base',        value: 'Medellín, CO' },       en: { label: 'Based in',   value: 'Medellín, CO' } },
  { es: { label: 'Idiomas',     value: 'ES nativo · EN B1' },  en: { label: 'Languages',  value: 'Native ES · EN B1' } },
  { es: { label: 'Formación',   value: 'Ing. Multimedia, USB' }, en: { label: 'Education', value: 'Multimedia Eng., USB' } },
] as const;
