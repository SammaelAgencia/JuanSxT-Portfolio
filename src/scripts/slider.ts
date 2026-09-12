/**
 * Carruseles de láminas.
 *
 * El desplazamiento lo hace el navegador: la tira es un contenedor con
 * `overflow-x` y `scroll-snap`, así que el gesto táctil y la rueda funcionan
 * sin JavaScript. Lo único que aporta el script son los botones y los puntos,
 * y para eso no mide nada por frame: lee `offsetLeft`, que ya está calculado,
 * y sólo cuando alguien pulsa o termina de desplazarse.
 *
 * Vive dentro de paneles que arrancan ocultos (`hidden`), de modo que al
 * iniciarse las medidas serían cero. Por eso no se guarda ninguna: se
 * consultan en el momento del clic, cuando la lámina ya está en pantalla.
 */
import { reduceMotion } from './env';

export function initSliders(): void {
  const sliders = document.querySelectorAll<HTMLElement>('[data-slider]');
  if (!sliders.length) return;

  for (const slider of sliders) montar(slider);
}

function montar(slider: HTMLElement): void {
  const track = slider.querySelector<HTMLElement>('[data-slider-track]');
  if (!track) return;

  const slides = [...track.children] as HTMLElement[];
  if (slides.length < 2) return;

  const prev = slider.querySelector<HTMLButtonElement>('[data-slider-prev]');
  const next = slider.querySelector<HTMLButtonElement>('[data-slider-next]');
  const dots = [...slider.querySelectorAll<HTMLButtonElement>('[data-slider-dot]')];

  /** Lámina más cercana al borde izquierdo de la tira. */
  const actual = (): number => {
    const x = track.scrollLeft;
    let best = 0;
    let dist = Infinity;
    slides.forEach((slide, i) => {
      const d = Math.abs(slide.offsetLeft - x);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    return best;
  };

  const ir = (i: number) => {
    const destino = slides[Math.max(0, Math.min(slides.length - 1, i))];
    if (!destino) return;
    // Con «reducir movimiento» el salto es seco: un desplazamiento animado de
    // pantalla entera es justo lo que esa preferencia pide evitar.
    track.scrollTo({
      left: destino.offsetLeft,
      behavior: reduceMotion() ? 'auto' : 'smooth',
    });
  };

  const pintar = () => {
    const i = actual();
    dots.forEach((dot, d) => {
      dot.setAttribute('aria-current', String(d === i));
    });
    // Los extremos se apagan: el carrusel no da la vuelta, y un botón que no
    // hace nada tiene que decirlo.
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === slides.length - 1;
    slider.style.setProperty('--slider-i', String(i));
  };

  prev?.addEventListener('click', () => ir(actual() - 1));
  next?.addEventListener('click', () => ir(actual() + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => ir(i)));

  let ticking = false;
  track.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        pintar();
      });
    },
    { passive: true },
  );

  pintar();
}
