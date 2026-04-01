import React from 'react'
import './Page.css'

function BinarySearchPage({ showToast }) {
  return (
    <div className="page binarysearch-page">
      <div className="placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">🔍</div>
          <h2>Binary Search Visualizer</h2>
          <p>Watch the binary search algorithm divide and conquer sorted arrays with animated pointers</p>
          <div className="placeholder-features">
            <span className="placeholder-feature">O(log n) Search</span>
            <span className="placeholder-feature">Pointer Animation</span>
            <span className="placeholder-feature">Step-by-Step</span>
            <span className="placeholder-feature">Sorted Arrays</span>
          </div>
          <button className="placeholder-cta">Coming Soon</button>
        </div>
      </div>
    </div>
  )
}

export default BinarySearchPage
