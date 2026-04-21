import React, { useState, useEffect } from 'react'
import Grid from '../components/Grid'
import './Page.css'

const ALGO_DISPLAY_NAMES = {
  dijkstra: "Dijkstra's Algorithm",
  astar: 'A* Search',
  bfs: 'Breadth-First Search (BFS)',
  dfs: 'Depth-First Search (DFS)',
  greedy: 'Greedy Best-First Search',
}

function PathfindingPage({ showToast, onAlgorithmChange, onVizStatusChange }) {
  const ROWS = 20
  const COLS = 45
  const [grid, setGrid] = useState([])
  const [startNode, setStartNode] = useState({ row: 10, col: 5 })
  const [endNode, setEndNode] = useState({ row: 10, col: 44 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra')
  const [nodeCounter, setNodeCounter] = useState({ visited: 0, pathLength: 0 })

  useEffect(() => {
    onAlgorithmChange?.(ALGO_DISPLAY_NAMES['dijkstra'])
  }, [])

  useEffect(() => {
    initializeGrid()
  }, [])

  const initializeGrid = () => {
    const newGrid = Array.from({ length: ROWS }, (_, row) =>
      Array.from({ length: COLS }, (_, col) => ({
        row,
        col,
        isWall: false,
        isStart: row === startNode.row && col === startNode.col,
        isEnd: row === endNode.row && col === endNode.col,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        gScore: Infinity,
        fScore: Infinity,
        previousNode: null,
      }))
    )
    setGrid(newGrid)
  }

  const resetGrid = () => {
    setIsAnimating(false)
    setNodeCounter({ visited: 0, pathLength: 0 })
    initializeGrid()
    showToast('Board cleared!')
  }

  const clearPath = () => {
    const newGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        isVisited: false,
        isPath: false,
      }))
    )
    setGrid(newGrid)
    setNodeCounter({ visited: 0, pathLength: 0 })
    showToast('Path cleared!')
  }

  const handleVisualize = async (algorithmName) => {
    if (isAnimating) return
    setIsAnimating(true)
    onVizStatusChange?.('running')
    setNodeCounter({ visited: 0, pathLength: 0 })

    const clearedGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        gScore: Infinity,
        fScore: Infinity,
        previousNode: null,
      }))
    )
    setGrid(clearedGrid)

    await new Promise(resolve => setTimeout(resolve, 50))

    const algorithm = (await import(`../algorithms/pathfinding/${algorithmName}`)).default
    const startNodeObj = clearedGrid[startNode.row][startNode.col]
    const endNodeObj = clearedGrid[endNode.row][endNode.col]

    const { visitedNodesInOrder, shortestPath } = algorithm(clearedGrid, startNodeObj, endNodeObj)
    setNodeCounter(prev => ({ ...prev, visited: visitedNodesInOrder.length, pathLength: shortestPath.length }))

    for (const node of visitedNodesInOrder) {
      await new Promise(resolve => setTimeout(resolve, 10))
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(r => [...r])
        newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isVisited: true }
        return newGrid
      })
    }

    for (const node of shortestPath) {
      await new Promise(resolve => setTimeout(resolve, 50))
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(r => [...r])
        newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isPath: true }
        return newGrid
      })
    }

    setIsAnimating(false)
    onVizStatusChange?.('complete')
  }

  const handleGenerateMaze = async () => {
    setIsAnimating(true)
    onVizStatusChange?.('maze_running')
    const { default: generateMaze } = await import('../algorithms/pathfinding/maze')
    const walls = generateMaze(grid)

    for (const wall of walls) {
      await new Promise(resolve => setTimeout(resolve, 5))
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(r => [...r])
        newGrid[wall.row][wall.col] = { ...newGrid[wall.row][wall.col], isWall: true }
        return newGrid
      })
    }

    setIsAnimating(false)
    onVizStatusChange?.('idle')
    showToast('Maze generated!')
  }

  const algorithmInfo = {
    dijkstra: {
      name: "Dijkstra's Algorithm",
      complexity: 'O((V + E) log V)',
      desc: 'Explores nodes by shortest known distance. Guarantees the shortest path on weighted graphs.',
      guarantees: true,
    },
    astar: {
      name: 'A* Search',
      complexity: 'O(E log V)',
      desc: 'Uses a heuristic to guide search toward the goal. Faster than Dijkstra\'s in practice.',
      guarantees: true,
    },
    bfs: {
      name: 'Breadth-First Search',
      complexity: 'O(V + E)',
      desc: 'Explores all neighbors level by level. Guarantees shortest path on unweighted graphs.',
      guarantees: true,
    },
    dfs: {
      name: 'Depth-First Search',
      complexity: 'O(V + E)',
      desc: 'Explores as far as possible down each branch before backtracking. Does not guarantee shortest path.',
      guarantees: false,
    },
    greedy: {
      name: 'Greedy Best-First Search',
      complexity: 'O(E log V)',
      desc: 'Always expands the node that looks closest to the goal. Fast but does not guarantee shortest path.',
      guarantees: false,
    },
  }

  const info = algorithmInfo[selectedAlgorithm]

  return (
    <div className="page pathfinding-page">
      <div className="controls">
        <div className="control-group">
          <label htmlFor="algo-select">Algorithm</label>
          <select
            id="algo-select"
            value={selectedAlgorithm}
            onChange={(e) => {
              setSelectedAlgorithm(e.target.value)
              onAlgorithmChange?.(ALGO_DISPLAY_NAMES[e.target.value])
            }}
            disabled={isAnimating}
          >
            {Object.entries(algorithmInfo).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>
        </div>

        <div className="controls-divider" />

        <button
          className="btn btn-primary"
          onClick={() => handleVisualize(selectedAlgorithm)}
          disabled={isAnimating}
        >
          {isAnimating ? 'Visualizing...' : 'Visualize'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleGenerateMaze}
          disabled={isAnimating}
        >
          Generate Maze
        </button>

        <button
          className="btn btn-secondary"
          onClick={clearPath}
          disabled={isAnimating}
        >
          Clear Path
        </button>

        <button
          className="btn btn-danger"
          onClick={resetGrid}
          disabled={isAnimating}
        >
          Clear Board
        </button>
      </div>

      <div className="algo-info-bar">
        <div className="algo-info-left">
          <span className="algo-info-name">{info.name}</span>
          <span className="algo-info-complexity">{info.complexity}</span>
          <span className={`algo-info-badge ${info.guarantees ? 'badge-guaranteed' : 'badge-no-guarantee'}`}>
            {info.guarantees ? 'Shortest path guaranteed' : 'No path guarantee'}
          </span>
        </div>
        <div className="algo-info-desc">{info.desc}</div>
        <div className="legend">
          <span className="legend-item"><span className="legend-dot" style={{ background: '#22c55e' }} />Start</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: '#ef4444' }} />End</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: '#d4d4d8' }} />Wall</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: '#6366f1' }} />Visited</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }} />Path</span>
        </div>
      </div>

      <div className="grid-container">
        <Grid
          grid={grid}
          setGrid={setGrid}
          startNode={startNode}
          setStartNode={setStartNode}
          endNode={endNode}
          setEndNode={setEndNode}
          isAnimating={isAnimating}
        />
      </div>

      {nodeCounter.visited > 0 && (
        <div className="counter">
          <span className="counter-item">
            <span className="counter-dot" style={{ background: '#6366f1' }} />
            <span className="counter-label">Nodes Visited</span>
            <span className="counter-value">{nodeCounter.visited}</span>
          </span>
          <span className="counter-item">
            <span className="counter-dot" style={{ background: '#f59e0b' }} />
            <span className="counter-label">Path Length</span>
            <span className="counter-value">{nodeCounter.pathLength > 0 ? nodeCounter.pathLength : '—'}</span>
          </span>
        </div>
      )}
    </div>
  )
}

export default PathfindingPage
