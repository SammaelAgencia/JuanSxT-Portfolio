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
import { reduceMotion, isDesktop, onTick } from './env';
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

/** Después de `load`, no antes: lo que se monte aquí no compite con el primer
 *  pintado ni entra en la ventana que mide el bloqueo del hilo principal. */
function trasCarga(fn: () => void): void {
  if (document.readyState === 'complete') idle(fn);
  else window.addEventListener('load', () => idle(fn), { once: true });
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
    loadSmoothScroll();
  });

  /* El shader del hero espera a que la página esté cargada del todo. Compilar
     el programa y subir la primera pantalla completa de píxeles es el gasto
     más caro de todo el JavaScript del sitio, y en el arranque compite con
     el texto y las imágenes que el visitante sí ha venido a ver. */
  trasCarga(loadHeroWaves);
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

  /* Al bucle compartido, no a uno propio. Lenis trae su ejemplo con un
     `requestAnimationFrame` recursivo, y copiarlo dejaba dos bucles pidiendo
     frames a la vez: el suyo y el de `env.ts`, que es el que mueve cursor,
     imanes y campo del hero. Dos bucles compitiendo es la causa más común de
     jank en sitios como este.

     Y sólo mientras hay scroll que animar. Enganchado de continuo, Lenis pedía
     un frame cada 16 ms desde que carga la página hasta que se cierra, aunque
     nadie tocara nada: el hilo principal no llegaba a quedarse quieto en toda
     la visita. Se engancha al primer gesto y se suelta un cuarto de segundo
     después de que el desplazamiento se pare. */
  let soltar: (() => void) | null = null;
  let ultimoGesto = 0;

  const paso = (_dt: number, now: number) => {
    lenis.raf(now);
    if (lenis.isScrolling || lenis.animatedScroll !== lenis.targetScroll) {
      ultimoGesto = now;
    } else if (now - ultimoGesto > 250) {
      soltar?.();
      soltar = null;
    }
  };

  const despertar = () => {
    ultimoGesto = performance.now();
    if (!soltar) soltar = onTick(paso);
  };

  /* En fase de captura: Lenis escucha la rueda también, y cuando le llegue el
     evento el frame ya tiene que estar pedido. */
  const gesto = { passive: true, capture: true } as const;
  window.addEventListener('wheel', despertar, gesto);
  window.addEventListener('touchstart', despertar, gesto);
  window.addEventListener('keydown', despertar, gesto);
  window.addEventListener('resize', despertar, { passive: true });

  // Los anclas internas pasan por Lenis para que el desplazamiento sea suave.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      despertar();
      lenis.scrollTo(target as HTMLElement, { offset: -24 });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
