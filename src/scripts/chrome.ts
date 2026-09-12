/**
 * Cromo de la página: intro, cabecera, menú, índice activo y copiado de email.
 * Todo lo que no es una sección de contenido vive aquí.
 */
import { reduceMotion } from './env';

/* ------------------------------------------------------------------ INTRO --
   Contador breve que cubre el primer paint de las fuentes. No bloquea nada:
   si el JS falla, la clase nunca se añade y la página se ve igual.           */
export function initIntro(): void {
  const intro = document.querySelector<HTMLElement>('[data-intro]');
  const root = document.documentElement;
  if (!intro) return;

  const done = () => {
    root.setAttribute('data-intro-done', 'true');
    // Se retira del árbol tras la transición para no dejar una capa viva.
    window.setTimeout(() => intro.remove(), 1200);
  };

  if (reduceMotion()) {
    intro.remove();
    root.setAttribute('data-intro-done', 'true');
    return;
  }

  const counter = intro.querySelector<HTMLElement>('[data-intro-count]');
  const started = performance.now();
  const MIN = 900;
  let value = 0;

  const tick = () => {
    // Avance decreciente: rápido al principio, se frena cerca de 100.
    value += Math.max(0.6, (100 - value) * 0.06);
    const shown = Math.min(100, Math.floor(value));
    if (counter) counter.textContent = String(shown).padStart(3, '0');
    root.style.setProperty('--intro-progress', String(shown / 100));

    const elapsed = performance.now() - started;
    if (shown >= 100 && elapsed >= MIN && document.readyState !== 'loading') {
      done();
      return;
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
  // Red de seguridad: pase lo que pase, la intro se va.
  window.setTimeout(done, 4000);
}

/* --------------------------------------------------------------- CABECERA --
   Se oculta al bajar y reaparece al subir. La dirección se calcula en el
   evento de scroll, que es pasivo y no lee layout (sólo scrollY).            */
export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  let last = window.scrollY;
  let ticking = false;

  const root = document.documentElement;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const delta = y - last;

    header.toggleAttribute('data-pinned', y > 40);
    // Enciende la banda de desenfoque progresivo anclada arriba. Sobre el
    // primer pliegue no hay nada que disolver y se ahorra recomponer ocho
    // backdrops por frame.
    root.toggleAttribute('data-scrolled', y > 40);
    if (Math.abs(delta) > 6) {
      header.toggleAttribute('data-hidden', delta > 0 && y > 240);
      last = y;
    }
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
}

/* ------------------------------------------------------------------ MENÚ -- */
export function initMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  if (!toggle || !panel) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.toggleAttribute('data-open', open);
    document.documentElement.toggleAttribute('data-menu-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  panel.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

/* ---------------------------------------------------------- ÍNDICE ACTIVO -- */
export function initScrollSpy(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>('[data-spy-link]');
  if (!links.length) return;

  const map = new Map<string, HTMLAnchorElement[]>();
  links.forEach((link) => {
    const id = link.getAttribute('href')?.slice(1);
    if (!id) return;
    map.set(id, [...(map.get(id) ?? []), link]);
  });

  const sections = [...map.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el));

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const targets = map.get(entry.target.id);
        targets?.forEach((link) =>
          link.toggleAttribute('data-current', entry.isIntersecting),
        );
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
}

/* ------------------------------------------------------- COPIAR CORREO -- */
export function initCopy(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    const value = button.dataset.copy;
    if (!value) return;
    const status = button.parentElement?.querySelector<HTMLElement>('[data-copy-status]');
    // El texto viene del HTML: así el script no tiene idioma dentro.
    const done = button.dataset.copyDone ?? '';
    let timer = 0;

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(value);
        button.setAttribute('data-copied', 'true');
        if (status) status.textContent = done;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          button.removeAttribute('data-copied');
          if (status) status.textContent = '';
        }, 2200);
      } catch {
        // Sin permiso de portapapeles: se abre el cliente de correo.
        window.location.href = `mailto:${value}`;
      }
    });
  });
}

/* ------------------------------------------------------- CLIPS EN FICHA --
   Los <video> de los proyectos van con preload="none": no pesan nada hasta
   que el puntero entra en su ficha. En táctil ni se activa: allí manda la
   imagen fija, que es lo correcto cuando no hay hover.                      */
export function initCardMotion(): void {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const slots = document.querySelectorAll<HTMLElement>('.slot[data-motion]');
  if (!slots.length) return;

  slots.forEach((slot) => {
    const video = slot.querySelector('video');
    if (!video) return;

    slot.addEventListener(
      'pointerenter',
      () => {
        // La descarga arranca exactamente aquí, no antes.
        if (video.preload !== 'auto') video.preload = 'auto';
        void video
          .play()
          .then(() => slot.setAttribute('data-playing', ''))
          .catch(() => {
            /* Sin archivo o autoplay bloqueado: se queda la imagen fija. */
          });
      },
      { passive: true },
    );

    slot.addEventListener(
      'pointerleave',
      () => {
        video.pause();
        slot.removeAttribute('data-playing');
      },
      { passive: true },
    );
  });
}

/* ------------------------------------------------- BANDA DE DESENFOQUE --
   La banda de abajo se apaga en cuanto el pie entra en pantalla: a partir de
   ahí no hay nada que disolver y lo único que haría es velar el pie. Va por
   `IntersectionObserver`, no por posición de scroll, para no tener que medir
   el alto del documento en cada frame.                                      */
export function initBlurBand(): void {
  const footer = document.querySelector('[data-footer]');
  if (!footer) return;

  const root = document.documentElement;
  const io = new IntersectionObserver(
    ([entry]) => root.toggleAttribute('data-at-footer', !!entry?.isIntersecting),
    { threshold: 0 },
  );
  io.observe(footer);
}

/* ---------------------------------------------------------------- RELOJ -- */
export function initClock(): void {
  const el = document.querySelector<HTMLElement>('[data-clock]');
  if (!el) return;

  const fmt = new Intl.DateTimeFormat(document.documentElement.lang || 'es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Bogota',
  });

  const render = () => { el.textContent = fmt.format(new Date()); };
  render();
  window.setInterval(render, 30_000);
}
