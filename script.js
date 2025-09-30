(() => {
  // Consolidated single-page presentation script
  const navLinks = Array.from(document.querySelectorAll('.side-nav a'));
  const panels = Array.from(document.querySelectorAll('main#content section'));
  const swotCards = Array.from(document.querySelectorAll('.swot-card'));
  const swotDetail = document.getElementById('swot-detail');
  const budgetBars = Array.from(document.querySelectorAll('.bar span'));
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  // Helper: safe scrollIntoView
  function safeScroll(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Smooth scroll for nav links
  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.dataset.target;
      const el = document.getElementById(id);
      safeScroll(el);
    });
  });

  // Scroll-spy observer updates active nav and triggers budget animation
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        const id = ent.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.dataset.target === id));
        if (id === 'financials') {
          budgetBars.forEach(b => {
            const w = b.style.getPropertyValue('--w') || b.getAttribute('data-w') || '';
            b.style.width = w;
          });
        }
      }
    });
  }, { threshold: 0.5 });
  panels.forEach(p => spy.observe(p));

  // Determine the currently visible panel index
  function currentPanelIndex() {
    const reference = window.scrollY + window.innerHeight / 3;
    let idx = panels.findIndex(p => p.offsetTop <= reference && (p.offsetTop + p.offsetHeight) > reference);
    if (idx === -1) {
      // fallback: pick the first fully visible or nearest
      idx = panels.findIndex(p => p.getBoundingClientRect().top >= 0) || 0;
    }
    return Math.max(0, Math.min(panels.length - 1, idx));
  }

  // Scroll to adjacent panel
  function scrollToPanel(direction) {
    if (!panels.length) return;
    const idx = currentPanelIndex();
    const target = Math.max(0, Math.min(panels.length - 1, idx + direction));
    safeScroll(panels[target]);
  }

  // Prev/Next handlers (guard null buttons)
  if (prevBtn) prevBtn.addEventListener('click', () => scrollToPanel(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollToPanel(1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.target && /input|textarea/i.test(e.target.tagName)) return; // ignore typing
    if (e.key === 'ArrowDown' || e.key === 'PageDown') scrollToPanel(1);
    if (e.key === 'ArrowUp' || e.key === 'PageUp') scrollToPanel(-1);
    if (e.key === 'Home') safeScroll(panels[0]);
    if (e.key === 'End') safeScroll(panels[panels.length - 1]);
  });

  // Vertical swipe support for touch devices
  let startY = null;
  document.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (startY == null) return;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dy) > 50) {
      if (dy < 0) scrollToPanel(1); else scrollToPanel(-1);
    }
    startY = null;
  }, { passive: true });

  // SWOT interactivity
  const swotDetails = [
    'Mitigations: strong pasture rotation, selective breeding, and community pre-sales to guarantee demand.',
    'Mitigations: staggered breeding, parasite control plan, and phased capital deployment.',
    'Opportunities: apply for USDA/local grants, add agritourism and processing services.',
    'Mitigations: predator fencing, insurance, and maintaining regulatory relationships.'
  ];
  swotCards.forEach(c => c.addEventListener('click', () => {
    const i = Number(c.dataset.idx) || 0;
    if (swotDetail) swotDetail.textContent = swotDetails[i] || '';
    swotCards.forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    if (swotDetail) swotDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }));

  // Fullscreen toggle
  const fsToggle = document.getElementById('fsToggle');
  if (fsToggle) {
    fsToggle.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
          fsToggle.textContent = 'Exit Fullscreen';
        } else {
          await document.exitFullscreen();
          fsToggle.textContent = 'Fullscreen';
        }
      } catch (err) {
        console.warn('Fullscreen failed', err);
      }
    });
  }

  // Initialize budget bars to zero width and read --w from inline style or data-w
  budgetBars.forEach(b => {
    // allow both CSS var or data attribute for robust setup
    const inline = b.style.getPropertyValue('--w');
    if (!inline) {
      const attr = b.getAttribute('data-w');
      if (attr) b.style.setProperty('--w', attr);
    }
    b.style.width = '0';
  });

  // Accessibility: add aria-labels if not present
  if (nextBtn && !nextBtn.hasAttribute('aria-label')) nextBtn.setAttribute('aria-label', 'Next panel');
  if (prevBtn && !prevBtn.hasAttribute('aria-label')) prevBtn.setAttribute('aria-label', 'Previous panel');

})();
