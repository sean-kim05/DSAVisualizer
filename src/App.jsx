import React, { useState } from 'react'
import Navbar from './components/Navbar'
import WelcomeModal from './components/WelcomeModal'
import Toast from './components/Toast'
import PathfindingPage from './pages/PathfindingPage'
import SortingPage from './pages/SortingPage'
import TreePage from './pages/TreePage'
import HeapPage from './pages/HeapPage'
import GraphPage from './pages/GraphPage'
import LinkedListPage from './pages/LinkedListPage'
import StackQueuePage from './pages/StackQueuePage'
import BinarySearchPage from './pages/BinarySearchPage'
import AboutPage from './pages/AboutPage'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('pathfinding')
  const [showWelcome, setShowWelcome] = useState(true)
  const [toast, setToast] = useState(null)

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const tabs = [
    { id: 'pathfinding', label: 'Pathfinding' },
    { id: 'sorting', label: 'Sorting' },
    { id: 'tree', label: 'Tree' },
    { id: 'heap', label: 'Heap' },
    { id: 'graph', label: 'Graph' },
    { id: 'linkedlist', label: 'Linked List' },
    { id: 'stackqueue', label: 'Stack & Queue' },
    { id: 'binarysearch', label: 'Binary Search' },
    { id: 'about', label: 'About' },
  ]

  const renderPage = () => {
    switch (activeTab) {
      case 'pathfinding':
        return <PathfindingPage showToast={showToast} />
      case 'sorting':
        return <SortingPage showToast={showToast} />
      case 'tree':
        return <TreePage showToast={showToast} />
      case 'heap':
        return <HeapPage showToast={showToast} />
      case 'graph':
        return <GraphPage showToast={showToast} />
      case 'linkedlist':
        return <LinkedListPage showToast={showToast} />
      case 'stackqueue':
        return <StackQueuePage showToast={showToast} />
      case 'binarysearch':
        return <BinarySearchPage showToast={showToast} />
      case 'about':
        return <AboutPage />
      default:
        return <PathfindingPage showToast={showToast} />
    }
  }

  return (
    <div className="app">
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        tabs={tabs}
      />
      <div className="page-container" key={activeTab}>
        {renderPage()}
      </div>
      {toast && <Toast message={toast} />}
    </div>
  )
}

export default App
