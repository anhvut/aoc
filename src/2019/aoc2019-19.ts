export {};

import fs from 'fs';

const nbs: number[] = fs
  .readFileSync(__filename.replace(/\.[jt]s/, '.txt'), 'utf-8')
  .split(',')
  .map((x) => +x);

function* run(input: number[], program: number[]): Generator<number, number, number> {
  let pos = 0;
  let result = 0;
  let relativeBase = 0;
  const mem: number[] = program.slice();
  const getValue = (mode: number, param: number) =>
    (mode === 1 ? param : mode === 2 ? mem[relativeBase + param] : mem[param]) ?? 0;
  const getDestinationAddress = (mode: number, param: number) => {
    if (mode === 0) return param;
    if (mode === 2) return relativeBase + param;
    throw new Error(`Invalid destination mode ${mode}`);
  };
  while (pos < mem.length) {
    const instruction = mem[pos];
    const opcode = instruction % 100;
    const param1Mode = Math.floor(instruction / 100) % 10;
    const param2Mode = Math.floor(instruction / 1000) % 10;
    const param3Mode = Math.floor(instruction / 10000) % 10;
    switch (opcode) {
      case 1:
      case 2: {
        const [src1, src2, dst] = mem.slice(pos + 1, pos + 4);
        const value1 = getValue(param1Mode, src1);
        const value2 = getValue(param2Mode, src2);
        const value3 = getDestinationAddress(param3Mode, dst);
        mem[value3] = opcode === 1 ? value1 + value2 : value1 * value2;
        pos += 4;
        break;
      }
      case 3: {
        const dst = getDestinationAddress(param1Mode, mem[pos + 1]);
        mem[dst] = input.shift();
        pos += 2;
        break;
      }
      case 4: {
        const src = mem[pos + 1];
        result = getValue(param1Mode, src);
        pos += 2;
        const inputNext = yield result;
        if (inputNext != null) input.push(inputNext);
        break;
      }
      case 5:
      case 6: {
        const [src1, src2] = mem.slice(pos + 1, pos + 3);
        const value1 = getValue(param1Mode, src1);
        const value2 = getValue(param2Mode, src2);
        if ((opcode === 5 && value1) || (opcode === 6 && !value1)) pos = value2;
        else pos += 3;
        break;
      }
      case 7:
      case 8: {
        const [src1, src2, dst] = mem.slice(pos + 1, pos + 4);
        const value1 = getValue(param1Mode, src1);
        const value2 = getValue(param2Mode, src2);
        const value3 = getDestinationAddress(param3Mode, dst);
        mem[value3] = (opcode === 7 && value1 < value2) || (opcode === 8 && value1 === value2) ? 1 : 0;
        pos += 4;
        break;
      }
      case 9: {
        const src = mem[pos + 1];
        const adjust = getValue(param1Mode, src);
        relativeBase += adjust;
        pos += 2;
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

const part1 = () => {
  let nb = 0;
  for (let x = 0; x < 50; x++) for (let y = 0; y < 50; y++) nb += run([x, y], nbs).next().value;
  return nb;
};

const part2 = (square = 100) => {
  console.time('part 2');
  let result = 0;
  const maxSize = 10000;
  const segments = Array(maxSize)
    .fill(0)
    .map(() => [0, 0]);
  for (let y = 4; y < maxSize; y++) {
    const segment = segments[y];
    for (let x = segments[y - 1][0]; segment[1] === 0 && x < maxSize; x++) {
      const c = run([x, y], nbs).next().value;
      if (c && !segment[0]) segment[0] = x;
      else if (!c && segment[0]) segment[1] = x;
    }
    if (y >= square) {
      const minX = Math.max(segment[0], segments[y - square + 1][0]);
      const maxX = Math.min(segment[1], segments[y - square + 1][1]);
      if (maxX - minX === square) {
        console.log(`Found at (${minX},${y - square + 1})`);
        result = minX * 10_000 + y - square + 1;
        break;
      }
    }
  }

  square.toString();
  console.timeEnd('part 2');
  return result;
};

console.log(part1());
console.log(part2());
