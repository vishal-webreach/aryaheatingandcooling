// Shows the back-to-top button once the page is scrolled past the sentinel.
// An IntersectionObserver avoids a scroll listener and layout reads.

let observer: IntersectionObserver | undefined;

function initBackToTop(): void {
  observer?.disconnect();

  const button = document.querySelector<HTMLButtonElement>('[data-to-top]');
  const sentinel = document.querySelector<HTMLElement>('[data-to-top-sentinel]');
  if (!button || !sentinel) return;

  observer = new IntersectionObserver(([entry]) => {
    if (entry) button.toggleAttribute('data-show', !entry.isIntersecting);
  });
  observer.observe(sentinel);

  button.addEventListener('click', () => window.scrollTo(0, 0));
}

// Runs on first load and after every client-side navigation.
document.addEventListener('astro:page-load', initBackToTop);
