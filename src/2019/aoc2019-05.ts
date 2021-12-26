export {};
const fs = require('fs');
const nbs: number[] = fs.readFileSync(__filename.replace(/\.js/, '.txt'), 'utf-8').split(',').map(x => +x);

const run = (input: number): number => {
  let pos: number = 0;
  let result: number;
  const mem: number[] = nbs.slice();
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
        mem[dst] = input;
        pos += 2;
        break;
      }
      case 4: {
        const src = mem[pos + 1];
        result = param1Immediate ? src : mem[src];
        pos += 2;
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
};

const part1 = (): number => run(1);
const part2 = (): number => run(5);

console.log(part1());
console.log(part2());
