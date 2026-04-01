class BSTNode {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.id = Math.random().toString(36).substr(2, 9)
    this.x = 0
    this.y = 0
    this.visited = false
    this.found = false
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null
    this.nodeCount = 0
  }

  insert(value) {
    if (!Number.isInteger(value) || value < 0 || value > 999) return false
    const newNode = new BSTNode(value)
    if (this.root === null) {
      this.root = newNode
      this.nodeCount++
      return true
    }
    this._insertNode(this.root, newNode)
    this.nodeCount++
    return true
  }

  _insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode
      } else {
        this._insertNode(node.left, newNode)
      }
    } else {
      if (node.right === null) {
        node.right = newNode
      } else {
        this._insertNode(node.right, newNode)
      }
    }
  }

  search(value) {
    const path = []
    const found = this._searchNode(this.root, value, path)
    return { path, found }
  }

  _searchNode(node, value, path) {
    if (node === null) return false
    path.push(node)
    if (value === node.value) return true
    if (value < node.value) return this._searchNode(node.left, value, path)
    return this._searchNode(node.right, value, path)
  }

  delete(value) {
    this.root = this._deleteNode(this.root, value)
    return true
  }

  _deleteNode(node, value) {
    if (node === null) return null

    if (value < node.value) {
      node.left = this._deleteNode(node.left, value)
      return node
    } else if (value > node.value) {
      node.right = this._deleteNode(node.right, value)
      return node
    } else {
      if (node.left === null) {
        this.nodeCount--
        return node.right
      } else if (node.right === null) {
        this.nodeCount--
        return node.left
      } else {
        let minRight = node.right
        while (minRight.left !== null) {
          minRight = minRight.left
        }
        node.value = minRight.value
        node.right = this._deleteNode(node.right, minRight.value)
        return node
      }
    }
  }

  inorder() {
    const result = []
    this._inorderTraversal(this.root, result)
    return result
  }

  _inorderTraversal(node, result) {
    if (node !== null) {
      this._inorderTraversal(node.left, result)
      result.push(node)
      this._inorderTraversal(node.right, result)
    }
  }

  preorder() {
    const result = []
    this._preorderTraversal(this.root, result)
    return result
  }

  _preorderTraversal(node, result) {
    if (node !== null) {
      result.push(node)
      this._preorderTraversal(node.left, result)
      this._preorderTraversal(node.right, result)
    }
  }

  postorder() {
    const result = []
    this._postorderTraversal(this.root, result)
    return result
  }

  _postorderTraversal(node, result) {
    if (node !== null) {
      this._postorderTraversal(node.left, result)
      this._postorderTraversal(node.right, result)
      result.push(node)
    }
  }

  calculatePositions() {
    if (this.root === null) return
    this._calculatePositions(this.root, 0, 0, 150)
  }

  _calculatePositions(node, x, y, offset) {
    if (node === null) return
    node.x = x
    node.y = y
    if (node.left) this._calculatePositions(node.left, x - offset, y + 80, offset / 1.5)
    if (node.right) this._calculatePositions(node.right, x + offset, y + 80, offset / 1.5)
  }
}

export default BinarySearchTree
export { BSTNode }
