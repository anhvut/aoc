export {};
import fs from 'fs';

const input: string[] = fs
  .readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8')
  .trim()
  .split(/\r?\n/g);

const parse = (input: string[]) => {
  return input.map((s) =>
    s
      .match(/^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/)
      .slice(1)
      .map((x) => +x)
  );
};

const part1 = (input: string[]) => {
  const lines = parse(input);
  const [maxX, maxY] = lines.reduce(
    ([a, b], [_id, x, y, w, h]) => [Math.max(a, x + w + 1), Math.max(b, y + h + 1)],
    [0, 0]
  );
  const map = Array(maxY)
    .fill(0)
    .map(() => Array(maxX).fill(0));
  for (const [_id, x, y, w, h] of lines)
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++)
        map[y + j][x + i]++;
  let result = 0;
  for (let j = 0; j < maxY; j++) for (let i = 0; i < maxX; i++) result += Number(map[j][i] > 1);
  return result;
};

type N = number;
const between = (xb: N, x: N, xeExcl: N) => xb <= x && x < xeExcl;
const intersects = (xb1: N, xeExcl1: N, xb2: N, xeExcl2: N) => between(xb1, xb2, xeExcl1) || between(xb2, xb1, xeExcl2);
const intersects2D = (x: N, y: N, xe: N, ye: N, x2: N, y2: N, xe2: N, ye2: N) =>
  intersects(x, xe, x2, xe2) && intersects(y, ye, y2, ye2);

const part2 = (input: string[]) => {
  const lines = parse(input);
  const overlap: Record<number, boolean> = {};
  for (let i = 0; i < input.length; i++) {
    const [id, x, y, w, h] = lines[i];
    for (let j = i + 1; j < input.length; j++) {
      const [id2, x2, y2, w2, h2] = lines[j];
      if (intersects2D(x, y, x + w, y + h, x2, y2, x2 + w2, y2 + h2)) overlap[id] = overlap[id2] = true;
    }
  }
  return lines.find(([x]) => !overlap[x])[0];
};

console.time('part 1');
console.log(part1(input));
console.timeEnd('part 1');
console.time('part 2');
console.log(part2(input));
console.timeEnd('part 2');
