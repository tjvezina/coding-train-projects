const CANVAS_WIDTH = 700
const CELL_COUNT = 32
const CELL_SIZE = CANVAS_WIDTH / CELL_COUNT

let subtitle
let nextButton

let currentStep = -1
const steps = []

const graphics = {}

let voronoiOffsets
let voronoiPoints
let triangles
let edgeMap

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_WIDTH)
  strokeJoin(ROUND)
  
  const title = createP('Voronoi Mesh Generation')
  title.class('title')
  
  subtitle = createP('')
  subtitle.class('subtitle')
  
  const controlRow = createDiv()
  controlRow.class('control-row')
  
  const restartButton = createButton('Restart')
  restartButton.parent(controlRow)
  restartButton.mousePressed(onRestart)
  
  nextButton = createButton('Next')
  nextButton.parent(controlRow)
  nextButton.mousePressed(runNextStep)
  
  steps.push({ name: 'Divide into cells', run: stepDivide })
  steps.push({ name: 'Add points', run: stepAddPoints })
  steps.push({ name: 'Randomize points', run: stepRandomizePoints })
  steps.push({ name: 'Delaunay triangulation', run: stepDelaunayTriangulation })
  steps.push({ name: 'Find circumcenters', run: stepCircumcenters })
  steps.push({ name: 'Connect neighbors', run: stepVoronoi })
  steps.push({ name: 'Voronoi graph', run: stepFinal })
  
  runNextStep()
}

function draw() {
  background(42)
  
  Object.values(graphics).sort((a, b) => a.order - b.order).forEach(g => g.draw())
}

function onRestart() {
  Object.keys(graphics).forEach(k => delete graphics[k])
  nextButton.removeAttribute('disabled')
  currentStep = -1
  runNextStep()
}

function runNextStep() {
  if (++currentStep === steps.length - 1) {
    nextButton.attribute('disabled', true)
  }
  
  const step = steps[currentStep]
  subtitle.html(`${currentStep + 1}. ${step.name}`)
  step.run()
}

function stepDivide() {
  graphics.grid = {
    order: 50,
    draw() {
    noFill()
      strokeWeight(2)
      stroke(200, 0, 0, 128)
      for (let i = 1; i < CELL_COUNT; i++) {
        line(i*CELL_SIZE, 0, i*CELL_SIZE, height)
        line(0, i*CELL_SIZE, width, i*CELL_SIZE)
      }
    }
  }
}

function stepAddPoints() {
  graphics.points = {
    order: 40,
    draw() {
    noFill()
      strokeWeight(5)
      stroke(255)
      for (let y = 0; y < CELL_COUNT; y++) {
        for (let x = 0; x < CELL_COUNT; x++) {
          point(CELL_SIZE * (x+0.5), CELL_SIZE * (y+0.5))
        }
      }
    }
  }
}

function stepRandomizePoints() {
  voronoiOffsets = new Array(CELL_COUNT)
  voronoiPoints = new Array(CELL_COUNT)
  for (let x = 0; x < CELL_COUNT; x++) {
    voronoiOffsets[x] = new Array(CELL_COUNT)
    voronoiPoints[x] = new Array(CELL_COUNT)
    for (let y = 0; y < CELL_COUNT; y++) {
      const offset = createVector(0, 0)
      
      const a = random(TWO_PI)
      const r = random(1)
      offset.set(cos(a) * r * 0.5 + 0.5, sin(a) * r * 0.5 + 0.5)
      
      voronoiOffsets[x][y] = offset
      voronoiPoints[x][y] = createVector(x + offset.x, y + offset.y).mult(CELL_SIZE)
      
      // voronoiPoints[x][y].set(random(width), random(height))
    }
  }
  
  graphics.points.draw = function() {
    noFill()
    strokeWeight(5)
    stroke(255)
    for (let y = 0; y < CELL_COUNT; y++) {
      for (let x = 0; x < CELL_COUNT; x++) {
        const p = voronoiPoints[x][y]
        point(p.x, p.y)
      }
    }
  }
}

// https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm
function stepDelaunayTriangulation() {
  triangles = []
  
  // Add super-triangle containing all points
  const aSuper = createVector(-1, -1)
  const bSuper = createVector(width*2, 0)
  const cSuper = createVector(0, height*2)
  addTriangle(aSuper, bSuper, cSuper)
  
  for (const col of voronoiPoints) {
    for (const p of col) {
      // Get all triangles who's circumcircle contains the next point
      const badTriangles = triangles.filter(tri => tri.circumcenter.dist(p) < tri.radius)
      
      // Get the edges forming a polygon which bounds the bad triangles
      let edges = []
      for (const badTri of badTriangles) {
        const { a, b, c } = badTri
        for (const edge of [[a, b], [b, c], [c, a]]) {
          edge.sort((a, b) => a.x - b.x)
          
          // Check whether the edge is already in the set
          let iShared = -1
          for (let i = 0; i < edges.length; i++) {
            if (edges[i][0] === edge[0] && edges[i][1] === edge[1]) {
              iShared = i
              break
            }
          }
          
          // If the edge is shared, remove both duplicates; else add it
          if (iShared === -1) {
            edges.push(edge)
          } else {
            edges.splice(iShared, 1)
          }          
        }
      }
        
      triangles = triangles.filter(tri => !badTriangles.includes(tri))
        
      // Create new triangles by connecting the point to each edge of the hole left by the bad triangles
      for (const edge of edges) {
        addTriangle(p, edge[0], edge[1])
      }
    }
  }
    
  // Remove triangles that include the original super-triangle's vertices
  triangles = triangles.filter(tri => [aSuper, bSuper, cSuper].every(p => tri.a !== p && tri.b !== p && tri.c !== p))
  
  // Remove very thin triangles from the edges of the mesh (i.e. large circumcircle)
  triangles = triangles.filter(tri => {
    return tri.radius < CELL_SIZE * sqrt(2) &&
      tri.circumcenter.x >= 0 && tri.circumcenter.x < width &&
      tri.circumcenter.y >= 0 && tri.circumcenter.y < height
  })
    
  delete graphics.grid
  graphics.delaunayTriangles = {
    order: 20,
    draw() {
      noFill()
      strokeWeight(2)
      stroke(31, 102, 184)
      beginShape(TRIANGLES)
      triangles.forEach(tri => {
        vertex(tri.a.x, tri.a.y)
        vertex(tri.b.x, tri.b.y)
        vertex(tri.c.x, tri.c.y)
      })
      endShape()
    }
  }
}
  
function stepCircumcenters() {
  delete graphics.points
  graphics.circumcenters = {
    order: 70,
    draw() {
      noFill()
      for (const tri of triangles) {
        strokeWeight(5)
        stroke(184, 108, 31)
        point(tri.circumcenter.x, tri.circumcenter.y)
        
        strokeWeight(1)
        stroke(184, 108, 31, 64)
        circle(tri.circumcenter.x, tri.circumcenter.y, tri.radius*2)
      }
    }
  }
}
  
function stepVoronoi() {
  // Find the triangle(s) shared by each Delaunay triangulation edge
  edgeMap = {}
  for (const tri of triangles) {
    for (const edge of tri.edges) {
      const id = edgeToID(edge)
      if (edgeMap[id] === undefined) {
        edgeMap[id] = { edge, triangles: [] }
      }
      
      edgeMap[id].triangles.push(tri)
    }
  }
  
  delete graphics.circumcenters
  graphics.voronoi = {
    order: 60,
    draw() {
      noFill()
      strokeWeight(2)
      stroke(184, 108, 31)
      Object.values(edgeMap).forEach(edgeData => {
        if (edgeData.triangles.length > 1) {
          const [t1, t2] = edgeData.triangles
          line(t1.circumcenter.x, t1.circumcenter.y, t2.circumcenter.x, t2.circumcenter.y)
        } else {
          const { edge } = edgeData
          const a = atan2(edge[1].y - edge[0].y, edge[1].x - edge[0].x) - PI/2
          const { circumcenter: c } = edgeData.triangles[0]
          line(c.x, c.y, c.x + cos(a) * width, c.y + sin(a) * width)
        }
      })
    }
  }
}
  
function stepFinal() {
  delete graphics.delaunayTriangles
}

function addTriangle(a, b, c) {
  let A = p5.Vector.sub(b, a).angleBetween(p5.Vector.sub(c, a))
  
  // Correct vertex order if necessary
  if (A < 0) {
    A *= -1
    
    const temp = c
    c = b
    b = temp
  }
  
  const B = p5.Vector.sub(c, b).angleBetween(p5.Vector.sub(a, b))
  const C = PI - A - B
  
  const sin2A = sin(2*A)
  const sin2B = sin(2*B)
  const sin2C = sin(2*C)
  
  const circumcenter = createVector(
    (a.x*sin2A + b.x*sin2B + c.x*sin2C) / (sin2A + sin2B + sin2C),
    (a.y*sin2A + b.y*sin2B + c.y*sin2C) / (sin2A + sin2B + sin2C)
  )
  
  const radius = a.dist(circumcenter)
  
  triangles.push({ a, b, c, A, B, C, circumcenter, radius, edges: [[a, b], [b, c], [c, a]] })
}
  
function edgeToID(edge) {
  const [a, b] = edge
  const aID = `${floor(a.x)},${floor(a.y)}`
  const bID = `${floor(b.x)},${floor(b.y)}`
  return (a.x <= b.x ? `${aID}-${bID}` : `${bID}-${aID}`)
}
  
function pointToString(p) {
  return `${floor(p.x/CELL_SIZE)},${floor(p.y/CELL_SIZE)}`
}

function triToString(tri) {
  return `${pointToString(tri.a)} - ${pointToString(tri.b)} - ${pointToString(tri.c)}`
}

function edgeToString(edge) {
  return `${pointToString(edge[0])} -> ${pointToString(edge[1])}`
}
