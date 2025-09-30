import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="Octocat.png" className="App-logo" alt="logo" />
        <p>
          GitHub Codespaces <span className="heart">♥️</span> React
        </p>
        <p className="small">
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </p>
      </header>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const slides = [
  {
    id: 'title',
    title: 'Artisan Meats Collective',
    subtitle: 'A Community-Focused, Sustainable Goat & Lamb Breeding Program for Alabama',
    background: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2940&auto=format&fit=crop'
  },
  {
    id: 'summary',
    title: 'Executive Summary',
    content: `Artisan Meats Collective is a planned livestock breeding program focused on goats and sheep, designed to address critical gaps in Alabama's local meat supply chain. Initial Scale: Launching with a foundational herd of 10 goats and 15 sheep. Primary Goal: Grow to a sustainable herd of 50 breeding animals through managed breeding. Core Business: Selling high-quality, ethically-raised animals and meat directly to the community at fair market prices.`
  },
  {
    id: 'problem',
    title: 'The Market Problem',
    content: `Limited local availability of fresh goat and lamb; lack of transparency in the supply chain; price inefficiency from middlemen; barriers for niche markets (Halal/Zabiha).`
  },
  {
    id: 'opportunity',
    title: 'The Opportunity',
    content: `Meet unmet niche demand, capture the local food movement, build a resilient direct-to-consumer business, and foster community investment.`
  },
  {
    id: 'solution',
    title: 'Our Solution: Artisan Meats Collective',
    content: `Transparent pasture-to-plate model with community-centric breeding, direct-to-consumer sales, and value-added processing (on-site, compliant).`
  },
  {
    id: 'competitive',
    title: 'Competitive Landscape',
    content: `We compete on freshness, transparency, consistent local supply, and value-added processing compared to large producers, other local farms, and imported retail meat.`
  },
  {
    id: 'swot',
    title: 'SWOT Analysis',
    content: `Strengths: niche market, hardy animals, multiple revenue streams. Weaknesses: longer time to market, parasite management, capital needs. Opportunities: processing, grants, agritourism. Threats: predation, regulations, input cost volatility.`
  },
  {
    id: 'marketing',
    title: 'Marketing Strategy',
    content: `Offline: farmers markets, partnerships, community events, farm open days. Online: social media, content & email, local SEO.`
  },
  {
    id: 'roadmap',
    title: 'Roadmap to Success',
    content: `Phase 1: Foundation & Infrastructure. Phase 2: Breeding & Market Entry. Phase 3: Scaling. Phase 4: Profitability & Diversification.`
  },
  {
    id: 'finance',
    title: 'Financial Plan & Use of Funds',
    content: `Optimal Investment: $50,000+. Infrastructure 40%, Breeding Stock 30%, Operational Runway 20%, Processing 10%.`
  },
  {
    id: 'projections',
    title: 'Financial Projections',
    content: `Year 1: 20 animals sold, $3,200 revenue, $200 net; Year 2: 22 sold, $3,520 revenue, $520 net; Year 3: 25 sold, $4,000 revenue, $800 net.`
  },
  {
    id: 'cta',
    title: 'Join Us',
    content: `We're seeking partners and investors to build a more sustainable and transparent local food system in Alabama. Contact us to learn more.`
  }
];

function Slide({ slide }){
  return (
    <section className="slide" id={slide.id} style={{backgroundImage: slide.background ? `url(${slide.background})` : undefined}}>
      <div className="slide-inner">
        <h1 className="slide-title">{slide.title}</h1>
        {slide.subtitle && <h2 className="slide-sub">{slide.subtitle}</h2>}
        {slide.content && <p className="slide-content">{slide.content}</p>}
      </div>
    </section>
  )
}

export default function App(){
  const containerRef = useRef(null);
  const [active, setActive] = useState(slides[0].id);

  useEffect(()=>{
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          setActive(e.target.id);
        }
      })
    }, {threshold: 0.55});

    const el = containerRef.current;
    if(!el) return;
    const secs = el.querySelectorAll('.slide');
    secs.forEach(s=>observer.observe(s));
    return ()=>secs.forEach(s=>observer.unobserve(s));
  },[])

  return (
    <div className="presentation">
      <aside className="nav">
        {slides.map(s=> (
          <a key={s.id} href={`#${s.id}`} className={`nav-item ${active===s.id? 'active':''}`}>{s.title}</a>
        ))}
      </aside>
      <main ref={containerRef} className="slides">
        {slides.map(s => <Slide key={s.id} slide={s} />)}
      </main>
    </div>
  )
}
