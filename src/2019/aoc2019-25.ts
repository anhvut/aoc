export {};

import fs from 'fs';

const nbs: number[] = fs
  .readFileSync(__filename.replace(/\.[jt]s/, '.txt'), 'utf-8')
  .split(',')
  .filter(Boolean)
  .map((x) => +x);

function* run(input: number[], program: number[]): Generator<number, number, number[]> {
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
        if (input.length > 0) {
          mem[dst] = input.shift();
        } else {
          const n = yield undefined;
          if (n != null && n.length > 0) {
            input.push(...n);
            mem[dst] = input.shift();
          }
        }
        pos += 2;
        break;
      }
      case 4: {
        const src = mem[pos + 1];
        result = getValue(param1Mode, src);
        pos += 2;
        const n = yield result;
        if (n != null) input.push(...n);
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

const takeAllInstructions = [
  'west',
  'take pointer',
  'east',
  'south',
  'take whirled peas',
  'south',
  'south',
  'south',
  'take festive hat',
  'north',
  'north',
  'north',
  'north',
  'north',
  'take coin',
  'north',
  'take astronaut ice cream',
  'north',
  'west',
  'take dark matter',
  'south',
  'take klein bottle',
  'west',
  'take mutex',
  'west',
  'south',
  'east',
];

const items = [
  'pointer',
  'whirled peas',
  'festive hat',
  'coin',
  'astronaut ice cream',
  'dark matter',
  'klein bottle',
  'mutex',
];

const toCharCodes = (s: string) => Array.from(s).map((c) => c.charCodeAt(0));

function* runProgram(generator: Generator<number, number, number[]>): Generator<string, string, string> {
  let output = '';
  let input: number[] = null;

  for (;;) {
    const next = generator.next(input);
    input = null;
    if (next.done) break;
    if (next.value === 10) {
      console.log(output);
      if (output === 'Command?') {
        const command = yield output;
        input = command ? toCharCodes(command + '\n') : null;
      }
      output = '';
    } else output += String.fromCharCode(next.value);
  }
  return null;
}

function* generateSubsets<T>(set: T[]): Generator<T[]> {
  const length = set.length;
  const maxNb = Math.pow(2, length);
  let c, j, k;

  for (c = 0; c < maxNb; c++) {
    const a: T[] = [];
    for (j = 0, k = 1; j < length; j++, k <<= 1) {
      if ((c & k) > 0) a.push(set[j]);
    }
    yield a;
  }
}

const part = () => {
  const runner = runProgram(run([], nbs));
  runner.next();
  for (const command of takeAllInstructions) {
    console.log(`Auto input => ${command}`);
    runner.next(command);
  }
  let inventory = items;
  for (const subset of generateSubsets(items)) {
    const commands = [];
    for (const item of items) {
      if (inventory.includes(item) && !subset.includes(item)) commands.push(`drop ${item}`);
      else if (!inventory.includes(item) && subset.includes(item)) commands.push(`take ${item}`);
    }
    for (const command of commands) runner.next(command);
    inventory = subset;
    if (runner.next('east').done) break;
  }
  console.log(`Needed items: ${inventory.join(', ')}`);
  return 0;
};

console.log(part());
