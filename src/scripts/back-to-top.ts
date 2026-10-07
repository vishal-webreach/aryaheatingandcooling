// Shows the back-to-top button once the page is scrolled past the sentinel.
// An IntersectionObserver avoids a scroll listener and layout reads.

function initBackToTop(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-to-top]');
  const sentinel = document.querySelector<HTMLElement>('[data-to-top-sentinel]');
  if (!button || !sentinel) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry) button.toggleAttribute('data-show', !entry.isIntersecting);
  });
  observer.observe(sentinel);

  button.addEventListener('click', () => window.scrollTo(0, 0));
}

initBackToTop();
