/**
 * Idiomas del sitio principal.
 *
 * Español en `/` e inglés en `/en/`. Son dos páginas de verdad, generadas en
 * el build: no hay un traductor en el navegador, ni el HTML lleva las dos
 * versiones para esconder una. Cada URL pesa lo que pesaba antes.
 *
 * El idioma no se pasa de componente en componente: cada uno lo deduce de la
 * ruta con `langOf(Astro.url.pathname)`, que en el build es una comparación de
 * cadenas y en el navegador no existe.
 *
 * La página del torneo (/pokemon) queda fuera: es interna y sólo está en
 * español, así que cae en el idioma por defecto y no pinta el selector.
 */

export const langs = ['es', 'en'] as const;
export type Lang = (typeof langs)[number];

export const defaultLang: Lang = 'es';

/** Etiqueta del selector y atributo `lang` real de cada idioma. */
export const langMeta: Record<Lang, { label: string; name: string; locale: string; og: string }> = {
  es: { label: 'ES', name: 'Español', locale: 'es-CO', og: 'es_CO' },
  en: { label: 'EN', name: 'English', locale: 'en', og: 'en_US' },
};

/** Idioma a partir de la ruta. Todo lo que no cuelgue de /en/ es español. */
export function langOf(pathname: string): Lang {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : defaultLang;
}

/** Portada de un idioma. Es también la base de sus anclas. */
export function homePath(lang: Lang): string {
  return lang === 'en' ? '/en/' : '/';
}

/** ¿Estamos en la portada de ese idioma? Con y sin barra final. */
export function isHome(pathname: string, lang: Lang): boolean {
  const base = homePath(lang);
  return pathname === base || `${pathname}/` === base;
}

/** La misma página en el otro idioma. Sólo hay dos, así que es directo. */
export function otherLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}
