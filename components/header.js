export function renderHeader({ t, switchLanguage }) {
  const el = document.getElementById('header-container');
  if (!el) return;
  el.innerHTML = `
    <header class="header">
      <div class="header-content">
        <button class="menu-btn" id="menu-btn">☰</button>
        <div class="logo">Azozon</div>
        <div class="header-actions">
          <button class="language-btn" id="lang-btn">${t('lang_btn')}</button>
          <div class="user-info"><span>${t('hello_signin')}</span></div>
        </div>
      </div>
    </header>
  `;
  el.querySelector('#menu-btn')?.addEventListener('click', () => window.toggleDrawer && window.toggleDrawer());
  el.querySelector('#lang-btn')?.addEventListener('click', () => switchLanguage && switchLanguage());
}