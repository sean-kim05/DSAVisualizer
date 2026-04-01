import React from 'react'
import './Page.css'

function LinkedListPage({ showToast }) {
  return (
    <div className="page linkedlist-page">
      <div className="placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">🔗</div>
          <h2>Linked List Visualizer</h2>
          <p>Learn singly and doubly linked list operations with animated pointer movements</p>
          <div className="placeholder-features">
            <span className="placeholder-feature">Singly & Doubly</span>
            <span className="placeholder-feature">Insert/Delete</span>
            <span className="placeholder-feature">Pointer Animation</span>
            <span className="placeholder-feature">Memory Layout</span>
          </div>
          <button className="placeholder-cta">Coming Soon</button>
        </div>
      </div>
    </div>
  )
}

export default LinkedListPage
