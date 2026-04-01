import React, { useState, useRef } from 'react'
import TreeVisualization from '../components/TreeVisualization'
import BinarySearchTree from '../algorithms/tree/bst'
import './Page.css'
import './Tree.css'

function TreePage({ showToast }) {
  const [tree, setTree] = useState(new BinarySearchTree())
  const [inputValue, setInputValue] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [visitedNodes, setVisitedNodes] = useState([])
  const [foundNode, setFoundNode] = useState(null)
  const [traversalOrder, setTraversalOrder] = useState([])
  const treeRef = useRef(tree)

  const handleInsert = () => {
    const value = parseInt(inputValue)
    if (isNaN(value) || value < 0 || value > 999) {
      showToast('Enter a number between 0-999')
      return
    }

    const newTree = new BinarySearchTree()
    newTree.root = treeRef.current.root
    newTree.nodeCount = treeRef.current.nodeCount
    newTree.insert(value)
    treeRef.current = newTree
    setTree({ ...newTree })
    setInputValue('')
    showToast(`Inserted ${value}`)
  }

  const handleDelete = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      showToast('Enter a valid number')
      return
    }

    const newTree = new BinarySearchTree()
    newTree.root = treeRef.current.root
    newTree.nodeCount = treeRef.current.nodeCount
    newTree.delete(value)
    treeRef.current = newTree
    setTree({ ...newTree })
    setInputValue('')
    showToast(`Deleted ${value}`)
  }

  const handleSearch = async () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      showToast('Enter a valid number')
      return
    }

    setIsAnimating(true)
    setVisitedNodes([])
    setFoundNode(null)
    setTraversalOrder([])

    const { path, found } = treeRef.current.search(value)

    for (let node of path) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setVisitedNodes(prev => [...prev, node])
    }

    if (found && path.length > 0) {
      setFoundNode(path[path.length - 1])
      showToast(`Found ${value}!`)
    } else {
      showToast(`${value} not found`)
    }

    setIsAnimating(false)
  }

  const handleTraversal = async (type) => {
    setIsAnimating(true)
    setVisitedNodes([])
    setFoundNode(null)
    setTraversalOrder([])

    let nodes = []
    if (type === 'inorder') nodes = treeRef.current.inorder()
    else if (type === 'preorder') nodes = treeRef.current.preorder()
    else if (type === 'postorder') nodes = treeRef.current.postorder()

    const order = []
    for (let node of nodes) {
      await new Promise(resolve => setTimeout(resolve, 500))
      setVisitedNodes(prev => [...prev, node])
      order.push(node.value)
      setTraversalOrder([...order])
    }

    showToast(`${type} traversal complete`)
    setIsAnimating(false)
  }

  const handleGenerateRandom = () => {
    const newTree = new BinarySearchTree()
    const values = new Set()
    while (values.size < 10) {
      values.add(Math.floor(Math.random() * 100))
    }
    values.forEach(v => newTree.insert(v))
    treeRef.current = newTree
    setTree({ ...newTree })
    setVisitedNodes([])
    setFoundNode(null)
    setTraversalOrder([])
    showToast('Generated random tree with 10 nodes')
  }

  return (
    <div className="page tree-page">
      <div className="controls">
        <input
          type="number"
          min="0"
          max="999"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value (0-999)"
          disabled={isAnimating}
          className="input-field"
        />

        <button
          className="btn btn-primary"
          onClick={handleInsert}
          disabled={isAnimating}
        >
          Insert
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleDelete}
          disabled={isAnimating}
        >
          Delete
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleSearch}
          disabled={isAnimating}
        >
          Search
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => handleTraversal('inorder')}
          disabled={isAnimating}
        >
          Inorder
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => handleTraversal('preorder')}
          disabled={isAnimating}
        >
          Preorder
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => handleTraversal('postorder')}
          disabled={isAnimating}
        >
          Postorder
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleGenerateRandom}
          disabled={isAnimating}
        >
          Generate Random
        </button>
      </div>

      <div className="tree-main">
        <TreeVisualization tree={tree} visitedNodes={visitedNodes} foundNode={foundNode} />

        {traversalOrder.length > 0 && (
          <div className="traversal-info">
            <div className="traversal-order">
              <strong>Traversal Order:</strong> {traversalOrder.join(' → ')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TreePage
