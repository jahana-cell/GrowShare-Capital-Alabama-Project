import { useEffect, useRef } from 'react'
import './index.css'
import Header from './components/Header'
import SideNav from './components/SideNav'
import Controls from './components/Controls'

function App() {
  const contentRef = useRef(null)

  useEffect(() => {
    const navLinks = Array.from(document.querySelectorAll('.side-nav a'))
    const panels = Array.from(document.querySelectorAll('main#content section'))
    const swotCards = Array.from(document.querySelectorAll('.swot-card'))
    const swotDetail = document.getElementById('swot-detail')
    const budgetBars = Array.from(document.querySelectorAll('.bar span'))
    const prevBtn = document.getElementById('prev')
    const nextBtn = document.getElementById('next')

    function safeScroll(el) { if (!el) return; el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

    navLinks.forEach(a => a.addEventListener('click', e => { e.preventDefault(); safeScroll(document.getElementById(a.dataset.target)) }))

    const spy = new IntersectionObserver(entries => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          const id = ent.target.id
          navLinks.forEach(a => a.classList.toggle('active', a.dataset.target === id))
          if (id === 'financials') {
            budgetBars.forEach(b => {
              const w = b.style.getPropertyValue('--w') || b.getAttribute('data-w') || ''
              b.style.width = w
            })
          }
        }
      })
    }, { threshold: 0.5 })
    panels.forEach(p => spy.observe(p))

    function currentPanelIndex() {
      const reference = window.scrollY + window.innerHeight / 3
      let idx = panels.findIndex(p => p.offsetTop <= reference && (p.offsetTop + p.offsetHeight) > reference)
      if (idx === -1) idx = panels.findIndex(p => p.getBoundingClientRect().top >= 0) || 0
      return Math.max(0, Math.min(panels.length - 1, idx))
    }

    function scrollToPanel(direction) {
      if (!panels.length) return
      const idx = currentPanelIndex()
      const target = Math.max(0, Math.min(panels.length - 1, idx + direction))
      safeScroll(panels[target])
    }

    if (prevBtn) prevBtn.addEventListener('click', () => scrollToPanel(-1))
    if (nextBtn) nextBtn.addEventListener('click', () => scrollToPanel(1))

    document.addEventListener('keydown', e => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') scrollToPanel(1)
      if (e.key === 'ArrowUp' || e.key === 'PageUp') scrollToPanel(-1)
      if (e.key === 'Home') safeScroll(panels[0])
      if (e.key === 'End') safeScroll(panels[panels.length - 1])
    })

    let startY = null
    document.addEventListener('touchstart', e => { startY = e.touches[0].clientY }, { passive: true })
    document.addEventListener('touchend', e => {
      if (startY == null) return
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dy) > 50) { if (dy < 0) scrollToPanel(1); else scrollToPanel(-1) }
      startY = null
    }, { passive: true })

    const swotDetails = [
      'Mitigations: strong pasture rotation, selective breeding, and community pre-sales to guarantee demand.',
      'Mitigations: staggered breeding, parasite control plan, and phased capital deployment.',
      'Opportunities: apply for USDA/local grants, add agritourism and processing services.',
      'Mitigations: predator fencing, insurance, and maintaining regulatory relationships.'
    ]
    swotCards.forEach(c => c.addEventListener('click', () => {
      const i = Number(c.dataset.idx) || 0
      if (swotDetail) swotDetail.textContent = swotDetails[i] || ''
      swotCards.forEach(x => x.classList.remove('active'))
      c.classList.add('active')
      if (swotDetail) swotDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }))

    const fsToggle = document.getElementById('fsToggle')
    if (fsToggle) fsToggle.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement) { await document.documentElement.requestFullscreen(); fsToggle.textContent = 'Exit Fullscreen' }
        else { await document.exitFullscreen(); fsToggle.textContent = 'Fullscreen' }
      } catch (err) { console.warn('Fullscreen failed', err) }
    })

    budgetBars.forEach(b => { const inline = b.style.getPropertyValue('--w'); if (!inline) { const attr = b.getAttribute('data-w'); if (attr) b.style.setProperty('--w', attr) } b.style.width = '0' })

    if (nextBtn && !nextBtn.hasAttribute('aria-label')) nextBtn.setAttribute('aria-label', 'Next panel')
    if (prevBtn && !prevBtn.hasAttribute('aria-label')) prevBtn.setAttribute('aria-label', 'Previous panel')

    // cleanup on unmount
    return () => {
      navLinks.forEach(a => a.replaceWith(a.cloneNode(true)))
      document.querySelectorAll('button, [id="prev"], [id="next"]').forEach(() => {})
    }
  }, [])

  return (
    <div className="container">
      <Header />
      <SideNav />
      <main id="content" ref={contentRef}>
        <section id="summary" className="panel p-1">
          <div className="panel-inner">
            <h2>Executive Summary</h2>
            <p>Start with 10 goats and 15 sheep, scale to 50. Direct-to-consumer, community-investor model with on-site processing to capture value.</p>
            <div className="highlights">
              <div className="chip">Community-backed</div>
              <div className="chip">Fresh & Local</div>
              <div className="chip">Halal-capable</div>
              <div className="chip">Value-added processing</div>
            </div>
          </div>
        </section>

        <section id="market" className="panel p-2">
          <div className="panel-inner">
            <h2>Market Overview & Pain Points</h2>
            <ul className="points">
              <li>High domestic demand, heavy reliance on imports</li>
              <li>Consumers lack fresh local options and transparency</li>
              <li>Price inflated by multiple middlemen</li>
              <li>Cultural and Halal requirements underserved</li>
            </ul>
          </div>
        </section>

        <section id="opportunity" className="panel p-3">
          <div className="panel-inner">
            <h2>The Opportunity</h2>
            <ol>
              <li>Serve niche ethnic & gourmet markets at premium prices</li>
              <li>Leverage the local-food movement</li>
              <li>Build direct relationships to stabilize revenue</li>
              <li>Offer local investment options</li>
            </ol>
          </div>
        </section>

        <section id="solution" className="panel p-4">
          <div className="panel-inner">
            <h2>Our Solution</h2>
            <div className="columns">
              <div>
                <h3>Breeding Program</h3>
                <p>Community-centric model with transparent practices and regular updates.</p>
              </div>
              <div>
                <h3>Direct Sales</h3>
                <p>Whole/half/custom cuts direct to customers and restaurants.</p>
              </div>
              <div>
                <h3>Processing</h3>
                <p>On-site compliant processing to control quality and offer Halal options.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="competition" className="panel p-5">
          <div className="panel-inner">
            <h2>Competitive Landscape</h2>
            <div className="grid">
              <div className="card colorful">
                <h4>Large Producers</h4>
                <p>Scale & low price; limited freshness and traceability.</p>
              </div>
              <div className="card colorful">
                <h4>Local Farms</h4>
                <p>Local appeal; often inconsistent supply and no processing.</p>
              </div>
              <div className="card colorful">
                <h4>Imported Meat</h4>
                <p>Available & consistent, but frozen and untraceable.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="swot" className="panel p-6">
          <div className="panel-inner">
            <h2>SWOT</h2>
            <div className="swot-grid">
              <div className="swot-card" data-idx="0">
                <h4>Strengths</h4>
                <ul>
                  <li>High-value niche market</li>
                  <li>Hardy animals & multiple revenue streams</li>
                  <li>Community-investor model</li>
                </ul>
              </div>
              <div className="swot-card" data-idx="1">
                <h4>Weaknesses</h4>
                <ul>
                  <li>Slower growth cycle</li>
                  <li>Parasite management</li>
                  <li>Initial capital needs</li>
                </ul>
              </div>
              <div className="swot-card" data-idx="2">
                <h4>Opportunities</h4>
                <ul>
                  <li>Value-added processing</li>
                  <li>Government grants</li>
                  <li>Agritourism</li>
                </ul>
              </div>
              <div className="swot-card" data-idx="3">
                <h4>Threats</h4>
                <ul>
                  <li>Predation</li>
                  <li>Regulatory hurdles</li>
                  <li>Input price fluctuation</li>
                </ul>
              </div>
            </div>
            <p className="swot-hint">Click any card to expand mitigation ideas.</p>
            <div id="swot-detail" className="swot-detail"></div>
          </div>
        </section>

        <section id="marketing" className="panel p-7">
          <div className="panel-inner">
            <h2>Marketing Strategy</h2>
            <div className="columns">
              <div>
                <h3>Offline (60%)</h3>
                <ul>
                  <li>Farmers' markets & restaurant partnerships</li>
                  <li>Farm open days & agritourism</li>
                </ul>
              </div>
              <div>
                <h3>Online (40%)</h3>
                <ul>
                  <li>Social media, content, email, local SEO</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="roadmap" className="panel p-8">
          <div className="panel-inner">
            <h2>Roadmap</h2>
            <div className="timeline">
              <div className="step"><strong>Phase 1</strong><span>Secure $50k+, acquire stock, build infrastructure</span></div>
              <div className="step"><strong>Phase 2</strong><span>Breeding cycle, begin processing build, market entry</span></div>
              <div className="step"><strong>Year 2</strong><span>Scale herd, launch direct sales</span></div>
              <div className="step"><strong>Year 3</strong><span>Stabilize production & diversify revenue</span></div>
            </div>
          </div>
        </section>

        <section id="financials" className="panel p-9">
          <div className="panel-inner">
            <h2>Financials</h2>
            <div className="budget">
              <div className="bar"><span style={{'--w':'30%'}}>Breeding stock — 30%</span></div>
              <div className="bar"><span style={{'--w':'40%'}}>Infrastructure — 40%</span></div>
              <div className="bar"><span style={{'--w':'20%'}}>Operational runway — 20%</span></div>
              <div className="bar"><span style={{'--w':'10%'}}>Processing setup — 10%</span></div>
            </div>
            <div className="projection">
              <div className="proj-card">
                <h4>Year 1</h4>
                <p>20 animals sold — $3,200 — Net $200</p>
              </div>
              <div className="proj-card">
                <h4>Year 2</h4>
                <p>22 animals sold — $3,520 — Net $520</p>
              </div>
              <div className="proj-card">
                <h4>Year 3</h4>
                <p>25 animals sold — $4,000 — Net $800</p>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="panel p-10">
          <div className="panel-inner">
            <h2>Get Involved</h2>
            <p>Join Artisan Meats Collective. Learn about investment tiers, farm tours, and pre-orders.</p>
            <p className="contact">Email: info@artisanmeats.local • Phone: (555) 555-0123</p>
            <div className="cta-actions">
              <a className="btn-primary" href="mailto:info@artisanmeats.local">Contact Us</a>
              <a className="btn-ghost" href="#roadmap">See Roadmap</a>
            </div>
          </div>
        </section>
      </main>
      <Controls />
      <footer>
        <small>Presentation generated from business plan — Artisan Meats Collective</small>
      </footer>
    </div>
  )
}

export default App
