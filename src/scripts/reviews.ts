// "More" / "Less" toggle for long reviews.
// Reviews are clamped to a few lines in CSS; the toggle only shows when text is actually cut off.

// Listeners from the previous page, dropped when a new page is swapped in.
let reviewListeners: AbortController | undefined;

function initReviews(): void {
  reviewListeners?.abort();
  reviewListeners = new AbortController();
  const { signal } = reviewListeners;

  document.querySelectorAll<HTMLElement>('[data-review]').forEach((review) => {
    const text = review.querySelector<HTMLElement>('[data-review-text]');
    const toggle = review.querySelector<HTMLButtonElement>('[data-review-toggle]');
    if (!text || !toggle) return;

    const measure = (): void => {
      if (text.hasAttribute('data-expanded')) return;
      toggle.hidden = text.scrollHeight <= text.clientHeight + 1;
    };

    measure();
    // Line count changes with the card width and once the web font has loaded.
    window.addEventListener('resize', measure, { signal });
    void document.fonts.ready.then(measure);

    toggle.addEventListener('click', () => {
      const open = !text.hasAttribute('data-expanded');
      text.toggleAttribute('data-expanded', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Less' : 'More';
    });
  });
}

// Runs on first load and after every client-side navigation.
document.addEventListener('astro:page-load', initReviews);
