import {ALL_DIRECTIONS, POINT, pointAdd, SERIALIZED_POINT, serializePoint, timeit} from '../util';

const findPoint = (g: string[][], f: string): POINT => {
  for (let y = 0; y < g.length; y++) {
    const x = g[y].indexOf(f);
    if (x >= 0) return [x, y];
  }
  return null;
};

const part1 = (grid: string[][], steps: number, callBack?: (nbSteps: number, result: number) => void) => {
  const s = findPoint(grid, 'S');
  grid = grid.map((r) => r.slice());
  grid[s[1]][s[0]] = '.';
  const my = grid.length;
  const mx = grid[0].length;
  let toVisit: Array<POINT> = [s];
  for (let i = 1; i <= steps; i++) {
    const visited: Record<SERIALIZED_POINT, boolean> = {};
    const nextToVisit: Array<POINT> = [];
    const check = (p: POINT) => {
      if (grid[((p[1] % my) + my) % my][((p[0] % mx) + mx) % mx] === '.') {
        const k: SERIALIZED_POINT = serializePoint(p);
        if (!visited[k]) {
          visited[k] = true;
          nextToVisit.push(p);
        }
      }
    };
    for (const p of toVisit) for (const dir of ALL_DIRECTIONS) check(pointAdd(p, dir));
    toVisit = nextToVisit;
    if (callBack) callBack(i, toVisit.length);
  }
  return toVisit.length;
};

const part2 = (grid: string[][], steps = 26501365) => {
  const multiplier = grid.length;
  const offset = steps % multiplier;
  const needed = offset + multiplier * 2;
  const values: Array<number> = []; // 3 values needed, every mx with offset
  part1(grid, needed, (nbSteps, result) => {
    if (nbSteps % multiplier === offset) values.push(result);
  });
  const value0 = values[0];
  const diff0 = values[1] - value0;   // differential is linear !
  const diff1 = values[2] - values[1];
  const secondDiff = diff1 - diff0; // differential of differential is constant !
  const nbMultiplier = Math.floor(steps / multiplier);
  // diff(i) = diff0 + secondDiff * i
  // result = sum(diff(i)) + value0
  // result = nbMultiplier * diff0 + secondDiff * sum(1..nbMultiplier) + value0
  // note: with sum(1..n) = n * (n+1) / 2
  return nbMultiplier * diff0 + secondDiff * (nbMultiplier * (nbMultiplier+1)) / 2 + value0;
};

const runs = [1, 1, 0, 1];

const inputSample = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`
  .trim()
  .split('\n')
  .map((x) => x.split(''));

const inputReal = `
...................................................................................................................................
.##.....#........#........#...........#......#....##.....##....................#...#.......#.....................#......#.#........
...........................#.......#...#.#...#....#...........................#................##.......#....................#.#...
..............#..............##...#.....#.#...#..#.......#...................................#..#......#.......#....#...........##.
..........##...#..#......#...#.#..........................................#....................#.....................#.....#.......
..#............##.....................##.........#..............................#.............##.........##..................#.....
..............#.#..............................#...............................#....#...#..#.......................#...##..........
.....................#...#....#.......#.............#.#...........##...................#.#...........##......#.#......#.....#.#....
.....#.......#..........#...##.#.....#.......#.#.....#.......................#....#..#....................#.#.#....#.......#.......
..#............#.#..........#.....#.....#.......#..............................................#.................#.................
......#........##..........#........#............##......................................................#.........#...............
......#...#.....#....##.................#.......................#..#..............................#.......#..............#.....#...
.......#..#.......#..........#.............................#.##.........................................#...#.........#............
....................#.............#.#..............................#......#...........##...##..............#..#.....#..............
........#.........#...................#................##..#...#...#.......#.....................#...#........#.#.......#..........
.......................#..#.....##...........................#.#.....................#............#.#.............#.#...#..........
..#....#....#...............#........#.........................#......#...........................#.##..#.###..#....##.......#.....
...........#..##..............#...##............................#..#.....................#............#............................
...##.......#........#.#.....#.........#.#.........#..............##....................#.##.....#............#.................#..
...#......#....#............#............#...............#.#......#.............#.............#........#.#.##.........#....#....#..
.#...###.#....#..................#...#.................#......#........#...#.....#.......#...................#..........##.........
...#..........#........#.......#.................#......#...............#...................#..................#...#....#..........
...........#....#..................#...#.......#..........#....#......#......#...#...........#..........................#..#.......
....###...............#......#........#...............#...##...#...............##..............#....#..........#..#....#...........
.............##......#.#............#........#....................#.#.........#..............#................#.#..............#...
.###....#...............#.........#.#...............................#...#......###....................#.##.........#...............
......#..............#.........#.............#..#..#.......####.....................................#..#...........................
....#...#........#..........................#........#....#.#..#.............#...#...................#.............................
......#...#.................................#.....#...........#..................................................#....#.#..........
..........#.....#.................................##..#........#..................##.......................#.......................
..#..#.##.#.#..............#..#.................#..................#........#.........#..............#....................#.##.....
.........#.......#.....#.#...............#...#....#..#.............#...#...............................#...#.##...#.....#......#...
..#..#..........#.......................#............#...#............#............#..#...............#............................
.#..................##.#..............#..................#.....#..............#....#...#..##............................#...#...#..
.#.....#..#.........................#....#........#........#........#..##........#..........#.#.........##..#..........#........#..
...................#...##................#..........#.......#...............##....................................#...#............
................#...#.................#.....#..............#...............#......#...#....##...................#.....#.....#......
....................##............................#..##..##..##...........#.......#.#.#..#....#...................#................
..#........#.#..#....#..............#............................................##.................................#..............
..........#.......#...............................#.......#..#....#...#.......###.......#..........#.........#........#........#...
........................................#.............#.##........................#...............#..............#.................
...#...........................#.................#.......#..#.....#...#.........................#...#..........#.............#.....
..................................#...#..............#......#..##..#..#........#..#.#..........##....##..................#....#....
..#..........#....................#......#....#.........##....#..........#......##...#.....#........##...................#.........
..........#..............#.............................#...............................#.......................................#...
.............#..........#.......#...#.#..#..#..#...#.......#..#..........#..#......................................................
...#.....#.................##..##....#.#..#...................#......#......#...........#..#....#...................#.......###....
........#....................#....#...........#.............#...............#...........#...#.........................##..#.#......
.....................#...........#..#..#....#..............#..........#..#.........#..##..........#............................#...
...#......#.........................#.......#.......#...#.........#........................#.#.........#......#............#.......
....................#.#..#..................................................#......#............#.##........##..............#......
.......#...........#...#.#..#....#.#.......................##.................................#................................#...
.......#............#...#......#..#.#................#................................#...##....#..#...........#.............#.....
.........................#....................#.#..##..#..............#...#....#...##..............................................
.........................##..............#........#.#...........#........#.............#...........................#..........#....
.#....#..........................#......#..#...#...........#.......#..........................................#....................
....................#........#....#..#...........#.....................##.##.....#...#..................#..........#...............
.....................#....................#.#..................##.....#............#.......##..#...........#.......................
.....................#..#........#...#.#..................#....#.....................................#..........##....#............
...........................#.#....#...............#...............#........#........#...#..........#..........#....................
.................###......#.......#....................#.............#............#....................#.....#.......##............
.........##......#.....................#.....#..........#.....................#......#..........#.....................#............
..................#..#........##..###.....................#..........#......#...#......#.#......#......#.............#....#........
.........#....#.#.............#....#........#.....#..........#...........................#.......#....#...#........................
...........#.................................................#....................#.......#...........#...#.......#................
.................................................................S.................................................................
..................#...............#..........#..........####.............##......#.#...#.......###........#..................#.....
.......................#...#..##...................##..........................#...##..........##........#...##....................
............#................#.............................#................#......#..........##...................................
.............#....#.....##...............#....#..##...#.....#............................##..............#.........................
.............###.....#..........#.....................................#....#.#.........#................................#..........
..............#..........................................#........##...#.#.#...............#..........#............##............#.
............#....#............#.........#...........#.............#............................#..##..#............................
...#...................#.........#...#............#..#........................#.#.#..#..#.............#.....#......................
.................#........................#.........#..........#..#............#.#.....#...........#....#....#.................#...
.....#.................#....#........#.#......#............##.........#.#.........##...........#..#............#..#..............#.
.....................................................#..................................#..............#..#.......#..............#.
.......................................#...........#.........................................#...........#.....#..............#....
...#.#..#..........#...#.##.#..........................................#...............#.#.......#.......................#...#..#..
....##.##.#.........#...#......#.#.#..........................................#.........#......##...#......#................#......
.......................#...#......#....#...#...#.......#......................#...........................#.#......................
.......#..#.................#...#...#...........#........#.........#......#.#.#...##.............#....................#..#.........
........................................................#.............................#..........#...#.................#...........
............###......................#.................................#..................................##...............#.......
..........................................#.#........................#......#.#..#..................#..#......................#.#..
.........##........................#...#....#.....#.#......#...................#.............#.........#............#.#.#..#.......
......#......................##...........#....#.##.....#......#..#...#..#.........#..#...#....#.......................##....#.....
..............................#......#........#...#............#.........#.##..........................#.........#..........#.#....
...##...#....................#.....#................................##.....#.......................#...........#..#....#...........
.......#....#...#...................#.#...........#......#..........#......#...........#.............#....................#......#.
.................................#......#.#...............#.......#..........#.#..#.#.............#..........###....#..#...........
..............#..#....#..............................................#......#.........#...........................#................
.#..........#....#....#..........#..#.........................#...#.....#.....................##...#...............#.....#.........
.......#.......#.#.......................#...............#.........#.......................##.....................#......#...#.....
.....................................#....#.........#.....#...................##............#...............................#.#....
........#...#...#.....................................##...............#.......#...#.......#...............#..#.........#.....#....
....#............#........#............................#......#.....#.#..#..............................#...#..#...#...............
.....#..................#..............#............#.............#.#.#.#......#......#................#.....#.....................
.......#...........#.........................#...............##....#..##.......#........#.................#..............#...#.....
..#..#.......#.#......#......#...........#.#..................#...#..##..#...........#........................###..........#.......
........#......................#........#........##.#......................##..#...#............................#...........#......
...............#.....#........#.#...................#.......#..............#............#........................#.....#..#..#.....
........##...#....#....#.......................................#.........#..##......................##..#......#...................
..#..........#.....#....#.#..#.....................................#...#.#..#..#.#.#..#............#.............##................
..................#......#...................##........#.......##...#.............#............................##.........#........
......................#........#.#.#...........#.......#.#.....................................#.............#....##.......#....#..
.............#.....#...........#..#.............##...#..#.............................................#...........#.#...#.....#....
..........................#..#..................#.......#..#.........#......#..#..................#....#..........#.#...#..........
.....#.........##.....#.......#.......#.........#..#.##...#...................#..........................#......#.#................
....#.#.................#...........#.......................................#.....#.........#.............#..................#.....
....#.....#.................#.#....#...#...............#.....#.............#.............#..................#.......#.....#....#...
.....#..........................#..#.........................#........#....#..#.................##...............................#.
.......#..................................................#...............................#......#.............#....#..............
..#...#......##......................#....................#.........#........................#.......#....#.......#...#....#.......
........#..........#....................#....#.............##...........##...........#..........................................#..
.###................#..........#......................#.......#.......#.............#..............................#......#....#...
...#......#...#.#........#.....#.........##.........................#.#....................#......................#.#...........##.
..........#.........................#....#.....##............#.....................#...............................................
..#...........##...............................#.#.................#..............#.............#..#................#..#...........
......#............#..#...........#.............#.........#....#..#.............#....#............#...........#.....#..............
...##..#..........#...#..................#.....#...............#.....#.................................###..............#..........
..............#.#.................#...........#................#....#...........#.........#.........#...#..............#...........
................#.#...#.......#.........#.#..#...............................#.#....................#......#.......#.....#.........
....................#...#....#...#............#....#............................#.#.#......##.#...##......#.#.#.....#..........#...
.........#..............#..#......#............#.................................#..........#......#.........#...........#..#..##..
...#.#....#.....##..................#.##..##....#.......#.......#.............................................................#....
.....#..#.......#...................#.........................................#...#.................#......................#....#..
............................................................................#......................................................
......................#.....#......#...#..........#........#..............................#.#..#..........#........##..............
..................##...#......#.#.#...#..##.........#......#.................##.....#...#.......#...#....#..#....#......##.........
...................................................................................................................................
`
  .trim()
  .split('\n')
  .map((x) => x.split(''));

if (runs[0]) console.log('part1 sample', part1(inputSample, 6));
if (runs[1]) console.log('part1 real', part1(inputReal, 64));     // 3830
if (runs[2]) console.log('part2 sample', part2(inputSample, 5000));
if (runs[3]) console.log('part2 real', timeit(() => part2(inputReal)));  // 637093462333755