export {};
const fs = require('fs');
const lines: string[] = fs.readFileSync(__filename.replace(/\.js/, '.txt'), 'utf-8').split(/\n/g);

type Instruction = {direction: string, length: number};

const instructions: Instruction[][] = lines.map(x => x.split(',').map(x => ({direction: x[0], length: +x.slice(1)})));

const serialize = (x: number, y: number): string => `${x}_${y}`;
const deserialize = (s: string): number[] => s.split('_').map(x => +x);

const follow = (instructions: Instruction[]): Record<string, number> => {
  const result = {};
  let x = 0, y = 0, steps = 1;
  for (const instruction of instructions) {
    const [dx, dy] = {'R': [1, 0], 'L': [-1, 0], 'U': [0, 1], 'D': [0, -1]}[instruction.direction];
    for (let i = 0; i < instruction.length; i++) {
      x += dx;
      y += dy;
      const key = serialize(x, y);
      if (!result[key]) result[key] = steps;
      steps++;
    }
  }
  return result;
}

const getIntersection = (a: Record<string, any>, b: Record<string, any>): string[] => {
  return Object.keys(b).filter(x => !!a[x]);
}

const part1 = (): number => {
  const map = follow(instructions[0]);
  const map2 = follow(instructions[1]);
  const intersection = getIntersection(map, map2);
  const points = intersection.map(deserialize);
  const distances = points.map(([x, y]) => Math.abs(x) + Math.abs(y));
  return distances.reduce((a, b) => Math.min(a, b), Infinity);
}

const part2 = (): number => {
  const map = follow(instructions[0]);
  const map2 = follow(instructions[1]);
  const intersection = getIntersection(map, map2);
  const distances = intersection.map(key => map[key] + map2[key]);
  return distances.reduce((a, b) => Math.min(a, b), Infinity);
}

console.log(part1());
console.log(part2());
