import React, { useState, useEffect } from 'react'
import { Link2 } from 'lucide-react'
import './Page.css'

function LinkedListPage({ showToast, onAlgorithmChange, onVizStatusChange }) {
  useEffect(() => {
    onAlgorithmChange?.('Linked List')
  }, [])
  const [nodes, setNodes] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [indexInput, setIndexInput] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [activeIdx, setActiveIdx] = useState(null)   // currently highlighted node index
  const [foundIdx, setFoundIdx] = useState(null)
  const [mode, setMode] = useState('singly')         // 'singly' | 'doubly'
  const [speed, setSpeed] = useState('normal')

  const speedMap = { slow: 600, normal: 350, fast: 120 }
  const delay = () => new Promise(r => setTimeout(r, speedMap[speed]))

  const resetHighlight = () => { setActiveIdx(null); setFoundIdx(null) }

  // ── Insert at tail ────────────────────────────────────────────
  const insertTail = async () => {
    const val = inputValue.trim()
    if (!val) { showToast('Enter a value'); return }
    setInputValue('')
    setIsAnimating(true)
    resetHighlight()
    // animate traversal to tail
    for (let i = 0; i < nodes.length; i++) {
      setActiveIdx(i)
      await delay()
    }
    setNodes(prev => [...prev, { val }])
    setActiveIdx(nodes.length)
    await delay()
    resetHighlight()
    setIsAnimating(false)
    showToast(`Inserted "${val}" at tail`)
  }

  // ── Insert at head ────────────────────────────────────────────
  const insertHead = async () => {
    const val = inputValue.trim()
    if (!val) { showToast('Enter a value'); return }
    setInputValue('')
    setIsAnimating(true)
    resetHighlight()
    setActiveIdx(0)
    await delay()
    setNodes(prev => [{ val }, ...prev])
    resetHighlight()
    setIsAnimating(false)
    showToast(`Inserted "${val}" at head`)
  }

  // ── Insert at index ───────────────────────────────────────────
  const insertAt = async () => {
    const val = inputValue.trim()
    const idx = parseInt(indexInput)
    if (!val) { showToast('Enter a value'); return }
    if (isNaN(idx) || idx < 0 || idx > nodes.length) {
      showToast(`Index must be 0–${nodes.length}`)
      return
    }
    setInputValue('')
    setIsAnimating(true)
    resetHighlight()
    for (let i = 0; i < idx; i++) {
      setActiveIdx(i)
      await delay()
    }
    setNodes(prev => {
      const copy = [...prev]
      copy.splice(idx, 0, { val })
      return copy
    })
    setActiveIdx(idx)
    await delay()
    resetHighlight()
    setIsAnimating(false)
    showToast(`Inserted "${val}" at index ${idx}`)
  }

  // ── Delete by value ───────────────────────────────────────────
  const deleteByVal = async () => {
    const val = inputValue.trim()
    if (!val) { showToast('Enter a value to delete'); return }
    setIsAnimating(true)
    resetHighlight()
    let found = -1
    for (let i = 0; i < nodes.length; i++) {
      setActiveIdx(i)
      await delay()
      if (nodes[i].val === val) { found = i; break }
    }
    if (found === -1) {
      showToast(`"${val}" not found`)
      resetHighlight()
      setIsAnimating(false)
      return
    }
    setFoundIdx(found)
    await delay()
    setNodes(prev => prev.filter((_, i) => i !== found))
    resetHighlight()
    setIsAnimating(false)
    showToast(`Deleted "${val}"`)
  }

  // ── Search ────────────────────────────────────────────────────
  const search = async () => {
    const val = inputValue.trim()
    if (!val) { showToast('Enter a value to search'); return }
    setIsAnimating(true)
    resetHighlight()
    let found = -1
    for (let i = 0; i < nodes.length; i++) {
      setActiveIdx(i)
      await delay()
      if (nodes[i].val === val) { found = i; break }
    }
    if (found === -1) {
      showToast(`"${val}" not found`)
      resetHighlight()
    } else {
      setFoundIdx(found)
      setActiveIdx(null)
      showToast(`Found "${val}" at index ${found}`)
    }
    setIsAnimating(false)
  }

  const clearList = () => {
    if (isAnimating) return
    setNodes([])
    resetHighlight()
    showToast('Cleared list')
  }

  const generateRandom = () => {
    if (isAnimating) return
    const vals = Array.from({ length: 6 }, () => Math.floor(Math.random() * 99) + 1)
    setNodes(vals.map(v => ({ val: String(v) })))
    resetHighlight()
    showToast('Generated random list')
  }

  const getNodeBg = (i) => {
    if (i === foundIdx) return '#22c55e'
    if (i === activeIdx) return '#f59e0b'
    return '#6366f1'
  }

  const NODE_W = 64
  const NODE_H = 44
  const GAP = 48
  const ROW_CAP = 8
  const rows = []
  for (let i = 0; i < nodes.length; i += ROW_CAP) rows.push(nodes.slice(i, i + ROW_CAP))
  const totalRows = rows.length

  return (
    <div className="page linkedlist-page">
      <div className="controls">
        <div className="control-group">
          <label>Type:</label>
          <select value={mode} onChange={e => setMode(e.target.value)} disabled={isAnimating}>
            <option value="singly">Singly Linked</option>
            <option value="doubly">Doubly Linked</option>
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

        <input
          type="text" maxLength={4}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isAnimating && insertTail()}
          placeholder="Value"
          disabled={isAnimating}
          className="input-field"
          style={{ width: '80px' }}
        />

        <input
          type="number" min="0"
          value={indexInput}
          onChange={e => setIndexInput(e.target.value)}
          placeholder="Index"
          disabled={isAnimating}
          className="input-field"
          style={{ width: '72px' }}
        />

        <button className="btn btn-primary" onClick={insertHead} disabled={isAnimating}>Insert Head</button>
        <button className="btn btn-primary" onClick={insertTail} disabled={isAnimating}>Insert Tail</button>
        <button className="btn btn-primary" onClick={insertAt} disabled={isAnimating || indexInput === ''}>Insert At</button>
        <button className="btn btn-secondary" onClick={search} disabled={isAnimating || nodes.length === 0}>Search</button>
        <button className="btn btn-secondary" onClick={deleteByVal} disabled={isAnimating || nodes.length === 0}>Delete</button>
        <button className="btn btn-secondary" onClick={generateRandom} disabled={isAnimating}>Random</button>
        <button className="btn btn-danger" onClick={clearList} disabled={isAnimating || nodes.length === 0}>Clear</button>

        {nodes.length > 0 && (
          <div className="control-group" style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Size: <strong style={{ color: 'var(--accent-primary)' }}>{nodes.length}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="algo-info-bar">
        <div className="algo-info-left">
          <span className="algo-info-name">{mode === 'doubly' ? 'Doubly Linked List' : 'Singly Linked List'}</span>
          <span className="algo-info-complexity">O(n) traverse</span>
          <span className="algo-info-space">Space: O(n)</span>
        </div>
        <div className="algo-info-desc">A sequence of nodes where each node holds a value and a pointer to the next (and previous in doubly). Allows O(1) insert/delete at head with O(n) access by index.</div>
      </div>

      {nodes.length === 0 ? (
        <div className="placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon"><Link2 size={32} strokeWidth={1.5} /></div>
            <h2>Linked List Visualizer</h2>
            <p>Insert values using the toolbar, or start with a random list.</p>
            <button className="placeholder-cta" onClick={generateRandom}>Generate Random List</button>
          </div>
        </div>
      ) : (
        <div style={{
          flex: 1, background: 'var(--bg-secondary)', borderRadius: '8px',
          border: '1px solid var(--border-color)', overflow: 'auto',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '24px', gap: '32px',
        }}>
          {rows.map((row, rowIdx) => {
            const globalOffset = rowIdx * ROW_CAP
            const isLastRow = rowIdx === totalRows - 1
            return (
              <div key={rowIdx} style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
                {/* wrap-around left arrow for non-first rows */}
                {rowIdx > 0 && (
                  <div style={{
                    position: 'absolute', left: 0,
                    fontSize: '11px', color: 'var(--text-muted)',
                  }} />
                )}
                {row.map((node, i) => {
                  const globalIdx = globalOffset + i
                  const isLast = globalIdx === nodes.length - 1
                  const bg = getNodeBg(globalIdx)
                  return (
                    <div key={globalIdx} style={{ display: 'flex', alignItems: 'center' }}>
                      {/* Node box */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{globalIdx}</div>
                        <div style={{
                          width: `${NODE_W}px`, height: `${NODE_H}px`,
                          background: bg,
                          borderRadius: '8px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '15px', fontWeight: '700', color: '#fff',
                          transition: 'background 0.25s',
                          boxShadow: bg !== '#6366f1' ? `0 0 0 3px ${bg}44` : 'none',
                          position: 'relative',
                        }}>
                          {node.val}
                          {/* back pointer for doubly */}
                          {mode === 'doubly' && globalIdx > 0 && (
                            <div style={{
                              position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                              fontSize: '10px', color: '#a78bfa',
                            }}>◄</div>
                          )}
                        </div>
                        {globalIdx === 0 && (
                          <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: '600' }}>HEAD</div>
                        )}
                        {globalIdx === nodes.length - 1 && (
                          <div style={{ fontSize: '10px', color: '#8b5cf6', fontWeight: '600' }}>TAIL</div>
                        )}
                      </div>

                      {/* Arrow + next pointer */}
                      {!isLast ? (
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          width: `${GAP}px`, flexShrink: 0,
                        }}>
                          <div style={{ flex: 1, height: '2px', background: 'var(--border-light)' }} />
                          <div style={{ color: 'var(--border-light)', fontSize: '14px', marginLeft: '-2px' }}>▶</div>
                        </div>
                      ) : !isLastRow ? (
                        // end-of-row wrap arrow down
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          width: `${GAP}px`, flexShrink: 0,
                        }}>
                          <div style={{ flex: 1, height: '2px', background: 'var(--border-light)' }} />
                          <div style={{ color: 'var(--border-light)', fontSize: '12px' }}>↙</div>
                        </div>
                      ) : (
                        // null terminator
                        <div style={{ display: 'flex', alignItems: 'center', width: `${GAP + 48}px`, flexShrink: 0 }}>
                          <div style={{ flex: 1, height: '2px', background: 'var(--border-light)' }} />
                          <div style={{ color: 'var(--border-light)', fontSize: '14px', marginLeft: '-2px' }}>▶</div>
                          <div style={{
                            marginLeft: '6px', padding: '4px 8px',
                            border: '1px dashed var(--border-light)', borderRadius: '6px',
                            fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600',
                          }}>null</div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LinkedListPage
