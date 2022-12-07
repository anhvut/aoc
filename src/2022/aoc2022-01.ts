export {};
const fs = require('fs');
const nbs: number[] = fs
  .readFileSync(__dirname + '/aoc2022-01.txt', 'utf-8')
  .split(/\n/g)
  .reduce(
    (agg, line) => {
      line ? (agg[agg.length - 1] += +line) : agg.push(0);
      return agg;
    },
    [0]
  );

const part1 = (n = nbs) => n.reduce((a, b) => Math.max(a, b));

const part2 = () => {
  const nbs2 = nbs.slice().sort((a, b) => b - a);
  return nbs2[0] + nbs2[1] + nbs2[2];
};

console.log(part1());
console.log(part2());
