export {};
const fs = require('fs');

enum I1 {
  A = 'A',
  B = 'B',
  C = 'C',
}

enum I2 {
  X = 'X',
  Y = 'Y',
  Z = 'Z',
}

const dict1: Record<I1, string> = {
  A: 'Rock',
  B: 'Paper',
  C: 'Scissors',
};
const dict2 = {
  X: 'Rock',
  Y: 'Paper',
  Z: 'Scissors',
};

const input: Array<[I1, I2]> = fs
  .readFileSync(__dirname + '/aoc2022-02.txt', 'utf-8')
  .split(/\n/g)
  .map(
    (line, i) => {
      if (!line) return null;
      const r = line.split(' ');
      if (!dict1[r[0]] || !dict2[r[1]]) {
        throw Error(`Error line ${i + 1}: ${line}`);
      }
      return r;
    },
    [0]
  )
  .filter(Boolean);

const points: Record<I2, number> = {
  X: 1,
  Y: 2,
  Z: 3,
};

const points2: Record<I1, Record<I2, number>> = {
  A: {
    X: 3,
    Y: 6,
    Z: 0,
  },
  B: {
    X: 0,
    Y: 3,
    Z: 6,
  },
  C: {
    X: 6,
    Y: 0,
    Z: 3,
  },
};

const points3: Record<I1, Record<I2, I2>> = {
  A: {
    X: I2.Z,
    Y: I2.X,
    Z: I2.Y,
  },
  B: {
    X: I2.X,
    Y: I2.Y,
    Z: I2.Z,
  },
  C: {
    X: I2.Y,
    Y: I2.Z,
    Z: I2.X,
  },
};

const part1 = () => {
  return input.reduce((agg, line) => {
    return agg + points[line[1]] + points2[line[0]][line[1]];
  }, 0);
};

const part2 = () => {
  return input.reduce((agg, line) => {
    const i2 = points3[line[0]][line[1]];
    return agg + points[i2] + points2[line[0]][i2];
  }, 0);
};

console.log(part1());
console.log(part2());
