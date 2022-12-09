export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

type POINT = [number, number];
const points: POINT[] = [];
type FOLD = [string, number];
const folds: FOLD[] = [];

lines.forEach((x) => {
  if (x.includes(',')) {
    points.push(x.split(',').map((y) => parseInt(y)) as POINT);
  } else if (x.includes('=')) {
    folds.push(
      x
        .slice('fold along '.length)
        .split('=')
        .map((y, i) => (i === 1 ? parseInt(y) : y)) as FOLD
    );
  }
});

const doFold = (points: POINT[], fold: FOLD): POINT[] => {
  const mark: Record<string, boolean> = {};
  const result: POINT[] = [];
  for (const [x0, y0] of points) {
    const x = fold[0] === 'x' && x0 > fold[1] ? fold[1] * 2 - x0 : x0;
    const y = fold[0] === 'y' && y0 > fold[1] ? fold[1] * 2 - y0 : y0;
    const key = `${x}_${y}`;
    if (!mark[key]) {
      mark[key] = true;
      result.push([x, y]);
    }
  }
  return result;
};

const part1 = () => {
  const fold = folds[0];
  const foldedPoints = doFold(points, fold);
  return foldedPoints.length;
};

const part2 = () => {
  let foldedPoints = points;
  for (const fold of folds) {
    foldedPoints = doFold(foldedPoints, fold);
  }
  const [X, Y] = foldedPoints.reduce(([X, Y], [x, y]) => [Math.max(x, X), Math.max(y, Y)], [0, 0]);
  const v = Array(Y + 1)
    .fill(0)
    .map(() => Array(X + 1).fill('.'));
  for (const [x, y] of foldedPoints) v[y][x] = '#';
  for (const y of v) console.log(y.join(''));
};

console.log(part1());
part2();
