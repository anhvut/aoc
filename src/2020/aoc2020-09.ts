export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

const nbs = lines.map((x) => +x);
const PREAMBLE = 25;

const part1 = () => {
  return nbs.find((nb, i) => {
    if (i < PREAMBLE) {
      return false;
    }
    const buffer = nbs.slice(i - PREAMBLE, i);
    return !buffer.find((a, ia) => buffer.find((b, ib) => a + b === nb && ia !== ib));
  });
};

const part2 = () => {
  const nb = part1();
  const i = nbs.indexOf(nb);
  const buffer = nbs.slice(0, i);
  for (let ia = 0; ia < buffer.length; ia++) {
    for (let ib = ia + 1; ib <= buffer.length; ib++) {
      const subBuffer = buffer.slice(ia, ib);
      const sum = subBuffer.reduce((agg, x) => agg + x, 0);
      if (sum === nb) {
        const min = subBuffer.reduce((agg, x) => Math.min(agg, x));
        const max = subBuffer.reduce((agg, x) => Math.max(agg, x));
        return min + max;
      }
      if (sum > nb) {
        break;
      }
    }
  }
  return 0;
};

console.log(part1());
console.log(part2());
