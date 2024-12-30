import {consoleTimeit} from '../util';
import * as console from "node:console";
import {zipWith} from "es-toolkit";

type Machine = {
  registers: Record<string, number>;
  program: number[];
  out: number[];
}

const instructionName = ['adv', 'bxl', 'bst', 'jnz', 'bxc', 'out', 'bdv', 'cdv'];

function run({registers, program, out}: Machine, checkOutput?: boolean) {
  let ip = 0;
  while (ip < program.length) {
    const instruction = program[ip];
    const operand = program[ip + 1];
    const combo = operand < 4 ? operand : operand === 4 ? registers['A'] : operand === 5 ? registers['B'] : registers['C'];
    // console.log(`Instruction ${instructionName[instruction]} ${operand} (${combo})`);
    switch (instruction) {
      case 0:
        registers['A'] = Math.floor(registers['A'] / Math.pow(2, combo));
        break;
      case 1:
        registers['B'] = registers['B'] ^ operand;
        break;
      case 2:
        registers['B'] = combo & 7;
        break;
      case 3:
        if (registers['A'] !== 0) ip = combo - 2;
        break;
      case 4:
        registers['B'] = registers['B'] ^ registers['C'];
        break;
      case 5:
        out.push(combo & 7);
        if (checkOutput) {
          if (out[out.length - 1] !== program[out.length - 1]) return false;
          if (out.length > program.length) return false;
        }
        break;
      case 6:
        registers['B'] = Math.floor(registers['A'] / Math.pow(2, combo));
        break;
      case 7:
        registers['C'] = Math.floor(registers['A'] / Math.pow(2, combo));
        break;
    }
    ip += 2;
  }
  return true;
}

function parse(input: string[]) {
  const machine: Machine = {
    registers: {},
    program: [],
    out: []
  };
  for (const line of input) {
    const match = line.match(/Register ([A-Z]): (\d+)/);
    if (match) {
      machine.registers[match[1]] = parseInt(match[2]);
    } else if (line.startsWith('Program: ')) {
      machine.program = line.slice('Program: '.length).split(',').map(Number);
    }
  }
  return machine;
}

const part1 = (input: string[]) => {
  const machine = parse(input);
  run(machine);
  return machine.out.join(',');
};

const part2Sample = (input: string[]) => {
  const machine = parse(input);
  for (let i = 0;; i++) {
    machine.registers['A'] = i;
    machine.registers['B'] = 0;
    machine.registers['C'] = 0;
    machine.out = [];
    const r = run(machine, true);
    if (!r) continue;
    if (machine.out.length === machine.program.length && zipWith(machine.out, machine.program, (a, b) => a == b).every(Boolean)) return i;
  }
};

function part2Real(input: string[]) {
  /*
410715035 (3036601633) => 2,4,1,7,7,5,1,7,0,3
410715037 (3036601635) => 2,4,1,7,7,5,1,7,0,3
410719131 (3036611633) => 2,4,1,7,7,5,1,7,0,3
410719133 (3036611635) => 2,4,1,7,7,5,1,7,0,3
410723227 (3036621633) => 2,4,1,7,7,5,1,7,0,3
410723229 (3036621635) => 2,4,1,7,7,5,1,7,0,3
   */
  const machine = parse(input);
  const m = Math.pow(2, 30);
  const l = Math.pow(2, 21);
  for (let i = 0; i < l; i++) {
    const v = (i * m) +  410715035;
    machine.registers['A'] = v;
    machine.registers['B'] = 0;
    machine.registers['C'] = 0;
    machine.out = [];
    run(machine, true);
    if (machine.out.every((v, i) => v === machine.program[i]))
      console.log(`${v} (${v.toString(8)}) => ${machine.out.join(',')}`);
    if (machine.out.length === machine.program.length) return v;
  }
  throw new Error('Not found');
}

// noinspection SpellCheckingInspection
const inputSample = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`
    .trim()
    .split('\n');

const inputSample2 = `
Register A: 117440
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`
  .trim()
  .split('\n');

// noinspection SpellCheckingInspection
const inputReal = `
Register A: 66752888
Register B: 0
Register C: 0

Program: 2,4,1,7,7,5,1,7,0,3,4,1,5,5,3,0
`
  .trim()
  .split('\n');

/*
2,4 : B = A & 7
1,7 : B = B ^ 7
7,5 : C = A >> B
1,7 : B = B ^ 7
0,3 : A = A >> 3
4,1 : B = B ^ C
5,5 : out B & 7
3,0 : if A != 0 goto 0
*/

const runs = [3, 1, 1, 1];
if (runs[0] & 1) consoleTimeit('part1 sample1', () => part1(inputSample));
if (runs[0] & 2) consoleTimeit('part1 sample2', () => part1(inputSample2));
if (runs[1]) consoleTimeit('part1 real', () => part1(inputReal));
if (runs[2]) consoleTimeit('part2 sample', () => part2Sample(inputSample2));
if (runs[3]) consoleTimeit('part2 real', () => part2Real(inputReal));