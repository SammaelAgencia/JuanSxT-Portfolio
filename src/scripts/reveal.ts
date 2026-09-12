/**
 * Revelado al entrar en pantalla.
 *
 * Un único IntersectionObserver para todo el documento. El JS sólo pone el
 * atributo `data-inview`; la forma de la animación vive en animations.css.
 * Los elementos se dejan de observar tras revelarse (salvo data-reveal-repeat).
 */
export function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group]');
  if (!targets.length) return;

  // Sin JS de animación: se muestra todo de inmediato.
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.setAttribute('data-inview', 'true'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.setAttribute('data-inview', 'true');
          if (!el.hasAttribute('data-reveal-repeat')) observer.unobserve(el);
        } else if (el.hasAttribute('data-reveal-repeat')) {
          el.setAttribute('data-inview', 'false');
        }
      }
    },
    {
      // Se dispara cuando el elemento ha subido ~12% dentro del viewport:
      // evita que la animación empiece justo en el borde inferior.
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.08,
    },
  );

  targets.forEach((el) => observer.observe(el));
}
