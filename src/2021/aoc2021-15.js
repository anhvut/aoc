const fs = require('fs')

const lines = fs.readFileSync(__dirname + '/aoc2021-15.txt', 'utf-8').split(/\r?\n/);
const maze = lines.map(x => Array.from(x).map(y => +y));

const extendMaze = (maze) => {
  const extendPoint = (n, i) => {
    const v = n + i;
    return v >= 10 ? v - 9 : v;
  }
  const newMaze = maze.map(nbs => {
    const result = [];
    for (let i = 0; i < 5; i++) {
      for (const n of nbs) {
        result.push(extendPoint(n, i));
      }
    }
    return result;
  });
  const originalY = maze.length;
  const newX = newMaze[0].length;
  for (let i = 1; i < 5; i++) {
    for (let y = 0; y < originalY; y++) {
      const line = [];
      for (let x = 0; x < newX; x++) {
        line.push(extendPoint(newMaze[y][x], i));
      }
      newMaze.push(line);
    }
  }
  return newMaze;
}

const asKey = ([x, y]) => `${x}_${y}`;
const fromKey = (s) => s.split('_').map(x => +x);

function reconstructPath(cameFrom, currentKey) {
  const totalPath = [currentKey];
  let prev = cameFrom[currentKey];
  while (prev) {
    currentKey = prev;
    totalPath.unshift(currentKey);
    prev = cameFrom[currentKey];
  }
  return totalPath;
}

function aStar(start, goal, h, maze) {
  const ex = maze[0].length-1;
  const ey = maze.length-1;
  const INF = 100 * maze[0].length * maze.length;

  function *findNeighbors(currentKey) {
    const [x, y] = fromKey(currentKey);
    if (x > 0) yield [x-1, y];
    if (x < ex) yield [x+1, y];
    if (y > 0) yield [x, y-1];
    if (y < ey) yield [x, y+1];
  }

  const startKey = asKey(start);
  const goalKey = asKey(goal);
  const openSet = {[startKey]: true};
  const cameFrom = {};
  const gScore = {[startKey]: 0};
  const fScore = {[startKey]: h(start)};
  let openSetKeys = Object.keys(openSet);
  while (openSetKeys.length > 0) {
    let currentKey = '', currentScore = INF;
    for (const key of openSetKeys) {
      const score = fScore[key] ?? INF;
      if (score < currentScore) {
        currentKey = key;
        currentScore = score;
      }
    }
    if (currentKey === goalKey) return reconstructPath(cameFrom, currentKey);
    delete openSet[currentKey];
    const gScoreCurrent = gScore[currentKey] ?? INF;
    for (const neighbor of findNeighbors(currentKey)) {
      const neighborKey = asKey(neighbor);
      const dCurrentNeighbor = maze[neighbor[1]][neighbor[0]];
      const tentativeGScore = gScoreCurrent + dCurrentNeighbor;
      if (tentativeGScore < (gScore[neighborKey] ?? INF)) {
        cameFrom[neighborKey] = currentKey;
        gScore[neighborKey] = tentativeGScore;
        fScore[neighborKey] = tentativeGScore + h(neighbor);
        if (!openSet[neighborKey]) openSet[neighborKey] = true;
      }
    }
    openSetKeys = Object.keys(openSet);
  }
  return INF;
}

const dijkstra = (start, goal, maze) => {
  const ex = maze[0].length-1;
  const ey = maze.length-1;
  const INF = 100 * maze[0].length * maze.length;

  function *findNeighbors(currentKey) {
    const [x, y] = fromKey(currentKey);
    if (x > 0) yield [x-1, y];
    if (x < ex) yield [x+1, y];
    if (y > 0) yield [x, y-1];
    if (y < ey) yield [x, y+1];
  }

  const startKey = asKey(start);
  const goalKey = asKey(goal);
  const distanceTo = {[startKey]: 0};
  const comeFrom = {};

  const queue = [startKey];
  while (queue.length > 0) {
    const currentKey = queue.shift();
    let distanceToCurrent = distanceTo[currentKey];
    for (const neighbor of findNeighbors(currentKey)) {
      const neighborKey = asKey(neighbor);
      const d = maze[neighbor[1]][neighbor[0]];
      const dTotal = distanceToCurrent + d;
      if (dTotal < (distanceTo[neighborKey] ?? INF)) {
        distanceTo[neighborKey] = dTotal;
        comeFrom[neighborKey] = currentKey;
        let i = 0;
        while (i < queue.length && dTotal > distanceTo[queue[i]]) i++;
        queue.splice(i, 0, neighborKey);
      }
    }
  }
  return reconstructPath(comeFrom, goalKey);
};

const part = (maze) => {
  const ex = maze[0].length-1;
  const ey = maze.length-1;
  // const path = aStar([0, 0], [ex, ey], ([x, y]) => maze[y][x] + (ex-x) + (ey-y), maze);
  const path = dijkstra([0, 0], [ex, ey], maze);
  let score = -maze[0][0];
  for (const p of path) {
    const [x, y] = fromKey(p);
    score += maze[y][x];
  }
  return score;
}

console.log(part(maze));
console.log(part(extendMaze(maze)));
