export {};
const fs = require('fs')
const nbs: number[] = fs.readFileSync(__dirname + '/aoc2019-02.txt', 'utf-8').split(',').map(x => +x);

const run = (noun: number, verb: number): number => {
  let pos: number = 0;
  const mem: number[] = nbs.slice();
  mem[1] = noun;
  mem[2] = verb;
  while (pos < mem.length) {
    const opcode = mem[pos];
    switch (opcode) {
      case 1:
      case 2:
        const [src1, src2, dst] = mem.slice(pos + 1, pos + 4);
        mem[dst] = opcode === 1 ? mem[src1] + mem[src2] : mem[src1] * mem[src2];
        pos += 4;
        break;
      case 99:
        return mem[0];
      default:
        throw Error(`Unknown opcode ${opcode} at position ${pos}`);
    }
  }
  return 0;
}

const part1 = (): number => run(12, 2);

const part2 = (): number => {
  for (let noun = 0; noun < 100; noun++)
    for (let verb = 0; verb < 100; verb++)
      if (run(noun, verb) === 19690720) return 100*noun + verb;
}

console.log(part1());
console.log(part2());
