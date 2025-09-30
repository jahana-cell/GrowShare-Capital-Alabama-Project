(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const progress = document.getElementById('progress');
  let idx = slides.findIndex(s => s.classList.contains('active')) || 0;

  function render() {
    slides.forEach((s,i)=> s.classList.toggle('active', i===idx));
    progress.textContent = `${idx+1} / ${slides.length}`;
    document.title = slides[idx].dataset.title + ' — Artisan Meats Collective';
  }

  function next(){ idx = Math.min(slides.length-1, idx+1); render(); }
  function prev(){ idx = Math.max(0, idx-1); render(); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

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
})();
