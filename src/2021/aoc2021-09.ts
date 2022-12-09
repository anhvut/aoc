export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);
const input = lines.map((l) => Array.from(l).map((x) => +x));

const evaluateAround = (fct: (n: number, x: number, y: number) => boolean, n: number, x: number, y: number) =>
  fct(n, x - 1, y) && fct(n, x + 1, y) && fct(n, x, y - 1) && fct(n, x, y + 1);

function* findLowPoints() {
  const isLower = (n: number, x: number, y: number) => {
    const m = input[y]?.[x];
    return m == null || n < m;
  };
  for (let y = 0; y < input.length; y++)
    for (let x = 0; x < input[0].length; x++) {
      const n = input[y][x];
      if (evaluateAround(isLower, n, x, y)) yield [x, y, n];
    }
}

const part1 = () => {
  return [...findLowPoints()].reduce((r, [, , n]) => r + n + 1, 0);
};

const part2 = () => {
  const lengths = [];
  for (const [x0, y0] of findLowPoints()) {
    const marks: Record<`${number}_${number}`, boolean> = {};
    const mark = (x: number, y: number) => (marks[`${x}_${y}`] = true);
    const marked = (x: number, y: number) => marks[`${x}_${y}`];
    mark(x0, y0);
    const isLower = (n: number, x: number, y: number) => {
      const m = input[y]?.[x];
      return m == null || marked(x, y) || n <= m;
    };
    let bfs = [
      [x0 - 1, y0],
      [x0 + 1, y0],
      [x0, y0 - 1],
      [x0, y0 + 1],
    ];
    while (bfs.length > 0) {
      const nextBfs: Array<[number, number]> = [];
      const addToBfs = (x: number, y: number) => {
        const m = input[y]?.[x];
        if (m != null && m !== 9 && !marked(x, y)) {
          nextBfs.push([x, y]);
        }
      };
      for (const [x, y] of bfs) {
        const n = input[y]?.[x];
        if (n != null && !marked(x, y) && evaluateAround(isLower, n, x, y)) {
          mark(x, y);
          addToBfs(x - 1, y);
          addToBfs(x + 1, y);
          addToBfs(x, y - 1);
          addToBfs(x, y + 1);
        }
      }
      bfs = nextBfs;
    }
    lengths.push(Object.values(marks).length);
  }
  lengths.sort((a, b) => b - a);
  return lengths.slice(0, 3).reduce((a, l) => a * l, 1);
};

console.log(part1());
console.log(part2());
