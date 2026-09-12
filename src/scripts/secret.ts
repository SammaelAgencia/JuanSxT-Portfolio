/**
 * Acceso oculto a /pokemon: se teclea la palabra estando en el índice.
 *
 * Es un solo listener de teclado sobre una ventana deslizante de tantas letras
 * como tenga el código —no guarda historial ni monta temporizadores—, y sólo
 * se instala en el índice: en la propia página del torneo no hay nada que
 * escuchar. La palabra vive en `data/pokemon.ts`, no aquí.
 */
import { torneo } from '../data/pokemon';

/** Las dos portadas —española e inglesa—, servidas en dev, en `preview` y con
 *  `build.format: 'directory'`. */
function enIndice(): boolean {
  const path = window.location.pathname.replace(/index\.html$/, '');
  return ['', '/', '/en', '/en/'].includes(path);
}

export function initSecret(): void {
  if (!enIndice()) return;

  const code = torneo.codigo.toLowerCase();
  let buffer = '';

  window.addEventListener('keydown', (e) => {
    // Los atajos del navegador y del sistema no son texto tecleado.
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    // Sólo letras sueltas: las teclas con nombre ('Shift', 'Enter'…) miden más.
    if (e.key.length !== 1) return;
    // Nunca se espía un campo de texto.
    const target = e.target as Element | null;
    if (target?.closest('input, textarea, select, [contenteditable]')) return;

    buffer = (buffer + e.key.toLowerCase()).slice(-code.length);
    if (buffer !== code) return;

    buffer = '';
    window.location.href = torneo.ruta;
  });
}
