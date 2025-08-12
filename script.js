// Header Component
function createHeader() {
    const langLabel = (typeof currentLanguage !== 'undefined' && currentLanguage === 'ar') ? 'EN' : 'عر';
    const titleAttr = (typeof currentLanguage !== 'undefined' && currentLanguage === 'ar') ? 'اللغة' : 'Language';

    const headerHTML = `
        <header class="header">
            <div class="header-content">
                <button class="menu-btn" type="button">☰</button>
                <div class="logo">Azozon</div>
                <div class="header-actions">
                    <button class="language-btn" type="button" title="${titleAttr}">${langLabel}</button>
                    <div class="user-info"><span>${typeof t === 'function' ? t('hello_signin') : 'Hello, sign in'}</span></div>
                </div>
            </div>
        </header>
    `;

    const container = document.getElementById('header-container');
    container.innerHTML = headerHTML;

    // ربط الأحداث بعد الحقن
    container.querySelector('.menu-btn')?.addEventListener('click', toggleDrawer);
    container.querySelector('.language-btn')?.addEventListener('click', switchLanguage);
}

// Footer Component
function createFooter() {
    const footerHTML = `
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Azozon</h4>
                    <p>${t('azozon_desc')}</p>
                    <p>${t('trusted_partner')}</p>
                </div>
                <div class="footer-section">
                    <h4>${t('quick_links')}</h4>
                    <ul>
                        <li><a href="#">${t('about_us')}</a></li>
                        <li><a href="#">${t('customer_service')}</a></li>
                        <li><a href="#">${t('privacy_policy')}</a></li>
                        <li><a href="#">${t('terms_use')}</a></li>
                        <li><a href="#">${t('returns_refunds')}</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>${t('categories')}</h4>
                    <ul>
                        <li><a href="#">${t('electronics')}</a></li>
                        <li><a href="#">${t('fashion')}</a></li>
                        <li><a href="#">${t('home_garden')}</a></li>
                        <li><a href="#">${t('sports')}</a></li>
                        <li><a href="#">${t('books')}</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>${t('connect_us')}</h4>
                    <div class="social-links">
                        <a href="#" onclick="alert('Facebook page coming soon!')">📘 Facebook</a>
                        <a href="#" onclick="alert('Twitter page coming soon!')">🐦 Twitter</a>
                        <a href="#" onclick="alert('Instagram page coming soon!')">📷 Instagram</a>
                        <a href="#" onclick="alert('YouTube channel coming soon!')">📺 YouTube</a>
                    </div>
                    <div class="contact-info">
                        <p>📧 contact@azozon.com</p>
                        <p>📞 +966-50-123-4567</p>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>${t('footer_rights')}</p>
                <p class="arabic-note">${t('platform_note')}</p>
            </div>
        </footer>
    `;
    
    document.getElementById('footer-container').innerHTML = footerHTML;
}

// Drawer Functions
function toggleDrawer() {
    const drawer = document.querySelector('.drawer');
    const overlay = document.querySelector('.overlay');
    
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // منع التمرير عند فتح الدرج
    document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : 'auto';
}

function closeDrawer() {
    const drawer = document.querySelector('.drawer');
    const overlay = document.querySelector('.overlay');
    
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    
    // إعادة تفعيل التمرير
    document.body.style.overflow = 'auto';
}

// Event Listeners
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDrawer();
    }
});

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeDrawer();
    }
});

// Animation for feature cards
function animateFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

/* Intro video */
function createIntroVideo(showEveryTime = true) {
    if (!showEveryTime && sessionStorage.getItem('azozon-intro-played') === '1') return;

    const overlay = document.createElement('div');
    overlay.className = 'intro-video-overlay';
    overlay.innerHTML = `
        <video class="intro-video"
               src="videos/azozon.mp4"
               autoplay  playsinline preload="auto"></video>
        <button class="skip-intro-btn" aria-label="Skip intro">تخطي | Skip</button>
    `;
    document.body.appendChild(overlay);

    const video = overlay.querySelector('video');
    const skipBtn = overlay.querySelector('.skip-intro-btn');

    const closeIntro = () => {
        overlay.classList.add('hide');
        sessionStorage.setItem('azozon-intro-played', '1');
        setTimeout(() => overlay.remove(), 450);
    };

    skipBtn.addEventListener('click', closeIntro);
    video.addEventListener('ended', closeIntro);
    video.play().catch(() => { /* قد يمنع المتصفح التشغيل، زر التخطي متاح */ });

    // أمان: إغلاق بعد 20ث كحد أقصى
    setTimeout(() => { if (document.body.contains(overlay)) closeIntro(); }, 20000);
}

/* i18n: دعم العربية/الإنجليزية */
let currentLanguage =
  localStorage.getItem('preferred-language') ||
  ((document.documentElement.lang || navigator.language || '').startsWith('ar') ? 'ar' : 'en');

function applyDirLang() {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
}
applyDirLang();

const translations = {
  ar: {
    hello_signin: 'مرحباً، تسجيل الدخول',
    welcome_title: 'مرحباً بكم في عزوزون',
    welcome_subtitle: 'وجهتكم المثلى للتسوق - كل ما تحتاجونه، يصل بسرعة!',
    menu_instruction: 'اضغط على زر القائمة لاستكشاف فئاتنا',
    fast_delivery: '🚚 توصيل سريع', fast_delivery_desc: 'احصل على طلباتك بسرعة وأمان',
    secure_payment: '🔒 دفع آمن',   secure_payment_desc: 'تسوق بثقة عبر نظام الدفع الآمن',
    best_deals: '🎯 أفضل العروض',   best_deals_desc: 'عروض وخصومات رائعة على ملايين المنتجات',
    digital_content: 'المحتوى الرقمي والأجهزة',
    shop_department: 'تسوق حسب القسم',
    programs_features: 'البرامج والميزات',
    help_settings: 'المساعدة والإعدادات',
    prime_video: 'برايم فيديو', azozon_music: 'عزوزون ميوزك', kindle_books: 'كتب كيندل الإلكترونية', azozon_appstore: 'متجر تطبيقات عزوزون',
    electronics: 'الإلكترونيات', computers: 'أجهزة الكمبيوتر', smart_home: 'المنزل الذكي',
    arts_crafts: 'الفنون والحرف', fashion: 'الأزياء', home_garden: 'المنزل والحديقة',
    gift_cards: 'بطاقات الهدايا', shop_interest: 'تسوق حسب الاهتمام', azozon_live: 'عزوزون لايف', international_shopping: 'التسوق الدولي',
    your_account: 'حسابك', customer_service: 'خدمة العملاء', sign_out: 'تسجيل الخروج',
    see_all: 'عرض الكل ⌄',
    quick_links: 'روابط سريعة', about_us: 'من نحن', privacy_policy: 'سياسة الخصوصية', terms_use: 'شروط الاستخدام', returns_refunds: 'المرتجعات والاسترداد',
    categories: 'الفئات', connect_us: 'تواصل معنا',
    azozon_desc: 'موقع عزوزون - تدليع لعبدالعزيز صاحب الموقع الحالي',
    trusted_partner: 'شريكك الموثوق في التسوق الإلكتروني منذ 2024',
    footer_rights: '© 2024 عزوزون. جميع الحقوق محفوظة. | صنع بـ ❤️ بواسطة عبدالعزيز',
    platform_note: 'عزوزون - منصة التسوق الإلكتروني الموثوقة',
    welcome_msg: 'مرحباً بك في عزوزون! 🎉',
    lang_btn: 'EN'
  },
  en: {
    hello_signin: '👤 Hello, sign in',
    welcome_title: 'Welcome to Azozon',
    welcome_subtitle: 'Your ultimate shopping destination - Everything you need, delivered fast!',
    menu_instruction: 'Click the menu button to explore our categories',
    fast_delivery: '🚚 Fast Delivery', fast_delivery_desc: 'Get your orders delivered quickly and safely',
    secure_payment: '🔒 Secure Payment', secure_payment_desc: 'Shop with confidence using our secure payment system',
    best_deals: '🎯 Best Deals', best_deals_desc: 'Find great deals and discounts on millions of products',
    digital_content: 'Digital Content & Devices',
    shop_department: 'Shop by Department',
    programs_features: 'Programs & Features',
    help_settings: 'Help & Settings',
    prime_video: 'Prime Video', azozon_music: 'Azozon Music', kindle_books: 'Kindle E-readers & Books', azozon_appstore: 'Azozon Appstore',
    electronics: 'Electronics', computers: 'Computers', smart_home: 'Smart Home',
    arts_crafts: 'Arts & Crafts', fashion: 'Fashion', home_garden: 'Home & Garden',
    gift_cards: 'Gift Cards', shop_interest: 'Shop By Interest', azozon_live: 'Azozon Live', international_shopping: 'International Shopping',
    your_account: 'Your Account', customer_service: 'Customer Service', sign_out: 'Sign Out',
    see_all: 'See all ⌄',
    quick_links: 'Quick Links', about_us: 'About Us', privacy_policy: 'Privacy Policy', terms_use: 'Terms of Use', returns_refunds: 'Returns & Refunds',
    categories: 'Categories', connect_us: 'Connect With Us',
    azozon_desc: 'Azozon website — nickname for Abdulaziz, the current owner',
    trusted_partner: 'Your trusted online shopping partner since 2024',
    footer_rights: '© 2024 Azozon. All rights reserved. | Made with ❤️ by Abdul Aziz (عبدالعزيز)',
    platform_note: 'Azozon — Trusted e-commerce platform',
    welcome_msg: 'Welcome to Azozon! 🎉',
    lang_btn: 'عر'
  }
};
const t = (k) => (translations[currentLanguage] && translations[currentLanguage][k]) || k;

function switchLanguage() {
  currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
  localStorage.setItem('preferred-language', currentLanguage);
  applyDirLang();
  createHeader();
  createFooter();
  updateMainContent();
  updateDrawerContent();
}

/* تحديث محتوى الصفحة حسب اللغة */
function updateMainContent() {
  const hero = document.querySelector('.hero-section');
  if (hero) {
    const h1 = hero.querySelector('h1');
    const p1 = hero.querySelector('p:first-of-type');
    const sub = hero.querySelector('.subtitle');
    if (h1) h1.textContent = t('welcome_title');
    if (p1) p1.textContent = t('welcome_subtitle');
    if (sub) sub.textContent = t('menu_instruction');
  }

  const cards = document.querySelectorAll('.feature-card');
  const data = [
    { h: t('fast_delivery'), p: t('fast_delivery_desc') },
    { h: t('secure_payment'), p: t('secure_payment_desc') },
    { h: t('best_deals'), p: t('best_deals_desc') }
  ];
  cards.forEach((card, i) => {
    if (data[i]) card.innerHTML = `<h3>${data[i].h}</h3><p>${data[i].p}</p>`;
  });
}

/* إنشاء/تحديث عناصر قائمة للدرج */
function ensureMenu(sectionEl) {
  let ul = sectionEl.querySelector('.drawer-menu');
  if (!ul) {
    ul = document.createElement('ul');
    ul.className = 'drawer-menu';
    sectionEl.appendChild(ul);
  }
  return ul;
}

/* تحديث محتوى الدرج حسب اللغة */
function updateDrawerContent() {
  const sections = document.querySelectorAll('.drawer .drawer-section');

  // 1) المحتوى الرقمي
  if (sections[0]) {
    const h3 = sections[0].querySelector('h3') || sections[0].insertBefore(document.createElement('h3'), sections[0].firstChild);
    h3.textContent = t('digital_content');
    const ul = ensureMenu(sections[0]);
    const items = ['prime_video','azozon_music','kindle_books','azozon_appstore'];
    ul.innerHTML = items.map(k => `<li><a href="#">${t(k)} <span>›</span></a></li>`).join('');
  }

  // 2) تسوّق حسب القسم
  if (sections[1]) {
    const h3 = sections[1].querySelector('h3') || sections[1].insertBefore(document.createElement('h3'), sections[1].firstChild);
    h3.textContent = t('shop_department');
    const ul = ensureMenu(sections[1]);
    const items = ['electronics','computers','smart_home','arts_crafts','fashion','home_garden'];
    ul.innerHTML = items.map(k => `<li><a href="#">${t(k)} <span>›</span></a></li>`).join('');
    const seeAllBtn = sections[1].querySelector('.see-all-btn');
    if (seeAllBtn) seeAllBtn.textContent = t('see_all');
  }

  // 3) البرامج والميزات
  if (sections[2]) {
    const h3 = sections[2].querySelector('h3') || sections[2].insertBefore(document.createElement('h3'), sections[2].firstChild);
    h3.textContent = t('programs_features');
    const ul = ensureMenu(sections[2]);
    const items = ['gift_cards','shop_interest','azozon_live','international_shopping'];
    ul.innerHTML = items.map(k => `<li><a href="#">${t(k)} <span>›</span></a></li>`).join('');
  }

  // 4) المساعدة والإعدادات
  if (sections[3]) {
    // بعض الصفحات كانت فارغة؛ ننشئ العنوان والقائمة عند الحاجة
    let h3 = sections[3].querySelector('h3');
    if (!h3) {
      h3 = document.createElement('h3');
      sections[3].prepend(h3);
    }
    h3.textContent = t('help_settings');

    const ul = ensureMenu(sections[3]);
    const items = ['your_account','customer_service','sign_out'];
    ul.innerHTML = items.map(k => `<li><a href="#">${t(k)}</a></li>`).join('');
  }

  // نص المستخدم أعلى الدرج
  const drawerUserSpan = document.querySelector('.drawer-user span:last-child');
  if (drawerUserSpan) drawerUserSpan.textContent = t('hello_signin');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    createHeader();
    createFooter();

    // إضافة هاتين السطرين
    updateMainContent();
    updateDrawerContent();

    createIntroVideo();
    setTimeout(() => { animateFeatureCards(); }, 100);
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add some interactive features
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #232f3e;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Welcome message
setTimeout(() => {
    showNotification(t('welcome_msg'));
}, 2000);

// عرّض الدوال عالمياً لأن السكربت يعمل كـ module
window.toggleDrawer = toggleDrawer;
window.closeDrawer = closeDrawer;
window.switchLanguage = switchLanguage;