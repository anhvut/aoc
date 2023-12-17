import {ALL_DIRECTIONS} from "../util";

export {};
import fs from 'fs';
const nbs: number[] = fs
  .readFileSync(__filename.replace(/\.[jt]s/, '.txt'), 'utf-8')
  .split(',')
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
  return 0;
}

type Vector = number[];
type Matrix = number[][];

const serializePoint = ([x, y]: Vector): string => `${x}_${y}`;
const deserializePoint = (s: string): Vector => s.split('_').map(Number);

const vectorAdd = (pt1: Vector, pt2: Vector) => pt1.map((x, i) => x + pt2[i]);
const vectorSub = (pt1: Vector, pt2: Vector) => pt1.map((x, i) => x - pt2[i]);
const manhattanDistance = (pt1: Vector, pt2: Vector) => pt1.reduce((a, b, i) => a + Math.abs(b - pt2[i]), 0);

function displayGrid(topLeft: number[], bottomRight: number[], map: Record<string, Cell>) {
  const grid: Matrix = Array(bottomRight[1] - topLeft[1] + 1)
    .fill(0)
    .map(() => Array(bottomRight[0] - topLeft[0] + 1).fill(3));
  for (const [key, value] of Object.entries(map)) {
    const [x, y] = deserializePoint(key);
    grid[y - topLeft[1]][x - topLeft[0]] = value;
  }
  const display: string[][] = grid.map((line) => line.map((x) => ['#', ' ', '*', ' ', '.'][x]));
  console.log('');
  display.reverse().forEach((line) => console.log(line.join(' ')));
}

const directionEnum = ([x, y]: Vector) => {
  if (!x) return y > 0 ? 1 : 2;
  return x < 0 ? 3 : 4;
};

enum Cell {
  WALL = 0,
  FREE = 1,
  OXYGEN = 2,
}

type SearchTree = {
  position: Vector;
  children: SearchTree[];
  parent: SearchTree;
  distance: number;
};
const searchPath = (from: Vector, to: Vector, map: Record<string, Cell>): Vector[] | SearchTree => {
  if (manhattanDistance(from, to) === 0) return [];
  const tree: SearchTree = { position: from, children: [], parent: null, distance: 0 };
  const searches: SearchTree[] = [tree];
  const visited: Record<string, boolean> = {};
  visited[serializePoint(from)] = true;
  let current: SearchTree;
  while (searches.length > 0) {
    current = searches.shift();
    for (const direction of ALL_DIRECTIONS) {
      const nextPosition = vectorAdd(current.position, direction);
      const s = serializePoint(nextPosition);
      const cell = map[s];
      if ((cell === Cell.FREE || cell === Cell.OXYGEN) && !visited[s]) {
        const child: SearchTree = {
          position: nextPosition,
          children: [],
          parent: current,
          distance: current.distance + 1,
        };
        current.children.push(child);
        searches.push(child);

        if (manhattanDistance(nextPosition, to) === 0) {
          const result = [];
          let back = child;
          while (manhattanDistance(from, back.position) !== 0) {
            result.push(back.position);
            back = back.parent;
          }
          return result.reverse();
        }
      }
    }
    visited[serializePoint(current.position)] = true;
  }
  return current;
};

const main = (): void => {
  let position: Vector = [0, 0];
  let oxygenPosition: Vector = null;
  const map: Record<string, Cell> = { [serializePoint(position)]: Cell.FREE };
  const topLeft: Vector = [0, 0];
  const bottomRight: Vector = [0, 0];

  const generator = run([1], nbs);
  const next = (...input: number[]): number => {
    const nextOutput = generator.next(input);
    return nextOutput.value;
  };
  next();
  const cellsToExplore: Vector[] = [[0, 0]];
  while (cellsToExplore.length > 0) {
    cellsToExplore.sort((a, b) => manhattanDistance(a, position) - manhattanDistance(b, position));
    const toExplore = cellsToExplore.shift();
    // go to toExplore
    const path = searchPath(position, toExplore, map) as Vector[];
    for (const step of path) {
      const direction = vectorSub(step, position);
      next(directionEnum(direction));
      position = step;
    }
    // search four directions around toExplore
    for (const direction of ALL_DIRECTIONS) {
      const neighbour = vectorAdd(position, direction);
      const s = serializePoint(neighbour);
      if (map.hasOwnProperty(s)) continue;
      const tileId = next(directionEnum(direction));
      map[s] = tileId;
      if (tileId === Cell.FREE || tileId === Cell.OXYGEN) {
        if (tileId === Cell.OXYGEN) oxygenPosition = neighbour;
        next(directionEnum(direction.map((x) => -x)));
        cellsToExplore.push(neighbour);
      }
    }
    topLeft[0] = Math.min(position[0] - 1, topLeft[0]);
    topLeft[1] = Math.min(position[1] - 1, topLeft[1]);
    bottomRight[0] = Math.max(position[0] + 1, bottomRight[0]);
    bottomRight[1] = Math.max(position[1] + 1, bottomRight[1]);
  }

  position = [0, 0];
  const pathToOxygen = searchPath(position, oxygenPosition, map) as Vector[];
  const markedMap = { ...map, [serializePoint(position)]: 4 };
  for (const step of pathToOxygen) markedMap[serializePoint(step)] = 4;
  markedMap[serializePoint(oxygenPosition)] = 2;
  displayGrid(topLeft, bottomRight, markedMap);
  const part1 = pathToOxygen.length;

  // part 2 : path to impossible cell will return furthest cell
  const furthestCell = searchPath(oxygenPosition, topLeft, map) as SearchTree;
  const part2 = furthestCell.distance;

  console.log(part1, part2);
};

main();
