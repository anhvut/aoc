export {};

const parse = (input: string[]) => {
  return input.map((x) => Array.from(x));
};

const computeRating = (map: string[][]): number => {
  let result = 0;
  let offset = 0;
  for (const row of map) {
    for (const c of row) {
      if (c === '#') {
        result += 1 << offset;
      }
      offset++;
    }
  }
  return result;
};

const computeNext = (map: string[][]): string[][] => {
  const nextMap = map.map((x) => x.slice());
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    const nextRow = nextMap[y];
    for (let x = 0; x < row.length; x++) {
      const adjacents =
        Number(row[x - 1] === '#') +
        Number(row[x + 1] === '#') +
        Number(map[y - 1]?.[x] === '#') +
        Number(map[y + 1]?.[x] === '#');
      if (row[x] === '#' && adjacents !== 1) nextRow[x] = '.';
      else if (row[x] === '.' && (adjacents === 1 || adjacents === 2)) nextRow[x] = '#';
    }
  }
  return nextMap;
};

const part1 = (input: string[]) => {
  const initialMap = parse(input);
  let map = initialMap.map((x) => x.slice());
  const knownRating = new Set([computeRating(map)]);
  while (true) {
    map = computeNext(map);
    const rating = computeRating(map);
    if (knownRating.has(rating)) return rating;
    knownRating.add(rating);
  }
};

const increaseDepth = (initialMap: string[][][]): string[][][] => {
  const maxY = initialMap[0].length;
  const maxX = initialMap[0][0].length;
  const nextMap: string[][][] = [
    Array(maxY)
      .fill(0)
      .map(() => Array(maxX).fill('.')),
    ...initialMap.map((grid) => grid.map((row) => row.slice())),
    Array(maxY)
      .fill(0)
      .map(() => Array(maxX).fill('.')),
  ];
  nextMap[0][2][2] = nextMap[nextMap.length - 1][2][2] = '?';
  return nextMap;
};

const computeNext2 = (initialMap: string[][][]): string[][][] => {
  const map = increaseDepth(initialMap);
  const nextMap = map.map((grid) => grid.map((row) => row.slice()));
  for (let z = 0; z < map.length; z++) {
    const grid = map[z];
    const nextGrid = nextMap[z];
    for (let y = 0; y < grid.length; y++) {
      const row = grid[y];
      const nextRow = nextGrid[y];
      for (let x = 0; x < row.length; x++) {
        if (x === 2 && y === 2) continue;
        let adjacents = 0;
        // up
        if (y === 0) adjacents += Number(map[z - 1]?.[1][2] === '#');
        else if (y === 3 && x === 2)
          adjacents +=
            Number(map[z + 1]?.[4][0] === '#') +
            Number(map[z + 1]?.[4][1] === '#') +
            Number(map[z + 1]?.[4][2] === '#') +
            Number(map[z + 1]?.[4][3] === '#') +
            Number(map[z + 1]?.[4][4] === '#');
        else adjacents += Number(grid[y - 1][x] === '#');
        // down
        if (y === grid.length - 1) adjacents += Number(map[z - 1]?.[3][2] === '#');
        else if (y === 1 && x === 2)
          adjacents +=
            Number(map[z + 1]?.[0][0] === '#') +
            Number(map[z + 1]?.[0][1] === '#') +
            Number(map[z + 1]?.[0][2] === '#') +
            Number(map[z + 1]?.[0][3] === '#') +
            Number(map[z + 1]?.[0][4] === '#');
        else adjacents += Number(grid[y + 1][x] === '#');
        // left
        if (x === 0) adjacents += Number(map[z - 1]?.[2][1] === '#');
        else if (x === 3 && y === 2)
          adjacents +=
            Number(map[z + 1]?.[0][4] === '#') +
            Number(map[z + 1]?.[1][4] === '#') +
            Number(map[z + 1]?.[2][4] === '#') +
            Number(map[z + 1]?.[3][4] === '#') +
            Number(map[z + 1]?.[4][4] === '#');
        else adjacents += Number(row[x - 1] === '#');
        // right
        if (x === row.length - 1) adjacents += Number(map[z - 1]?.[2][3] === '#');
        else if (x === 1 && y === 2)
          adjacents +=
            Number(map[z + 1]?.[0][0] === '#') +
            Number(map[z + 1]?.[1][0] === '#') +
            Number(map[z + 1]?.[2][0] === '#') +
            Number(map[z + 1]?.[3][0] === '#') +
            Number(map[z + 1]?.[4][0] === '#');
        else adjacents += Number(row[x + 1] === '#');
        if (row[x] === '#' && adjacents !== 1) nextRow[x] = '.';
        else if (row[x] === '.' && (adjacents === 1 || adjacents === 2)) nextRow[x] = '#';
      }
    }
  }
  return nextMap;
};

// noinspection JSUnusedLocalSymbols
const display2 = (map: string[][][]) => {
  const offset = Math.floor(map.length / 2);
  map.forEach((grid, i) => {
    console.log(`Depth ${i - offset}`);
    for (const row of grid) console.log(row.join(' '));
  });
};

const part2 = (input: string[]) => {
  let map = [parse(input).map(r => r.slice())];
  map[0][2][2] = '?';
  for (let i = 0; i < 200; i++) {
    map = computeNext2(map);
    // display2(map);
  }
  return map.reduce((a, d) => a + d.reduce((b, r) => b + r.reduce((e, c) => e + Number(c === '#'), 0), 0), 0);
};

const inputSample = `
....#
#..#.
#..##
..#..
#....
`
  .trim()
  .split('\n');

const inputReal = `
##.##
.#.##
##..#
#.#..
.###.
`
  .trim()
  .split('\n');

console.log(part1(inputSample));
console.log(part1(inputReal));
console.log(part2(inputSample));
console.log(part2(inputReal));
