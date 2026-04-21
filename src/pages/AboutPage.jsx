import React, { useState } from 'react'
import { Navigation, BarChart2, GitBranch, Layers, Share2, Link2, AlignJustify, Search } from 'lucide-react'
import './Page.css'
import './AboutPage.css'

const sections = [
  {
    id: 'pathfinding',
    icon: Navigation,
    title: 'Pathfinding',
    color: '#6366f1',
    desc: 'Watch algorithms navigate a grid from a start node to an end node in real time.',
    how: [
      'Drag the green node to move the start position',
      'Drag the red node to move the end position',
      'Click and drag on the grid to draw walls',
      'Select an algorithm from the dropdown',
      'Click Visualize to run it',
      'Use Generate Maze to create a random maze',
      'Clear Path removes animation but keeps walls',
      'Clear Board resets everything',
    ],
    algos: [
      { name: "Dijkstra's", desc: 'Guarantees shortest path. Explores equally in all directions.' },
      { name: 'A*', desc: 'Guarantees shortest path. Faster than Dijkstra using Manhattan distance heuristic.' },
      { name: 'BFS', desc: 'Guarantees shortest path on unweighted grids. Simple and efficient.' },
      { name: 'DFS', desc: 'Does not guarantee shortest path. Explores depth-first.' },
      { name: 'Greedy Best First', desc: 'Fast but does not guarantee shortest path. Uses heuristic only.' },
    ],
  },
  {
    id: 'sorting',
    icon: BarChart2,
    title: 'Sorting',
    color: '#a78bfa',
    desc: 'Visualize sorting algorithms on a bar chart with color-coded comparisons and swaps.',
    how: [
      'Click Generate New Array to create a random array',
      'Select an algorithm from the dropdown',
      'Adjust speed with the Speed selector',
      'Click Sort to start the animation',
      'Yellow = comparing, Red = swapping, Green = sorted',
    ],
    algos: [
      { name: 'Bubble Sort', desc: 'O(n²) — repeatedly swaps adjacent elements out of order.' },
      { name: 'Selection Sort', desc: 'O(n²) — finds the minimum and places it at the front each pass.' },
      { name: 'Insertion Sort', desc: 'O(n²) avg, O(n) best — builds a sorted array one element at a time.' },
      { name: 'Merge Sort', desc: 'O(n log n) — divide and conquer, stable sort.' },
      { name: 'Quick Sort', desc: 'O(n log n) avg — in-place divide and conquer with a pivot.' },
    ],
  },
  {
    id: 'tree',
    icon: GitBranch,
    title: 'Binary Search Tree',
    color: '#22c55e',
    desc: 'Build a BST interactively and watch insert, delete, search, and traversal animate node by node.',
    how: [
      'Type a number (0–999) into the input field',
      'Click Insert to add the value to the tree',
      'Click Delete to remove a value',
      'Click Search to highlight the search path',
      'Use Inorder / Preorder / Postorder to animate traversals',
      'Click Generate Random to build a random tree with 10 nodes',
    ],
    algos: [
      { name: 'Inorder', desc: 'Left → Root → Right. Produces sorted output for a BST.' },
      { name: 'Preorder', desc: 'Root → Left → Right. Useful for copying a tree.' },
      { name: 'Postorder', desc: 'Left → Right → Root. Useful for deleting a tree.' },
    ],
  },
  {
    id: 'heap',
    icon: Layers,
    title: 'Heap',
    color: '#f59e0b',
    desc: 'Visualize a Min or Max heap as both a tree and an array, with animated bubble-up and bubble-down.',
    how: [
      'Choose Min Heap or Max Heap from the dropdown',
      'Type a value and click Insert (or press Enter)',
      'Watch the value bubble up to restore the heap property',
      'Click Extract Min/Max to remove the root',
      'Watch the new root bubble down',
      'Click Random to generate a valid heap with 8 values',
      'Blue = root, Purple = regular node, Yellow = comparing, Red = swapping',
    ],
    algos: [
      { name: 'Insert + Bubble Up', desc: 'Add to end, then swap upward until heap property is restored. O(log n).' },
      { name: 'Extract + Bubble Down', desc: 'Remove root, move last element to top, swap downward. O(log n).' },
    ],
  },
  {
    id: 'graph',
    icon: Share2,
    title: 'Graph Traversal',
    color: '#8b5cf6',
    desc: 'Build a custom graph by adding nodes and edges, then run BFS or DFS to watch the traversal animate.',
    how: [
      'Select Add Nodes mode and click the canvas to place nodes',
      'Select Add Edges mode, click one node then another to connect them',
      'Select Delete mode and click any node to remove it (and its edges)',
      'Click BFS to run Breadth-First Search starting from the first node',
      'Click DFS to run Depth-First Search starting from the first node',
      'Yellow = currently visiting, Green = visited',
      'The traversal order is shown below the graph',
      'Click Random Graph to generate a connected example graph',
    ],
    algos: [
      { name: 'BFS', desc: 'Explores all neighbors at the current depth before moving deeper. Uses a queue.' },
      { name: 'DFS', desc: 'Explores as far as possible along each branch before backtracking. Uses recursion.' },
    ],
  },
  {
    id: 'linkedlist',
    icon: Link2,
    title: 'Linked List',
    color: '#38bdf8',
    desc: 'Visualize singly and doubly linked list operations with animated pointer movements between nodes.',
    how: [
      'Choose Singly or Doubly linked list from the dropdown',
      'Type a value and click Insert Head or Insert Tail',
      'Click Delete to remove a node by value',
      'Click Search to highlight a node by value',
      'Watch pointer arrows animate between nodes as the list changes',
    ],
    algos: [
      { name: 'Insert Head', desc: 'Add a new node at the front. O(1).' },
      { name: 'Insert Tail', desc: 'Add a new node at the end. O(n) for singly, O(1) with tail pointer.' },
      { name: 'Delete', desc: "Remove a node by value, updating the previous node's next pointer. O(n)." },
      { name: 'Search', desc: 'Walk the list to find a node by value. O(n).' },
    ],
  },
  {
    id: 'stackqueue',
    icon: AlignJustify,
    title: 'Stack & Queue',
    color: '#f472b6',
    desc: 'Compare LIFO (Stack) and FIFO (Queue) side by side with animated push, pop, enqueue, and dequeue.',
    how: [
      'Type a value into the input field',
      'Click Push to add to the stack (top), or Enqueue to add to the queue (back)',
      'Click Pop to remove from the top of the stack',
      'Click Dequeue to remove from the front of the queue',
      'Watch both structures animate simultaneously to compare behavior',
    ],
    algos: [
      { name: 'Stack (LIFO)', desc: 'Last In, First Out. Push adds to top, Pop removes from top.' },
      { name: 'Queue (FIFO)', desc: 'First In, First Out. Enqueue adds to back, Dequeue removes from front.' },
    ],
  },
  {
    id: 'binarysearch',
    icon: Search,
    title: 'Binary Search',
    color: '#34d399',
    desc: 'Step through binary search on a sorted array with animated left, right, and mid pointer movements.',
    how: [
      'Generate a sorted array or enter custom values',
      'Type a target value to search for',
      'Click Search to start the animation',
      'Watch the left, right, and mid pointers move step by step',
      'Green = found, Red = eliminated range',
    ],
    algos: [
      { name: 'Binary Search', desc: 'O(log n) — Repeatedly halves the search space by comparing target to the mid element.' },
    ],
  },
]

export default function AboutPage() {
  const [active, setActive] = useState('pathfinding')
  const section = sections.find(s => s.id === active)

  return (
    <div className="page about-page">
      <div className="about-layout">
        <aside className="about-sidebar">
          <div className="about-header">
            <h2>DSAVisualizer</h2>
            <p>Interactive algorithm &amp; data structure visualizations. Pick a section to learn how it works.</p>
          </div>
          <nav className="about-nav">
            {sections.map(s => {
              const Icon = s.icon
              const isActive = active === s.id
              return (
                <button
                  key={s.id}
                  className={`about-nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActive(s.id)}
                  style={{ '--section-color': s.color }}
                >
                  <span className="about-nav-icon">
                    <Icon size={16} color={isActive ? s.color : 'var(--text-muted)'} strokeWidth={isActive ? 2.2 : 1.8} />
                  </span>
                  {s.title}
                </button>
              )
            })}
          </nav>
        </aside>

        <div className="about-content">
          <div className="about-section-header" style={{ borderColor: section.color }}>
            <span className="about-section-icon">
              {React.createElement(section.icon, { size: 36, color: section.color, strokeWidth: 1.5 })}
            </span>
            <div>
              <h3 style={{ color: section.color }}>{section.title}</h3>
              <p>{section.desc}</p>
            </div>
          </div>

          <div className="about-body">
            <div className="about-card">
              <h4>How to Use</h4>
              <ol className="about-steps">
                {section.how.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="about-card">
              <h4>{section.algos.length > 1 ? 'Algorithms / Operations' : 'Operations'}</h4>
              <div className="about-algos">
                {section.algos.map((a, i) => (
                  <div key={i} className="about-algo-item">
                    <span className="about-algo-name" style={{ color: section.color }}>{a.name}</span>
                    <span className="about-algo-desc">{a.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
