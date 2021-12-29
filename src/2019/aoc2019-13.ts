export {};
const fs = require('fs');
const nbs: number[] = fs.readFileSync(__filename.replace(/\.js/, '.txt'), 'utf-8').split(',').map(x => +x);

function *run(input: number[], program: number[]): Generator<number, number, number[]> {
  let pos: number = 0;
  let result: number = 0;
  let relativeBase: number = 0;
  const mem: number[] = program.slice();
  const getValue = (mode: number, param: number) => (mode === 1 ? param : mode === 2 ? mem[relativeBase + param] : mem[param]) ?? 0;
  const getDestinationAddress = (mode: number, param: number) => {
    if (mode === 0) return param;
    if (mode === 2) return relativeBase + param;
    throw new Error(`Invalid destination mode ${mode}`);
  }
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
        if (inputNext != null) input.push(...inputNext);
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
}

type Vector = number[];
type Matrix = number[][];

const serializePoint = ([x, y]: Vector): string => `${x}_${y}`;
const deserializePoint = (s: string): Vector => s.split('_').map(Number);

function displayGrid(topLeft: number[], bottomRight: number[], map: Record<string, number>) {
  const grid: Matrix = Array(bottomRight[1] - topLeft[1] + 1).fill(0).map(() => Array(bottomRight[0] - topLeft[0] + 1).fill(0));
  for (const [key, value] of Object.entries(map)) {
    const [x, y] = deserializePoint(key);
    grid[y - topLeft[1]][x - topLeft[0]] = value;
  }
  const display: string[] = grid.map(line => line.map(x => [' ', '#', '.', '-', '*'][x] ?? '?').join(''));
  display.forEach(line => console.log(line));
}

const part1 = (): number => {
  const map: Record<string, number> = {};
  let topLeft: Vector = [0, 0];
  let bottomRight: Vector = [0, 0];

  const generator = run([], nbs);
  let done = false;
  const next = (): number => {
    const nextOutput = generator.next();
    if (nextOutput.done) done = true;
    return nextOutput.value;
  };
  do {
    const x = next();
    const y = next();
    const tileId = next();
    if (done) break;
    map[serializePoint([x, y])] = tileId;
    topLeft = [Math.min(topLeft[0], x), Math.min(topLeft[1], y)];
    bottomRight = [Math.max(bottomRight[0], x), Math.max(bottomRight[1], y)];
  } while (!done);
  displayGrid(topLeft, bottomRight, map);
  return Object.values(map).filter(x => x === 2).length;
};

const part2 = (): number => {
  const map: Record<string, number> = {};
  const generator = run([], Object.assign([], nbs, [2]));
  let done = false;
  const next = (nextInput?: number[] | null): number => {
    const nextOutput = generator.next(nextInput);
    done = done || nextOutput.done;
    return nextOutput.value;
  };
  let padX = -1;
  let nextInput: number[] = [];
  let score = 0;
  do {
    const x = next(nextInput);
    const y = next();
    const tileId = next();
    nextInput.length = 0;
    if (done) break;
    map[serializePoint([x, y])] = tileId;
    if (tileId === 3 && padX < 0) padX = x;
    if (tileId === 4 && padX >= 0) {
      nextInput = Array(Math.abs(x - padX)).fill(x < padX ? -1 : 1);
      padX = x;
    }
    if (x === -1 && y === 0) score = tileId;
  } while (!done);
  return score;
};

console.log(part1())
console.log(part2())
