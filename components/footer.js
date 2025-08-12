import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';

// ...existing code...

// بعد تعريف دوال الدرج
window.toggleDrawer = toggleDrawer;
window.closeDrawer = closeDrawer;

// في تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function () {
  renderHeader({ t, switchLanguage });
  renderFooter({ t });

  updateMainContent();
  updateDrawerContent();
  createIntroVideo();
  setTimeout(animateFeatureCards, 100);
});

// ...existing code...