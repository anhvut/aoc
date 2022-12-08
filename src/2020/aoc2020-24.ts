export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

const instructions: string[][] = lines.map((line) => {
  const result = [];
  let position = 0;
  while (position < line.length) {
    const c = line[position];
    const size = c === 'e' || c === 'w' ? 1 : 2;
    result.push(line.slice(position, position + size));
    position += size;
  }
  return result;
});

const getNextPosition = (x: number, y: number, instruction: string): [number, number] => {
  switch (instruction) {
    case 'e':
      x++;
      break;
    case 'w':
      x--;
      break;
    case 'ne':
      y++;
      if (Math.abs(y) % 2 === 1) x++;
      break;
    case 'se':
      y--;
      if (Math.abs(y) % 2 === 1) x++;
      break;
    case 'nw':
      y++;
      if (Math.abs(y) % 2 === 0) x--;
      break;
    case 'sw':
      y--;
      if (Math.abs(y) % 2 === 0) x--;
      break;
  }
  return [x, y];
};

const toKey = (x: number, y: number) => `${x}_${y}`;
const fromKey = (k: string) => k.split('_').map((x) => +x);

function getInitialMap() {
  const map: Record<string, number> = {};
  for (const line of instructions) {
    const [x, y] = line.reduce(([x, y], instruction) => getNextPosition(x, y, instruction), [0, 0]);
    const key = toKey(x, y);
    if (map[key]) delete map[key];
    else map[key] = 1;
  }
  return map;
}

const part1 = () => {
  return Object.values(getInitialMap()).length;
};

const getNeighbors = (x: number, y: number) => [
  getNextPosition(x, y, 'w'),
  getNextPosition(x, y, 'e'),
  getNextPosition(x, y, 'nw'),
  getNextPosition(x, y, 'ne'),
  getNextPosition(x, y, 'sw'),
  getNextPosition(x, y, 'se'),
];

const part2 = (nb = 100) => {
  let map = getInitialMap();
  for (let i = 0; i < nb; i++) {
    const nextMap: Record<string, number> = {};
    const positions = Object.keys(map).map(fromKey);
    const [xMin, yMin, xMax, yMax] = positions.reduce(
      ([xMin, yMin, xMax, yMax], [x, y]) => [
        Math.min(xMin, x - 1),
        Math.min(yMin, y - 1),
        Math.max(xMax, x + 1),
        Math.max(yMax, y + 1),
      ],
      [Infinity, Infinity, -Infinity, -Infinity]
    );

    for (let y = yMin; y <= yMax; y++) {
      for (let x = xMin; x <= xMax; x++) {
        const neighbors = getNeighbors(x, y);
        const count = neighbors.map(([x, y]) => map[toKey(x, y)] ?? 0).reduce((a, b) => a + b);
        let value = map[toKey(x, y)] ?? 0;
        if (value && (count === 0 || count > 2)) value = 0;
        else if (count === 2) value = 1;
        if (value) nextMap[toKey(x, y)] = value;
      }
    }
    map = nextMap;
  }
  return Object.values(map).length;
};

console.log(part1());
console.log(part2());
