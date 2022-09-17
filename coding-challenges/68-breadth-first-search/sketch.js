const EDGE_LEN = 100
const NODE_SPACE = 100
const EDGE_FORCE = 0.4
const SPACE_FORCE = 0.15

const KEVIN_BACON = 'Kevin Bacon';
const DEFAULT_OPTION = '--';

let camera

let graph
let inputData

let nodes = []
let pullStrength = 1

let actorDropdown

let solution = []

function preload() {
  inputData = loadJSON('./assets/kevinbacon.json')
}

function setup() {
  createCanvas(1000, 800);
  
  camera = new Camera2D(createVector(0, 0), 1, 0.5, 3.0);
  
  createP('Actor to find:');
  actorDropdown = createSelect();
  actorDropdown.option(DEFAULT_OPTION);
  actorDropdown.changed(breadthFirstSearch);
  
  graph = new Graph();
  const actorNames = [];
  
  for (let i = 0; i < inputData.movies.length; i++) {
    const movie = inputData.movies[i];
    const position = createVector(0, -200).rotate(TWO_PI / inputData.movies.length * i);
    const movieNode = new Node(movie.title, position, true);
    graph.add(movieNode);
    
    movie.cast.forEach(actor => {
      let actorNode = graph.find(actor);
      
      if (actorNode === undefined) {
        actorNode = new Node(actor, position);
        graph.add(actorNode);

        if (actor !== KEVIN_BACON) {
          actorNames.push(actor);
        }
      }
      
      actorNode.addEdge(movieNode);
      movieNode.addEdge(actorNode);
    })
  }
  
  nodes = Object.values(graph.graph);

  actorNames.sort().forEach(actor => actorDropdown.option(actor));
}

function draw() {
  background(42);
  
  camera.apply();
  
  // Gradually stop the graph settling to prevent infinite spinning/twitching
  pullStrength = max(0, pullStrength - 0.0005);
  
  nodes.forEach(nodeA => {
    nodes.forEach(nodeB => {
      if (nodeA === nodeB) {
        return
      }
      
      const a = nodeA.position;
      const b = nodeB.position;
      const isNeighbor = nodeA.edges.includes(nodeB);
        
      // If the nodes are already far enough apart, don't pull them together
      if (!isNeighbor && p5.Vector.dist(a, b) > NODE_SPACE) {
        return;
      }
      
      const mid = p5.Vector.add(a, b).mult(0.5);
      const len = (isNeighbor ? EDGE_LEN : NODE_SPACE);
      
      const a2 = p5.Vector.add(mid, p5.Vector.sub(a, mid).setMag(len / 2));
      const b2 = p5.Vector.add(mid, p5.Vector.sub(b, mid).setMag(len / 2));
      
      const force = (isNeighbor ? EDGE_FORCE : SPACE_FORCE) * pullStrength;
      nodeA.position = p5.Vector.lerp(a, a2, force);
      nodeB.position = p5.Vector.lerp(b, b2, force);
    })
  })
  
  // Find the longest distance between two nodes
  let longest = { a: null, b: null, len: 0 }
  for (let i = 0; i < nodes.length; i++) {
    const nodeA = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeB = nodes[j];
      const dist = p5.Vector.dist(nodeA.position, nodeB.position);
      if (dist > longest.len) {
        longest.len = dist;
        longest.a = nodeA;
        longest.b = nodeB;
      }
    }
  }
    
  // Determine which one is on the left
  let left, right;
  if (longest.a.position.x < longest.b.position.x) {
    left = longest.a.position;
    right = longest.b.position;
  } else {
    left = longest.b.position;
    right = longest.a.position;
  }
      
  // Rotate the whole graph to put the longest distance along the x-axis (to fit within the screen)
  const delta = p5.Vector.sub(right, left);
  const angle = atan2(delta.y, delta.x);
      
  nodes.forEach(node => node.position.rotate(-angle * 0.05 * pullStrength));
  
  graph.draw(solution);
}
                  
function mouseDragged() {
  camera.onMouseDragged();
}
    
function mouseWheel(event) {
  camera.onMouseWheel(event);
}
    
function breadthFirstSearch() {
  const start = actorDropdown.value();
  const end = KEVIN_BACON;

  if (start === DEFAULT_OPTION) {
    solution = [];
    return;
  }
  
  const startNode = graph.find(start);
  const endNode = graph.find(end);
  
  if (startNode === undefined) {
    console.error(`${start} not found in graph, search failed`);
    return;
  }
    
  if (endNode === undefined) {
    console.error(`${end} not found in graph, search failed`);
    return;
  }
    
  const searched = [];
  const nodeQueue = [{ node: startNode, parent: null }];
  
  while (nodeQueue.length > 0) {
    const next = nodeQueue.splice(0, 1)[0];
    
    searched.push(next.node);
    
    if (next.node.value === end) {
      solution = [];
      let parent = next;
      while (parent !== null) {
        solution.splice(0, 0, parent.node);
        parent = parent.parent;
      }
      return;
    }
      
    for (let i = 0; i < next.node.edges.length; i++) {
      const neighbor = next.node.edges[i];
      if (!searched.includes(neighbor)) {
        nodeQueue.push({ node: neighbor, parent: next });
      }
    }
  }
}
