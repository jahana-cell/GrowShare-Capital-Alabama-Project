export default function SideNav(){
  return (
    <nav className="side-nav" aria-label="Presentation navigation">
      <ul>
        <li><a href="#summary" data-target="summary" className="active">Summary</a></li>
        <li><a href="#market" data-target="market">Market</a></li>
        <li><a href="#opportunity" data-target="opportunity">Opportunity</a></li>
        <li><a href="#solution" data-target="solution">Solution</a></li>
        <li><a href="#competition" data-target="competition">Competition</a></li>
        <li><a href="#swot" data-target="swot">SWOT</a></li>
        <li><a href="#marketing" data-target="marketing">Marketing</a></li>
        <li><a href="#roadmap" data-target="roadmap">Roadmap</a></li>
        <li><a href="#financials" data-target="financials">Financials</a></li>
        <li><a href="#cta" data-target="cta">Get Involved</a></li>
      </ul>
    </nav>
  )
}
