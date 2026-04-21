# DSAVisualizer

An interactive visualizer for algorithms and data structures, with a built-in Claude AI assistant that explains what you're watching in real time.

**Live Demo:** [sean-kim05.github.io/DSAVisualizer](https://sean-kim05.github.io/DSAVisualizer/) · [GitHub](https://github.com/sean-kim05/DSAVisualizer)

---

## Features

### 8 Interactive Visualizers
- **Pathfinding** — Dijkstra, A*, BFS, DFS, Greedy Best-First on a live grid with maze generation
- **Sorting** — Bubble, Selection, Insertion, Merge, Quick Sort with color-coded comparisons and swap animations
- **Binary Search Trees** — Insert, delete, search, and traverse with animated node highlighting
- **Heaps** — Min/Max heap operations with tree and array representations side by side
- **Graphs** — Draggable node-edge graphs with BFS/DFS traversal animations
- **Linked Lists** — Singly/doubly list operations with pointer animations
- **Stacks & Queues** — Side-by-side LIFO/FIFO demonstrations
- **Binary Search** — Step-by-step search on sorted arrays with pointer animations

### AI Assistant (Claude-powered)
A collapsible panel built into every page. Connects to a Flask backend that streams responses via SSE using the Anthropic API.

- **Context-aware** — knows which algorithm is active and whether a visualization is running, done, or generating a maze
- **Preset questions** — Explain this algorithm, Time complexity, When to use this, Compare alternatives, What to watch for
- **Conversation history** — multi-turn chat within a session
- **Streaming responses** — answers stream token by token
- **Keyboard shortcut** — press `/` to focus the input

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, CSS custom properties |
| AI Backend | Flask, Anthropic Python SDK (claude-sonnet-4-6), SSE streaming |
| Frontend Deploy | GitHub Pages (`base: '/DSAVisualizer/'` in Vite config) |
| Backend Deploy | Render (`render.yaml` included) |

---

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+ (for the AI backend)

### Frontend
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
```

### Backend (AI Panel)
```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:
```
ANTHROPIC_API_KEY=your_key_here
```

```bash
python app.py     # http://localhost:5000
```

The Vite dev proxy forwards all `/api` requests to `localhost:5000` automatically — no CORS config needed in dev.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Powers the AI assistant panel |

---

## Algorithm Reference

### Pathfinding

| Algorithm | Time | Space | Shortest Path |
|---|---|---|---|
| Dijkstra's | O((V+E) log V) | O(V) | ✅ Yes |
| A* | O((V+E) log V) | O(V) | ✅ Yes |
| BFS | O(V+E) | O(V) | ✅ Yes (unweighted) |
| DFS | O(V+E) | O(V) | ❌ No |
| Greedy Best-First | O((V+E) log V) | O(V) | ❌ No |

### Sorting

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |

---

## Architecture

```
React (GitHub Pages)         Flask (Render)
        |                         |
        |── POST /api/explain ───►|
        |                         | streams SSE chunks
        |◄── data: {text} ────── |
        |◄── data: {done} ────── |
```

Algorithm context is injected server-side from `backend/algorithm_data.py` — the frontend sends only the algorithm name and viz state, keeping prompts consistent and the client thin.

---

## License

MIT
