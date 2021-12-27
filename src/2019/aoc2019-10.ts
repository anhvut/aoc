export {};
const fs = require('fs');
const map: string[][] = fs.readFileSync(__filename.replace(/\.js$/, '.txt'), 'utf-8').split(/\n/g).map(x => Array.from(x));

type Point = [number, number];

const stars: Point[] = [];
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[0].length; x++) {
    if (map[y][x] === '#') stars.push([x, y]);
  }
}

const serializePoint = ([x, y]: Point): string => `${x}_${y}`;
const deserializePoint = (s: string): Point => s.split('_').map(Number) as Point;

const computeGcd = (a: number, b: number): number => {
  const r = a % b;
  if (!r) return b;
  return computeGcd(b, r);
}

const getIncrement = (x: number, y: number): Point => {
  if (x === 0) return [0, y / Math.abs(y)];
  if (y === 0) return [x / Math.abs(x), 0];
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  const gcd = computeGcd(Math.max(ax, ay), Math.min(ax, ay));
  return [x / gcd, y / gcd];
};

function getOtherPointsByIncrement(i: number): Record<string, Point[]> {
  const incrementKeys: Record<string, any> = {};
  const [x, y] = stars[i];
  for (let j = 0; j < stars.length; j++) {
    if (i === j) continue;
    const [x2, y2] = stars[j];
    const increment = getIncrement(x2 - x, y2 - y);
    const key = serializePoint(increment);
    if (!incrementKeys[key]) incrementKeys[key] = [];
    incrementKeys[key].push(stars[j]);
  }
  return incrementKeys;
}

const getBestPosition = (): [number, number] => {
  let max = 0;
  let bestIndex = -1;
  for (let i = 0; i < stars.length; i++) {
    const incrementKeys = getOtherPointsByIncrement(i);
    const candidate = Object.keys(incrementKeys).length;
    if (candidate > max) {
      max = candidate;
      bestIndex = i;
    }
  }
  return [max, bestIndex];
};

const manhattanDistance = ([x1, y1]: Point, [x2, y2]: Point): number => Math.abs(x1 - x2) + Math.abs(y1 - y2);

const part1 = (): number => getBestPosition()[0];

const part2 = (): number => {
  const bestIndex = getBestPosition()[1];
  const center = stars[bestIndex];
  const increments = getOtherPointsByIncrement(bestIndex);
  const sortedIncrementKeys = Object.keys(increments).sort((a, b) => {
    const [x1, y1] = deserializePoint(a);
    const [x2, y2] = deserializePoint(b);
    if (x1 >= 0 && x2 < 0) return -1;
    if (x1 < 0 && x2 >= 0) return 1;
    return y1/x1 - y2/x2;
  });
  let maxDepth = 0;
  for (const points of Object.values(increments)) {
    points.sort((a, b) => manhattanDistance(a, center) - manhattanDistance(b, center));
    maxDepth = Math.max(maxDepth, points.length);
  }
  const vaporizedPoints = [];
  for (let depth = 0; depth < maxDepth; depth++) {
    vaporizedPoints.push(...sortedIncrementKeys.flatMap(key => {
      const point = increments[key][depth];
      return point ? [point] : [];
    }));
  }
  return vaporizedPoints[199][0] * 100 + vaporizedPoints[199][1];
};

console.log(part1());
console.log(part2());