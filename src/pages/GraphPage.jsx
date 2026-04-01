import React from 'react'
import './Page.css'

function GraphPage({ showToast }) {
  return (
    <div className="page graph-page">
      <div className="placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">🕸️</div>
          <h2>Graph Traversal Visualizer</h2>
          <p>Watch BFS and DFS algorithms explore nodes and edges in interactive graph structures</p>
          <div className="placeholder-features">
            <span className="placeholder-feature">BFS & DFS</span>
            <span className="placeholder-feature">Interactive Nodes</span>
            <span className="placeholder-feature">Weighted Edges</span>
            <span className="placeholder-feature">Shortest Paths</span>
          </div>
          <button className="placeholder-cta">Coming Soon</button>
        </div>
      </div>
    </div>
  )
}

export default GraphPage
