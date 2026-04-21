import React, { useState, useEffect } from 'react'
import './Page.css'

function StackQueuePage({ showToast, onAlgorithmChange, onVizStatusChange }) {
  useEffect(() => {
    onAlgorithmChange?.('Stack & Queue')
  }, [])
  const [stack, setStack] = useState([])
  const [queue, setQueue] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [stackActive, setStackActive] = useState(null)  // index highlighted in stack
  const [queueActive, setQueueActive] = useState(null)  // index highlighted in queue
  const [speed, setSpeed] = useState('normal')

  const speedMap = { slow: 600, normal: 350, fast: 120 }
  const delay = () => new Promise(r => setTimeout(r, speedMap[speed]))

  // ── Stack operations ──────────────────────────────────────────
  const push = async () => {
    const val = inputValue.trim()
    if (!val) { showToast('Enter a value'); return }
    setInputValue('')
    setIsAnimating(true)
    const newItem = { val, id: Date.now() }
    setStack(prev => [newItem, ...prev])
    setStackActive(0)
    await delay()
    setStackActive(null)
    setIsAnimating(false)
    showToast(`Pushed "${val}" onto stack`)
  }

  const pop = async () => {
    if (stack.length === 0) { showToast('Stack is empty'); return }
    setIsAnimating(true)
    setStackActive(0)
    await delay()
    const popped = stack[0].val
    setStack(prev => prev.slice(1))
    setStackActive(null)
    setIsAnimating(false)
    showToast(`Popped "${popped}" from stack`)
  }

  // ── Queue operations ──────────────────────────────────────────
  const enqueue = async () => {
    const val = inputValue.trim()
    if (!val) { showToast('Enter a value'); return }
    setInputValue('')
    setIsAnimating(true)
    const newItem = { val, id: Date.now() + 1 }
    setQueue(prev => [...prev, newItem])
    setQueueActive(queue.length)
    await delay()
    setQueueActive(null)
    setIsAnimating(false)
    showToast(`Enqueued "${val}"`)
  }

  const dequeue = async () => {
    if (queue.length === 0) { showToast('Queue is empty'); return }
    setIsAnimating(true)
    setQueueActive(0)
    await delay()
    const dequeued = queue[0].val
    setQueue(prev => prev.slice(1))
    setQueueActive(null)
    setIsAnimating(false)
    showToast(`Dequeued "${dequeued}"`)
  }

  const clearAll = () => {
    if (isAnimating) return
    setStack([])
    setQueue([])
    showToast('Cleared both')
  }

  const generateRandom = () => {
    if (isAnimating) return
    const vals = Array.from({ length: 5 }, () => Math.floor(Math.random() * 99) + 1)
    setStack(vals.slice(0, 3).map((v, i) => ({ val: String(v), id: i })))
    setQueue(vals.map((v, i) => ({ val: String(v), id: i + 10 })))
    showToast('Generated random data')
  }

  const MAX_VISIBLE = 8

  const NodeBox = ({ val, isActive, label, color }) => (
    <div style={{
      width: '72px', padding: '10px 0', textAlign: 'center',
      background: isActive ? color : 'var(--bg-card)',
      border: `2px solid ${isActive ? color : 'var(--border-color)'}`,
      borderRadius: '8px',
      fontSize: '15px', fontWeight: '700',
      color: isActive ? '#fff' : 'var(--text-primary)',
      transition: 'all 0.25s',
      position: 'relative',
      flexShrink: 0,
    }}>
      {val}
      {label && (
        <div style={{
          position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '10px', fontWeight: '700', color, whiteSpace: 'nowrap',
        }}>{label}</div>
      )}
    </div>
  )

  return (
    <div className="page stackqueue-page">
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
          type="text" maxLength={4}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isAnimating && push()}
          placeholder="Value"
          disabled={isAnimating}
          className="input-field"
          style={{ width: '80px' }}
        />

        <button className="btn btn-primary" onClick={push} disabled={isAnimating}>Push (Stack)</button>
        <button className="btn btn-secondary" onClick={pop} disabled={isAnimating || stack.length === 0}>Pop</button>
        <button className="btn btn-primary" onClick={enqueue} disabled={isAnimating}>Enqueue (Queue)</button>
        <button className="btn btn-secondary" onClick={dequeue} disabled={isAnimating || queue.length === 0}>Dequeue</button>
        <button className="btn btn-secondary" onClick={generateRandom} disabled={isAnimating}>Random</button>
        <button className="btn btn-danger" onClick={clearAll} disabled={isAnimating}>Clear</button>
      </div>

      <div className="algo-info-bar">
        <div className="algo-info-left">
          <span className="algo-info-name">Stack & Queue</span>
          <span className="algo-info-complexity">O(1) push/pop/enqueue/dequeue</span>
          <span className="algo-info-space">Space: O(n)</span>
        </div>
        <div className="algo-info-desc">Stack (LIFO) — last in, first out. Used for undo, call stacks, DFS. Queue (FIFO) — first in, first out. Used for BFS, task scheduling, buffers.</div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '16px', overflow: 'hidden', minHeight: 0 }}>
        {/* Stack panel */}
        <div style={{
          flex: 1, background: 'var(--bg-secondary)', borderRadius: '8px',
          border: '1px solid var(--border-color)', display: 'flex',
          flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 16px', borderBottom: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
          }}>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>Stack (LIFO)</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              size: <strong style={{ color: '#6366f1' }}>{stack.length}</strong>
            </span>
          </div>

          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end',
            padding: '16px', gap: '6px', overflow: 'hidden',
          }}>
            {stack.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 'auto', marginTop: 'auto' }}>
                Empty stack
              </div>
            ) : (
              <>
                {stack.length > MAX_VISIBLE && (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    +{stack.length - MAX_VISIBLE} more...
                  </div>
                )}
                {stack.slice(0, MAX_VISIBLE).map((item, i) => (
                  <NodeBox
                    key={item.id} val={item.val}
                    isActive={i === stackActive}
                    label={i === 0 ? '← TOP' : null}
                    color="#6366f1"
                  />
                ))}
              </>
            )}
            <div style={{
              width: '72px', height: '4px', background: 'var(--border-color)',
              borderRadius: '0 0 4px 4px', marginTop: '2px',
            }} />
          </div>

          <div style={{
            padding: '8px 16px', borderTop: '1px solid var(--border-color)',
            fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', flexShrink: 0,
          }}>
            Push & Pop from TOP
          </div>
        </div>

        {/* Queue panel */}
        <div style={{
          flex: 2, background: 'var(--bg-secondary)', borderRadius: '8px',
          border: '1px solid var(--border-color)', display: 'flex',
          flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 16px', borderBottom: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
          }}>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>Queue (FIFO)</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              size: <strong style={{ color: '#8b5cf6' }}>{queue.length}</strong>
            </span>
          </div>

          <div style={{
            flex: 1, display: 'flex', alignItems: 'center',
            padding: '24px 20px', gap: '8px', overflow: 'auto',
          }}>
            {queue.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 'auto' }}>
                Empty queue
              </div>
            ) : (
              <>
                <div style={{
                  height: '40px', width: '4px', background: 'var(--border-color)',
                  borderRadius: '4px 0 0 4px', flexShrink: 0,
                }} />
                {queue.slice(0, MAX_VISIBLE).map((item, i) => (
                  <React.Fragment key={item.id}>
                    <NodeBox
                      val={item.val}
                      isActive={i === queueActive}
                      label={i === 0 ? '↑ FRONT' : i === Math.min(queue.length, MAX_VISIBLE) - 1 ? '↑ REAR' : null}
                      color="#8b5cf6"
                    />
                    {i < Math.min(queue.length, MAX_VISIBLE) - 1 && (
                      <div style={{ color: 'var(--border-light)', fontSize: '16px', flexShrink: 0 }}>→</div>
                    )}
                  </React.Fragment>
                ))}
                {queue.length > MAX_VISIBLE && (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>
                    +{queue.length - MAX_VISIBLE} more
                  </div>
                )}
                <div style={{
                  height: '40px', width: '4px', background: 'var(--border-color)',
                  borderRadius: '0 4px 4px 0', flexShrink: 0,
                }} />
              </>
            )}
          </div>

          <div style={{
            padding: '8px 16px', borderTop: '1px solid var(--border-color)',
            fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', flexShrink: 0,
          }}>
            Enqueue at REAR · Dequeue from FRONT
          </div>
        </div>
      </div>
    </div>
  )
}

export default StackQueuePage
