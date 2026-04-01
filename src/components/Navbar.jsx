import React from 'react'
import './Navbar.css'

function Navbar({ activeTab, setActiveTab, tabs }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="title"><span className="logo-mark">D</span>SAVisualizer</h1>
        <div className="tabs">
          {tabs.filter(t => t.id !== 'about').map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          <div className="tab-separator" />
          <button
            className={`tab tab-about ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
