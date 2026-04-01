import React from 'react'
import './Page.css'

function HeapPage({ showToast }) {
  return (
    <div className="page heap-page">
      <div className="placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">🏗️</div>
          <h2>Heap Visualizer</h2>
          <p>Explore priority queues and heap operations with interactive tree and array representations</p>
          <div className="placeholder-features">
            <span className="placeholder-feature">Min/Max Heaps</span>
            <span className="placeholder-feature">Insert & Delete</span>
            <span className="placeholder-feature">Heap Sort</span>
            <span className="placeholder-feature">Tree Visualization</span>
          </div>
          <button className="placeholder-cta">Coming Soon</button>
        </div>
      </div>
    </div>
  )
}

export default HeapPage
