import React, { useState } from 'react'
import './Page.css'

const SORT_DISPLAY_NAMES = {
  bubble: 'Bubble Sort',
  selection: 'Selection Sort',
  insertion: 'Insertion Sort',
  merge: 'Merge Sort',
  quick: 'Quick Sort',
}

const SORT_INFO = {
  bubble: {
    complexity: 'O(n²)',
    space: 'O(1)',
    desc: 'Repeatedly swaps adjacent elements that are out of order. Simple but inefficient on large lists.',
  },
  selection: {
    complexity: 'O(n²)',
    space: 'O(1)',
    desc: 'Finds the minimum element and places it at the start, repeating for each position.',
  },
  insertion: {
    complexity: 'O(n²)',
    space: 'O(1)',
    desc: 'Builds a sorted array one element at a time by inserting each into its correct position.',
  },
  merge: {
    complexity: 'O(n log n)',
    space: 'O(n)',
    desc: 'Divides the array in half, recursively sorts each half, then merges them back together.',
  },
  quick: {
    complexity: 'O(n log n) avg',
    space: 'O(log n)',
    desc: 'Picks a pivot, partitions elements around it, then recursively sorts each partition.',
  },
}

function SortingPage({ showToast, onAlgorithmChange, onVizStatusChange }) {
  const [array, setArray] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble')
  const [speed, setSpeed] = useState('normal')
  const [counter, setCounter] = useState({ comparisons: 0, swaps: 0 })
  const [colorStates, setColorStates] = useState({})

  const speedMap = { slow: 50, normal: 20, fast: 5 }

  const generateArray = () => {
    const newArray = Array.from({ length: 50 }, () => Math.floor(Math.random() * 500))
    setArray(newArray)
    setColorStates({})
    setCounter({ comparisons: 0, swaps: 0 })
  }

  React.useEffect(() => {
    generateArray()
    onAlgorithmChange?.(SORT_DISPLAY_NAMES['bubble'])
  }, [])

  const handleSort = async () => {
    if (isAnimating) return
    setIsAnimating(true)
    onVizStatusChange?.('running')
    setCounter({ comparisons: 0, swaps: 0 })
    setColorStates({})

    const algorithm = (await import(`../algorithms/sorting/${selectedAlgorithm}`)).default
    const animations = algorithm(array)

    for (const animation of animations) {
      await new Promise(resolve => setTimeout(resolve, speedMap[speed]))

      if (animation.type === 'compare') {
        setColorStates(prev => {
          const newStates = { ...prev }
          animation.indices.forEach(idx => newStates[idx] = 'comparing')
          return newStates
        })
        setCounter(prev => ({ ...prev, comparisons: prev.comparisons + 1 }))
      } else if (animation.type === 'swap') {
        const [i, j] = animation.indices
        setArray(prev => {
          const newArray = [...prev]
          ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
          return newArray
        })
        setColorStates(prev => {
          const newStates = { ...prev }
          newStates[i] = 'swapping'
          newStates[j] = 'swapping'
          return newStates
        })
        setCounter(prev => ({ ...prev, swaps: prev.swaps + 1 }))
      } else if (animation.type === 'sorted') {
        setColorStates(prev => {
          const newStates = { ...prev }
          animation.indices.forEach(idx => newStates[idx] = 'sorted')
          return newStates
        })
      }
    }

    setIsAnimating(false)
    onVizStatusChange?.('complete')
    showToast('Sorting complete!')
  }

  const getBarColor = (index) => {
    const state = colorStates[index]
    if (state === 'comparing') return 'var(--color-sorting-compare)'
    if (state === 'swapping') return 'var(--color-sorting-swap)'
    if (state === 'sorted') return 'var(--color-sorting-sorted)'
    return 'var(--color-sorting-default)'
  }

  const info = SORT_INFO[selectedAlgorithm]

  return (
    <div className="page sorting-page">
      <div className="controls">
        <div className="control-group">
          <label htmlFor="algo-select">Algorithm</label>
          <select
            id="algo-select"
            value={selectedAlgorithm}
            onChange={(e) => {
              setSelectedAlgorithm(e.target.value)
              onAlgorithmChange?.(SORT_DISPLAY_NAMES[e.target.value])
            }}
            disabled={isAnimating}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
        </div>

        <div className="controls-divider" />

        <button
          className="btn btn-primary"
          onClick={handleSort}
          disabled={isAnimating}
        >
          {isAnimating ? 'Sorting...' : 'Sort'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={generateArray}
          disabled={isAnimating}
        >
          New Array
        </button>

        <div className="controls-divider" />

        <div className="control-group">
          <label htmlFor="speed-select">Speed</label>
          <select
            id="speed-select"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            disabled={isAnimating}
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      </div>

      <div className="algo-info-bar">
        <div className="algo-info-left">
          <span className="algo-info-name">{SORT_DISPLAY_NAMES[selectedAlgorithm]}</span>
          <span className="algo-info-complexity">{info.complexity}</span>
          <span className="algo-info-space">Space: {info.space}</span>
        </div>
        <div className="algo-info-desc">{info.desc}</div>
        <div className="legend">
          <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--color-sorting-default)' }} />Default</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--color-sorting-compare)' }} />Comparing</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--color-sorting-swap)' }} />Swapping</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--color-sorting-sorted)' }} />Sorted</span>
        </div>
      </div>

      <div className="sort-visualization">
        <div className="bars">
          {array.map((value, index) => (
            <div
              key={index}
              className="bar"
              style={{
                height: `${(value / 500) * 100}%`,
                backgroundColor: getBarColor(index),
              }}
            />
          ))}
        </div>
      </div>

      {(counter.comparisons > 0 || counter.swaps > 0) && (
        <div className="counter">
          <span className="counter-item">
            <span className="counter-dot" style={{ background: 'var(--color-sorting-compare)' }} />
            <span className="counter-label">Comparisons</span>
            <span className="counter-value">{counter.comparisons}</span>
          </span>
          <span className="counter-item">
            <span className="counter-dot" style={{ background: 'var(--color-sorting-swap)' }} />
            <span className="counter-label">Swaps</span>
            <span className="counter-value">{counter.swaps}</span>
          </span>
        </div>
      )}
    </div>
  )
}

export default SortingPage
