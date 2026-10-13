// Quote forms: the service type list follows the chosen service,
// and the date picker cannot go back before today.

// Listeners from the previous page, dropped when a new page is swapped in.
let quoteListeners: AbortController | undefined;

function initQuoteForm(): void {
  quoteListeners?.abort();
  quoteListeners = new AbortController();
  const { signal } = quoteListeners;

  // The form is on the page more than once: under the hero and in the quote dialog.
  document.querySelectorAll<HTMLFormElement>('[data-quote-form]').forEach((form) => {
    const service = form.querySelector<HTMLSelectElement>('select[name="service"]');
    const serviceType = form.querySelector<HTMLSelectElement>('select[name="serviceType"]');
    if (!service || !serviceType) return;

    // Service title -> the service types that belong to it.
    const serviceTypes: Record<string, string[]> = JSON.parse(form.dataset.serviceTypes ?? '{}');

    const syncServiceTypes = (): void => {
      const types = serviceTypes[service.value] ?? [];
      serviceType.replaceChildren(
        new Option(service.value ? 'Select a service type' : 'Select a service first', ''),
        ...types.map((type) => new Option(type))
      );
      serviceType.disabled = types.length === 0;
    };

    service.addEventListener('change', syncServiceTypes, { signal });
    // Resetting the form clears the service after this event, so wait a tick.
    form.addEventListener('reset', () => setTimeout(syncServiceTypes), { signal });
    syncServiceTypes();

    const dateTime = form.querySelector<HTMLInputElement>('input[name="datetime"]');
    if (dateTime) {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      dateTime.min = `${now.getFullYear()}-${month}-${day}T00:00`;
    }
  });
}

// Runs on first load and after every client-side navigation.
document.addEventListener('astro:page-load', initQuoteForm);
