const fs = require('fs')

const lines = fs.readFileSync(__dirname + '/aoc2021-11.txt', 'utf-8').split(/\r?\n/);
const input = lines.map(x => Array.from(x).map(y => +y));
const Y = input.length;
const X = input[0].length;

const iterate = (nbs) => {
  let nbFlash = 0;
  const next = nbs.map(x => x.slice());
  for (let y = 0; y < Y; y++) {
    for (let x = 0; x < X; x++) {
      next[y][x]++;
    }
  }
  const flash = next.map(y => y.map(x => 0));
  const impact = (x, y) => {
    if (y >= 0 && y < Y && x >= 0 && x < X && !flash[y][x]) {
      next[y][x]++;
    }
  }
  let done = true;
  do {
    done = true;
    for (let y = 0; y < Y; y++) {
      for (let x = 0; x < X; x++) {
        const n = next[y][x];
        if (n > 9 && !flash[y][x]) {
          flash[y][x] = 1;
          done = false;
          nbFlash++;
          impact(x - 1, y - 1);
          impact(x, y - 1);
          impact(x + 1, y - 1);
          impact(x - 1, y);
          impact(x + 1, y);
          impact(x - 1, y + 1);
          impact(x, y + 1);
          impact(x + 1, y + 1);
        }
      }
    }
  } while (!done);
  for (let y = 0; y < Y; y++) {
    for (let x = 0; x < X; x++) {
      if (flash[y][x]) next[y][x] = 0;
    }
  }
  return [next, flash, nbFlash];
};

const part1 = () => {
  let r = 0, nbs = input, nb;
  for (let i = 0; i < 100; i++) {
    [nbs, , nb] = iterate(nbs);
    r += nb;
  }
  return r;
}

const part2 = () => {
  let i = 0, nbs = input, flash;
  do {
    i++;
    [nbs, flash] = iterate(nbs);
  } while (flash.some(x => x.some(y => !y)));
  return i;
};

console.log(part1());
console.log(part2());
