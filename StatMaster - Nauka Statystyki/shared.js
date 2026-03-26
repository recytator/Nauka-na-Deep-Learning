// ===== THEME TOGGLE =====
(function(){
  const html = document.documentElement;
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = prefersDark ? 'dark' : 'light';
  html.setAttribute('data-theme', theme);

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) {
      updateToggleIcon(toggle, theme);
      toggle.addEventListener('click', () => {
        theme = theme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', theme);
        updateToggleIcon(toggle, theme);
      });
    }
  });

  function updateToggleIcon(btn, t) {
    btn.innerHTML = t === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' mode');
  }
})();

// ===== SCROLL ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
    observer.observe(el);
  });
});

// ===== STICKY NAV SHADOW =====
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }
});

// ===== MOBILE NAV =====
document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');

  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => mobileNav.classList.add('open'));
    if (mobileClose) mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }
});

// ===== PROGRESS BAR =====
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.querySelector('.progress-bar-fill');
  if (bar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
    }, { passive: true });
  }
});

// ===== TOC ACTIVE TRACKING =====
document.addEventListener('DOMContentLoaded', () => {
  const tocLinks = document.querySelectorAll('.toc-list a');
  const sections = [];

  tocLinks.forEach(link => {
    const id = link.getAttribute('href')?.replace('#', '');
    if (id) {
      const el = document.getElementById(id);
      if (el) sections.push({ el, link });
    }
  });

  if (sections.length === 0) return;

  const updateActive = () => {
    let current = sections[0];
    for (const s of sections) {
      if (s.el.getBoundingClientRect().top <= 120) current = s;
    }
    tocLinks.forEach(l => l.classList.remove('active'));
    current.link.classList.add('active');
  };

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
});

// ===== ACCORDION =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('open');
    });
  });
});

// ===== QUIZ FUNCTIONALITY =====
function initQuiz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', function() {
      const question = this.closest('.quiz-question');
      const options = question.querySelectorAll('.quiz-option');
      const feedback = question.querySelector('.quiz-feedback');

      if (this.classList.contains('disabled')) return;

      options.forEach(o => {
        o.classList.add('disabled');
        if (o.dataset.correct === 'true') o.classList.add('correct');
      });

      if (this.dataset.correct === 'true') {
        this.classList.add('correct');
        if (feedback) {
          feedback.textContent = feedback.dataset.success || 'Brawo! Poprawna odpowiedz.';
          feedback.classList.add('show', 'success');
        }
      } else {
        this.classList.add('wrong');
        if (feedback) {
          feedback.textContent = feedback.dataset.error || 'Niestety, to nie jest poprawna odpowiedz.';
          feedback.classList.add('show', 'error');
        }
      }
    });
  });
}
