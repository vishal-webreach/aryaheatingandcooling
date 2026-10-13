// Opens the quote form in a dialog from any `data-quote-open` button.

// Listeners from the previous page, dropped when a new page is swapped in.
let modalListeners: AbortController | undefined;

function initQuoteModal(): void {
  modalListeners?.abort();
  modalListeners = new AbortController();
  const { signal } = modalListeners;

  const modal = document.querySelector<HTMLDialogElement>('[data-quote-modal]');
  if (!modal) return;

  document.addEventListener(
    'click',
    (event) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-quote-open]')) return;
      modal.showModal();
      document.body.classList.add('overflow-hidden');
    },
    { signal }
  );

  modal.addEventListener(
    'click',
    (event) => {
      if (!(event.target instanceof Element)) return;
      // A click on the dialog itself lands on the backdrop; the content sits in a child.
      if (event.target === modal || event.target.closest('[data-quote-close]')) modal.close();
    },
    { signal }
  );

  // Also fires when the dialog is closed with Escape.
  modal.addEventListener('close', () => document.body.classList.remove('overflow-hidden'), { signal });
}

// Runs on first load and after every client-side navigation.
document.addEventListener('astro:page-load', initQuoteModal);
