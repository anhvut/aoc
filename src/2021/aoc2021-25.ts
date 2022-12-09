export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

type MAP = string[][];
const initialMap: MAP = lines.map((l) => Array.from(l));

const cloneMap = (map: MAP): MAP => map.map((y) => y.slice());

const moveRight = (map: MAP) => {
  const r = cloneMap(map);
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      let z = x + 1;
      if (z >= map[0].length) z = 0;
      if (map[y][x] === '>' && map[y][z] === '.') {
        r[y][x] = '.';
        r[y][z] = '>';
      }
    }
  }
  return r;
};

const moveDown = (map: MAP) => {
  const r = cloneMap(map);
  for (let y = 0; y < map.length; y++) {
    let z = y + 1;
    if (z >= map.length) z = 0;
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 'v' && map[z][x] === '.') {
        r[y][x] = '.';
        r[z][x] = 'v';
      }
    }
  }
  return r;
};

const part = () => {
  let nbRuns = 0;
  let map = initialMap;
  let end;
  do {
    let nextMap = moveRight(map);
    nextMap = moveDown(nextMap);
    end = nextMap.every((l, y) => l.every((c, x) => c === map[y][x]));
    map = nextMap;
    nbRuns++;
  } while (!end);
  return nbRuns;
};

console.log(part());
