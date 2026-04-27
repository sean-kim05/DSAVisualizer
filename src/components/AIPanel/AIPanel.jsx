import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Lightbulb, Clock, Target, Scale, Eye, Sparkles, Paperclip, Camera, X } from 'lucide-react'
import styles from './AIPanel.module.css'

const API_BASE = import.meta.env.VITE_API_URL || ''

const PRESET_QUESTIONS = [
  { label: 'Explain this algorithm', icon: Lightbulb },
  { label: 'Time complexity',        icon: Clock },
  { label: 'When should I use this?', icon: Target },
  { label: 'Compare to similar',     icon: Scale },
  { label: 'What to watch for?',     icon: Eye },
]

const ALGORITHM_WELCOME = {
  "Dijkstra's Algorithm": "Now watching Dijkstra's — the gold standard for shortest paths. Ask me anything!",
  'A* Search': "Now watching A* — it uses a heuristic to find paths faster. Ask me anything!",
  'Breadth-First Search (BFS)': 'Now watching BFS — watch it explore in perfect rings outward. Ask me anything!',
  'Depth-First Search (DFS)': 'Now watching DFS — watch it dive deep before backtracking. Ask me anything!',
  'Greedy Best-First Search': 'Now watching Greedy Best-First — it beelines toward the goal. Ask me anything!',
  'Bubble Sort': 'Now watching Bubble Sort — the classic teaching algorithm. Ask me anything!',
  'Selection Sort': 'Now watching Selection Sort — minimal swaps, same comparisons. Ask me anything!',
  'Insertion Sort': 'Now watching Insertion Sort — surprisingly fast on nearly-sorted data. Ask me anything!',
  'Merge Sort': 'Now watching Merge Sort — guaranteed O(n log n), always. Ask me anything!',
  'Quick Sort': 'Now watching Quick Sort — the fastest sort in practice. Ask me anything!',
  'Binary Search Tree': 'Now watching BST — the foundation of ordered data structures. Ask me anything!',
  'Heap Data Structure': 'Now watching Heaps — the most efficient priority queue. Ask me anything!',
  'Binary Search': 'Now watching Binary Search — halving the search space each step. Ask me anything!',
}

const IconAI = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1.5C4.186 1.5 1.5 4.186 1.5 7.5c0 1.476.528 2.827 1.4 3.876L1.5 12.793A.5.5 0 001.854 13.5H7.5c3.314 0 6-2.686 6-6s-2.686-6-6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <circle cx="5" cy="7.5" r="1" fill="currentColor"/>
    <circle cx="7.5" cy="7.5" r="1" fill="currentColor"/>
    <circle cx="10" cy="7.5" r="1" fill="currentColor"/>
  </svg>
)

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const IconSend = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 2.5v10M3 6.5l4.5-4 4.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconStop = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor"/>
  </svg>
)

const IconCopy = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <rect x="4.5" y="4.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M3 8.5H2A1.5 1.5 0 01.5 7V2A1.5 1.5 0 012 .5h5A1.5 1.5 0 018.5 2v1.5" stroke="currentColor" strokeWidth="1.1"/>
  </svg>
)

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2.5 6.5l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconPlay = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 2.5l8 3.5-8 3.5V2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
)

function TypingIndicator() {
  return (
    <div className={styles.typingIndicator}>
      <span /><span /><span />
    </div>
  )
}

function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  if (message.role === 'status') {
    return <div className={styles.statusMsg}>{message.content}</div>
  }

  return (
    <div className={`${styles.bubble} ${styles[message.role]} ${message.isError ? styles.errorBubble : ''}`}>
      {message.role === 'assistant' && (
        <div className={styles.bubbleHeader}>
          <span className={styles.aiLabel}>
            <IconAI />
            Claude
          </span>
          {!message.isStreaming && message.content && (
            <button className={styles.copyBtn} onClick={handleCopy} title="Copy response">
              {copied ? <IconCheck /> : <IconCopy />}
            </button>
          )}
        </div>
      )}
      {message.image && (
        <img src={message.image} alt="attached" className={styles.msgImage} />
      )}
      <div className={styles.bubbleContent}>
        {message.isStreaming && !message.content ? (
          <TypingIndicator />
        ) : (
          <span className={styles.messageText}>{message.content}</span>
        )}
        {message.isStreaming && message.content && (
          <span className={styles.streamCursor}>▋</span>
        )}
      </div>
    </div>
  )
}

export default function AIPanel({ currentAlgorithm, currentTab, vizStatus }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showExplainBtn, setShowExplainBtn] = useState(false)
  const [vizBanner, setVizBanner] = useState(null)
  const [pendingImage, setPendingImage] = useState(null) // { dataUrl }
  const [isCapturing, setIsCapturing] = useState(false)

  const abortRef = useRef(null)
  const chatRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const prevAlgorithmRef = useRef(currentAlgorithm)
  const prevVizStatusRef = useRef(vizStatus)
  const historyRef = useRef([])

  useEffect(() => {
    if (!localStorage.getItem('dsa_ai_tooltip_seen')) {
      setTimeout(() => setShowTooltip(true), 2000)
    }
  }, [])

  const dismissTooltip = () => {
    setShowTooltip(false)
    localStorage.setItem('dsa_ai_tooltip_seen', '1')
  }

  useEffect(() => {
    if (currentAlgorithm && currentAlgorithm !== prevAlgorithmRef.current) {
      prevAlgorithmRef.current = currentAlgorithm
      historyRef.current = []
      const welcome = ALGORITHM_WELCOME[currentAlgorithm]
        || `Now watching ${currentAlgorithm}. Ask me anything!`
      setMessages([{ role: 'status', content: welcome }])
      setShowExplainBtn(false)
      setVizBanner(null)
    }
  }, [currentAlgorithm])

  useEffect(() => {
    if (vizStatus === prevVizStatusRef.current) return
    prevVizStatusRef.current = vizStatus

    if (vizStatus === 'running') {
      setVizBanner('Visualization running — I can explain what you\'re seeing')
      setShowExplainBtn(false)
    } else if (vizStatus === 'maze_running') {
      setVizBanner('Generating maze — ask me how this works!')
      setShowExplainBtn(false)
    } else if (vizStatus === 'complete') {
      setVizBanner(null)
      setShowExplainBtn(true)
    } else {
      setVizBanner(null)
    }
  }, [vizStatus])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const handleKey = (e) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 150)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Paste image from clipboard
  useEffect(() => {
    const handlePaste = (e) => {
      if (!isOpen) return
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const file = item.getAsFile()
          const reader = new FileReader()
          reader.onload = (ev) => setPendingImage({ dataUrl: ev.target.result })
          reader.readAsDataURL(file)
          break
        }
      }
    }
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [isOpen])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => setPendingImage({ dataUrl: ev.target.result })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const captureViz = useCallback(async () => {
    setIsCapturing(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const target =
        document.querySelector('.sort-visualization') ||
        document.querySelector('.grid-container') ||
        document.querySelector('.tree-canvas') ||
        document.querySelector('canvas') ||
        document.querySelector('.page')
      if (!target) return
      const canvas = await html2canvas(target, { backgroundColor: '#09090b', scale: 1, useCORS: true })
      setPendingImage({ dataUrl: canvas.toDataURL('image/png') })
    } catch (_) {
      // silently fail — user can paste manually
    } finally {
      setIsCapturing(false)
    }
  }, [])

  const buildContext = useCallback(() => {
    const parts = []
    if (vizStatus === 'running') parts.push('visualization is currently running')
    if (vizStatus === 'complete') parts.push('visualization just completed')
    if (vizStatus === 'paused') parts.push('visualization is paused')
    return parts.join(', ')
  }, [vizStatus])

  const sendMessage = useCallback(async (question) => {
    if (!question.trim() || isStreaming) return

    const q = question.trim()
    const imageToSend = pendingImage?.dataUrl || null
    setInput('')
    setPendingImage(null)
    setIsStreaming(true)
    setRateLimited(true)
    setTimeout(() => setRateLimited(false), 1000)

    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setMessages(prev => [...prev, { role: 'user', content: q, image: imageToSend }])
    setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }])

    const historySnapshot = [...historyRef.current]

    try {
      const res = await fetch(`${API_BASE}/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm: currentAlgorithm || 'Unknown',
          context: buildContext(),
          question: q,
          history: historySnapshot,
          image: imageToSend,
        }),
        signal: controller.signal,
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.type === 'text') {
              fullText += data.text
              setMessages(prev => {
                const next = [...prev]
                next[next.length - 1] = { role: 'assistant', content: fullText, isStreaming: true }
                return next
              })
            } else if (data.type === 'done') {
              setMessages(prev => {
                const next = [...prev]
                next[next.length - 1] = { role: 'assistant', content: fullText, isStreaming: false }
                return next
              })
              historyRef.current = [
                ...historySnapshot,
                { role: 'user', content: q },
                { role: 'assistant', content: fullText },
              ]
            } else if (data.type === 'error') {
              setMessages(prev => {
                const next = [...prev]
                next[next.length - 1] = {
                  role: 'assistant',
                  content: data.message,
                  isStreaming: false,
                  isError: true,
                }
                return next
              })
            }
          } catch (_) {}
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages(prev => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last?.isStreaming) {
            next[next.length - 1] = { ...last, isStreaming: false, content: last.content || '(stopped)' }
          }
          return next
        })
      } else {
        setMessages(prev => {
          const next = [...prev]
          next[next.length - 1] = {
            role: 'assistant',
            content: `Connection error. Is the Flask backend running?\n\n${err.message}`,
            isStreaming: false,
            isError: true,
          }
          return next
        })
      }
    } finally {
      setIsStreaming(false)
    }
  }, [currentAlgorithm, buildContext, isStreaming, pendingImage])

  const stopGeneration = () => {
    if (abortRef.current) abortRef.current.abort()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handlePreset = (question) => {
    if (isStreaming) return
    sendMessage(question)
  }

  const handleExplainNow = () => {
    sendMessage('Explain what just happened in that visualization')
    setShowExplainBtn(false)
  }

  const togglePanel = () => {
    setIsOpen(o => !o)
    if (!isOpen) dismissTooltip()
  }

  return (
    <>
      {showTooltip && !isOpen && (
        <div className={styles.tooltip} onClick={dismissTooltip}>
          <span>Ask Claude to explain any algorithm</span>
          <button className={styles.tooltipClose} onClick={dismissTooltip}>
            <IconClose />
          </button>
        </div>
      )}

      <button
        className={`${styles.toggleBtn} ${isOpen ? styles.toggleOpen : ''}`}
        onClick={togglePanel}
        title={isOpen ? 'Close AI panel (/)' : 'Open AI assistant (/)'}
        aria-label="Toggle AI panel"
      >
        {isOpen ? <IconClose /> : <IconAI />}
        {!isOpen && <span className={styles.toggleLabel}>AI</span>}
      </button>

      <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`} aria-hidden={!isOpen}>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}><Sparkles size={14} strokeWidth={2} /></span>
            <div className={styles.headerTitleBlock}>
              <span className={styles.headerTitle}>Claude</span>
              {currentAlgorithm && (
                <span className={styles.headerAlgoName}>{currentAlgorithm}</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.presets}>
          {PRESET_QUESTIONS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={styles.presetBtn}
              onClick={() => handlePreset(label)}
              disabled={isStreaming}
              title={label}
            >
              <span className={styles.presetIcon}><Icon size={13} strokeWidth={2} /></span>
              <span className={styles.presetLabel}>{label}</span>
            </button>
          ))}
        </div>

        {vizBanner && (
          <div className={styles.vizBanner}>
            <span className={styles.vizDot} />
            {vizBanner}
          </div>
        )}

        <div className={styles.chat} ref={chatRef}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}><IconAI /></div>
              <p>Ask me about <strong>{currentAlgorithm || 'this algorithm'}</strong>.</p>
              <p className={styles.emptyHint}>Press <kbd>/</kbd> to open · Paste or 📎 to attach images</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))
          )}
        </div>

        {showExplainBtn && (
          <div className={styles.explainBanner}>
            <button className={styles.explainBtn} onClick={handleExplainNow}>
              <IconPlay />
              Explain what just happened
            </button>
          </div>
        )}

        {/* Image preview */}
        {pendingImage && (
          <div className={styles.imagePreviewWrap}>
            <img src={pendingImage.dataUrl} alt="preview" className={styles.imagePreview} />
            <button className={styles.imageRemoveBtn} onClick={() => setPendingImage(null)} title="Remove image">
              <X size={12} />
            </button>
          </div>
        )}

        <form className={styles.inputArea} onSubmit={handleSubmit}>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {/* Attach buttons */}
          <button
            type="button"
            className={styles.attachBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={isStreaming}
            title="Attach image"
          >
            <Paperclip size={15} strokeWidth={2} />
          </button>
          <button
            type="button"
            className={styles.attachBtn}
            onClick={captureViz}
            disabled={isStreaming || isCapturing}
            title="Capture visualization"
          >
            <Camera size={15} strokeWidth={2} />
          </button>

          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Ask about ${currentAlgorithm || 'this algorithm'}…`}
            disabled={isStreaming}
            maxLength={500}
          />
          {isStreaming ? (
            <button
              type="button"
              className={`${styles.sendBtn} ${styles.stopBtn}`}
              onClick={stopGeneration}
              title="Stop generation"
            >
              <IconStop />
            </button>
          ) : (
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={(!input.trim() && !pendingImage) || rateLimited}
              title="Send message"
            >
              <IconSend />
            </button>
          )}
        </form>

        <div className={styles.footer}>
          <Sparkles size={11} strokeWidth={2} style={{ flexShrink: 0 }} />
          Powered by Claude · Press <kbd>/</kbd> to toggle
        </div>
      </div>

      {isOpen && <div className={styles.backdrop} onClick={togglePanel} />}
    </>
  )
}
