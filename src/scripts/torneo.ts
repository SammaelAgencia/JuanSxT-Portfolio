/**
 * Página del torneo (/pokemon): pestañas y música de fondo.
 *
 * Las dos funciones salen a la primera si su marca no está en el documento,
 * así que en el índice no cuesta nada. No hay estado global ni bucles: las
 * pestañas son un `click` y un `keydown`, y el audio un elemento nativo.
 */
import { torneo } from '../data/pokemon';

/* -------------------------------------------------------------- PESTAÑAS --
   Patrón ARIA de tablist con navegación por flechas. El HTML llega con la
   primera abierta y las demás con `hidden`: sin JavaScript se lee la primera
   sección entera en vez de una página vacía.                                */
export function initTabs(): void {
  const list = document.querySelector<HTMLElement>('[data-tabs]');
  if (!list) return;

  const tabs = [...list.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  if (!tabs.length) return;

  const panelOf = (tab: HTMLButtonElement) =>
    document.getElementById(tab.getAttribute('aria-controls') ?? '');

  const select = (tab: HTMLButtonElement, focus = false) => {
    for (const other of tabs) {
      const on = other === tab;
      other.setAttribute('aria-selected', String(on));
      // Sólo la pestaña activa entra en el orden de tabulación: dentro del
      // grupo se navega con las flechas, que es lo que espera un lector.
      other.tabIndex = on ? 0 : -1;
      const panel = panelOf(other);
      if (panel) panel.hidden = !on;
    }
    if (focus) tab.focus();
  };

  list.addEventListener('click', (e) => {
    const tab = (e.target as Element).closest<HTMLButtonElement>('[role="tab"]');
    if (tab) select(tab);
  });

  list.addEventListener('keydown', (e) => {
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current < 0) return;

    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[e.key];
    let next = -1;

    if (step) next = (current + step + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    else return;

    e.preventDefault();
    select(tabs[next]!, true);
  });
}

/* ---------------------------------------------------------------- MÚSICA --
   Arranca sola: `musica.auto`. Los navegadores no dejan sonar audio sin un
   gesto previo, así que el intento del arranque puede fallar; cuando falla se
   queda a la espera del primer clic o tecla y suena entonces. Quien la
   silencie con el botón no la vuelve a oír, ni en visitas siguientes.

   El archivo va con `preload="none"`: la descarga empieza en el intento de
   reproducción, no al cargar la página.                                     */
const CLAVE = 'torneo:musica';

export function initMusic(): void {
  const audio = document.querySelector<HTMLAudioElement>('[data-sound]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-sound-toggle]');
  if (!audio || !toggle) return;

  const label = toggle.querySelector<HTMLElement>('[data-sound-label]');
  audio.volume = torneo.musica.volumen;

  const paint = (state: 'on' | 'off' | 'missing') => {
    toggle.setAttribute('aria-pressed', String(state === 'on'));
    toggle.toggleAttribute('data-playing', state === 'on');
    toggle.toggleAttribute('data-missing', state === 'missing');
    toggle.disabled = state === 'missing';
    if (!label) return;
    label.textContent =
      state === 'on' ? 'Silenciar' : state === 'missing' ? 'Sin pista' : 'Poner música';
  };

  /** Guarda la elección. En modo privado `localStorage` puede lanzar. */
  const remember = (on: boolean) => {
    try {
      window.localStorage.setItem(CLAVE, on ? 'on' : 'off');
    } catch {
      /* Sin almacenamiento: la elección dura lo que la visita. */
    }
  };

  /** Sin elección previa manda `musica.auto`; sólo un «off» explícito la calla. */
  const wanted = (): boolean => {
    try {
      const saved = window.localStorage.getItem(CLAVE);
      return saved === null ? torneo.musica.auto : saved === 'on';
    } catch {
      return torneo.musica.auto;
    }
  };

  const play = async (): Promise<boolean> => {
    try {
      // La descarga arranca exactamente aquí, no al cargar la página.
      if (audio.preload !== 'auto') audio.preload = 'auto';
      await audio.play();
      paint('on');
      return true;
    } catch {
      // O el archivo no está —eso no se arregla solo— o el navegador pide un
      // gesto, que es lo normal y se resuelve con el primer clic.
      paint(audio.error ? 'missing' : 'off');
      return false;
    }
  };

  const stop = () => {
    audio.pause();
    paint('off');
  };

  // Si el archivo no existe, el botón lo dice en vez de fallar en silencio.
  audio.addEventListener('error', () => paint('missing'));
  audio.addEventListener('pause', () => paint('off'));
  audio.addEventListener('play', () => paint('on'));

  toggle.addEventListener('click', () => {
    const on = toggle.getAttribute('aria-pressed') === 'true';
    if (on) {
      stop();
      remember(false);
      return;
    }
    remember(true);
    void play();
  });

  paint('off');
  if (!wanted()) return;

  void play().then((ok) => {
    if (ok || audio.error) return;
    // Bloqueada por falta de gesto: se reintenta con el primero que llegue.
    const resume = () => {
      void play();
    };
    document.addEventListener('pointerdown', resume, { once: true });
    document.addEventListener('keydown', resume, { once: true });
  });
}
