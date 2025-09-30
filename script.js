(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const progress = document.getElementById('progress');
  const notesToggle = document.getElementById('notesToggle');
  const fsToggle = document.getElementById('fsToggle');
  let idx = slides.findIndex(s => s.classList.contains('active')) || 0;
  let notesShown = false;

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

  // notes toggle
  if(notesToggle){
    notesToggle.addEventListener('click', ()=>{
      notesShown = !notesShown;
      slides.forEach(s => s.classList.toggle('show-notes', notesShown));
      notesToggle.classList.toggle('active', notesShown);
    });
  }

  // fullscreen
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
      }catch(e){ console.warn('Fullscreen not supported', e); }
    });
  }

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
