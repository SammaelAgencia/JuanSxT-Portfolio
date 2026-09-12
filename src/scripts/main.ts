/**
 * Punto de entrada. Astro lo empaqueta como un único módulo diferido.
 *
 * Estrategia de coste:
 *   · Lo que afecta a lo que se ve primero (intro, cabecera, revelado) corre ya.
 *   · Lo demás espera a que el hilo principal esté libre (requestIdleCallback).
 *   · El scroll suave (Lenis) y el campo de líneas del hero se cargan de forma
 *     diferida y sólo si hacen falta: en móvil y con "reducir movimiento"
 *     nunca llegan a descargarse.
 */
import { reduceMotion, isDesktop } from './env';
import { initReveal } from './reveal';
import { initCursor, initMagnets } from './cursor';
import { initField } from './field';
import { initScenes } from './scene';
import { initSecret } from './secret';
import { initTabs, initMusic } from './torneo';
import { initSliders } from './slider';
import {
  initIntro,
  initHeader,
  initMenu,
  initScrollSpy,
  initBlurBand,
  initCopy,
  initClock,
  initCardMotion,
} from './chrome';

/** Espera a que el hilo principal esté libre; si el navegador no lo soporta,
 *  un timeout corto cumple el mismo papel. */
function idle(fn: () => void): void {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(fn, { timeout: 1500 });
  } else {
    window.setTimeout(fn, 200);
  }
}

function boot(): void {
  // Prioridad alta: se percibe de inmediato.
  initIntro();
  initHeader();
  initReveal();
  initMenu();
  // Son interacciones de contenido: no pueden esperar a que el hilo se libere.
  initScenes();
  initTabs();
  initSliders();

  // Prioridad baja: mejora, no es indispensable.
  idle(() => {
    initField();
    initCursor();
    initMagnets();
    initScrollSpy();
    initBlurBand();
    initCopy();
    initClock();
    initCardMotion();
    initSecret();
    initMusic();
    loadHeroWaves();
    loadSmoothScroll();
  });
}

/** Campo de líneas del hero. Se importa aparte para que el shader no viaje
 *  en el bundle de quien no lo va a ver. */
async function loadHeroWaves(): Promise<void> {
  if (reduceMotion() || !isDesktop()) return;
  const { initHeroWaves } = await import('./waves');
  initHeroWaves();
}

async function loadSmoothScroll(): Promise<void> {
  if (reduceMotion() || !isDesktop()) return;

  const { default: Lenis } = await import('lenis');
  const lenis = new Lenis({
    // Duración corta a propósito: por encima de ~1s la rueda se siente
    // despegada del gesto, sobre todo en secciones largas con apilado.
    duration: 0.85,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // El scroll táctil nativo ya es bueno: no se toca.
    syncTouch: false,
  });

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // Los anclas internas pasan por Lenis para que el desplazamiento sea suave.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -24 });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
