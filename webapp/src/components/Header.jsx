import logo from '../assets/logo.svg'

export default function Header(){
  return (
    <header>
      <div className="brand">
        <img src={logo} alt="logo" className="logo" />
        <div>
          <h1>Artisan Meats Collective</h1>
          <p className="subtitle">Goat &amp; Lamb Breeding Program — Community-focused, sustainable model</p>
        </div>
      </div>
      <div className="header-controls">
        <button id="fsToggle" title="Toggle fullscreen">Fullscreen</button>
      </div>
    </header>
  )
}
