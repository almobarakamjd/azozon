// Header Component
function defaultCreateHeader() {
    const langLabel = (typeof currentLanguage !== 'undefined' && currentLanguage === 'ar') ? 'EN' : 'عر';
    const titleAttr = (typeof currentLanguage !== 'undefined' && currentLanguage === 'ar') ? 'اللغة' : 'Language';

    const headerHTML = `
        <header class="header">
            <div class="header-content">
                <button class="menu-btn" type="button">☰</button>
                <div class="logo" style="background: transparent !important; border: none !important; box-shadow: none !important;">Azozon</div>
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
    // Route the logo to the correct home path
    container.querySelector('.logo')?.addEventListener('click', goHome);
}
// Delegate to components if present
function createHeader() {
    return (window.UI?.createHeader || defaultCreateHeader)();
}

// Footer Component
function defaultCreateFooter() {
  const root = document.getElementById('footer-container');
  if (!root) return;

  const year = new Date().getFullYear();
  root.innerHTML = `
    <footer class="az-footer" role="contentinfo">
      <div class="az-foot-inner">
        <section class="az-foot-col az-foot-brand">
          <h3 class="brand">Azozon</h3>
          <div class="title-underline"></div>
          <p>${t('brand_desc')}</p>
          <p>${t('brand_trusted')}</p>
        </section>

        <section class="az-foot-col">
          <h4 class="az-foot-title">${t('quick_links')}</h4>
          <div class="title-underline"></div>
          <ul class="az-foot-list">
            <li><a href="about.html">${t('about_us')}</a></li>
            <li><a href="product-list.html?p=customer_service">${t('customer_service')}</a></li>
            <li><a href="#">${t('privacy_policy')}</a></li>
            <li><a href="#">${t('terms_use')}</a></li>
            <li><a href="#">${t('returns_refunds')}</a></li>
          </ul>
        </section>

        <section class="az-foot-col">
          <h4 class="az-foot-title">${t('categories')}</h4>
          <div class="title-underline"></div>
          <ul class="az-foot-list">
            <li><a href="product-list.html?p=electronics">${t('electronics')}</a></li>
            <li><a href="product-list.html?p=fashion">${t('fashion')}</a></li>
            <li><a href="product-list.html?p=home_garden">${t('home_garden')}</a></li>
            <li><a href="product-list.html?p=sports">${t('sports')}</a></li>
            <li><a href="product-list.html?p=books">${t('books')}</a></li>
          </ul>
        </section>

        <section class="az-foot-col">
          <h4 class="az-foot-title">${t('connect_us')}</h4>
          <div class="title-underline"></div>
          <ul class="az-foot-list">
            <li><a href="#" rel="noopener">Facebook</a></li>
            <li><a href="#" rel="noopener">Twitter</a></li>
            <li><a href="#" rel="noopener">Instagram</a></li>
            <li><a href="#" rel="noopener">YouTube</a></li>
          </ul>
          <div class="az-foot-contact">
            <a href="mailto:contact@azozon.com">contact@azozon.com</a><br>
            <a href="tel:+966501234567">+966-50-123-4567</a>
          </div>
        </section>
      </div>
      <div class="az-foot-copy">© ${year} Azozon</div>
    </footer>
  `;
}

// اجعل الدالة متاحة عالميًا واستدعِها تلقائيًا عند توفر الحاوية
window.createFooter = (typeof createFooter === 'function')
  ? createFooter
  : defaultCreateFooter;

document.addEventListener('DOMContentLoaded', () => {
  const footHost = document.getElementById('footer-container');
  if (footHost) {
    try { window.createFooter(); } catch (_) { defaultCreateFooter(); }
  }
});

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

    const video = document.createElement('video');
    video.className = 'intro-video';
    video.src = 'videos/azozon.mp4';
    video.preload = 'auto';
    video.autoplay = true;      // سيسمح فقط إن كان مكتوماً
    video.muted = true;         // ضروري للسماح بالـ autoplay
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', '');
    const DEFAULT_VOLUME = 0.5;   // نصف الصوت
    video.volume = DEFAULT_VOLUME; // يطبّق عند فكّ الكتم أيضاً
    overlay.appendChild(video);

    const skipBtn = document.createElement('button');
    skipBtn.className = 'skip-intro-btn';
    skipBtn.textContent = (currentLanguage === 'ar' ? 'تخطي' : 'Skip');
    overlay.appendChild(skipBtn);

    // زر اختياري للتحكم بالصوت (يبقى مفيداً)
    const audioBtn = document.createElement('button');
    audioBtn.className = 'audio-toggle-btn';
    overlay.appendChild(audioBtn);

    document.body.appendChild(overlay);

    const closeIntro = () => {
        overlay.classList.add('hide');
        sessionStorage.setItem('azozon-intro-played', '1');
        setTimeout(() => overlay.remove(), 450);
    };

    skipBtn.addEventListener('click', closeIntro);
    video.addEventListener('ended', closeIntro);

    const tryPlay = () => video.play().catch(() => {});
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    setTimeout(() => { if (video.paused) tryPlay(); }, 400);

    // إدارة الصوت
    let isMuted = true;
    const updateAudioBtn = () => {
        audioBtn.textContent = isMuted
          ? (currentLanguage === 'ar' ? 'تشغيل الصوت 🔊' : 'Unmute 🔊')
          : (currentLanguage === 'ar' ? 'كتم الصوت 🔇' : 'Mute 🔇');
    };
    const unmuteNow = () => {
        if (!isMuted) return;
        isMuted = false;
        video.muted = false;
        video.volume = DEFAULT_VOLUME; // نصف الصوت بعد فكّ الكتم
        updateAudioBtn();
        tryPlay();
    };
    const remuteNow = () => {
        if (isMuted) return;
        isMuted = true;
        video.muted = true;
        video.volume = 0;
        updateAudioBtn();
    };
    updateAudioBtn();

    audioBtn.addEventListener('click', () => (isMuted ? unmuteNow() : remuteNow()));

    // فكّ الكتم عند أول تفاعل داخل الصفحة (يشمل حركة الماوس/العجلة/لمس/زر)
    const firstInteraction = () => {
        unmuteNow();
    };
    const opts = { once: true, passive: true, capture: true };
    ['mousemove', 'wheel', 'pointerdown', 'touchstart', 'keydown'].forEach(evt =>
        window.addEventListener(evt, firstInteraction, opts)
    );

    // عند رجوع التركيز للتبويب حاول التشغيل مجدداً
    window.addEventListener('focus', () => { if (!overlay.classList.contains('hide')) tryPlay(); });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !overlay.classList.contains('hide')) tryPlay();
    });

    // مسار أمان: أغلق بعد 20 ثانية
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
    lang_btn: 'EN',
    coming_soon: 'سيتم إنشاء القسم قريباً'
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
    lang_btn: 'عر',
    coming_soon: 'This section will be created soon'
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
  renderAboutPage(); // <-- ترجمة صفحة من نحن
}

// أضِف هذا المقطع بعد تعريف const translations = { ... }
translations.ar = Object.assign({}, translations.ar, {
  // Footer
  brand_desc: 'موقع عزوزون - تدليع لعبدالعزيز صاحب الموقع الحالي',
  brand_trusted: 'شريكك الموثوق في التسوق الإلكتروني منذ 2024',
  sports: 'الرياضة',
  books: 'الكتب',

  // About page
  about_title: 'من نحن',
  about_subtitle: 'أوزوزون منصة تسوق رقمية تهدف إلى جعل تجربة الشراء أسهل وأسرع وأكثر أمانًا.',
  about_watch_intro: 'شاهد الانترو',
  about_contact_us: 'تواصل معنا',
  about_vision_h: 'رؤيتنا',
  about_vision_p: 'تقديم تجربة تسوق سلسة تلبي احتياجات الجميع في أي وقت ومن أي مكان.',
  about_mission_h: 'رسالتنا',
  about_mission_p: 'تمكين البائعين والمشترين عبر منصة آمنة وسريعة وبأسعار تنافسية.',
  about_values_h: 'قيمنا',
  about_values_p: 'الشفافية – الجودة – السرعة – دعم العملاء.',
  about_journey_h: 'رحلتنا',
  about_j_2023: '2023: إطلاق النسخة الأولى.',
  about_j_2024: '2024: تطوير الشحن والبنية التحتية.',
  about_j_2025: '2025: تجربة واجهة جديدة وتخصيص أفضل.',
  about_contact_h: 'تواصل معنا',
  about_contact_p: 'يسعدنا تواصلك لأي اقتراح أو استفسار.',
  about_email: 'البريد',
  about_whatsapp: 'واتساب'
});

translations.en = Object.assign({}, translations.en, {
  // Footer
  brand_desc: 'Azozon website — nickname for Abdulaziz, the current owner',
  brand_trusted: 'Your trusted online shopping partner since 2024',
  sports: 'Sports',
  books: 'Books',

  // About page
  about_title: 'About Us',
  about_subtitle: 'Azozon is a digital shopping platform that makes purchasing easier, faster, and safer.',
  about_watch_intro: 'Watch intro',
  about_contact_us: 'Contact us',
  about_vision_h: 'Our Vision',
  about_vision_p: 'Deliver a seamless shopping experience that serves everyone, anytime, anywhere.',
  about_mission_h: 'Our Mission',
  about_mission_p: 'Empower sellers and buyers through a secure, fast, and competitive platform.',
  about_values_h: 'Our Values',
  about_values_p: 'Transparency – Quality – Speed – Customer support.',
  about_journey_h: 'Our Journey',
  about_j_2023: '2023: First release.',
  about_j_2024: '2024: Logistics and infrastructure upgrades.',
  about_j_2025: '2025: New UI and better personalization.',
  about_contact_h: 'Contact us',
  about_contact_p: 'We are happy to hear from you for any suggestion or inquiry.',
  about_email: 'Email',
  about_whatsapp: 'WhatsApp'
});


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

// Helper: compute page route for first two links in each section
function getPageForKey(key) {
  // Allowed keys (first two per section)
  const allowed = new Set([
    'prime_video','azozon_music',        // Digital Content & Devices
    'electronics','computers',           // Shop by Department
    'gift_cards','shop_interest',        // Programs & Features
    'your_account','customer_service'    // Help & Settings
  ]);
  if (!allowed.has(key)) return null;
  // Open dedicated video page for Prime Video; others go to product list
  return key === 'prime_video'
    ? `video.html`
    : `product-list.html?p=${encodeURIComponent(key)}`;
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
    ul.innerHTML = items.map(k => {
      const url = getPageForKey(k);
      const soon = url ? '' : ' data-soon="1"';
      const href = url || '#';
      return `<li><a href="${href}"${soon}>${t(k)} <span>›</span></a></li>`;
    }).join('');
  }

  // 2) تسوّق حسب القسم
  if (sections[1]) {
    const h3 = sections[1].querySelector('h3') || sections[1].insertBefore(document.createElement('h3'), sections[1].firstChild);
    h3.textContent = t('shop_department');
    const ul = ensureMenu(sections[1]);
    const items = ['electronics','computers','smart_home','arts_crafts','fashion','home_garden'];
    ul.innerHTML = items.map(k => {
      const url = getPageForKey(k);
      const soon = url ? '' : ' data-soon="1"';
      const href = url || '#';
      return `<li><a href="${href}"${soon}>${t(k)} <span>›</span></a></li>`;
    }).join('');
    const seeAllBtn = sections[1].querySelector('.see-all-btn');
    if (seeAllBtn) seeAllBtn.textContent = t('see_all');
  }

  // 3) البرامج والميزات
  if (sections[2]) {
    const h3 = sections[2].querySelector('h3') || sections[2].insertBefore(document.createElement('h3'), sections[2].firstChild);
    h3.textContent = t('programs_features');
    const ul = ensureMenu(sections[2]);
    const items = ['gift_cards','shop_interest','azozon_live','international_shopping'];
    ul.innerHTML = items.map(k => {
      const url = getPageForKey(k);
      const soon = url ? '' : ' data-soon="1"';
      const href = url || '#';
      return `<li><a href="${href}"${soon}>${t(k)} <span>›</span></a></li>`;
    }).join('');
  }

  // 4) المساعدة والإعدادات
  if (sections[3]) {
    let h3 = sections[3].querySelector('h3');
    if (!h3) {
      h3 = document.createElement('h3');
      sections[3].prepend(h3);
    }
    h3.textContent = t('help_settings');

    const ul = ensureMenu(sections[3]);
    const items = ['your_account','customer_service','sign_out'];
    ul.innerHTML = items.map(k => {
      const url = getPageForKey(k);
      const soon = url ? '' : ' data-soon="1"';
      const href = url || '#';
      return `<li><a href="${href}"${soon}>${t(k)}</a></li>`;
    }).join('');
  }

  // نص المستخدم أعلى الدرج
  const drawerUserSpan = document.querySelector('.drawer-user span:last-child');
  if (drawerUserSpan) drawerUserSpan.textContent = t('hello_signin');
}

// Go home (handles /pages/ or root)
function goHome() {
  const p = (location.pathname || '').replace(/\\/g, '/');
  const home = p.includes('/pages/') ? '../index.html' : 'index.html';
  location.href = home;
}

// ابني هيكل الدرج إن كان فارغاً (لا يمسّ الهيدر/الفوتر)
function ensureDrawerSkeleton() {
  const drawer = document.querySelector('nav.drawer');
  if (!drawer) return;
  if (drawer.querySelector('.drawer-section')) return; // تم بناؤه سابقاً

  drawer.innerHTML = `
    <div class="drawer-header">
      <div class="drawer-user">
        <span class="user-icon">👤</span>
        <span>${t('hello_signin')}</span>
      </div>
      <button class="close-btn" type="button" aria-label="Close">✕</button>
    </div>
    <div class="drawer-content">
      <div class="drawer-section"></div>
      <div class="drawer-section"></div>
      <div class="drawer-section"></div>
      <div class="drawer-section"></div>
    </div>
  `;
  drawer.querySelector('.close-btn')?.addEventListener('click', closeDrawer);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  createHeader();
  createFooter();

  ensureDrawerSkeleton();
  updateDrawerContent();

  updateMainContent();
  renderAboutPage(); // <-- عند فتح about.html

  createIntroVideo(false);
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

// Global handler for "Coming soon" links in drawer
document.addEventListener('click', function (e) {
  const a = e.target.closest('a[data-soon]');
  if (a) {
    e.preventDefault();
    alert(t('coming_soon'));
  }
});

// Simple product grid renderer for product-list pages
function renderProductsPage(title, products) {
  const root = document.getElementById('products-root');
  if (!root) return;
  root.innerHTML = `
    <section class="products-page">
      <h1 class="products-title">${title}</h1>
      <div class="products-grid">
        ${products.map(p => `
          <article class="product-card">
            <div class="product-thumb">${p.emoji || '🛒'}</div>
            <h3 class="product-name">${p.name}</h3>
            <div class="product-price">${p.price}</div>
            <button class="add-btn" type="button">${currentLanguage==='ar'?'أضف للسلة':'Add to Cart'}</button>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

// About Component
function renderAboutPage() {
  if (!/about\.html/i.test(location.pathname)) return;

  const main = document.querySelector('main.main-content') || document.querySelector('main');
  if (!main) return;

  main.innerHTML = `
    <section class="about-hero" style="max-width:1100px;margin:24px auto 12px;padding:0 16px;text-align:center">
      <h1 style="margin:0 0 8px">${t('about_title')}</h1>
      <p>${t('about_subtitle')}</p>
      <div class="cta-bar" style="display:flex;gap:10px;justify-content:center;margin-top:22px">
        <button id="about-contact-btn" class="btn" style="background:#223043;color:#fff;border:none;border-radius:10px;padding:10px 16px;cursor:pointer">${t('about_contact_us')}</button>
        <button id="about-watch-intro" class="btn alt" style="background:#ff9900;color:#111;border:none;border-radius:10px;padding:10px 16px;cursor:pointer">${t('about_watch_intro')}</button>
      </div>
    </section>

    <section class="about-sections" style="max-width:1100px;margin:0 auto;padding:0 16px 48px">
      <div class="about-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-top:18px">
        <article class="card" style="background:#fff;border-radius:12px;padding:16px;box-shadow:0 4px 16px rgba(0,0,0,.06)">
          <h3>${t('about_vision_h')}</h3>
          <p>${t('about_vision_p')}</p>
        </article>
        <article class="card" style="background:#fff;border-radius:12px;padding:16px;box-shadow:0 4px 16px rgba(0,0,0,.06)">
          <h3>${t('about_mission_h')}</h3>
          <p>${t('about_mission_p')}</p>
        </article>
        <article class="card" style="background:#fff;border-radius:12px;padding:16px;box-shadow:0 4px 16px rgba(0,0,0,.06)">
          <h3>${t('about_values_h')}</h3>
          <p>${t('about_values_p')}</p>
        </article>
      </div>

      <h2 style="margin-top:28px">${t('about_journey_h')}</h2>
      <ul class="card" style="list-style:none;padding:16px;margin:10px 0 0;background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.06)">
        <li>${t('about_j_2023')}</li>
        <li>${t('about_j_2024')}</li>
        <li>${t('about_j_2025')}</li>
      </ul>

      <h2 id="contact" style="margin-top:28px">${t('about_contact_h')}</h2>
      <div class="card" style="background:#fff;border-radius:12px;padding:16px;box-shadow:0 4px 16px rgba(0,0,0,.06)">
        <p>${t('about_contact_p')}</p>
        <p>
          ${t('about_email')}: <a href="mailto:support@azozon.local">support@azozon.local</a><br>
          ${t('about_whatsapp')}: <a href="https://wa.me/000000000000" target="_blank" rel="noopener">راسلنا</a>
        </p>
      </div>
    </section>
  `;

  // Events
  const contactBtn = document.getElementById('about-contact-btn');
  contactBtn?.addEventListener('click', () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  });
  const introBtn = document.getElementById('about-watch-intro');
  introBtn?.addEventListener('click', () => {
    // أعِد عرض الانترو عند الطلب
    createIntroVideo(true);
  });
}

// Welcome message
setTimeout(() => {
    showNotification(t('welcome_msg'));
}, 2000);

// عرّض الدوال عالمياً لأن السكربت يعمل كـ module
window.toggleDrawer = toggleDrawer;
window.closeDrawer = closeDrawer;
window.switchLanguage = switchLanguage;
window.goHome = goHome;
window.renderProductsPage = renderProductsPage;