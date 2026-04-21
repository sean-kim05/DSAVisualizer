import React, { useState, useEffect } from 'react'
import './Page.css'

function BinarySearchPage({ showToast, onAlgorithmChange, onVizStatusChange }) {
  useEffect(() => {
    onAlgorithmChange?.('Binary Search')
  }, [])
  const [array, setArray] = useState([])
  const [target, setTarget] = useState('')
  const [customInput, setCustomInput] = useState('')
  const [low, setLow] = useState(null)
  const [high, setHigh] = useState(null)
  const [mid, setMid] = useState(null)
  const [foundIdx, setFoundIdx] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [speed, setSpeed] = useState('normal')
  const [steps, setSteps] = useState([])

  const speedMap = { slow: 800, normal: 500, fast: 180 }
  const delay = () => new Promise(r => setTimeout(r, speedMap[speed]))

  const reset = () => {
    setLow(null); setHigh(null); setMid(null)
    setFoundIdx(null); setNotFound(false); setSteps([])
  }

  const generateRandom = () => {
    if (isAnimating) return
    const size = 14
    const set = new Set()
    while (set.size < size) set.add(Math.floor(Math.random() * 98) + 1)
    setArray([...set].sort((a, b) => a - b))
    reset()
    showToast('Generated random sorted array')
  }

  const loadCustom = () => {
    if (isAnimating) return
    const vals = customInput.split(',')
      .map(v => parseInt(v.trim()))
      .filter(v => !isNaN(v))
    if (vals.length < 2) { showToast('Enter at least 2 comma-separated numbers'); return }
    const sorted = [...new Set(vals)].sort((a, b) => a - b)
    setArray(sorted)
    reset()
    showToast(`Loaded ${sorted.length} values (sorted)`)
  }

  const runSearch = async () => {
    const t = parseInt(target)
    if (isNaN(t)) { showToast('Enter a target number'); return }
    if (array.length === 0) { showToast('Generate or load an array first'); return }
    setIsAnimating(true)
    reset()

    let lo = 0
    let hi = array.length - 1
    const log = []

    while (lo <= hi) {
      const m = Math.floor((lo + hi) / 2)
      setLow(lo); setHigh(hi); setMid(m)
      const entry = { lo, hi, mid: m, midVal: array[m], comparison: '' }

      await delay()

      if (array[m] === t) {
        entry.comparison = `array[${m}] = ${array[m]} = target ✓`
        log.push(entry)
        setSteps([...log])
        setFoundIdx(m)
        setIsAnimating(false)
        showToast(`Found ${t} at index ${m}!`)
        return
      } else if (array[m] < t) {
        entry.comparison = `array[${m}] = ${array[m]} < ${t} → search right`
        lo = m + 1
      } else {
        entry.comparison = `array[${m}] = ${array[m]} > ${t} → search left`
        hi = m - 1
      }
      log.push(entry)
      setSteps([...log])
    }

    setLow(null); setHigh(null); setMid(null)
    setNotFound(true)
    setIsAnimating(false)
    showToast(`${t} not found in array`)
  }

  const getCellStyle = (i) => {
    const base = {
      minWidth: '44px', height: '48px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', borderRadius: '8px', fontSize: '14px', fontWeight: '700',
      transition: 'all 0.3s', flexShrink: 0, position: 'relative',
      border: '2px solid transparent',
    }
    if (i === foundIdx) return { ...base, background: '#22c55e', color: '#fff', border: '2px solid #22c55e' }
    if (notFound && low !== null && i >= low && i <= high) return { ...base, background: 'rgba(239,68,68,0.2)', color: 'var(--text-muted)', border: '2px solid #ef4444' }
    if (i === mid) return { ...base, background: '#f59e0b', color: '#fff', border: '2px solid #f59e0b' }
    if (low !== null && high !== null && i >= low && i <= high) return { ...base, background: 'var(--bg-card)', color: 'var(--text-primary)', border: '2px solid #6366f1' }
    return { ...base, background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '2px solid var(--border-color)' }
  }

  const getPointerLabel = (i) => {
    const labels = []
    if (i === low && i === high) labels.push('lo=hi')
    else if (i === low) labels.push('lo')
    else if (i === high) labels.push('hi')
    if (i === mid && i !== foundIdx) labels.push('mid')
    if (i === foundIdx) labels.push('FOUND')
    return labels.join(' ')
  }

  return (
    <div className="page binarysearch-page">
      <div className="controls">
        <div className="control-group">
          <label>Speed:</label>
          <select value={speed} onChange={e => setSpeed(e.target.value)} disabled={isAnimating}>
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>

        <input
          type="number"
          value={target}
          onChange={e => setTarget(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isAnimating && runSearch()}
          placeholder="Target"
          disabled={isAnimating}
          className="input-field"
          style={{ width: '80px' }}
        />

        <button className="btn btn-primary" onClick={runSearch} disabled={isAnimating || array.length === 0}>Search</button>
        <button className="btn btn-secondary" onClick={generateRandom} disabled={isAnimating}>Random Array</button>

        <div className="control-group" style={{ marginLeft: '8px' }}>
          <input
            type="text"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="e.g. 3,7,15,22,40"
            disabled={isAnimating}
            className="input-field"
            style={{ width: '180px' }}
          />
          <button className="btn btn-secondary" onClick={loadCustom} disabled={isAnimating}>Load</button>
        </div>

        <button className="btn btn-secondary" onClick={reset} disabled={isAnimating}>Reset</button>

        {array.length > 0 && (
          <div className="control-group" style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              n = <strong style={{ color: 'var(--accent-primary)' }}>{array.length}</strong>
              &nbsp;· O(log n) ≈ <strong style={{ color: '#8b5cf6' }}>{Math.ceil(Math.log2(array.length + 1))}</strong> steps max
            </span>
          </div>
        )}
      </div>

      <div className="algo-info-bar">
        <div className="algo-info-left">
          <span className="algo-info-name">Binary Search</span>
          <span className="algo-info-complexity">O(log n)</span>
          <span className="algo-info-space">Space: O(1)</span>
        </div>
        <div className="algo-info-desc">Repeatedly halves the search range by comparing the target to the midpoint. Requires a sorted array. Each step eliminates half the remaining elements.</div>
      </div>

      {array.length === 0 ? (
        <div className="placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">🔍</div>
            <h2>Binary Search Visualizer</h2>
            <p>Generate a sorted array or load your own, then search for a value.</p>
            <div className="placeholder-features">
              <span className="placeholder-feature">O(log n) Search</span>
              <span className="placeholder-feature">lo / mid / hi Pointers</span>
              <span className="placeholder-feature">Step-by-Step Log</span>
              <span className="placeholder-feature">Custom Arrays</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden', minHeight: 0 }}>
          {/* Array visualization */}
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: '8px',
            border: '1px solid var(--border-color)', padding: '28px 20px 16px',
            overflow: 'auto', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', minWidth: 'max-content' }}>
              {array.map((val, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  {/* pointer label above */}
                  <div style={{
                    fontSize: '10px', fontWeight: '700', height: '14px',
                    color: i === foundIdx ? '#22c55e' : i === mid ? '#f59e0b' : '#6366f1',
                    whiteSpace: 'nowrap',
                  }}>
                    {getPointerLabel(i)}
                  </div>
                  <div style={getCellStyle(i)}>{val}</div>
                  {/* index below */}
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{i}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex', gap: '16px', flexShrink: 0,
            padding: '8px 16px', background: 'var(--bg-secondary)',
            borderRadius: '8px', border: '1px solid var(--border-color)',
            fontSize: '12px', flexWrap: 'wrap',
          }}>
            {[
              { color: '#6366f1', label: 'Active search range' },
              { color: '#f59e0b', label: 'Mid pointer' },
              { color: '#22c55e', label: 'Found' },
              { color: '#ef4444', label: 'Not found' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', background: color, borderRadius: '3px' }} />
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Step log */}
          {steps.length > 0 && (
            <div style={{
              flex: 1, background: 'var(--bg-secondary)', borderRadius: '8px',
              border: '1px solid var(--border-color)', overflow: 'auto', minHeight: 0,
            }}>
              <div style={{
                padding: '8px 16px', borderBottom: '1px solid var(--border-color)',
                fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', flexShrink: 0,
              }}>
                Step Log
              </div>
              <div style={{ padding: '8px' }}>
                {steps.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '12px', padding: '6px 8px',
                    borderRadius: '6px', fontSize: '12px',
                    background: i % 2 === 0 ? 'var(--bg-card)' : 'transparent',
                    alignItems: 'center',
                  }}>
                    <span style={{ color: 'var(--text-muted)', width: '20px', flexShrink: 0 }}>#{i + 1}</span>
                    <span style={{ color: 'var(--text-muted)', width: '80px', flexShrink: 0 }}>
                      lo={s.lo} hi={s.hi}
                    </span>
                    <span style={{ color: '#f59e0b', width: '60px', flexShrink: 0 }}>mid={s.mid}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{s.comparison}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BinarySearchPage
