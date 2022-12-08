export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

type Instruction = {
  op: string;
  nb: number;
};
type Program = Instruction[];

const instructions: Program = lines.map((l) => {
  const parts = l.split(' ');
  console.assert(parts.length === 2);
  return {
    op: parts[0],
    nb: +parts[1],
  };
});

const run = (program: Program) => {
  const visited: Record<string, boolean> = {};
  let ip = 0,
    acc = 0;
  while (program[ip] && !visited[ip]) {
    const { op, nb } = program[ip];
    visited[ip] = true;
    switch (op) {
      case 'nop':
        ip++;
        break;
      case 'acc':
        acc += nb;
        ip++;
        break;
      case 'jmp':
        ip += nb;
        break;
      default:
        console.error('WTF', op, nb);
    }
  }
  return { acc, ip };
};

const part1 = () => {
  return run(instructions).acc;
};

const part2 = () => {
  return instructions
    .map(({ op, nb }, i) => {
      let newOp = null;
      switch (op) {
        case 'jmp':
          newOp = 'nop';
          break;
        case 'nop':
          newOp = 'jmp';
          break;
        default:
          return null;
      }
      const prog = instructions.slice();
      prog[i] = { op: newOp, nb };
      const result = run(prog);
      if (result.ip === instructions.length) {
        return result;
      } else {
        return null;
      }
    })
    .filter((x) => !!x);
};

console.log(part1());
console.log(part2());
