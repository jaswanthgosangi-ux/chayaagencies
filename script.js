/* ==========================================================================
   CHAYA AGENCIES - Enterprise Script Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Header Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Navigation Toggle & Backdrop Overlay
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');

  const setMenuState = (isOpen) => {
    if (!navMenu) return;

    if (isOpen) {
      navMenu.classList.add('open');
      if (navOverlay) navOverlay.classList.add('active');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'true');
        mobileToggle.innerHTML = '<i data-lucide="x"></i>';
      }
    } else {
      navMenu.classList.remove('open');
      if (navOverlay) navOverlay.classList.remove('active');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
      }
    }

    if (window.lucide) window.lucide.createIcons();
  };

  if (mobileToggle && navMenu) {
    const handleToggleClick = (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      setMenuState(!isOpen);
    };

    mobileToggle.addEventListener('click', handleToggleClick);

    if (navOverlay) {
      navOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        setMenuState(false);
      });
    }

    // Close menu and smoothly scroll to target section when tapping nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        setMenuState(false);

        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            e.preventDefault();
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        setMenuState(false);
      }
    });
  }

  // 3. Smooth Active Link Scroll Tracking
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  // 4. Animated Counters
  const counterElements = document.querySelectorAll('.stat-number');
  let animated = false;

  function runCounters() {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = target / 60;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.ceil(count) + suffix;
          setTimeout(updateCount, 25);
        } else {
          counter.innerText = target + suffix;
        }
      };
      updateCount();
    });
  }

  const statsSection = document.querySelector('.stats-banner');
  if (statsSection) {
    window.addEventListener('scroll', () => {
      const sectionPos = statsSection.getBoundingClientRect().top;
      const screenPos = window.innerHeight / 1.2;
      if (sectionPos < screenPos && !animated) {
        animated = true;
        runCounters();
      }
    });
  }

  // 5. Project Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  // 6. FAQ Accordion Toggle & Live Search Filter
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  const faqSearchInput = document.getElementById('faqSearchInput');
  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const text = item.innerText.toLowerCase();
        if (text.includes(term)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 7. Lightbox Modal Logic
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.project-zoom-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card');
      const img = card.querySelector('img');
      if (lightboxModal && lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // 8. Booking / Consultation Modal Handler
  const bookingModal = document.getElementById('bookingModal');
  const bookingClose = document.getElementById('bookingClose');
  const bookingTriggers = document.querySelectorAll('.trigger-booking-modal');

  bookingTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (bookingModal) {
        bookingModal.classList.add('active');
      }
    });
  });

  if (bookingClose) {
    bookingClose.addEventListener('click', () => {
      bookingModal.classList.remove('active');
    });
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
      }
    });
  }

  // 9. Site Survey Form Submission (Redirects to formatted WhatsApp chat)
  const siteSurveyForm = document.getElementById('siteSurveyForm');
  if (siteSurveyForm) {
    siteSurveyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('surveyName').value;
      const phone = document.getElementById('surveyPhone').value;
      const property = document.getElementById('surveyProperty').value;
      const system = document.getElementById('surveySystem').value;
      const message = document.getElementById('surveyMessage').value;

      const whatsappText = `*CHAYA AGENCIES - Free Site Survey Request*%0A%0A` +
        `*Name:* ${name}%0A` +
        `*Phone:* ${phone}%0A` +
        `*Property Type:* ${property}%0A` +
        `*System Required:* ${system}%0A` +
        `*Additional Details:* ${message || 'N/A'}`;

      const whatsappUrl = `https://wa.me/919703860810?text=${whatsappText}`;

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      alert('Thank you! Redirecting to WhatsApp to send your site survey details directly to CHAYA AGENCIES experts.');
      siteSurveyForm.reset();
      if (bookingModal) bookingModal.classList.remove('active');
    });
  }

  // 10. Contact Form Submission
  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const phone = document.getElementById('contactPhone').value;
      const email = document.getElementById('contactEmail').value;
      const service = document.getElementById('contactService').value;
      const message = document.getElementById('contactMessage').value;

      const text = `*New Inquiry for CHAYA AGENCIES*%0A%0A` +
        `*Name:* ${name}%0A` +
        `*Phone:* ${phone}%0A` +
        `*Email:* ${email}%0A` +
        `*Service Requested:* ${service}%0A` +
        `*Message:* ${message}`;

      window.open(`https://wa.me/919703860810?text=${text}`, '_blank');
      contactForm.reset();
    });
  }
});
