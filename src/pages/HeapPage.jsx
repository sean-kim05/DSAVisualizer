import React, { useState, useRef } from 'react'
import './Page.css'

const NODE_R = 22
const V_GAP = 72
const SVG_W = 900
const SVG_H = 340

function getPositions(n) {
  const pos = {}
  for (let i = 0; i < n; i++) {
    const level = Math.floor(Math.log2(i + 1))
    const levelStart = Math.pow(2, level) - 1
    const posInLevel = i - levelStart
    const nodesInLevel = Math.pow(2, level)
    pos[i] = {
      x: (posInLevel + 0.5) * (SVG_W / nodesInLevel),
      y: level * V_GAP + 40,
    }
  }
  return pos
}

function compare(a, b, type) {
  return type === 'min' ? a < b : a > b
}

function HeapPage({ showToast }) {
  const [heap, setHeap] = useState([])
  const [heapType, setHeapType] = useState('min')
  const [inputValue, setInputValue] = useState('')
  const [highlighted, setHighlighted] = useState([])
  const [swapped, setSwapped] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [speed, setSpeed] = useState('normal')
  const heapRef = useRef([])
  const typeRef = useRef('min')
  const speedRef = useRef('normal')

  const speedMap = { slow: 700, normal: 400, fast: 150 }
  const delay = () => new Promise(r => setTimeout(r, speedMap[speedRef.current]))

  const highlight = async (indices, swapIndices = []) => {
    setHighlighted(indices)
    setSwapped(swapIndices)
    await delay()
    setHighlighted([])
    setSwapped([])
  }

  const insert = async () => {
    const val = parseInt(inputValue)
    if (isNaN(val) || val < 0 || val > 999) {
      showToast('Enter a number between 0 and 999')
      return
    }
    setInputValue('')
    setIsAnimating(true)

    const h = [...heapRef.current, val]
    heapRef.current = h
    setHeap([...h])

    let i = h.length - 1
    await highlight([i])

    while (i > 0) {
      const parent = Math.floor((i - 1) / 2)
      await highlight([i, parent])
      if (compare(h[i], h[parent], typeRef.current)) {
        ;[h[i], h[parent]] = [h[parent], h[i]]
        await highlight([i, parent], [i, parent])
        heapRef.current = [...h]
        setHeap([...h])
        i = parent
      } else {
        break
      }
    }

    setIsAnimating(false)
    showToast(`Inserted ${val}`)
  }

  const extract = async () => {
    if (heapRef.current.length === 0) {
      showToast('Heap is empty')
      return
    }
    setIsAnimating(true)

    const h = [...heapRef.current]
    const extracted = h[0]
    await highlight([0])

    h[0] = h[h.length - 1]
    h.pop()
    heapRef.current = [...h]
    setHeap([...h])

    let i = 0
    while (true) {
      const left = 2 * i + 1
      const right = 2 * i + 2
      let target = i

      await highlight([i, left, right].filter(x => x < h.length))

      if (left < h.length && compare(h[left], h[target], typeRef.current)) target = left
      if (right < h.length && compare(h[right], h[target], typeRef.current)) target = right

      if (target === i) break

      ;[h[i], h[target]] = [h[target], h[i]]
      await highlight([i, target], [i, target])
      heapRef.current = [...h]
      setHeap([...h])
      i = target
    }

    setIsAnimating(false)
    showToast(`Extracted ${extracted}`)
  }

  const generateRandom = () => {
    if (isAnimating) return
    const vals = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100))
    const h = []
    const type = typeRef.current
    for (const val of vals) {
      h.push(val)
      let i = h.length - 1
      while (i > 0) {
        const parent = Math.floor((i - 1) / 2)
        if (compare(h[i], h[parent], type)) {
          ;[h[i], h[parent]] = [h[parent], h[i]]
          i = parent
        } else break
      }
    }
    heapRef.current = h
    setHeap([...h])
    showToast('Generated random heap')
  }

  const clearHeap = () => {
    if (isAnimating) return
    heapRef.current = []
    setHeap([])
    showToast('Cleared heap')
  }

  const switchType = (newType) => {
    if (isAnimating) return
    typeRef.current = newType
    setHeapType(newType)
    const vals = [...heapRef.current]
    const h = []
    for (const val of vals) {
      h.push(val)
      let i = h.length - 1
      while (i > 0) {
        const parent = Math.floor((i - 1) / 2)
        if (compare(h[i], h[parent], newType)) {
          ;[h[i], h[parent]] = [h[parent], h[i]]
          i = parent
        } else break
      }
    }
    heapRef.current = h
    setHeap([...h])
  }

  const pos = getPositions(heap.length)

  const getNodeColor = (i) => {
    if (swapped.includes(i)) return '#ef4444'
    if (highlighted.includes(i)) return '#f59e0b'
    if (i === 0) return '#6366f1'
    return '#8b5cf6'
  }

  return (
    <div className="page heap-page">
      <div className="controls">
        <div className="control-group">
          <label>Speed:</label>
          <select value={speed} onChange={e => { setSpeed(e.target.value); speedRef.current = e.target.value }} disabled={isAnimating}>
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>

        <div className="control-group">
          <label>Type:</label>
          <select value={heapType} onChange={e => switchType(e.target.value)} disabled={isAnimating}>
            <option value="min">Min Heap</option>
            <option value="max">Max Heap</option>
          </select>
        </div>

        <input
          type="number"
          min="0"
          max="999"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isAnimating && insert()}
          placeholder="Value (0–999)"
          disabled={isAnimating}
          className="input-field"
        />

        <button className="btn btn-primary" onClick={insert} disabled={isAnimating}>
          Insert
        </button>

        <button className="btn btn-secondary" onClick={extract} disabled={isAnimating || heap.length === 0}>
          Extract {heapType === 'min' ? 'Min' : 'Max'}
        </button>

        <button className="btn btn-secondary" onClick={generateRandom} disabled={isAnimating}>
          Random
        </button>

        <button className="btn btn-danger" onClick={clearHeap} disabled={isAnimating}>
          Clear
        </button>

        {heap.length > 0 && (
          <div className="control-group" style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Root: <strong style={{ color: 'var(--accent-primary)' }}>{heap[0]}</strong>
              &nbsp;· Size: <strong style={{ color: 'var(--accent-secondary)' }}>{heap.length}</strong>
            </span>
          </div>
        )}
      </div>

      {heap.length === 0 ? (
        <div className="placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">🏔️</div>
            <h2>{heapType === 'min' ? 'Min' : 'Max'} Heap</h2>
            <p>Insert values or generate a random heap to get started.</p>
            <div className="placeholder-features">
              <span className="placeholder-feature">Min/Max Heap</span>
              <span className="placeholder-feature">Insert & Extract</span>
              <span className="placeholder-feature">Animated Bubble-Up/Down</span>
              <span className="placeholder-feature">Array View</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
          <div style={{
            flex: 1,
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            overflow: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" height="100%" style={{ minHeight: '200px' }}>
              {heap.map((_, i) => {
                const left = 2 * i + 1
                const right = 2 * i + 2
                return (
                  <g key={`edges-${i}`}>
                    {left < heap.length && pos[i] && pos[left] && (
                      <line x1={pos[i].x} y1={pos[i].y} x2={pos[left].x} y2={pos[left].y}
                        stroke="var(--border-light)" strokeWidth="2" />
                    )}
                    {right < heap.length && pos[i] && pos[right] && (
                      <line x1={pos[i].x} y1={pos[i].y} x2={pos[right].x} y2={pos[right].y}
                        stroke="var(--border-light)" strokeWidth="2" />
                    )}
                  </g>
                )
              })}
              {heap.map((val, i) => pos[i] && (
                <g key={i}>
                  <circle cx={pos[i].x} cy={pos[i].y} r={NODE_R}
                    fill={getNodeColor(i)} style={{ transition: 'fill 0.2s' }} />
                  <text x={pos[i].x} y={pos[i].y} textAnchor="middle" dominantBaseline="central"
                    fill="var(--bg-primary)" fontSize="13" fontWeight="700">
                    {val}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div style={{
            display: 'flex', gap: '4px', padding: '12px 16px',
            background: 'var(--bg-secondary)', borderRadius: '8px',
            border: '1px solid var(--border-color)', overflowX: 'auto',
            alignItems: 'center', flexShrink: 0,
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '8px', whiteSpace: 'nowrap' }}>Array:</span>
            {heap.map((val, i) => (
              <div key={i} style={{ minWidth: '44px', textAlign: 'center', flexShrink: 0 }}>
                <div style={{
                  padding: '6px 4px', background: getNodeColor(i), borderRadius: '6px',
                  fontSize: '13px', fontWeight: '700', color: 'var(--bg-primary)', transition: 'background 0.2s',
                }}>
                  {val}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{i}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HeapPage
