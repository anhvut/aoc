export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

const start = +lines[0];
const bus = lines[1]
  .split(',')
  .filter((x) => x !== 'x')
  .map((x) => +x);
const bus2 = lines[1]
  .split(',')
  .map((x, i) => (x !== 'x' ? [+x, i] : null))
  .filter((x) => !!x);

const part1 = () => {
  return bus
    .map((x) => Math.ceil(start / x) * x - start)
    .reduce(([m, r], b, i) => (b < m ? [b, b * bus[i]] : [m, r]), [start, start]);
};

const part2pre = () => {
  let mult = 1;
  let nbFound = 0;
  while (true) {
    const product = mult * 859 - 19;
    const r = product % 373;
    if (r === 373 - 50) {
      console.log(`859 * ${mult} - 19 = ${product} --- ${r - 373} [373]`);
      nbFound++;
      if (nbFound === 10) break;
    }
    mult++;
  }
  return bus2;
};

const part2 = () => {
  for (let mult = 1; ; mult++) {
    const product = mult * 320407 + 237924;
    if (bus2.every(([x, i]) => (product + i) % x === 0)) {
      return product;
    }
  }
};

console.log(part1());
console.log(part2pre());
console.time();
console.log(part2());
console.timeEnd();
