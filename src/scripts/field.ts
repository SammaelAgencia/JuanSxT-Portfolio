/**
 * Campo reactivo del hero.
 *
 * Un foco (elemento con gradiente radial) sigue al puntero con amortiguación
 * y revela una retícula más brillante debajo. Todo se mueve con `transform`,
 * de modo que el navegador sólo recompone capas: no hay repintado del fondo.
 *
 * También expone `--px` / `--py` normalizados (-1 a 1) en el contenedor,
 * que el CSS usa para el parallax de las capas del hero.
 */
import { onTick, lerp, finePointer, reduceMotion } from './env';

export function initField(): void {
  const field = document.querySelector<HTMLElement>('[data-field]');
  if (!field) return;

  const spot = field.querySelector<HTMLElement>('[data-field-spot]');

  // En táctil el foco no tiene sentido: se deja la retícula estática.
  if (!finePointer() || reduceMotion()) {
    field.setAttribute('data-field-static', 'true');
    return;
  }

  let rect = field.getBoundingClientRect();
  let tx = rect.width / 2;
  let ty = rect.height / 2;
  let cx = tx;
  let cy = ty;
  let active = false;

  const measure = () => {
    rect = field.getBoundingClientRect();
  };

  const ro = new ResizeObserver(measure);
  ro.observe(field);
  window.addEventListener('scroll', measure, { passive: true });

  field.addEventListener(
    'pointermove',
    (e) => {
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
      if (!active) {
        active = true;
        cx = tx;
        cy = ty;
        field.setAttribute('data-field-active', 'true');
      }
    },
    { passive: true },
  );

  field.addEventListener('pointerleave', () => {
    active = false;
    field.setAttribute('data-field-active', 'false');
  });

  const stop = onTick((dt) => {
    const t = Math.min(0.11 * dt, 1);
    cx = lerp(cx, tx, t);
    cy = lerp(cy, ty, t);

    if (spot) spot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;

    // Normalizado para el parallax de las capas de texto.
    const nx = rect.width ? (cx / rect.width) * 2 - 1 : 0;
    const ny = rect.height ? (cy / rect.height) * 2 - 1 : 0;
    field.style.setProperty('--px', nx.toFixed(3));
    field.style.setProperty('--py', ny.toFixed(3));
  });

  // Si el hero sale de pantalla, el bucle se apaga.
  const io = new IntersectionObserver(
    ([entry]) => field.toggleAttribute('data-field-idle', !entry?.isIntersecting),
    { threshold: 0 },
  );
  io.observe(field);

  window.addEventListener('pagehide', () => {
    stop();
    ro.disconnect();
    io.disconnect();
  });
}
