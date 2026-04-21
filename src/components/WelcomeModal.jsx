import React, { useState, useEffect } from 'react'
import './WelcomeModal.css'

function WelcomeModal({ onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    onClose()
  }

  return (
    <>
      {isVisible && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleClose}>×</button>
            <h2>Welcome to DSAVisualizer</h2>
            <div className="modal-content">
              <div className="instruction">
                <h3>What is this?</h3>
                <p style={{marginBottom:'12px', color:'var(--text-secondary)', fontSize:'14px'}}>
                  An interactive tool to visualize classic algorithms and data structures in real time. Pick a tab above and start exploring!
                </p>
                <h3>Visualizers:</h3>
                <ul>
                  <li><strong>Pathfinding</strong> — Dijkstra, A*, BFS, DFS, Greedy with maze generation</li>
                  <li><strong>Sorting</strong> — Bubble, Selection, Insertion, Merge, Quick Sort</li>
                  <li><strong>Tree</strong> — Binary Search Tree insert, delete, search, traversal</li>
                  <li><strong>Heap</strong> — Min/Max heap operations with tree + array view</li>
                  <li><strong>Graph</strong> — Interactive BFS/DFS on custom node-edge graphs</li>
                  <li><strong>Linked List</strong> — Singly/doubly list with pointer animations</li>
                  <li><strong>Stack & Queue</strong> — LIFO/FIFO side-by-side comparison</li>
                  <li><strong>Binary Search</strong> — Step-by-step search on sorted arrays</li>
                </ul>
              </div>
              <div className="algorithms-info">
                <h3>Tips:</h3>
                <p>Use the <strong>About</strong> tab for a full guide on each visualizer.</p>
                <p>Speed controls let you slow down or speed up any animation.</p>
                <p>All visualizers work on desktop and mobile.</p>
              </div>
            </div>
            <button className="modal-button" onClick={handleClose}>Start Exploring</button>
          </div>
        </div>
      )}
    </>
  )
}

export default WelcomeModal
