(() => {
  const navLinks = Array.from(document.querySelectorAll('.side-nav a'));
  const panels = Array.from(document.querySelectorAll('main#content section'));
  const swotCards = Array.from(document.querySelectorAll('.swot-card'));
  const swotDetail = document.getElementById('swot-detail');
  const budgetBars = Array.from(document.querySelectorAll('.bar span'));
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  // Smooth scroll for nav links
  navLinks.forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.dataset.target;
      const el = document.getElementById(id);
      el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  // Scroll-spy observer
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        const id = ent.target.id;
        navLinks.forEach(a=> a.classList.toggle('active', a.dataset.target === id));
        if(id === 'financials'){
          budgetBars.forEach(b=> b.style.width = b.style.getPropertyValue('--w'));
        }
      }
    });
  },{threshold:0.5});
  panels.forEach(p=> observer.observe(p));

  // Prev/Next scroll to previous/next panel
  function scrollToPanel(direction){
    const y = window.scrollY + window.innerHeight/3; // central reference
    let idx = panels.findIndex(p => p.offsetTop <= y && (p.offsetTop + p.offsetHeight) > y);
    if(idx === -1) idx = 0;
    let target = idx + direction;
    target = Math.max(0, Math.min(panels.length-1, target));
    panels[target].scrollIntoView({behavior:'smooth',block:'start'});
  }
  prevBtn.addEventListener('click', ()=> scrollToPanel(-1));
  nextBtn.addEventListener('click', ()=> scrollToPanel(1));

  // keyboard navigation
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowDown' || e.key === 'PageDown') scrollToPanel(1);
    if(e.key === 'ArrowUp' || e.key === 'PageUp') scrollToPanel(-1);
    if(e.key === 'Home') panels[0].scrollIntoView({behavior:'smooth',block:'start'});
    if(e.key === 'End') panels[panels.length-1].scrollIntoView({behavior:'smooth',block:'start'});
  });

  // simple vertical swipe support
  let startY = null;
  document.addEventListener('touchstart', e=> startY = e.touches[0].clientY);
  document.addEventListener('touchend', e=>{
    if(startY == null) return;
    const dy = e.changedTouches[0].clientY - startY;
    if(Math.abs(dy) > 40){ if(dy < 0) scrollToPanel(1); else scrollToPanel(-1); }
    startY = null;
  });

  // SWOT interaction
  const swotDetails = [
    'Mitigations: strong pasture rotation, selective breeding, and community pre-sales to guarantee demand.',
    'Mitigations: staggered breeding, parasite control plan, and phased capital deployment.',
    'Opportunities: apply for USDA/local grants, add agritourism and processing services.',
    'Mitigations: predator fencing, insurance, and maintaining regulatory relationships.'
  ];
  swotCards.forEach(c=>{
    c.addEventListener('click', ()=>{
      const i = Number(c.dataset.idx) || 0;
      swotDetail.textContent = swotDetails[i] || '';
      swotCards.forEach(x=>x.classList.remove('active'));
      c.classList.add('active');
      swotDetail.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  });

  // Fullscreen toggle
  const fsToggle = document.getElementById('fsToggle');
  if(fsToggle){
    fsToggle.addEventListener('click', async ()=>{
      try{
        if(!document.fullscreenElement){
          await document.documentElement.requestFullscreen();
          fsToggle.textContent = 'Exit Fullscreen';
        } else {
          await document.exitFullscreen();
          fsToggle.textContent = 'Fullscreen';
        }
      }catch(e){ console.warn('Fullscreen failure', e); }
    });
  }

  // initialize: set budget bars 0 width for animation
  budgetBars.forEach(b=> b.style.width = '0');
})();
(() => {
  const navLinks = Array.from(document.querySelectorAll('.side-nav a'));
  const panels = Array.from(document.querySelectorAll('main#content section'));
  const swotCards = Array.from(document.querySelectorAll('.swot-card'));
  const swotDetail = document.getElementById('swot-detail');
  const budgetBars = Array.from(document.querySelectorAll('.bar span'));

  // Smooth scroll for nav links
  navLinks.forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.dataset.target;
      const el = document.getElementById(id);
      el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  function render() {
    slides.forEach((s,i)=> s.classList.toggle('active', i===idx));
    progress.textContent = `${idx+1} / ${slides.length}`;
    document.title = slides[idx].dataset.title + ' — Artisan Meats Collective';
    // ensure notes visibility state is applied
    slides.forEach(s => s.classList.toggle('show-notes', notesShown));
  }

  function next(){ idx = Math.min(slides.length-1, idx+1); render(); }
  function prev(){ idx = Math.max(0, idx-1); render(); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // SWOT card click -> show details
  const swotDetails = [
    'Mitigations: strong pasture rotation, selective breeding, and community pre-sales to guarantee demand.',
    'Mitigations: staggered breeding, parasite control plan, and phased capital deployment.',
    'Opportunities: apply for USDA/local grants, add agritourism and processing services.',
    'Mitigations: predator fencing, insurance, and maintaining regulatory relationships.'
  ];
  swotCards.forEach(c=>{
    c.addEventListener('click', ()=>{
      const i = Number(c.dataset.idx) || 0;
      swotDetail.textContent = swotDetails[i] || '';
      swotCards.forEach(x=>x.classList.remove('active'));
      c.classList.add('active');
      swotDetail.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  });

  // Scroll-spy to update active nav link
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        const id = ent.target.id;
        navLinks.forEach(a=> a.classList.toggle('active', a.dataset.target === id));
        // trigger budget bars animation only when financials visible
        if(id === 'financials'){
          budgetBars.forEach(b=> b.style.width = b.style.getPropertyValue('--w'));
        }
      }
    });
  },{threshold:0.45});
  panels.forEach(p=> observer.observe(p));

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight' || e.key === 'PageDown') next();
    if(e.key === 'ArrowLeft' || e.key === 'PageUp') prev();
    if(e.key === 'Home') { idx = 0; render(); }
    if(e.key === 'End') { idx = slides.length-1; render(); }
  });

  // simple touch support
  let startX = null;
  document.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; });
  document.addEventListener('touchend', e=>{
    if(startX==null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){ if(dx < 0) next(); else prev(); }
    startX = null;
  });

  // announce initial
  render();
  // set focus to next for keyboard users
  nextBtn.setAttribute('aria-label','Next slide');
  prevBtn.setAttribute('aria-label','Previous slide');
})();
