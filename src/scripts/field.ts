/**
 * Campo reactivo del hero.
 *
 * Un foco (elemento con gradiente radial) sigue al puntero con amortiguación
 * y revela una retícula más brillante debajo. Todo se mueve con `transform`,
 * de modo que el navegador sólo recompone capas: no hay repintado del fondo.
 *
 * También expone `--px` / `--py` normalizados (-1 a 1) en el contenedor,
 * que el CSS usa para el parallax de las capas del hero.
 *
 * NO SE MIDE NADA AL HACER SCROLL. La versión anterior llamaba a
 * `getBoundingClientRect()` en cada evento de scroll para mantener fresco el
 * origen del campo, y como el bucle rAF está escribiendo transforms al mismo
 * tiempo, cada una de esas lecturas obligaba al navegador a recalcular el
 * layout: es la «redistribución forzada» que salía en la auditoría. La caja se
 * guarda en coordenadas de DOCUMENTO, que el scroll no cambia, y el puntero se
 * lee en las mismas coordenadas (`pageX`/`pageY`). Así sólo hay que medir
 * cuando el elemento cambia de tamaño de verdad.
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

  /* Caja del campo en coordenadas del documento. `izq`/`arriba` sólo cambian
     si algo se redimensiona, nunca al desplazarse. */
  let ancho = 0;
  let alto = 0;
  let izq = 0;
  let arriba = 0;

  const medir = () => {
    const r = field.getBoundingClientRect();
    ancho = r.width;
    alto = r.height;
    izq = r.left + window.scrollX;
    arriba = r.top + window.scrollY;
  };

  medir();

  let tx = ancho / 2;
  let ty = alto / 2;
  let cx = tx;
  let cy = ty;
  let active = false;

  const ro = new ResizeObserver(medir);
  ro.observe(field);

  /* Y otra vez al llegar el puntero. La primera medida se toma en el arranque,
     que cae dentro de la cortina de entrada: ahí `.page-shell` todavía lleva
     el `scale(1.014)` del fundido, y `getBoundingClientRect` lo incluye
     mientras que el `ResizeObserver` no se entera (informa de la caja de
     layout, que una transformación no cambia). Medir al entrar es medir
     cuando la escena ya está quieta, y es la única lectura extra que se hace. */
  field.addEventListener('pointerenter', medir, { passive: true });

  field.addEventListener(
    'pointermove',
    (e) => {
      // pageX/pageY ya vienen en coordenadas de documento: nada que medir.
      tx = e.pageX - izq;
      ty = e.pageY - arriba;
      if (!active) {
        active = true;
        cx = tx;
        cy = ty;
        field.setAttribute('data-field-active', 'true');
      }
      arrancar();
    },
    { passive: true },
  );

  field.addEventListener('pointerleave', () => {
    active = false;
    field.setAttribute('data-field-active', 'false');
  });

  /* El bucle no se queda girando con el hero fuera de pantalla: se da de baja
     y se vuelve a registrar al reaparecer, igual que hace el shader. */
  let stop: (() => void) | null = null;
  let fuera = false;

  function parar() {
    stop?.();
    stop = null;
  }

  const paso = (dt: number) => {
    const t = Math.min(0.11 * dt, 1);
    cx = lerp(cx, tx, t);
    cy = lerp(cy, ty, t);

    if (spot) spot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;

    // Normalizado para el parallax de las capas de texto.
    const nx = ancho ? (cx / ancho) * 2 - 1 : 0;
    const ny = alto ? (cy / alto) * 2 - 1 : 0;
    field.style.setProperty('--px', nx.toFixed(3));
    field.style.setProperty('--py', ny.toFixed(3));

    /* Alcanzado el puntero, el bucle se da de baja. Escribir cada 16 ms un
       transform y dos variables que no cambian mantenía el hilo principal
       despierto durante toda la visita sin mover un píxel. Vuelve solo al
       siguiente movimiento. */
    if (Math.abs(tx - cx) < 0.5 && Math.abs(ty - cy) < 0.5) {
      cx = tx;
      cy = ty;
      parar();
    }
  };

  const arrancar = () => {
    if (!stop && !fuera) stop = onTick(paso);
  };

  arrancar();

  const io = new IntersectionObserver(
    ([entry]) => {
      fuera = !entry?.isIntersecting;
      field.toggleAttribute('data-field-idle', fuera);
      if (fuera) parar();
      else arrancar();
    },
    { threshold: 0 },
  );
  io.observe(field);

  window.addEventListener('pagehide', () => {
    parar();
    ro.disconnect();
    io.disconnect();
  });
}
