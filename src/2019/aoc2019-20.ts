export {};
import fs from 'fs';

const map: string[] = fs
  .readFileSync(__filename.replace(/\.[jt]s/, '.txt'), 'utf-8')
  .split('\n')
  .filter(Boolean);

const codeA = 'A'.codePointAt(0);
const codeZ = 'Z'.codePointAt(0);

const isLetter = (c: string) => c && codeA <= c.codePointAt(0) && c.codePointAt(0) <= codeZ;

type POS = [number, number];
type POS_KEY = `${number},${number}`;

const toKey = (x: number, y: number): POS_KEY => `${x},${y}`;

const parse = (): [POS, POS, Record<string, POS[]>] => {
  const matchingLetters: Record<POS_KEY, true> = {};
  let start: POS = [0, 0];
  let end: POS = [0, 0];
  const maxX = map.reduce((m, r) => Math.max(m, r.length), 0);
  const portals: Record<string, POS[]> = {};
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const c = row[x];
      const key = toKey(x, y);
      if (isLetter(c) && !matchingLetters[key]) {
        // search matching letter and position
        let position: POS;
        let matchingPosition: POS;
        let letters: string;
        if (isLetter(row[x + 1])) {
          letters = c + row[x + 1];
          matchingPosition = [x + 1, y];
          if (row[x + 2] === '.') position = [x + 2, y];
          else if (row[x - 1] === '.') position = [x - 1, y];
        } else if (isLetter(map[y + 1]?.[x])) {
          letters = c + map[y + 1][x];
          matchingPosition = [x, y + 1];
          if (map[y + 2]?.[x] === '.') position = [x, y + 2];
          else if (map[y - 1]?.[x] === '.') position = [x, y - 1];
        }
        if (!position) throw Error(`Position for found for ${letters} at (${x}, ${y})`);
        matchingLetters[toKey(matchingPosition[0], matchingPosition[1])] = true;
        if (letters === 'AA') start = position;
        else if (letters === 'ZZ') end = position;
        else {
          let entry = portals[letters];
          if (!entry) portals[letters] = entry = [undefined, undefined];
          const [x, y] = position;
          const isInside = x > 2 && y > 2 && x < maxX - 3 && y < map.length - 3;
          entry[Number(isInside)] = position;
        }
      }
    }
  }
  return [start, end, portals];
};

const getAccessible = (
  map: string[],
  start: POS,
  letterPos: Record<POS_KEY, string>,
  used: string[]
): Array<[string, number]> => {
  const result: Array<[string, number]> = [];
  const usedRecord = Object.fromEntries(used.map((u) => [u, true]));
  const visited: Record<POS_KEY, boolean> = {};
  let nbSteps = 0;
  let toVisit: Array<POS> = [start];
  while (toVisit.length > 0) {
    const nextToVisit: Array<POS> = [];
    const tryVisit = (x: number, y: number) => {
      if (map[y]?.[x] === '.') {
        nextToVisit.push([x, y]);
      }
    };
    for (const [x, y] of toVisit) {
      const key = toKey(x, y);
      if (visited[key]) continue;
      visited[key] = true;
      const letters3 = letterPos[key];
      if (letters3 && nbSteps) {
        if (usedRecord[letters3]) continue;
        // register new portal to visit
        result.push([letters3, nbSteps]);
        continue;
      }
      tryVisit(x - 1, y);
      tryVisit(x + 1, y);
      tryVisit(x, y - 1);
      tryVisit(x, y + 1);
    }
    toVisit = nextToVisit;
    nbSteps++;
  }
  return result;
};

const search = (start: POS, end: POS, portals: Record<string, POS[]>, map: string[]) => {
  let result = Infinity;
  const letterPos: Record<POS_KEY, string> = Object.fromEntries(
    Object.entries(portals)
      .flatMap(([letters, positions]) => positions.map((p, i) => [toKey(...p), letters + i]))
      .concat([
        [toKey(...start), 'AA'],
        [toKey(...end), 'ZZ'],
      ])
  );
  let toVisit: Array<[string, number, string[]]> = getAccessible(map, start, letterPos, ['AA']).map((x) => [
    ...x,
    ['AA'],
  ]);
  while (toVisit.length > 0) {
    const nextToVisit: Array<[string, number, string[]]> = [];
    for (const [prevPortal, prevSteps, prevUsed] of toVisit) {
      if (prevPortal === 'ZZ') {
        result = Math.min(result, prevSteps);
        continue;
      }
      const letters = prevPortal.slice(0, 2);
      const door = +prevPortal.slice(2);
      const pos = portals[letters][1 - door];
      const used = [...prevUsed, prevPortal];
      const steps = prevSteps + 1;
      for (const [newPortal, addSteps] of getAccessible(map, pos, letterPos, used)) {
        const newSteps = steps + addSteps;
        if (newSteps < result) nextToVisit.push([newPortal, newSteps, used]);
      }
    }
    toVisit = nextToVisit;
  }
  return result;
};

const part1 = () => {
  console.time('part 1');
  const [start, end, portals] = parse();
  const result = search(start, end, portals, map);
  console.timeEnd('part 1');
  return result;
};

const search2 = (start: POS, end: POS, portals: Record<string, POS[]>, map: string[]) => {
  let result = Infinity;
  const entriesInside = Object.entries(portals).flatMap(([letters, positions]) =>
    positions.map((p, i) => [toKey(...p), letters + i])
  );
  const entriesOutside = entriesInside.concat([
    [toKey(...start), 'AA'],
    [toKey(...end), 'ZZ'],
  ]);
  const letterPosInside: Record<POS_KEY, string> = Object.fromEntries(entriesInside);
  const letterPosOutside: Record<POS_KEY, string> = Object.fromEntries(entriesOutside);
  let toVisit: Array<[string, number, string[][], number]> = getAccessible(map, start, letterPosOutside, ['AA']).map(
    (x) => [...x, [['AA']], 0]
  );
  let turn = 0;
  while (toVisit.length > 0) {
    console.log(`Turn ${turn}, ${toVisit.length} to visit`);
    turn++;
    const nextToVisit: Array<[string, number, string[][], number]> = [];
    for (const [prevPortal, prevSteps, prevUsedByLevel, prevLevel] of toVisit) {
      if (prevPortal === 'ZZ') {
        result = Math.min(result, prevSteps);
        console.log(`Found ${result}`);
        continue;
      }
      const letters = prevPortal.slice(0, 2);
      const door = +prevPortal.slice(2);
      const level = prevLevel + (door === 1 ? 1 : -1);
      if (level < 0) continue;
      const pos = portals[letters][1 - door];
      const usedByLevel = prevUsedByLevel.slice();
      usedByLevel[prevLevel] = [...usedByLevel[prevLevel], prevPortal];
      if (usedByLevel.length < level + 1) usedByLevel.push([]);
      const steps = prevSteps + 1;
      const letterPos = level === 0 ? letterPosOutside : letterPosInside;
      for (const [newPortal, addSteps] of getAccessible(map, pos, letterPos, usedByLevel[level])) {
        const newSteps = steps + addSteps;
        if (newSteps < result) nextToVisit.push([newPortal, newSteps, usedByLevel, level]);
      }
    }
    toVisit = nextToVisit;
  }
  return result;
};

const part2 = () => {
  console.time('part 2');
  const [start, end, portals] = parse();
  const result = search2(start, end, portals, map);
  console.timeEnd('part 2');
  return result;
};

console.log(part1());
console.log(part2());
