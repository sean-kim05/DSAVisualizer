import React, { useRef, useEffect } from 'react'
import './Tree.css'

function TreeVisualization({ tree, visitedNodes, foundNode }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!tree.root) return

    tree.calculatePositions()
    drawTree()
  }, [tree, visitedNodes, foundNode])

  const drawTree = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(canvas.width / 2, 0)

    if (tree.root) {
      drawEdges(tree.root, ctx)
      drawNodes(tree.root, ctx)
    }

    ctx.restore()
  }

  const drawEdges = (node, ctx) => {
    if (node === null) return

    ctx.strokeStyle = 'var(--border-color)'
    ctx.lineWidth = 2

    if (node.left) {
      ctx.beginPath()
      ctx.moveTo(node.x, node.y)
      ctx.lineTo(node.left.x, node.left.y)
      ctx.stroke()
      drawEdges(node.left, ctx)
    }

    if (node.right) {
      ctx.beginPath()
      ctx.moveTo(node.x, node.y)
      ctx.lineTo(node.right.x, node.right.y)
      ctx.stroke()
      drawEdges(node.right, ctx)
    }
  }

  const drawNodes = (node, ctx) => {
    if (node === null) return

    const radius = 25

    // Determine node color
    let fillColor = 'var(--color-sorting-default)'
    if (foundNode && foundNode.id === node.id) {
      fillColor = 'var(--accent-green)'
    } else if (visitedNodes.some(n => n.id === node.id)) {
      fillColor = 'var(--accent-blue)'
    }

    // Draw circle
    ctx.fillStyle = fillColor
    ctx.beginPath()
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI)
    ctx.fill()

    // Draw border
    ctx.strokeStyle = 'var(--accent-green)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw text
    ctx.fillStyle = 'var(--bg-primary)'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.value, node.x, node.y)

    if (node.left) drawNodes(node.left, ctx)
    if (node.right) drawNodes(node.right, ctx)
  }

  return (
    <div className="tree-visualization">
      <canvas ref={canvasRef} width={800} height={600} className="tree-canvas" />
    </div>
  )
}

export default TreeVisualization
