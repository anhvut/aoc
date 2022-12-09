export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

const commands: Array<[string, number]> = lines.map((l) => {
  const w = l.split(' ');
  return [w[0], parseInt(w[1])];
});

type RED = (agg: [number, number, number], cmd: [string, number]) => [number, number, number];

const compute = (cmds: Array<[string, number]>, reducer: RED) => {
  const [horizontal, depth] = cmds.reduce(reducer, [0, 0, 0]);
  return horizontal * depth;
};

const reducer1: RED = ([horizontal, depth, _], [cmd, nb]) => {
  switch (cmd) {
    case 'forward':
      horizontal += nb;
      break;
    case 'up':
      depth -= nb;
      break;
    case 'down':
      depth += nb;
      break;
  }
  return [horizontal, depth, undefined];
};

const reducer2: RED = ([horizontal, depth, aim], [cmd, nb]) => {
  switch (cmd) {
    case 'forward':
      horizontal += nb;
      depth += aim * nb;
      break;
    case 'up':
      aim -= nb;
      break;
    case 'down':
      aim += nb;
      break;
  }
  return [horizontal, depth, aim];
};

console.log(compute(commands, reducer1));
console.log(compute(commands, reducer2));
