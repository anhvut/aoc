export {};
import fs from 'fs';
const nbs: number[] = fs
  .readFileSync(__dirname + '/aoc2019-01.txt', 'utf-8')
  .split(/\n/g)
  .map((x) => +x);

const toFuel = (n: number): number => Math.floor(n / 3) - 2;

const toTotalFuel = (n: number): number => {
  let result = 0;
  n = toFuel(n);
  while (n > 0) {
    result += n;
    n = toFuel(n);
  }
  return result;
};

const part = (fct: (nb: number) => number): number => nbs.map(fct).reduce((a, b) => a + b);

console.log(part(toFuel));
console.log(part(toTotalFuel));
