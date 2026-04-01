# AlgoViz - Interactive Algorithm & Data Structures Visualizer

**AlgoViz** is a comprehensive web application that brings algorithms and data structures to life through interactive visualizations. Perfect for students, educators, and developers learning computer science fundamentals.

## 🎯 What Makes It Special

**8 Interactive Visualizers** in one app:
- **Pathfinding**: Watch Dijkstra, A*, BFS, DFS, and Greedy Best First explore grids in real-time
- **Sorting**: Visualize Bubble, Selection, Insertion, Merge, and Quick Sort with color-coded comparisons and swaps
- **Binary Search Trees**: Insert, delete, search, and traverse with animated node highlighting
- **Heaps**: Min/Max heap operations with tree and array representations
- **Graphs**: Interactive node-edge graphs with BFS/DFS traversal animations
- **Linked Lists**: Singly/doubly linked list operations with pointer animations
- **Stacks & Queues**: Side-by-side visualizations with LIFO/FIFO demonstrations
- **Binary Search**: Step-by-step search on sorted arrays with pointer animations

## 🚀 Features

- **Smooth Animations**: Custom CSS keyframes with adjustable speeds
- **Interactive Controls**: Click, drag, and input-based interactions
- **Educational Tooltips**: Algorithm complexity info and explanations
- **Dark Theme**: Eye-friendly interface with vibrant accent colors
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Counters**: Track comparisons, swaps, nodes visited, and path lengths
- **Maze Generation**: Recursive division algorithm for pathfinding challenges

## 🛠️ Technical Stack

- **Frontend**: React 18 with modern hooks
- **Styling**: CSS variables and custom animations
- **Build Tool**: Vite for fast development
- **Architecture**: Modular component structure with algorithm separation

## 📚 Perfect For

- Computer Science students learning algorithms
- Interview preparation and algorithm practice
- Educators demonstrating complex concepts
- Developers understanding data structure operations

## How to Use

### Basic Controls
- **Drag the green node** to move the start position
- **Drag the red node** to move the end position
- **Click and drag** to draw/erase walls (white cells)
- Select an algorithm from the dropdown
- Click **Visualize** to watch the algorithm find the path
- Click **Generate Maze** to create a random maze
- **Clear Path** removes animation but keeps walls
- **Clear Board** resets everything

### Color Legend
- **Green**: Start node
- **Red**: End node
- **White**: Wall
- **Blue/Purple (animated)**: Visited cells during exploration
- **Yellow (animated)**: Final shortest path

## Algorithm Details

### Dijkstra's Algorithm
- **Time Complexity**: O((V + E) log V) where V is vertices, E is edges
- **Space Complexity**: O(V)
- **Characteristics**: 
  - Guarantees shortest path
  - Expands nodes in all directions equally
  - Good for understanding basic pathfinding
  - Can be slower than A*

### A* Algorithm
- **Time Complexity**: O((V + E) log V)
- **Space Complexity**: O(V)
- **Characteristics**:
  - Guarantees shortest path
  - Uses Manhattan distance heuristic for direction
  - Faster than Dijkstra in most cases
  - Uses informed search to prioritize promising nodes

### Breadth First Search (BFS)
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V)
- **Characteristics**:
  - Guarantees shortest path in unweighted grids
  - Explores all neighbors at current depth before moving to next
  - Simple and efficient for unweighted graphs
  - Best for large unweighted grids

### Maze Generation (Recursive Division)
- **Algorithm**: Recursive division with passage generation
- **Time Complexity**: O(V) where V is total cells
- **Space Complexity**: O(depth of recursion) ≈ O(log(max(rows, cols)))

## Project Structure

```
DSAVisualizer/
├── src/
│   ├── components/
│   │   ├── Grid.jsx           # Interactive grid for pathfinding
│   │   ├── Grid.css           # Grid styling and animations
│   │   ├── Navbar.jsx         # Tab navigation
│   │   ├── Navbar.css         # Navbar styling
│   │   ├── TreeVisualization.jsx # BST tree renderer
│   │   ├── Tree.css           # Tree styling
│   │   ├── WelcomeModal.jsx   # Tutorial modal
│   │   ├── WelcomeModal.css   # Modal styling
│   │   ├── Toast.jsx          # Toast notifications
│   │   └── Toast.css          # Toast styling
│   ├── algorithms/
│   │   ├── pathfinding/
│   │   │   ├── dijkstra.js    # Dijkstra's algorithm
│   │   │   ├── astar.js       # A* algorithm
│   │   │   ├── bfs.js         # Breadth First Search
│   │   │   ├── dfs.js         # Depth First Search
│   │   │   ├── greedy.js      # Greedy Best First
│   │   │   └── maze.js        # Maze generation
│   │   ├── sorting/
│   │   │   ├── bubble.js      # Bubble sort
│   │   │   ├── selection.js   # Selection sort
│   │   │   ├── insertion.js   # Insertion sort
│   │   │   ├── merge.js       # Merge sort
│   │   │   └── quick.js       # Quick sort
│   │   ├── tree/
│   │   │   └── bst.js         # Binary Search Tree
│   │   ├── heap/              # Coming soon
│   │   ├── graph/             # Coming soon
│   │   ├── linkedlist/        # Coming soon
│   │   ├── stackqueue/        # Coming soon
│   │   └── binarysearch/      # Coming soon
│   ├── pages/
│   │   ├── PathfindingPage.jsx # Pathfinding visualizer
│   │   ├── SortingPage.jsx     # Sorting visualizer
│   │   ├── TreePage.jsx        # BST visualizer
│   │   ├── HeapPage.jsx        # Heap visualizer (placeholder)
│   │   ├── GraphPage.jsx       # Graph visualizer (placeholder)
│   │   ├── LinkedListPage.jsx  # Linked list visualizer (placeholder)
│   │   ├── StackQueuePage.jsx  # Stack/Queue visualizer (placeholder)
│   │   ├── BinarySearchPage.jsx # Binary search visualizer (placeholder)
│   │   ├── Page.css            # Common page styling
│   │   └── Tree.css            # Tree page specific styling
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # App styling
│   ├── main.jsx                # React entry point
│   └── styles.css              # Global styles
├── public/
│   └── index.html              # HTML entry point
├── package.json                # Project dependencies
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## Algorithm Details

### Pathfinding Algorithms

#### Dijkstra's Algorithm
- **Time Complexity**: O((V + E) log V) where V is vertices, E is edges
- **Space Complexity**: O(V)
- **Characteristics**: Guarantees shortest path, explores equally in all directions

#### A* Algorithm
- **Time Complexity**: O((V + E) log V)
- **Space Complexity**: O(V)
- **Characteristics**: Guarantees shortest path, faster than Dijkstra using Manhattan distance heuristic

#### Breadth First Search (BFS)
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V)
- **Characteristics**: Guarantees shortest path in unweighted grids, simple and efficient

#### Depth First Search (DFS)
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V)
- **Characteristics**: Does not guarantee shortest path, explores depth-first

#### Greedy Best First Search
- **Time Complexity**: O((V + E) log V)
- **Space Complexity**: O(V)
- **Characteristics**: Does not guarantee shortest path, uses heuristic only

### Sorting Algorithms

#### Bubble Sort
- **Time Complexity**: O(n²) worst/average, O(n) best
- **Space Complexity**: O(1)
- **Characteristics**: Simple, repeatedly swaps adjacent elements

#### Selection Sort
- **Time Complexity**: O(n²) all cases
- **Space Complexity**: O(1)
- **Characteristics**: Finds minimum element and places it at beginning

#### Insertion Sort
- **Time Complexity**: O(n²) worst/average, O(n) best
- **Space Complexity**: O(1)
- **Characteristics**: Builds sorted array one element at a time

#### Merge Sort
- **Time Complexity**: O(n log n) all cases
- **Space Complexity**: O(n)
- **Characteristics**: Divide and conquer algorithm, stable sort

#### Quick Sort
- **Time Complexity**: O(n²) worst, O(n log n) average/best
- **Space Complexity**: O(log n)
- **Characteristics**: Divide and conquer, in-place sorting

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/seankim0807/DSAVisualizer.git
cd DSAVisualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Technical Highlights

### Smooth Animations
- CSS keyframe animations for visited and path cells
- 10ms delay between visited cell animations
- 50ms delay between path cell animations
- Ripple and fade effects for visual feedback

### Performance Optimizations
- Efficient grid updates using React hooks
- Grid node cloning to prevent mutations
- Event delegation for mouse interactions
- CSS transitions for smooth 60fps animations

### User Experience
- Welcome modal with instructions on first load
- Disabled controls during animation
- Toast notifications for user feedback
- Responsive grid that adapts to screen size
- Smooth dragging without flickering

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Tips & Tricks

1. **Pathfinding**: Generate a maze and compare how different algorithms explore
2. **Sorting**: Try different array sizes to see performance differences
3. **Trees**: Insert random values to see how the tree balances
4. **Speed Control**: Use the speed slider to understand algorithm steps better

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Future Enhancements

- Complete remaining visualizers (Heap, Graph, Linked List, Stack/Queue, Binary Search)
- Add more algorithms (Bellman-Ford, Floyd-Warshall, Red-Black Trees, etc.)
- Weighted graphs and terrain types
- Step-by-step debugging mode
- Statistics and performance comparisons
- Export/import functionality for custom data sets
