export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

type MAZE = number[][];
type POINT = [number, number];
type POINT_STR = `${number}_${number}`;

const maze: MAZE = lines.map((x) => Array.from(x).map((y) => +y));

const extendMaze = (maze: MAZE) => {
  const extendPoint = (n: number, i: number) => {
    const v = n + i;
    return v >= 10 ? v - 9 : v;
  };
  const newMaze = maze.map((nbs) => {
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
};

const asKey = ([x, y]: POINT): POINT_STR => `${x}_${y}`;
const fromKey = (s: POINT_STR): POINT => s.split('_').map((x) => +x) as POINT;

function reconstructPath(cameFrom: Record<POINT_STR, POINT_STR>, currentKey: POINT_STR) {
  const totalPath = [currentKey];
  let prev = cameFrom[currentKey];
  while (prev) {
    currentKey = prev;
    totalPath.unshift(currentKey);
    prev = cameFrom[currentKey];
  }
  return totalPath;
}

function aStar(start: POINT, goal: POINT, h: (p: POINT) => number, maze: MAZE) {
  const ex = maze[0].length - 1;
  const ey = maze.length - 1;
  const INF = 100 * maze[0].length * maze.length;

  function* findNeighbors(currentKey: POINT_STR): Generator<POINT> {
    const [x, y] = fromKey(currentKey);
    if (x > 0) yield [x - 1, y];
    if (x < ex) yield [x + 1, y];
    if (y > 0) yield [x, y - 1];
    if (y < ey) yield [x, y + 1];
  }

  const startKey = asKey(start);
  const goalKey = asKey(goal);
  const openSet: Record<POINT_STR, boolean> = { [startKey]: true };
  const cameFrom: Record<POINT_STR, POINT_STR> = {};
  const gScore = { [startKey]: 0 };
  const fScore = { [startKey]: h(start) };
  let openSetKeys = Object.keys(openSet) as POINT_STR[];
  while (openSetKeys.length > 0) {
    let currentKey: POINT_STR,
      currentScore = INF;
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
    openSetKeys = Object.keys(openSet) as POINT_STR[];
  }
  return INF;
}

const dijkstra = (start: POINT, goal: POINT, maze: MAZE) => {
  const ex = maze[0].length - 1;
  const ey = maze.length - 1;
  const INF = 100 * maze[0].length * maze.length;

  function* findNeighbors(currentKey: POINT_STR): Generator<POINT> {
    const [x, y] = fromKey(currentKey);
    if (x > 0) yield [x - 1, y];
    if (x < ex) yield [x + 1, y];
    if (y > 0) yield [x, y - 1];
    if (y < ey) yield [x, y + 1];
  }

  const startKey = asKey(start);
  const goalKey = asKey(goal);
  const distanceTo: Record<POINT_STR, number> = { [startKey]: 0 };
  const comeFrom: Record<POINT_STR, POINT_STR> = {};

  const queue = [startKey];
  while (queue.length > 0) {
    const currentKey = queue.shift();
    const distanceToCurrent = distanceTo[currentKey];
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

const part = (maze: MAZE) => {
  const ex = maze[0].length - 1;
  const ey = maze.length - 1;
  // const path = aStar([0, 0], [ex, ey], ([x, y]) => maze[y][x] + (ex-x) + (ey-y), maze);
  const path = dijkstra([0, 0], [ex, ey], maze);
  let score = -maze[0][0];
  for (const p of path) {
    const [x, y] = fromKey(p);
    score += maze[y][x];
  }
  return score;
};

console.log(part(maze));
console.log(part(extendMaze(maze)));
