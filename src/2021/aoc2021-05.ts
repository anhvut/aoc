export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

const nbs = lines.filter(Boolean).map((l) =>
  l
    .split(' -> ')
    .flatMap((x) => x.split(','))
    .map((x) => parseInt(x, 10))
);

const part = (diag: boolean) => {
  let nb2 = 0;
  const diagram: Record<string, number> = {};
  const mark = (x: number, y: number) => {
    const key = `${x}_${y}`;
    const newNb = (diagram[key] ?? 0) + 1;
    if (newNb === 2) nb2++;
    diagram[key] = newNb;
  };
  const markLine = (x1: number, y1: number, x2: number, y2: number, xIncr: number, yIncr: number) => {
    while (x1 !== x2 || y1 !== y2) {
      mark(x1, y1);
      x1 += xIncr;
      y1 += yIncr;
    }
    mark(x2, y2);
  };
  for (const [x1, y1, x2, y2] of nbs) {
    const xDiff = x2 - x1;
    const yDiff = y2 - y1;
    const xIncr = xDiff ? xDiff / Math.abs(xDiff) : 0;
    const yIncr = yDiff ? yDiff / Math.abs(yDiff) : 0;
    if (!xDiff || !yDiff) markLine(x1, y1, x2, y2, xIncr, yIncr);
    else if (diag && Math.abs(xDiff) === Math.abs(yDiff)) markLine(x1, y1, x2, y2, xIncr, yIncr);
  }
  return nb2;
};

console.log(part(false));
console.log(part(true));
