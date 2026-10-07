// Mobile drawer and dropdown behaviour for the main navigation.
// State lives in `data-open` attributes; the styling reacts to them.

const DESKTOP_QUERY = '(min-width: 901px)';

function initNav(): void {
  const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const overlay = document.querySelector<HTMLElement>('[data-nav-overlay]');
  const closeBtn = document.querySelector<HTMLButtonElement>('[data-nav-close]');
  if (!menuBtn || !nav || !overlay || !closeBtn) return;

  const setDropdown = (item: HTMLElement, open: boolean): void => {
    item.toggleAttribute('data-open', open);
    item.querySelector('[data-nav-toggle]')?.setAttribute('aria-expanded', String(open));
  };

  const closeDropdowns = (except?: HTMLElement): void => {
    nav.querySelectorAll<HTMLElement>('[data-nav-item][data-open]').forEach((item) => {
      if (item !== except) setDropdown(item, false);
    });
  };

  const setMenu = (open: boolean): void => {
    nav.toggleAttribute('data-open', open);
    overlay.toggleAttribute('data-open', open);
    document.body.classList.toggle('overflow-hidden', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      closeBtn.focus();
    } else {
      closeDropdowns();
    }
  };

  menuBtn.addEventListener('click', () => setMenu(!nav.hasAttribute('data-open')));
  closeBtn.addEventListener('click', () => setMenu(false));
  overlay.addEventListener('click', () => setMenu(false));

  nav.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const toggle = event.target.closest('[data-nav-toggle]');
    const item = toggle?.closest<HTMLElement>('[data-nav-item]');
    if (item) {
      const open = !item.hasAttribute('data-open');
      closeDropdowns(item);
      setDropdown(item, open);
      return;
    }

    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('click', (event) => {
    if (event.target instanceof Element && !event.target.closest('[data-nav-item]')) closeDropdowns();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeDropdowns();
    setMenu(false);
  });

  window.matchMedia(DESKTOP_QUERY).addEventListener('change', () => setMenu(false));
}

initNav();
