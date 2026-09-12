/**
 * Cursor invertido + imanes.
 *
 * Sólo en punteros finos. Se escribe con `transform` sobre elementos
 * promovidos a su propia capa, así que no provoca reflow. Se apoya en el
 * bucle rAF compartido de `env.ts`: no abre uno propio.
 *
 * Estados vía atributo en <html>:
 *   data-cursor="link" | "view" | "copy" | "close"
 * Se activan con `data-cursor-hint` en cualquier elemento. Con
 * `data-cursor-lock` en <html> el estado deja de responder al hover: lo usa la
 * escena de proyecto, que impone la X mientras está abierta.
 */
import { onTick, lerp, finePointer, reduceMotion } from './env';

export function initCursor(): void {
  if (!finePointer()) return;

  const root = document.documentElement;
  const dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
  const disc = document.querySelector<HTMLElement>('[data-cursor-disc]');
  const label = document.querySelector<HTMLElement>('[data-cursor-label]');
  if (!dot || !disc) return;

  root.setAttribute('data-has-cursor', 'true');

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let dx = tx;
  let dy = ty;
  let visible = false;

  /* Cuánto se acerca el disco al puntero en cada frame. Más alto lo pega al
     cursor y se pierde el arrastre; más bajo se despega demasiado. */
  const soft = reduceMotion() ? 1 : 0.2;

  window.addEventListener(
    'pointermove',
    (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        // Sin esto, el disco entraría cruzando la pantalla desde el centro.
        dx = tx;
        dy = ty;
        root.setAttribute('data-cursor-visible', 'true');
      }
    },
    { passive: true },
  );

  document.addEventListener('pointerleave', () => {
    root.setAttribute('data-cursor-visible', 'false');
    visible = false;
  });

  onTick((dt) => {
    // El punto va pegado al puntero; el disco llega tarde. Ese desfase es
    // el que da la sensación de peso.
    dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
    dx = lerp(dx, tx, Math.min(soft * dt, 1));
    dy = lerp(dy, ty, Math.min(soft * dt, 1));
    disc.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
  });

  // --- Estados: delegación de eventos, un solo listener --------------------
  /* Con el candado puesto el estado lo manda otro (la escena de proyecto): el
     hover no puede pisarlo ni al entrar ni al salir. */
  const bloqueado = () => root.hasAttribute('data-cursor-lock');

  document.addEventListener(
    'pointerover',
    (e) => {
      if (bloqueado()) return;
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor-hint]');
      if (!target) return;
      root.setAttribute('data-cursor', target.dataset.cursorHint || 'link');
      if (label) label.textContent = target.dataset.cursorLabel || '';
    },
    { passive: true },
  );

  document.addEventListener(
    'pointerout',
    (e) => {
      if (bloqueado()) return;
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor-hint]');
      if (!target) return;
      const next = (e as PointerEvent).relatedTarget as Element | null;
      if (next && target.contains(next)) return;
      root.removeAttribute('data-cursor');
      if (label) label.textContent = '';
    },
    { passive: true },
  );
}

/**
 * Imán: el elemento se desplaza hacia el puntero dentro de un radio.
 * Se aplica con `data-magnetic` (opcionalmente `data-magnetic-strength`).
 */
export function initMagnets(): void {
  if (!finePointer() || reduceMotion()) return;

  const magnets = document.querySelectorAll<HTMLElement>('[data-magnetic]');
  if (!magnets.length) return;

  magnets.forEach((el) => {
    const strength = Number(el.dataset.magneticStrength ?? 0.32);
    let raf = 0;

    const move = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * strength;
        const dy = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.setProperty('--mx', `${dx.toFixed(2)}px`);
        el.style.setProperty('--my', `${dy.toFixed(2)}px`);
      });
    };

    const reset = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    };

    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', reset, { passive: true });
    el.addEventListener('blur', reset);
  });
}
