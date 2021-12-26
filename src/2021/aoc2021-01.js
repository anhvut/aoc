const fs = require('fs');

const lines = fs.readFileSync(__dirname + '/aoc2021-01.txt', 'utf-8').split(/\r?\n/);
const nbs = lines.map(b => parseInt(b));

const part0 = (arr) => arr.reduce((agg, c, i) => agg + (i > 0 && c > arr[i-1] ? 1 : 0), 0);

const part1 = () => part0(nbs);

const nbs2 = nbs.map((x, i) => nbs[i-2]+nbs[i-1]+nbs[i]).slice(2);
const part2 = () => part0(nbs2)

console.log(part1());
console.log(part2());
