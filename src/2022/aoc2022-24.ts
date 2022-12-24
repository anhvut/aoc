export {};

type KEY = `${number},${number}`;
type POS = [number, number];

type BLIZZARD = {
  pos: POS;
  dir: POS;
};

const parse = (input: string[]): [BLIZZARD[], POS] => {
  const map = input.filter(Boolean);
  const r: BLIZZARD[] = [];
  for (let y = 0; y < map.length - 2; y++) {
    const row = map[y + 1];
    for (let x = 0; x < map[0].length - 2; x++) {
      switch (row[x + 1]) {
        case 'v':
          r.push({ pos: [x, y], dir: [0, 1] });
          break;
        case '^':
          r.push({ pos: [x, y], dir: [0, -1] });
          break;
        case '<':
          r.push({ pos: [x, y], dir: [-1, 0] });
          break;
        case '>':
          r.push({ pos: [x, y], dir: [1, 0] });
          break;
      }
    }
  }
  return [r, [map[0].length - 2, map.length - 2]];
};

const toKey = (x: number, y: number): KEY => `${x},${y}`;
// noinspection JSUnusedLocalSymbols
const toPos = (key: KEY): POS => key.split(',').map((x) => +x) as POS;

const computeLcm = (number1: number, number2: number) => {
  if (!number1 || !number2) {
    return 0;
  }
  let absHigherNumber = Math.max(number1, number2);
  let absLowerNumber = Math.min(number1, number2);
  let lcm = absHigherNumber;
  while (lcm % absLowerNumber !== 0) {
    lcm += absHigherNumber;
  }
  return lcm;
};

// noinspection JSUnusedLocalSymbols
const display = (blizzards: BLIZZARD[], maxX: number, maxY: number) => {
  console.log('');
  for (let y = 0; y < maxY; y++) {
    let row = '';
    for (let x = 0; x < maxX; x++) {
      row += blizzards.find((b) => b.pos[0] === x && b.pos[1] === y) ? '#' : '.';
    }
    console.log(row);
  }
};

type STEP = [number, number, number];
type STEP_KEY = `${number},${number},${number}`;

const step2Key = (step: STEP): STEP_KEY => step.join(',') as STEP_KEY;
// noinspection JSUnusedLocalSymbols
const key2Step = (stepKey: STEP_KEY): STEP => stepKey.split(',').map((x) => +x) as STEP;

const getBlizzardsTurns = (inputBlizzards: BLIZZARD[], maxX: number, maxY: number) => {
  const lcm = computeLcm(maxX, maxY);
  const result: BLIZZARD[][] = [];
  const blizzards = inputBlizzards.map(({ pos, dir }) => ({ pos: { ...pos }, dir: { ...dir } }));
  for (let i = 0; i < lcm; i++) {
    result.push(blizzards.map(({ pos, dir }) => ({ pos: { ...pos }, dir: { ...dir } })));
    for (const blizzard of blizzards) {
      blizzard.pos[0] = (blizzard.pos[0] + blizzard.dir[0] + maxX) % maxX;
      blizzard.pos[1] = (blizzard.pos[1] + blizzard.dir[1] + maxY) % maxY;
    }
  }
  return result;
};

const computePath = (start: POS, startTurn: number, end: POS, blizzardsTurns: BLIZZARD[][], maxX: number, maxY: number) => {
  const mod = blizzardsTurns.length;
  const blizzardsRegistries: Array<Record<KEY, boolean>> = blizzardsTurns.map((blizzards) =>
    Object.fromEntries(blizzards.map((b) => [toKey(b.pos[0], b.pos[1]), true]))
  );
  const visited: Record<STEP_KEY, boolean> = {};
  let toVisit: STEP[] = [[...start, startTurn]];
  while (toVisit.length > 0) {
    const nextToVisit: STEP[] = [];
    const tryVisit = (x: number, y: number, turn: number, turnMod: number): boolean => {
      if (x == end[0] && y == end[1]) return true;
      else if (x == start[0] && y == start[1]) nextToVisit.push([x, y, turn]);
      else if (0 <= x && x < maxX && 0 <= y && y < maxY && !blizzardsRegistries[turnMod][toKey(x, y)])
        nextToVisit.push([x, y, turn]);
      return false;
    };
    for (const [x, y, turn] of toVisit) {
      const visitKey = step2Key([x, y, turn % mod]);
      if (visited[visitKey]) continue;
      visited[visitKey] = true;

      const nextTurn = turn + 1;
      const nextTurnMod = nextTurn % mod;

      if (tryVisit(x + 1, y, nextTurn, nextTurnMod)) return nextTurn;
      if (tryVisit(x - 1, y, nextTurn, nextTurnMod)) return nextTurn;
      if (tryVisit(x, y - 1, nextTurn, nextTurnMod)) return nextTurn;
      if (tryVisit(x, y + 1, nextTurn, nextTurnMod)) return nextTurn;
      tryVisit(x, y, nextTurn, nextTurnMod);
    }
    toVisit = nextToVisit;
  }
  console.log('No solution found !');
  return 0;
};

const part1 = (input: string[]) => {
  console.time('part 1');
  const [blizzards, [maxX, maxY]] = parse(input);
  const start: POS = [0, -1];
  const end: POS = [maxX - 1, maxY];
  const blizzardsTurns = getBlizzardsTurns(blizzards, maxX, maxY);
  const result = computePath(start, 0, end, blizzardsTurns, maxX, maxY);
  console.timeEnd('part 1');
  return result;
};

const part2 = (input: string[]) => {
  console.time('part 2');
  const [blizzards, [maxX, maxY]] = parse(input);
  const start: POS = [0, -1];
  const end: POS = [maxX - 1, maxY];
  const blizzardsTurns = getBlizzardsTurns(blizzards, maxX, maxY);
  const goal = computePath(start, 0, end, blizzardsTurns, maxX, maxY);
  const back = computePath(end, goal, start, blizzardsTurns, maxX, maxY);
  const result = computePath(start, back, end, blizzardsTurns, maxX, maxY);
  console.timeEnd('part 2');
  return result;
};

const inputSample = `
#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#
`.split('\n');

const inputReal = `
#.####################################################################################################
#<<v<.^<<<v.^v<>v^^vvv<<v<^><<>^^^v^v<^<v^>>.<v<v>^vv>>vvv<^<v>v^.<v^>>>>v<^^<v^v<v>>v^.v><<^vv^<><>>#
#<<v^.<^><.<<v<vv<vv><.<^.><>vv>v<>v^^>vv^<<.<^<>.v>vv>v^v>vv<v>.<<^^<.^...<<v^.^.v>>.<<><^v>vv>>v^^<#
#>v<vv>^<^>^^^^^>v<v>v.v.v>v^v^<.^^<^>^<>>^v>v<^.v^^v<^>^>^>vvv<>>.^<>^>^>v>.>.<>v..v>>vvv^>>>vv<^vv>#
#<<>v^.>v^>>v<^><v>.^v.<^v^<<<>v><>^><>v<.v>^v^><v^<>>vvv^>>>v.v.<^^.^<v<^.<<v^<<<vv<v<<>>v><v>^<^<v>#
#>>vv<v>^^^<vv<>^>>>^.<v^<^^>.v>^<>v<<..v<>^v<v>>vvv..v>v<>>^>>^>>^^^<.^^<^>v<.v<^^v^.>^<v><>.^<^^>>.#
#<v<><.<><<<^v<v<<v<>.<^>^v>v^.^.<v>vv>v..^><^.<v<<>v<^>>v<>vvv<vv<<><vv<>>^><.v<v<^^v^>v>>v>v^<vv^^<#
#>^^v^><<<^.^<v><><v^^^^.^>>>>.^v.v<.<^v>v><>^.>>.^>v>>^>>^>^><^^^<v^^^>v<^>^^<vvv<^v^<>.^vv<^>.^>^^<#
#<<vv^^^><<<v.<v>^>v>^^><v<<><<^<<<v>.<v^<<>><>^>>>><v<.^>>>><^<>>v^vv^<.<>.>>.^v>.v^>.>vvvv^v<><v^<<#
#>>v>>^<<v.^v.vvvv<>>><>^v<^<>><v<^vv<.v>v>^<v<>>^<>>>^.>^v<>>vv<vvv^<vv.<<.v<<>.>^^<>^<>^v^^^>>>^.^>#
#>><>vv>^>>v^>v>^^v.<<^v.<..>>>^^vvvv..^v>^>.<.v<^<<.><.^>.<v><<>.<v^vv><^<<>v^vv^>v<^.^^>^<<^.<<<>.<#
#<>v>>v<>>>.v<<v<^^v<>^v<^^<v.>^<^v>vv>^>v<vv><v<v<^>>vv>>>v.<<<><.<><>.<>>^><<^vvvvv^<<<v<vv>>.<<^<.#
#><<.>^v<>^.vv^>^><><.<^>>vv^vvv><v><.>^^^v^..><><.vv<^>v.v<vvv><^^v.<>v<.^v<^>>>v<v^<>^>v<v^v>^v><>>#
#><v>.>^<<v>>.<<<<vv^<<^v^>vv<^^v><>><<v<^>vv>^^>v^^^<<v.vv<><^>>>>>>>^>^^.>>^.<>^<^<v.^.<v^^>.>>v^<<#
#>><<.<^<.<<>vv<>>v<.<><^^>^<>v^<<^^^>^^<<^<>^<<v<^^^.v>v<^v>.<v<.vv>^>><.>^<.>.>>v^><<v<^<^.><.^.^v<#
#>v^^v>v><^><<^^^<<vv>>.v>^<>^^>v>^.v>>v^<^v<v^^>vv^v><>^>><^<v.v>v><<<<>v.<.^>^<v.<<<<v^<<<<>>^>v^<>#
#<^^v<<^>v.<<>^vv^^<^<v>>vvv^^<>>^v^v..v^v>v.^<^.<<v<>v><.<^<^v<>^>v<vv>v><<.vv^.>^>v..>><<.v<^v^>>^.#
#>v^v.v^v><>vv<^v^<v^v<>v<v<<>>..^.<vv^v>v.>^<vv>><^>v>>^^v^vv<^<^>>v^v>^^^><v.>>^^.v.^>><<><.vv.^>>>#
#.^>>.<^v.>vvv<v>>^<.v<v<<v^v>v.>.>v<^.<^.v.<.>vvv^vv><.^^v>>>v>^>^vv<<.<^<>>vv.^>vvvvv^><><v^<^v^>v.#
#<>v^^^.>^>>>^>v.<^.<<^^<>>v>vv.v.^.><v^<v^v<^>^>><vv>^.^.<^^<<<<v>^.>.<<.>.>^><v.v^.^<><^>^v><.vv^<<#
#>>vv^^<v<<v<.>v>^...>vv..^v^>^<>v^^^<<<.>^v>>>>.>^<.v><v><^^^vv>.v^>v.>v^>>><^v<>vv>v>v.^><^v<^^<vv>#
#>^<><<.>.>>v>>v<<^^v^.v^>.>>vv^.><<v^<v^>>>vvv<v<.<>^>>>>v>^^^.v^<.v><<v><.<v^<<<^>v^v^^^.>>>^>>v<><#
#<^v<^<<^<v^>^^<.<..vvv^^v^^><<.>^v<<vv<<>v<>><<>>v^.<v><>.<^vv<<>>>>^><v<<^v^vv.v.<vv^>^>><<^<<<v^^>#
#<v>^><><^^v>><<^>>^>><.>>v<^v>^v.<<v^>^<v>vv^^<<v><vvv>^.<v^v<^v^.^<<^<v>v^v>v.>v<>><v.v.><<^vvv^>.<#
#>><.<><>>>v...v<><v>v<^>><vv^<^^<v<v^<v>^.<^v><>>v<v^v>v^>>v<^>v<>.vv<<^^^v<>v<<^><^<v^.<^<^.>v^..><#
#><<>^vv.v<<v<<^v.><>^.<.<<<^^.v^<v^<vvv^v^>^>><^<>^>>^>^vv.^>vvvv<^<v.>^<.^vvv<><.^^>>^..v<^^<><<>><#
#<.><v<><^.><<.^<^^v^v><>^>.<^>.<v^^^>><^vv^vv<<>v.vv<^.^>^>.>>.<<^v>>^^.vv>vvv<vv>^>>>v^<>v.>.>v<>>.#
#<v>>>>^><^v^>^^vvv^<<v<v<<^^><^<vv><v>>v<>v^^>v>.<>v>^>v>>v.>.>>>^^^vv<<<>^><^<><v<^^^^^.<^vvv^<<<.<#
#.<v^<>>vv<^v^<v>>v<><.>.^^>^<v^>>v<<.<>v>^^v^v<>vv^^v>v>vvvvv>v^^<<^<><^v<v>>^<<v>>^.^v<^<<<<^v<.<><#
#<.^v>^vv^>^v<>>^^v.v<vvv.v<<^.>v><^vv>><.^<><v>..><>>.vv>>>.>v<v><v^..<v<<<^^><v<v<.v^..<v.^v<>>><^>#
#>vv.<..>^vv<^><>v>^vv<^.>^.<v^<v>vvv>>><<^v<>^<^v>^v.^v^v^><^><^<v.^vv<>^v>^<<^v^^>^^>^.v<>.<>v>>.^>#
#<v^^v<.<<vv.<>v^<^>^.<^<v<v^<<v<v.<^^>^>^v>>.<v.>^v.^v.^><<^>v<v.^vv^.^^>>>^<<>>^^<vv>v.<>^.v>^v.>v>#
#<>v>>^^<<>^^>><^vvv^^<<><><vv<vv>v>>>^><^.<v<^.>>v<<<vv.^<<^^><v><^.<><<v>^v^<^><>v..><<...<^.v.^v.>#
#>.>^>v><..^<^^^v^v<v><<^.^>.^v^v<^>>v><<.>v^<<^<<>^<.>>>v<.>>v>^^.<<>>^><v..v<vvvvv^v.<<<v..^^>.<^<<#
#<v>>.^<..>><>v^^>^^>.^^v^vv<>.<<v>><^<^<.^>^^>^<<.v^<<v^.^>v^^>>>.v><>^^<<><^<vv>^v.<^<v<<vv^v.<<<v<#
#.^^^<<v>v^vv^vv^>v^<v<^.v<^^>v^.^^^^>^<<^^>.>^^>^v<.vv>><v^v<vvv^>^>^<^^<v<>.v>^<v.<v^>.<v^.^>v^vv<>#
####################################################################################################.#
`.split('\n');

console.log(part1(inputSample));
console.log(part1(inputReal));
console.log(part2(inputSample));
console.log(part2(inputReal));
