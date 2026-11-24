// Hero background slider: fades to the next photo every few seconds, dots jump to a photo.
// With reduced motion it stays on the first photo unless a dot is used.

const INTERVAL = 4000;

// Timer and listeners from the previous page, dropped when a new page is swapped in.
let timer: number | undefined;
let sliderListeners: AbortController | undefined;

function initHeroSlider(): void {
  window.clearInterval(timer);
  sliderListeners?.abort();
  sliderListeners = new AbortController();
  const { signal } = sliderListeners;

  const slider = document.querySelector<HTMLElement>('[data-hero-slider]');
  if (!slider) return;

  const slides = [...slider.querySelectorAll<HTMLElement>('[data-hero-slide]')];
  const dots = [...slider.querySelectorAll<HTMLButtonElement>('[data-hero-dot]')];
  if (slides.length < 2) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;

  const show = (index: number): void => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.toggleAttribute('data-active', i === current));
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
  };

  const start = (): void => {
    window.clearInterval(timer);
    if (!reduceMotion) timer = window.setInterval(() => show(current + 1), INTERVAL);
  };

  dots.forEach((dot, i) =>
    dot.addEventListener(
      'click',
      () => {
        show(i);
        start();
      },
      { signal }
    )
  );
  show(0);
  start();
}

// Runs on first load and after every client-side navigation.
document.addEventListener('astro:page-load', initHeroSlider);
document.addEventListener('astro:before-swap', () => window.clearInterval(timer));
