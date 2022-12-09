export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);
const nbs = lines.map((b) => parseInt(b));

const part0 = (arr: number[]) => arr.reduce((agg, c, i) => agg + (i > 0 && c > arr[i - 1] ? 1 : 0), 0);

const part1 = () => part0(nbs);

const nbs2 = nbs.map((x, i) => nbs[i - 2] + nbs[i - 1] + x).slice(2);
const part2 = () => part0(nbs2);

console.log(part1());
console.log(part2());
