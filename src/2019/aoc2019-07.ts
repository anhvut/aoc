export {};
import fs from 'fs';
const nbs: number[] = fs
  .readFileSync(__filename.replace(/\.[jt]s/, '.txt'), 'utf-8')
  .split(',')
  .map((x) => +x);

function* run(input: number[], program: number[]): Generator<number, number, number> {
  let pos = 0;
  let result = 0;
  const mem: number[] = program.slice();
  while (pos < mem.length) {
    const instruction = mem[pos];
    const opcode = instruction % 100;
    const param1Immediate = Math.floor(instruction / 100) % 10;
    const param2Immediate = Math.floor(instruction / 1000) % 10;
    switch (opcode) {
      case 1:
      case 2: {
        const [src1, src2, dst] = mem.slice(pos + 1, pos + 4);
        const value1 = param1Immediate ? src1 : mem[src1];
        const value2 = param2Immediate ? src2 : mem[src2];
        mem[dst] = opcode === 1 ? value1 + value2 : value1 * value2;
        pos += 4;
        break;
      }
      case 3: {
        const dst = mem[pos + 1];
        mem[dst] = input.shift() as number;
        pos += 2;
        break;
      }
      case 4: {
        const src = mem[pos + 1];
        result = param1Immediate ? src : mem[src];
        pos += 2;
        const inputNext = yield result;
        input.push(inputNext);
        break;
      }
      case 5:
      case 6: {
        const [src1, src2] = mem.slice(pos + 1, pos + 3);
        const value1 = param1Immediate ? src1 : mem[src1];
        const value2 = param2Immediate ? src2 : mem[src2];
        if ((opcode === 5 && value1) || (opcode === 6 && !value1)) pos = value2;
        else pos += 3;
        break;
      }
      case 7:
      case 8: {
        const [src1, src2, dst] = mem.slice(pos + 1, pos + 4);
        const value1 = param1Immediate ? src1 : mem[src1];
        const value2 = param2Immediate ? src2 : mem[src2];
        mem[dst] = (opcode === 7 && value1 < value2) || (opcode === 8 && value1 === value2) ? 1 : 0;
        pos += 4;
        break;
      }
      case 99:
        return result;
      default:
        throw Error(`Unknown opcode ${opcode} at position ${pos}`);
    }
  }
  return 0;
}

function* generatePermutation<T>(possibility: T[]): Generator<T[], void> {
  if (possibility.length <= 1) yield possibility;
  else {
    for (let i = 0; i < possibility.length; i++) {
      const element = possibility[i];
      const sub = possibility.filter((_, j) => j !== i);
      for (const permutation of generatePermutation(sub)) yield [element, ...permutation];
    }
  }
}

const part1 = (): number => {
  let result = 0;
  for (const permutation of generatePermutation([0, 1, 2, 3, 4])) {
    const out = permutation.reduce((prev, nb) => run([nb, prev], nbs).next().value, 0);
    result = Math.max(result, out);
  }
  return result;
};

const part2 = (): number => {
  let result = 0;
  for (const permutation of generatePermutation([5, 6, 7, 8, 9])) {
    const programs = [];
    let lastOutput = 0;
    for (let i = 0; i < permutation.length; i++) {
      const program = run([permutation[i], lastOutput], nbs);
      programs.push(program);
      lastOutput = program.next().value;
    }
    let i = 0,
      maxInPermutation = 0,
      next: IteratorResult<number, number>;
    do {
      next = programs[i].next(lastOutput);
      lastOutput = next.value;
      maxInPermutation = Math.max(lastOutput, maxInPermutation);
      i = (i + 1) % permutation.length;
    } while (!next.done);
    result = Math.max(result, isFinite(maxInPermutation) ? maxInPermutation : 0);
  }
  return result;
};

console.log(part1());
console.log(part2());
