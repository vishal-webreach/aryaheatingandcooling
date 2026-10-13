// "More" / "Less" toggle for long reviews.
// Reviews are clamped to a few lines in CSS; the toggle only shows when text is actually cut off.
// Each review is on the page twice (the marquee repeats the row), so both copies open together.

// Listeners from the previous page, dropped when a new page is swapped in.
let reviewListeners: AbortController | undefined;

function initReviews(): void {
  reviewListeners?.abort();
  reviewListeners = new AbortController();
  const { signal } = reviewListeners;

  const reviews = [...document.querySelectorAll<HTMLElement>('[data-review]')].flatMap((review) => {
    const text = review.querySelector<HTMLElement>('[data-review-text]');
    const toggle = review.querySelector<HTMLButtonElement>('[data-review-toggle]');
    return text && toggle ? [{ key: review.dataset.review, text, toggle }] : [];
  });
  if (!reviews.length) return;

  // Reads every height before changing anything, so the browser lays the row out once.
  const measure = (): void => {
    const clipped = reviews.map(({ text }) => text.scrollHeight > text.clientHeight + 1);
    reviews.forEach(({ text, toggle }, index) => {
      if (!text.hasAttribute('data-expanded')) toggle.hidden = !clipped[index];
    });
  };

  measure();
  // Line count changes with the card width and once the web font has loaded.
  window.addEventListener('resize', measure, { signal });
  void document.fonts.ready.then(measure);

  reviews.forEach(({ key, text, toggle }) => {
    toggle.addEventListener(
      'click',
      () => {
        const open = !text.hasAttribute('data-expanded');
        reviews
          .filter((review) => review.key === key)
          .forEach((review) => {
            review.text.toggleAttribute('data-expanded', open);
            review.toggle.setAttribute('aria-expanded', String(open));
            review.toggle.textContent = open ? 'Less' : 'More';
          });
      },
      { signal }
    );
  });
}

// Runs on first load and after every client-side navigation.
document.addEventListener('astro:page-load', initReviews);
