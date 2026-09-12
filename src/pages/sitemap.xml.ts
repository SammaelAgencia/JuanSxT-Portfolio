/**
 * Sitemap. Se genera en el build a partir de la lista de idiomas, así que
 * añadir una portada nueva no obliga a acordarse de este archivo.
 *
 * Sólo entran las páginas indexables: /pokemon es interna y lleva `noindex`,
 * de modo que anunciarla aquí sería contradecirse.
 *
 * Cada URL declara sus alternativas con `hreflang`, igual que el <head>: es
 * lo que le dice a Google que la portada española y la inglesa son la misma
 * página en dos idiomas y no contenido duplicado.
 */
import type { APIRoute } from 'astro';
import { site } from '@data/site';
import { langs, langMeta, homePath, defaultLang } from '@i18n';

export const GET: APIRoute = ({ site: base }) => {
  const origen = (base ?? new URL(site.url)).origin;
  const url = (lang: (typeof langs)[number]) => `${origen}${homePath(lang)}`;

  const alternativas = [
    ...langs.map((l) => `<xhtml:link rel="alternate" hreflang="${langMeta[l].locale}" href="${url(l)}"/>`),
    `<xhtml:link rel="alternate" hreflang="x-default" href="${url(defaultLang)}"/>`,
  ].join('');

  const cuerpo = langs
    .map((l) => `<url><loc>${url(l)}</loc>${alternativas}</url>`)
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">` +
      cuerpo +
      `</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
