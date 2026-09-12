/**
 * Consultas de entorno + un único bucle rAF compartido.
 *
 * Un solo requestAnimationFrame para todo el sitio: cursor, parallax y
 * previsualización de trabajo escriben en el mismo frame. Varios bucles
 * compitiendo es la causa más común de jank en sitios como estos.
 */

export const reduceMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = (): boolean =>
  window.matchMedia('(pointer: fine)').matches;

export const isDesktop = (): boolean =>
  window.matchMedia('(min-width: 900px)').matches;

/** Interpolación lineal amortiguada, independiente del framerate. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const clamp = (v: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, v));

type Task = (dt: number) => void;

const tasks = new Set<Task>();
let rafId = 0;
let last = 0;

function frame(now: number) {
  // dt normalizado a 60fps para que el lerp se comporte igual en 120Hz.
  const dt = last ? Math.min((now - last) / 16.667, 3) : 1;
  last = now;
  for (const task of tasks) task(dt);
  rafId = tasks.size ? requestAnimationFrame(frame) : 0;
}

/** Registra una tarea por frame. Devuelve la función para darla de baja. */
export function onTick(task: Task): () => void {
  tasks.add(task);
  if (!rafId) {
    last = 0;
    rafId = requestAnimationFrame(frame);
  }
  return () => {
    tasks.delete(task);
    if (!tasks.size && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };
}

/** Pausa el bucle cuando la pestaña no está visible: no gasta batería. */
document.addEventListener('visibilitychange', () => {
  if (document.hidden && rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  } else if (!document.hidden && tasks.size && !rafId) {
    last = 0;
    rafId = requestAnimationFrame(frame);
  }
});
