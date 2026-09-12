/**
 * Escenas de proyecto.
 *
 * Abre la ficha a pantalla completa que ya viene renderizada en el HTML
 * (`components/ui/Scene.astro`). No construye nada: sólo monta, abre y cierra.
 *
 * Tres listeners en todo el módulo, delegados en el documento, y ni una
 * medición por frame: la escena es CSS y el scroll de las capturas es nativo.
 */
import { reduceMotion } from './env';

/** Coincide con la transición de cierre de `components/scene.css`. */
const CIERRE = 560;

/* --------------------------------------------------------------- EL BUCLE --
   La tira de capturas se triplica y el scroll se mantiene siempre dentro del
   tercio del medio: al pasarse de largo por cualquiera de los dos extremos,
   salta un tercio entero. Como los tres tercios son idénticos, el salto no se
   ve, y desde dentro la tira no tiene principio ni final.

   No hay nada por frame: se mide una vez al abrir y el listener de scroll sólo
   compara dos números.                                                       */
interface Bucle {
  reel: HTMLElement;
  /** Alto de un tercio, en píxeles de scroll. */
  paso: number;
  /** Posición en la que la primera captura real queda centrada. */
  inicio: number;
}

const bucles = new WeakMap<HTMLElement, Bucle>();

function medir(b: Bucle): void {
  const tiras = b.reel.children;
  const porTira = tiras.length / 3;
  const primera = tiras[0] as HTMLElement;
  const media = tiras[porTira] as HTMLElement;

  b.paso = media.offsetTop - primera.offsetTop;
  b.inicio = media.offsetTop + media.offsetHeight / 2 - b.reel.clientHeight / 2;
  b.reel.scrollTop = b.inicio;
}

function envolver(b: Bucle): void {
  if (!b.paso) return;
  const y = b.reel.scrollTop;
  if (y >= b.inicio + b.paso) b.reel.scrollTop = y - b.paso;
  else if (y < b.inicio) b.reel.scrollTop = y + b.paso;
}

/** Prepara (una sola vez) y recentra el carrusel de una escena. */
function prepararBucle(escena: HTMLElement): void {
  const reel = escena.querySelector<HTMLElement>('[data-reel]');
  if (!reel) return;

  let bucle = bucles.get(reel);

  if (!bucle) {
    const originales = [...reel.children] as HTMLElement[];
    // Con una sola captura no hay vecinos que asomar: se queda como está.
    if (originales.length < 2) return;

    const copia = () =>
      originales.map((el) => {
        const c = el.cloneNode(true) as HTMLElement;
        // Las copias son decorado: para un lector de pantalla no existen.
        c.setAttribute('aria-hidden', 'true');
        return c;
      });

    reel.append(...copia());
    reel.prepend(...copia());
    reel.setAttribute('data-bucle', '');

    bucle = { reel, paso: 0, inicio: 0 };
    bucles.set(reel, bucle);
    reel.addEventListener('scroll', () => envolver(bucle as Bucle), { passive: true });
  }

  medir(bucle);
}

export function initScenes(): void {
  if (!document.querySelector('[data-scene]')) return;

  const root = document.documentElement;
  let abierta: HTMLElement | null = null;
  let origen: HTMLElement | null = null;
  let posicion = 0;
  let desmontar = 0;

  const abrir = (id: string, desde: HTMLElement) => {
    const escena = document.getElementById(id);
    if (!escena || abierta) return;
    window.clearTimeout(desmontar);

    abierta = escena;
    posicion = window.scrollY;
    // El disparador puede ser la tarjeta entera, que no es enfocable: se
    // guarda su botón para poder devolver el foco al cerrar.
    origen =
      desde.tagName === 'BUTTON'
        ? desde
        : desde.querySelector<HTMLElement>('button[data-piece-open]');

    escena.setAttribute('data-mounted', '');
    // Fuerza el cálculo de estilo con la escena ya montada. Sin esto el
    // navegador agrupa el cambio de `display` y el de `data-open` en el mismo
    // frame, y una transición que empieza desde `display: none` no ocurre.
    void escena.offsetWidth;
    escena.setAttribute('data-open', '');

    root.setAttribute('data-scene-open', '');
    // El cursor pasa a X y se bloquea: sin el candado, el primer `pointerout`
    // sobre la tarjeta que quedó debajo borraría el estado.
    root.setAttribute('data-cursor', 'close');
    root.setAttribute('data-cursor-lock', '');

    // Con la escena ya montada se puede medir: antes no tenía caja.
    prepararBucle(escena);

    escena.querySelector<HTMLElement>('[data-scene-close]')?.focus({ preventScroll: true });
  };

  const cerrar = () => {
    if (!abierta) return;
    const escena = abierta;
    abierta = null;

    escena.removeAttribute('data-open');
    root.removeAttribute('data-scene-open');
    root.removeAttribute('data-cursor');
    root.removeAttribute('data-cursor-lock');

    // Soltar el bloqueo suele conservar la posición, pero no en todos los
    // navegadores: se restaura a mano para volver exactamente a la ficha desde
    // la que se abrió.
    window.scrollTo(0, posicion);
    origen?.focus({ preventScroll: true });
    origen = null;

    // Se desmonta al terminar la transición: mientras tanto sigue en pantalla.
    desmontar = window.setTimeout(
      () => escena.removeAttribute('data-mounted'),
      reduceMotion() ? 0 : CIERRE,
    );
  };

  document.addEventListener('click', (e) => {
    const objetivo = e.target as Element | null;

    /* Con una escena abierta manda cerrar, y nada más. El orden importa: si
       primero se buscara un disparador, bastaría que el atributo de estado y
       el de apertura se llamaran parecido para que el usuario se quedara
       encerrado dentro de la escena. */
    if (abierta) {
      if (objetivo?.closest('[data-scene]')) cerrar();
      return;
    }

    const disparador = objetivo?.closest<HTMLElement>('[data-piece-open]');
    const id = disparador?.dataset.pieceOpen;
    if (disparador && id) abrir(id, disparador);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrar();
  });
}
