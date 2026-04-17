# DSAVisualizer

**Live Demo:** [sean-kim05.github.io/DSAVisualizer](https://sean-kim05.github.io/DSAVisualizer/)

An interactive visualizer for algorithms and data structures, with a built-in Claude AI assistant that explains what you're watching in real time.

---

## Features

### 8 Interactive Visualizers
- **Pathfinding** — Dijkstra, A*, BFS, DFS, Greedy Best-First on a live grid
- **Sorting** — Bubble, Selection, Insertion, Merge, Quick Sort with color-coded comparisons
- **Binary Search Trees** — Insert, delete, search, and traverse with animated node highlighting
- **Heaps** — Min/Max heap operations with tree and array representations side by side
- **Graphs** — Draggable node-edge graphs with BFS/DFS traversal animations
- **Linked Lists** — Singly/doubly list operations with pointer animations
- **Stacks & Queues** — Side-by-side LIFO/FIFO demonstrations
- **Binary Search** — Step-by-step search on sorted arrays with pointer animations

### AI Assistant (Claude-powered)
A collapsible AI panel is built into every visualizer. It connects to a Flask backend that streams responses via SSE using the Anthropic API.

- **Preset questions** — Explain this algorithm, Time complexity, When should I use this, Compare to similar, What to watch for
- **Context-aware** — The AI knows which algorithm is active and whether a visualization is running, complete, or generating a maze
- **Conversation history** — Multi-turn chat within a session
- **Streaming responses** — Answers stream in token by token
- **Keyboard shortcut** — Press `/` to focus the input
- **Copy & Stop** — Copy any response or cancel generation mid-stream

### UI
- LeetCode/NeetCode-inspired dark design with an indigo/violet palette
- Flat toolbar-style controls bar on each page
- Algorithm info bar showing time complexity and a "Shortest Path Guaranteed / Not Guaranteed" badge
- Stat bar tracking comparisons, swaps, visited nodes, and path length in real time
- Toast notifications, welcome modal, and smooth tab transitions
- Fully responsive

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite |
| Styling | CSS variables, custom animations, Inter font |
| AI Backend | Flask, Anthropic Python SDK (claude-sonnet-4-6), SSE streaming |
| Frontend Deploy | GitHub Pages |
| Backend Deploy | Render |

---

## Getting Started

### Prerequisites
- Node.js v16+
- Python 3.11+ (for the AI backend)

### Frontend

```bash
git clone https://github.com/sean-kim05/DSAVisualizer.git
cd DSAVisualizer
npm install
npm run dev
```

Open `http://localhost:5173`.

### Backend (AI Panel)

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file:
```
ANTHROPIC_API_KEY=your_key_here
```

```bash
python app.py
```

The backend runs on `http://localhost:5000`. The frontend proxies `/api` to it automatically in dev via Vite config.

### Production Build

```bash
npm run build
```

---

## Algorithm Reference

### Pathfinding

| Algorithm | Time | Space | Shortest Path |
|---|---|---|---|
| Dijkstra's | O((V+E) log V) | O(V) | Yes |
| A* | O((V+E) log V) | O(V) | Yes |
| BFS | O(V+E) | O(V) | Yes (unweighted) |
| DFS | O(V+E) | O(V) | No |
| Greedy Best-First | O((V+E) log V) | O(V) | No |

### Sorting

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |

---

## Project Structure

```
DSAVisualizer/
├── src/
│   ├── components/
│   │   ├── AIPanel/           # Claude AI assistant panel
│   │   ├── Grid.jsx           # Interactive pathfinding grid
│   │   ├── Navbar.jsx         # Tab navigation
│   │   ├── TreeVisualization.jsx
│   │   ├── WelcomeModal.jsx
│   │   └── Toast.jsx
│   ├── algorithms/
│   │   ├── pathfinding/       # dijkstra, astar, bfs, dfs, greedy, maze
│   │   ├── sorting/           # bubble, selection, insertion, merge, quick
│   │   └── tree/              # bst
│   ├── pages/
│   │   ├── PathfindingPage.jsx
│   │   ├── SortingPage.jsx
│   │   ├── TreePage.jsx
│   │   ├── HeapPage.jsx
│   │   ├── GraphPage.jsx
│   │   ├── LinkedListPage.jsx
│   │   ├── StackQueuePage.jsx
│   │   ├── BinarySearchPage.jsx
│   │   └── AboutPage.jsx
│   └── App.jsx
├── backend/
│   ├── app.py                 # Flask API with /api/explain SSE endpoint
│   ├── algorithm_data.py      # Algorithm context fed to the AI
│   └── requirements.txt
├── render.yaml                # Render deployment config
└── vite.config.js
```

---

## License

MIT
 
