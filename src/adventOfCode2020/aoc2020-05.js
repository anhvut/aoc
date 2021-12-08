const fs = require('fs');

const lines = fs.readFileSync('aoc2020-05.txt', 'utf-8').split(/\r?\n/);
const nbs = lines.map(b => parseInt(b.replace(/[FL]/g, '0').replace(/[BR]/g, '1'), 2)).sort((a, b) => +a - +b);

const part1 = () => nbs[nbs.length - 1];
const part2 = () => nbs.find((n, i) => i > 0 && n !== nbs[i-1] + 1) - 1;

console.log(part1());
console.log(part2());