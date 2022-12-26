export {};
import fs from 'fs';

const map: string[] = fs
  .readFileSync(__filename.replace(/\.[jt]s/, '.txt'), 'utf-8')
  .split('\n')
  .filter(Boolean);

const codeWallA = 'A'.codePointAt(0);
const codeWallZ = 'Z'.codePointAt(0);
const codeKeyA = 'a'.codePointAt(0);
const codeKeyZ = 'z'.codePointAt(0);

type POS = [number, number];

const analyze = (map: string[]): [POS, string[], Record<string, POS>] => {
  const start: POS = [0, 0];
  const keys: string[] = [];
  const keyPos: Record<string, POS> = {};
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const c = row[x];
      if (c === '@') {
        start[0] = x;
        start[1] = y;
      } else if (c.codePointAt(0) >= codeKeyA && c.codePointAt(0) <= codeKeyZ) {
        keys.push(c);
        keyPos[c] = [x, y];
      }
    }
  }
  return [start, keys, keyPos];
};

const searchByStep = (map: string[], start: POS, keys: string[]) => {
  const nbKeys = keys.length;
  let nbSteps = 0;
  const visited: Record<string, boolean> = {};
  let toVisit: Array<[number, number, string]> = [[start[0], start[1], '']];
  while (toVisit.length > 0) {
    const nextToVisit: Array<[number, number, string]> = [];
    for (const [x, y, keyFound] of toVisit) {
      const visitKey = `${x},${y},${keyFound}`;
      if (visited[visitKey]) continue;
      visited[visitKey] = true;
      let currentKeyFound = keyFound;
      const c = map[y][x];
      const cp = c.codePointAt(0);
      if (codeKeyA <= cp && cp <= codeKeyZ && !keyFound.includes(c)) {
        const keyFoundArray = Array.from(keyFound);
        keyFoundArray.push(c);
        if (keyFoundArray.length === nbKeys) return nbSteps;
        keyFoundArray.sort();
        currentKeyFound = keyFoundArray.join('');
      }
      const tryPos = (tx: number, ty: number) => {
        const nc = map[ty][tx];
        const ncp = nc.codePointAt(0);
        if (
          nc === '.' ||
          nc === '@' ||
          (codeKeyA <= ncp && ncp <= codeKeyZ) ||
          currentKeyFound.includes(nc.toLowerCase())
        ) {
          nextToVisit.push([tx, ty, currentKeyFound]);
        }
      };
      tryPos(x - 1, y);
      tryPos(x + 1, y);
      tryPos(x, y - 1);
      tryPos(x, y + 1);
    }
    toVisit = nextToVisit;
    nbSteps++;
  }
  console.log(`Not all keys found after ${nbSteps} steps`);
  return nbSteps;
};

const getAccessible = (start: POS, map: string[], ownKeys: string): Array<[string, number]> => {
  const visited: Record<string, boolean> = {};
  let toVisit: POS[] = [start];
  const result: Array<[string, number]> = [];
  let nbSteps = 0;
  while (toVisit.length > 0) {
    const nextToVisit: POS[] = [];
    const tryVisit = (x: number, y: number) => {
      const c = map[y][x];
      const cp = c.codePointAt(0);
      if (
        c === '.' ||
        c === '@' ||
        (codeKeyA <= cp && cp <= codeKeyZ) ||
        (codeWallA <= cp && cp <= codeWallZ && ownKeys.includes(c.toLowerCase()))
      ) {
        nextToVisit.push([x, y]);
      }
    };
    for (const [x, y] of toVisit) {
      const key = `${x},${y}`;
      if (visited[key]) continue;
      visited[key] = true;
      const c = map[y][x];
      const cp = c.codePointAt(0);
      if (codeKeyA <= cp && cp <= codeKeyZ && !ownKeys.includes(c)) result.push([c, nbSteps]);
      tryVisit(x - 1, y);
      tryVisit(x + 1, y);
      tryVisit(x, y - 1);
      tryVisit(x, y + 1);
    }
    nbSteps++;
    toVisit = nextToVisit;
  }
  return result;
};

const searchByKey = (map: string[], start: POS[], keys: string[], keyPos: Record<string, POS>) => {
  const nbKeys = keys.length;
  let round = 0;
  const visited: Record<string, boolean> = {};
  let toVisit: Array<[string, number, POS[]]> = start
    .flatMap((pos, index) =>
      getAccessible(pos, map, '').map<[string, number, POS[]]>(([path, step]) => [
        path,
        step,
        start.map((x, i) => (i === index ? keyPos[path] : x)),
      ])
    )
    .sort(([, s1], [, s2]) => s1 - s2);
  while (toVisit.length > 0) {
    console.log(`Round ${round}, ${toVisit.length} to visit`);
    const nextToVisit: Array<[string, number, POS[]]> = [];
    for (const [path, steps, positions] of toVisit) {
      const head = path.slice(0, -1);
      const last = path.slice(-1);
      const key = Array.from(head).sort().concat(last).join('');
      if (visited[key]) continue;
      visited[key] = true;

      if (path.length === nbKeys) return steps;
      positions.forEach((pos, index) => {
        for (const [newKey, addSteps] of getAccessible(pos, map, path)) {
          const newPositions = positions.map((x, i) => (i === index ? keyPos[newKey] : x));
          nextToVisit.push([path + newKey, steps + addSteps, newPositions]);
        }
      });
    }
    toVisit = nextToVisit.sort(([, s1], [, s2]) => s1 - s2);
    round++;
  }
  console.log(`Not all keys found after ${round} steps`);
  return round;
};

const part1 = () => {
  console.time('part 1');
  const [start, keys, _keyPos] = analyze(map);
  const result = searchByStep(map, start, keys);
  // const result = searchByKey(map, [start], keys, _keyPos); // work but much slower than searchByStep
  console.timeEnd('part 1');
  return result;
};

const part2 = () => {
  console.time('part 2');
  const [[x, y], keys, keyPos] = analyze(map);
  const newMap = map.map((r, i) => {
    if (i === y - 1 || i === y + 1) {
      const a = Array.from(r);
      a[x] = '#';
      return a.join('');
    } else if (i === y) {
      const a = Array.from(r);
      a[x - 1] = a[x] = a[x + 1] = '#';
      return a.join('');
    } else return r;
  });
  const result = searchByKey(
    newMap,
    [
      [x - 1, y - 1],
      [x + 1, y - 1],
      [x - 1, y + 1],
      [x + 1, y + 1],
    ],
    keys,
    keyPos
  );
  console.timeEnd('part 2');
  return result;
};

console.log(part1());
console.log(part2());
