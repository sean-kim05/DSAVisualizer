import React, { useState, useRef } from 'react'
import './Page.css'

const NODE_R = 20
let nextId = 0

function GraphPage({ showToast }) {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedEdge, setSelectedEdge] = useState(null)
  const [visitedNodes, setVisitedNodes] = useState(new Set())
  const [currentNode, setCurrentNode] = useState(null)
  const [traversalOrder, setTraversalOrder] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [mode, setMode] = useState('add')
  const [speed, setSpeed] = useState('normal')
  const svgRef = useRef(null)
  const nodesRef = useRef([])
  const edgesRef = useRef([])
  const dragRef = useRef(null) // { id, offsetX, offsetY }

  const speedMap = { slow: 900, normal: 500, fast: 200 }
  const delay = (ms) => new Promise(r => setTimeout(r, ms))

  const getSVGCoords = (e) => {
    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  // ── Drag handlers ──────────────────────────────────────────
  const handleNodeMouseDown = (e, id) => {
    if (isAnimating || mode === 'delete' || mode === 'edge') return
    e.stopPropagation()
    const { x, y } = getSVGCoords(e)
    const node = nodesRef.current.find(n => n.id === id)
    dragRef.current = { id, offsetX: x - node.x, offsetY: y - node.y }
  }

  const handleSVGMouseMove = (e) => {
    if (!dragRef.current) return
    const { x, y } = getSVGCoords(e)
    const { id, offsetX, offsetY } = dragRef.current
    nodesRef.current = nodesRef.current.map(n =>
      n.id === id ? { ...n, x: x - offsetX, y: y - offsetY } : n
    )
    setNodes([...nodesRef.current])
  }

  const handleSVGMouseUp = () => {
    dragRef.current = null
  }

  // ── Canvas click (add node) ────────────────────────────────
  const handleSVGClick = (e) => {
    if (isAnimating || dragRef.current) return
    if (e.target !== svgRef.current) return
    if (mode !== 'add') return
    const { x, y } = getSVGCoords(e)
    const id = nextId++
    const updated = [...nodesRef.current, { id, x, y }]
    nodesRef.current = updated
    setNodes([...updated])
    setSelectedNode(null)
    setSelectedEdge(null)
  }

  // ── Node click ────────────────────────────────────────────
  const handleNodeClick = (e, id) => {
    e.stopPropagation()
    if (isAnimating) return

    if (mode === 'delete') {
      nodesRef.current = nodesRef.current.filter(n => n.id !== id)
      edgesRef.current = edgesRef.current.filter(ed => ed.from !== id && ed.to !== id)
      setNodes([...nodesRef.current])
      setEdges([...edgesRef.current])
      setSelectedNode(null)
      return
    }

    if (mode === 'edge') {
      setSelectedEdge(null)
      if (selectedNode === null) {
        setSelectedNode(id)
      } else if (selectedNode === id) {
        setSelectedNode(null)
      } else {
        const exists = edgesRef.current.some(
          ed => (ed.from === selectedNode && ed.to === id) || (ed.from === id && ed.to === selectedNode)
        )
        if (!exists) {
          const updated = [...edgesRef.current, { from: selectedNode, to: id }]
          edgesRef.current = updated
          setEdges([...updated])
        }
        setSelectedNode(null)
      }
      return
    }

    setSelectedNode(prev => prev === id ? null : id)
    setSelectedEdge(null)
  }

  // ── Edge click (delete mode) ───────────────────────────────
  const handleEdgeClick = (e, idx) => {
    e.stopPropagation()
    if (isAnimating) return
    if (mode === 'delete') {
      edgesRef.current = edgesRef.current.filter((_, i) => i !== idx)
      setEdges([...edgesRef.current])
      setSelectedEdge(null)
      return
    }
    setSelectedEdge(prev => prev === idx ? null : idx)
    setSelectedNode(null)
  }

  // ── Traversal ─────────────────────────────────────────────
  const buildAdjacency = () => {
    const adj = {}
    nodesRef.current.forEach(n => { adj[n.id] = [] })
    edgesRef.current.forEach(ed => {
      adj[ed.from].push(ed.to)
      adj[ed.to].push(ed.from)
    })
    return adj
  }

  const runBFS = async () => {
    if (nodesRef.current.length === 0) { showToast('Add some nodes first'); return }
    setIsAnimating(true)
    setVisitedNodes(new Set())
    setCurrentNode(null)
    setTraversalOrder([])
    const startId = nodesRef.current[0].id
    const adj = buildAdjacency()
    const visited = new Set()
    const queue = [startId]
    const order = []
    visited.add(startId)
    while (queue.length > 0) {
      const node = queue.shift()
      setCurrentNode(node)
      await delay(speedMap[speed])
      order.push(node)
      setVisitedNodes(new Set(visited))
      setTraversalOrder([...order])
      for (const nb of (adj[node] || [])) {
        if (!visited.has(nb)) { visited.add(nb); queue.push(nb) }
      }
    }
    setCurrentNode(null)
    setIsAnimating(false)
    showToast(`BFS complete — visited ${order.length} nodes`)
  }

  const runDFS = async () => {
    if (nodesRef.current.length === 0) { showToast('Add some nodes first'); return }
    setIsAnimating(true)
    setVisitedNodes(new Set())
    setCurrentNode(null)
    setTraversalOrder([])
    const startId = nodesRef.current[0].id
    const adj = buildAdjacency()
    const visited = new Set()
    const order = []
    const dfs = async (node) => {
      visited.add(node)
      setCurrentNode(node)
      setVisitedNodes(new Set(visited))
      await delay(speedMap[speed])
      order.push(node)
      setTraversalOrder([...order])
      for (const nb of (adj[node] || [])) {
        if (!visited.has(nb)) await dfs(nb)
      }
    }
    await dfs(startId)
    setCurrentNode(null)
    setIsAnimating(false)
    showToast(`DFS complete — visited ${order.length} nodes`)
  }

  const reset = () => {
    if (isAnimating) return
    setVisitedNodes(new Set())
    setCurrentNode(null)
    setTraversalOrder([])
    setSelectedNode(null)
    setSelectedEdge(null)
  }

  const clearAll = () => {
    if (isAnimating) return
    nodesRef.current = []
    edgesRef.current = []
    setNodes([])
    setEdges([])
    reset()
  }

  const generateRandom = () => {
    if (isAnimating) return
    nodesRef.current = []
    edgesRef.current = []
    const count = 7
    const svgW = svgRef.current?.clientWidth || 700
    const svgH = svgRef.current?.clientHeight || 400
    const newNodes = Array.from({ length: count }, () => ({
      id: nextId++,
      x: 80 + Math.random() * (svgW - 160),
      y: 60 + Math.random() * (svgH - 120),
    }))
    const newEdges = []
    for (let i = 1; i < newNodes.length; i++) {
      newEdges.push({ from: newNodes[Math.floor(Math.random() * i)].id, to: newNodes[i].id })
    }
    for (let i = 0; i < 3; i++) {
      const a = newNodes[Math.floor(Math.random() * count)]
      const b = newNodes[Math.floor(Math.random() * count)]
      if (a.id !== b.id && !newEdges.some(ed =>
        (ed.from === a.id && ed.to === b.id) || (ed.from === b.id && ed.to === a.id)
      )) newEdges.push({ from: a.id, to: b.id })
    }
    nodesRef.current = newNodes
    edgesRef.current = newEdges
    setNodes([...newNodes])
    setEdges([...newEdges])
    reset()
    showToast('Generated random graph')
  }

  const getNodeColor = (id) => {
    if (id === currentNode) return '#f59e0b'
    if (visitedNodes.has(id)) return '#22c55e'
    if (id === selectedNode) return '#6366f1'
    return '#8b5cf6'
  }

  const getNodeLabel = (id) => {
    const idx = nodesRef.current.findIndex(n => n.id === id)
    return String.fromCharCode(65 + (idx % 26))
  }

  const modeHint = mode === 'add'
    ? 'Click canvas to add nodes, drag to reposition'
    : mode === 'edge'
    ? selectedNode !== null ? 'Now click a second node to connect' : 'Click a node to start an edge'
    : 'Click a node or edge to delete it'

  return (
    <div className="page graph-page">
      <div className="controls">
        <div className="control-group">
          <label>Mode:</label>
          <select value={mode} onChange={e => { setMode(e.target.value); setSelectedNode(null); setSelectedEdge(null) }} disabled={isAnimating}>
            <option value="add">Add / Move</option>
            <option value="edge">Add Edges</option>
            <option value="delete">Delete</option>
          </select>
        </div>

        <div className="control-group">
          <label>Speed:</label>
          <select value={speed} onChange={e => setSpeed(e.target.value)} disabled={isAnimating}>
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={runBFS} disabled={isAnimating || nodes.length === 0}>BFS</button>
        <button className="btn btn-primary" onClick={runDFS} disabled={isAnimating || nodes.length === 0}>DFS</button>
        <button className="btn btn-secondary" onClick={reset} disabled={isAnimating}>Reset Colors</button>
        <button className="btn btn-secondary" onClick={generateRandom} disabled={isAnimating}>Random Graph</button>
        <button className="btn btn-danger" onClick={clearAll} disabled={isAnimating}>Clear</button>

        <div className="control-group" style={{ marginLeft: 'auto' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>{modeHint}</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
        <div style={{
          flex: 1, background: 'var(--bg-secondary)', borderRadius: '8px',
          border: '1px solid var(--border-color)', overflow: 'hidden', position: 'relative',
          cursor: mode === 'add' ? 'crosshair' : 'default',
        }}>
          {nodes.length === 0 && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', pointerEvents: 'none',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🕸️</div>
              <div style={{ fontSize: '15px' }}>Click the canvas to add nodes, then switch to Add Edges mode to connect them</div>
            </div>
          )}
          <svg
            ref={svgRef}
            width="100%" height="100%"
            onClick={handleSVGClick}
            onMouseMove={handleSVGMouseMove}
            onMouseUp={handleSVGMouseUp}
            onMouseLeave={handleSVGMouseUp}
            style={{ display: 'block' }}
          >
            {edges.map((ed, i) => {
              const from = nodes.find(n => n.id === ed.from)
              const to = nodes.find(n => n.id === ed.to)
              if (!from || !to) return null
              const isSelected = selectedEdge === i
              return (
                <line key={i}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isSelected ? '#ef4444' : 'var(--border-light)'}
                  strokeWidth={isSelected ? 4 : 2.5}
                  style={{ cursor: mode === 'delete' ? 'pointer' : 'default', transition: 'stroke 0.2s' }}
                  onClick={e => handleEdgeClick(e, i)}
                />
              )
            })}
            {nodes.map(node => (
              <g key={node.id}
                onClick={e => handleNodeClick(e, node.id)}
                onMouseDown={e => handleNodeMouseDown(e, node.id)}
                style={{ cursor: mode === 'add' ? 'grab' : mode === 'delete' ? 'pointer' : 'pointer' }}
              >
                <circle
                  cx={node.x} cy={node.y} r={NODE_R}
                  fill={getNodeColor(node.id)}
                  stroke={node.id === selectedNode ? '#ffffff' : 'transparent'}
                  strokeWidth="3"
                  style={{ transition: 'fill 0.3s' }}
                />
                <text
                  x={node.x} y={node.y}
                  textAnchor="middle" dominantBaseline="central"
                  fill="var(--bg-primary)" fontSize="14" fontWeight="700"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {getNodeLabel(node.id)}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {traversalOrder.length > 0 && (
          <div style={{
            padding: '10px 16px', background: 'var(--bg-secondary)', borderRadius: '8px',
            border: '1px solid var(--border-color)', flexShrink: 0, fontSize: '13px',
          }}>
            <strong style={{ color: 'var(--accent-primary)' }}>Traversal Order: </strong>
            <span style={{ color: 'var(--text-secondary)' }}>
              {traversalOrder.map(id => getNodeLabel(id)).join(' → ')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default GraphPage
