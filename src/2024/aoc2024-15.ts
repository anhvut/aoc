import {consoleTimeit, POINT, pointAdd, pointDiff} from '../util';

const findInGrid = (grid: string[][], target: string) => {
  const l = grid[0].length;
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < l; x++) {
      if (row[x] === target) {
        return [x, y] as POINT;
      }
    }
  }
  return null;
};

function display(grid: string[][], intro?: string) {
  if (intro) console.log(intro);
  for (const row of grid) {
    console.log(row.join(' '));
  }
}

const dirs: Record<string, POINT> = {
  '^': [0, -1] as POINT,
  'v': [0, 1] as POINT,
  '<': [-1, 0] as POINT,
  '>': [1, 0] as POINT,
}

function parse(input: string[]): [string[][], string] {
  const separation = input.indexOf('');
  const grid = input.slice(0, separation).map((line) => Array.from(line));
  const instructions = input.slice(separation + 1).join('').trim();
  return [grid, instructions];
}

const part1 = (input: string[]) => {
  const [grid, instructions] = parse(input);
  const mx = grid[0].length;
  const my = grid.length;
  let robot = findInGrid(grid, '@');
  for (let i = 0, l = instructions.length; i < l; i++) {
    const instruction = instructions[i];
    const dir = dirs[instruction];
    let p = pointAdd(robot, dir);
    let canMove = false;
    while (grid[p[1]]?.[p[0]] !== '#') {
      if (grid[p[1]]?.[p[0]] === '.') {
        canMove = true;
        break;
      }
      p = pointAdd(p, dir);
    }
    if (canMove) {
      let n: POINT;
      do {
        n = pointDiff(p, dir);
        grid[p[1]][p[0]] = grid[n[1]][n[0]];
        p = n;
      } while (p[0] !== robot[0] || p[1] !== robot[1])
      grid[robot[1]][robot[0]] = '.';
      robot = pointAdd(robot, dir);
    }
    if (instructions.length < 700) display(grid, `After instruction ${i + 1} ${instruction}`);
  }
  let result = 0;
  for (let y = 0; y < my; y++) {
    for (let x = 0; x < mx; x++) {
      if (grid[y][x] === 'O') {
        result += 100*y + x;
      }
    }
  }
  return result;
};

const part2 = (input: string[], substitute = true) => {
  const [grid, instructions] = parse(input);
  const subst = {
    '#': ['#', '#'],
    'O': ['[', ']'],
    '.': ['.', '.'],
    '@': ['@', '.']
  }
  if (substitute) grid.forEach((row, i) => grid[i] = row.flatMap(c => subst[c]));
  const mx = grid[0].length;
  const my = grid.length;
  let robot = findInGrid(grid, '@');
  if (instructions.length < 700) display(grid, `Initial map`);
  for (let i = 0, l = instructions.length; i < l; i++) {
    const instruction = instructions[i];
    const dir = dirs[instruction];
    const isVertical = dir[0] === 0;
    let p = pointAdd(robot, dir);
    let checkX = [p[0]];
    let canMove = false;
    let stop = false;
    const moves: Array<POINT> = [robot];
    while (true) {
      const nextCheckX = [];
      for (const x of checkX) {
        switch (grid[p[1]][x]) {
          case '.':
            break;
          case '[':
            if (isVertical) nextCheckX[x] = nextCheckX[x + 1] = true;
            else {
              nextCheckX[x + dir[0]] = true;
              moves.push([x, p[1]]);
            }
            break;
          case ']':
            if (isVertical) nextCheckX[x] = nextCheckX[x - 1] = true;
            else {
              nextCheckX[x + dir[0]] = true;
              moves.push([x, p[1]]);
            }
            break;
          case '#':
            stop = true;
            break;
          default:
            console.log('Unexpected character', grid[p[1]][x]);
        }
        if (stop) break;
      }
      if (stop) break;
      checkX = Object.keys(nextCheckX).map(Number).sort((a, b) => a - b);
      if (isVertical) for (const x of checkX) moves.push([x, p[1]]);
      canMove = checkX.length === 0;
      if (canMove) break;
      p = pointAdd(p, dir);
    }
    if (canMove) {
      moves.reverse();
      for (const from of moves) {
        const to = pointAdd(from, dir);
        grid[to[1]][to[0]] = grid[from[1]][from[0]];
        grid[from[1]][from[0]] = '.';
      }
      robot = pointAdd(robot, dir);
    }
    if (instructions.length < 700) display(grid, `After instruction ${i + 1} ${instruction}`);
  }
  let result = 0;
  for (let y = 0; y < my; y++) {
    for (let x = 0; x < mx; x++) {
      if (grid[y][x] === '[') {
        result += 100*y + x;
      }
    }
  }
  return result;
};

// noinspection SpellCheckingInspection
const inputSample = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`
  .trim()
  .split('\n');

const inputSample2 = `
############
##........##
##...[]...##
##..[][]..##
##.[]..[].##
##..[][]..##
##...[]...##
##....@...##
############

^^^`
    .trim()
    .split('\n');
const inputSample3 = `
################
##............##
##............##
##.....[].....##
##....[][]....##
##...[]..[]...##
##..[].[].[]..##
##.[].[][].[].##
##..[]....[]..##
##...[]..[]...##
##....[][]....##
##.....[].....##
##......@.....##
################

^^^`
    .trim()
    .split('\n');

// noinspection SpellCheckingInspection
const inputReal = `
##################################################
#OO..O.....O.OOO..O.....O....O.......O..O.....O.##
#.OO....O...O...#.O...O.......#.#O..O.OO.......###
#O.O.........OO.OOO.O...#...#O.#.OO.#..O.#O.O....#
#.O....OO..O.................#O.O.OO......O#OOO.O#
#O..#.O...O...O....OO..O.........O..O..O#O#..O..O#
#.#.OO.#....#..O#.....#..O....OO........#....O...#
#...O.O.O.......O.OOO...O.....OO...OO.....O..#..##
#O.#O..OO...OOO.O.#O...OOO.OO...O...O..O.........#
#...O........OO..O...###.OO.#O.OO.OO.............#
#..OOO...O..O.....O.#O.....OO.O..O...O...........#
#O..O#O.O.O.OO...#....O#.............#...#.OO.OO.#
#.#.OOOO...O..O.O..O...........#.....OOO.....O...#
#............O...O....O.....O#.OO...#.#..O...O#..#
#...O..O..#....#.OO..OO.#...O...OO..OO..O.##.#OO.#
#.O............#.........OO.#...OO....O........#.#
#...#..#.OO.O....O#........#OO.O#..O..OO..O.....O#
#.O.....O.....O..#..#OO.O...O........OO.OO.O.O.OO#
#.#O..O....O..O#.OOO.OOOOO..#.....OO....O...O.O..#
#...O..........#.......OO.O..O.#......#..O..OO...#
#O#.O.#...O......O#.OOO..O#.OOO.O.....O..OO......#
#.#O.O.#.....#.O......OO...O.O.O.OO.......O.O..OO#
#....O#....#OO....O.O#.OO.O....O.....O.O..OO.....#
#..O.O...#O..#O...OO.OO....O.....#....O..OO..O..O#
#.#OO.....O.OO..O.OO.O..@....#.OOOO.OO..O......OO#
#O..O...O...OO.O..O.....OOOO.....#O..#OOO.O..O..##
#..O.#OO#..O..#.......O..O.........O........OO#..#
#O..#O......#....OO...O.OOOO..#OOO..O...O....OOO.#
#..O.OO.......OO.......O...#.O..OO....OOO#..#.O..#
#...O...OOOO...#..O..O..O....O...#O....O..O.....O#
#.O....#..OOOO...OO..O.......O.O.O.....O.........#
#..OO.O.....OO..#.O...#O..O...O#.......O.O.OOO...#
#OO.OOO..O.......O....OO...OO#...#...OO....O..O.O#
#O.O..#O..#...O.O..O.O..O......OO#..O.......O...##
#.O#O.#..OOOO..OO......O...O..O.....O...O.O..O.#O#
#.....#OO.O.O....O.O.....O.O....O......OO..##.##O#
#O............O...OO.O.O....O..O..O#OO..O#..#..O.#
#..##OO.....O..#.O......O..#.O##..O..#OO....OO.O.#
#...O.#...O.....O#.O#O.O..OO##.....O#.....O.O..O.#
#O##..O.......OO....O...O....#O....O..O.O..O..O..#
#....#...O....O..O...........OO......#O..#.#O....#
#..OOO#.........#..........O....O.............O..#
#........OO.O...OO..O#OO..O#O......OOOO.O.#O..O..#
#.O.O.....O.O....#.O..OO....O#...O....OOO........#
#..O#.O....O..O..O#...O...O.....O...O.O.O..O.....#
##..O#.OO#.#..#..O...#...OO.....O.O#O.....OO..#..#
#...O.O.......#.OOOO.OO#..OO...OO.O.........OO...#
#..#.##O....O.........O.......OO......#O...O.OOO.#
#OO..O...OO....O.OO..O....#.#O...#O.O..OOOO.O.#O.#
##################################################

<>vvvv>vv>^><^v^>^>^<v><^v^^>^<>>^^^^^^vvv<<^<<v^>^>>^<v^><>v^v<><<>><vvvv^vv><<<<>^><<^<^>v^<v<>vv^^vv^v>>><^<>v<^^>><<><vvv><>><>>>>>^><^<v>^<<^^>vv^>^vv^^^^<^v>>>^vv^<>^<v^v^^v<^>v>>v>^vv>><<>v<^v>^v^<<<^<><^vv<>>>vv<v^^<^><^<^<v><><>^^^^v<<v<^<v<>><>v<^>v>^>^v<<^v<v^>^vv<^v>>v><><>^<>^>>v<>>v>^>^>>>vv>^v>v<^^vv^<<>><>^^<<><v^<>vv<<^^^<^^v>v>vv>>vv^><<v<<vv^vv<><^v><v^>^>^<<>^^>^><v<>v>^v^v^>>v><>>^<><<v^<^<>v^>^^>^v>^vv<>v<v^^^^>v^<<v>v<>>^<^>^^^<^^>>v<>vv>>^^^<^^^^>vv>^vv^><^vv^<vv>>^^^v<^>^^^vv^><<<^>v<v>v<^>^><v>>vv>v^<<>^><^>v>v<<<<<<>v><><<v>><v<^^<>>^^<><>><^^^^>vv^vv^v>^<v>>>^^>>^<v>^^>^^^<v^^^>^v>^vvv<>vv^><>^>>^>v>><>^>^v^v<>vv^<^><<v>>>v<><<^^v<><<^^^^vv<v>^<^<vv><^v^<<>><v><<<<^v><^vv^<v>>^<^><^>^vv>^^v<>^v><<^>v<v^<<>v<v><vv<>><<vv>v>^>vv>v>vv>>><v<<^><v<^>v<<>v^<^^>^<^vvvvvv<<^v>^v<^>^v<<<^^<>^<^vvv^^^><v<<^<>>v^<vv>>v>^v^<>^<v>^v<><^><v>v<<^^>^<vvv<vv>^v^<>^>^>>v^^v<><>v>>^vvvv<<<<<^>vvv<<^>^><^<^v<>><<<^>^^<>v>v<v<<>><<>>v^<>>vvv^v>^^<>^>^>^v<^v^>^<v<>^><vv>>v^^^<^>v
<^>v<>^<<<<>^^v>>><>>v>v>v>>>>><^<v<><<>v><v^v^^<v<<<>^><v>^v>^v^>>>>>v^>v>>>>^>^>v<<v^^<^v<<^^<<<v<<v<v<^^^^>v<<^v^^^^><>vv>><<>><<v^<v>^vv><<^v<^<>>>^vv^>>vvv>^>><<<^>>^vv>>^^vvv^<<><^<>v>>^^^<<^vv^<<<vv>v<<<^v<>v<v^<<<v>><>vv>>>><v<<>v>v<>^^^^<v>^v>vvv<<>>^^<<^>>>v<vv>v><^^v>^v^^^<v^<><vv><^>>^<><>v>vvv^^v^vv<^v^v<>><>vvvv>>vv^^<<>v^v^>^<v^^^vvv^<>^vv>vv^>^>^vv>v>><<>^v^<^^<<^^^<vv<>>^>v><^<>v>v<^^vvv>v<^<v>v^>><>^<<<vv^^v^<v><^<>^><<>>v<><v<^vv^<<<>><v>v^<v<>v^><>v<v<v^v>vv<v^^>><>v^<v<v^^vv>v>vv>^v>vv^>^^<^v<^>^<<>>vvv>><<v>^><><>vv<vv>><v^<vvv^^v^><v^>><<vv<<><<>>v>><v<v><^^<v<^^><>v^>><<v>^vv>^<^<v>v^^vv><>>v^<^^v<><<><>v^vv>><>vvv<v>vv<^>>>^<<v<>>^<><^>v>vv<<>v>v<>^^<^^v>vv>>^^>v>>>v^<^^>v^v^^>^>vvv<vv^<>^^<vv^>vv<vv<>vv^<<vv>vv^^vv^>^>^vv>v^v><^>^v^>^^^><^>v^>v<<><><vv<<<v^<>v^^>^v<>>^><>^^v<<><>vv^<><^v^<>v<>^^>^>>^<vv^><>^^>^^^>>><<>v^^<<^vv<<^<^^>v^v^v<>v<>vv^v^v<<^^^v<>>^>^^v>v^>v<<>^<<>^v<v<v<^<<^^^^>^^v^><<>^vvv<vv<vv<<>>^<^^^<<>>vv<<>>^^^^^^<v^>>v>>>v^^^^<><^vv<>>^^<>>>
v<>>>^<>>^<v>v^^<><^><<>^vv<v>^>^^v<^><>v>^v^><<v><>>^>><>vv^v>^v><v>^v><>vv>>^<>v>v^v^^<^<^>^v>^<v>vv>>>vv<v^>v<^>^<^>v>><<><^^<<v><<v>>v>^>v<v>>^<vv<<v<><<<^v<>^>^<^v<>><<><vvv^<>v<^^<^>v>><^v>v><v^^^^><v<<^<<<^><><v<<v><<<<^><v^vv<><<^^><<vv^>vvv^>>>>v<v>>>^^^>v<<^<^>v^v^>v^>>^v<>>>v<>^><^>^v<v<><^>>><<v^>^>^<^<^v<^^>>><<v><v<<<vv<<<>>^>v<<><^v<^>>>v<^^^v><v<^>v<>^<^^^><<vv><>^>>vv<<><v^>v<>vv<^v^^^v>>>vv>^^^^v<v><<<<<<vv<v<^<v<>^^>^><^^^^v<>v^vv<>^^^>^<<vv^<^><^>>vvv><>><vv<v<>^^<v<^>^^<^v<<>^vvv>v>^v^^><>v>v>>vv<^><v^^<<>v^>v>><^v>>v<>^<<<>^v^^vvv^^v>>v>v^<v^<v>v><vv^<v^>^><v^vv^v^^>vvv>>vv>>>>><>>^^<v^><>^^<><v><>v>>^v^<^^>><^<<v>v^^<v^v<>v^<v^<<<>^>^v><><<v><^<vv^<>>^^^vv^>>v^<v<>v^v>v<<<<><^<v><vv<>^v<><<<<<vv^>^><><^v<v^><>v>v><<^^^>>^^>^vvvv<>^<>^^>>v<vv>>><^<v>>>>^v^><>^<<^vv<<>>^v<v^^>^>^>>v^>vv<<^><><^<^^<^vv<<<><v<v^^v<>>>^^v>v^><<<^^>>>^<>>^><vv^<v>^<>vvvv<vv>^<>^v<^^vv<vv<^<>>v<<vv^<>vv^><v>v<vv>^<>>vv<>vv>><>vv<vv<>>>vvv><><<v>v<<^>^v^<<>v<<^>>v>><><^<<^v^>^^>>^v^^v<^<
^<>>><><<v^^^<^>>^v^>>v<v<^<^><^<v>^v>^>^v>v^v^>>^<<><><^v^^v<>^>^v^^>^<<^v>v<<>^^v^^v<v<^v^^>vvv>>v<>><v<<<vv^<^<>>>v<v<<><>^<<>>v>v<<^>v^>^><>>><<^<v>v<<v^v>v<vv>><<<v^^v<^^>><>v>>v<><v><vv^>>v<vvv<v<^>^>^<>^<^<v<>v^v<^vv>^^<<>^><v>>v<^<v^vv^v^vv<<<>^^<v^<<>vvv^>^^v<v>^>v<><^<>v>^<<>^v<v^v>^<^^<<>^>^>><^><<v><^>vvv>^>^v^<><<^<>^<<><^^>>^<>^><vv<^v^^>vv><<^^v>v>>><<>vv><v<^v^<^^^v<v><v^<>><^>v<<v>>>^v^v^>^v>^^<^><^^>>>>^>vv<^<<<v^^v>><>^><>>^<><v>v>v^<><<>vv>^<^^v^^>>^<>^<<<><<<^^<<v^><<>^v^>><>><^>v>>^><><><>^v<<>v<vvvvvvv<>v>><>^v<<v>><<<v<^<>v>v^^^>>^<^>>>>>^v<><v<>>>>^v^^v>><v<vv>^v^^>>^<>><^>v<<>vv>>>^^v>^>v^vv^vvv<>^v<<>^^>>v^<vvvv>^>^v>vv^^^<v^^<^<^>^vv<^>^^v>^<^^^><<^v>v><v<v>>^>^^^>>>^<>><v<^<<^^<<<v^><><><<^>v<v<><><v>^>><>vvvv^^>v><<^<^<vvv<>^><^><<<<>vv^^^><v^v>v<^v<^>vv<v>^>>v<>^>>vv<v><<<<<<^>^vvv<><<^v<^vv<>v><>^><>v^^>^<^<^<><vv<><^v>v>v^<<<vv>^^^^v<>v<<v<<<v<v^>^v^<v<^>>v<>>^v>>^>vv<^><<<<<^<<<vv^^^^>v<^<v>><<v^<<><>^<<^^v<^^>>>v><>v^>^<^vv<<^^><v<^<>^<v>>v^v>>><v<>^<
><>>>vv^^>v^^^<>>^v^<>>^>^>>^<>v>^v<^<^<>v>^<>>v^<<<^<^^v><v<^>v^<><>^<<<><^<<<<>^v<^<^<vv^>>^<^^<vv<^<v^v<>vv^><v<v>>>>vv<>><^v^^>v^<><<<^^>v^^^^>vv^<v<<^<v^>v>v>><v<v<v<vv^v<>v^v>^<>v<v>>vv<<<v><^>>><v>><^>>v<^><v<v>^>v<^<>>v>>^v<vv>v>>^^<^>>vv>^vvv>^v^^^^><><><>>^<^<^>>v<>>><>v<^<v^v<^<<>>v<^^>v>><><v><vv<<^>v<v>v<<vv<<<^v^<>^^v^<>^<v^^<v>v<<<^>>vv<><<^>><>^^>^>>^^><<v^>>^^<^^<>vv<>^<>><<v^^<v>>^^>>vv^<^^^<vvv<>^><<<>v<<><v>>v<<^^<<v>^>^v<<v<v<v^>>^>v>^<><<>^^vv><<v^><^<><v<><<>>vv^<^v<<<v<^^>^>vv<v^>><v>>^^v<v<>>^^>v^^^<v^>^vv<><^v^<^v^>>vvvvv^><>^^vv<v>vvvvv^><v>^v^vvvv><^>>^v<<^>v<<>^v^^vvvvv<^>^><^<<>v<>v>>v^v^vv^vvv>v^^<^<<>vv^v^<v>v><vv><^<^><><v>><^^v^<>^^^>^v>^><^^vvvvv^<^^<v^v<<<v>v<><<>^>^v^<>>v<>><^v><^<^^>^^><v^^^<>vv^<^^v^^<^v^^v^v<>^^>><<vv^<<>>v>v<v>v^^<^>^<>vv^^<^<^^v<^^v>^vv<v>^v<^v^v^<^>>^><v<v^>^v>v^v>>>v^>>^^>>^><>>v^<<>^<>vv<<vvv<<>^v<^^>^>v^><>^^><>>><<<<v^^v>>v^vv^^<><<><v>><v<^^^^^^<>v<^^>>>v>vv<v^>>^^v^<>^><^><v^>vv<<>><v^^v>v^^<>>>>^v<^>^>v^>^^^>v^>v>v^<<>v
v>>>v^v>^<v<<^^>^^^vv<^^<<^^>><v>v^><^<^^>^^>^<v<^>>v<v^^<^<^<v>v^v^^<^><v>^v^<v>v^<v<vv^^^^^><v>vvv<>v^v>>>>^vv^^<^>><^^>>>vv<^<^vv>^v<<v^>^<v^><<^^^vv>vv<^^<<>v^^^v^v<<>^v^><v^^v>vvvv<^v><<^v>^v^^^^<v<^>^<<>v^<vv<v<^^<vv>>>^<<v^v^<<^^>v^>^v>^v<>>v<>v>vvv<<><<>>v^>^>>v>^v<>>^><vvv^<^<^<>vv>v^vv^vv^v^^^v<>><><v>>>^^^<v>^vv<v>vvvv^^<<vvv><>><<^v<^v^v^<<>>>v>><><<v>^>v><^><v^>vvv<^v>>v^<^<^v^<vv^^^^<^<^^^^>><^<>v^<<<v>><^^<v<v<><v^<<^<<vvv><v<><><>v><<vvv<v<>v^>^vv>>v>><<<<<v^v>vv>^>>><v<^^v^>v^v>>><>>^v<>v^><<>^<vv^>^v<vv><>><>^<v<^^v>>v^<<^v>v><^vv<><^^^<^v<^>^^<<<>vv^^>^>>v^^<>><^>vv>^v<^vvv<^^^>>>><<<^>>v><<><<<<v<<<vv>>vv^^>>v>>>v>>^^v^vvv>>^<v><>^>vv>><<<>^^<vv^^v<^^>><<><>v<^<>^v^v^^^<<>>^<v><>v<<^v>v>v<><v><><v<<<vv^^>^^<v^<v>^^^v><>><>^^<>>v<<>v><<>v<>v>^^<vv^^^>^v>^>v>v<v><v<>v^>><^^><>v^v<^><^>^^>>>><v<^v^>v<^<>^<^^v<v^>vv^<<<<<<^v<^<>>^<v^<<<>^^>v<^<v^^^v^v<^>v>v<<<^^><<<v<<^^<>>^<<><^^<^vv>v^^^><^^<vvv><^v^v^<^^<^<^^^<v<^<^><v^>>v<vv>v^vvv^^vvvv><>>>v<>vv>^v<vvv<^^><v>v^<v^<
<<><<<^v^^>>>v>v><><<<^^v>><><><^^^<v^v<v^>>>v^vv^><>v<<><<<v>^>v>v^^v>^>><^v>^>>>^<vv<v><><v<<>>>^><<^^^vv><v<^>^v^v>>v>>^^vv><><<<<><v>>v>v<^vv>>>^^<^^<<^vv<>vv>^<vv^<><v>><<^>><<^^<vv><^v^^<^><vv<>v^<<>^v<>>^<vv^>v<>v>^v^^v>>^^^>>><><vv>>^><v^<>>>>^^<v>>vv>>>><>^<^v^^^>v^^<<<vv^^><^<v<v^^v^^v^v^vv<>v<^<>^^<v><^>>^<^^^>><^^>^vv^>><v>>>v>^v^v^^<>>>><v>v^^>v>>v>>^^^<>v><vv<v^<v<><>v>^vv>^v<v<>>v<v^^v>^vv>><<^v^><<<v>^>v><vv<^>>vvvv>^>v>^^^>^^>><v<<vvv^<<^>^>v>vvv<^<><^vv<>>>><><^><<>^>v^v>^<^^>>>v<<^<^>v<vv>>v<><^><^^^<>>>^v^^^>>>>>><<<v>><^v^v>v<v<^^^^v^>v<v<><<^^<><>v>vv^<^><<><vv^>^v<<^^>^^<^<<v<v^^<<v<^>><v>^vvv<v<^^^vvvvv^>v<<vv>^<>>>v<^<vv>^v<>v><<vvv^^>>>v>>><^v>v<^^vv^v<vv<v><vv^<^v<<^<^^<>v>^>>>>^><<<>v<^>>^v>v^<<>>vv<v^>v>^v>>>>><v>>^>^>v>>^v^v<v<>v>>><v>v<^v<<v><>^<<>vvvvv>>v>>>^^<>vv>^<^><>^><>>>^v<>^<><v>><v<<<>>^^>><v>^v^v<<>v<^v>>v<<>vv><>>>v^^<<^>v>v<>>>vv^<v^v<vv<>^vvv^>>><<<^v^>>^>^>>^>vv^^>v^^>>v>^v^>^>^^vv<>>v^^vv>^<>>^>>^v>^>>v^><^^<^><^<>v^<v<<^vv^^v><v^vv^^^v^^<v
<<v>v<^^>v><v>^v>^vv<v<<^>v<^>v<^>><><v<>v>v^>v>^><^<>^<v^>><<>><^<^<<>>><v^^>>>v><<>>^vv>^<v^^^^<vv><>v^^<><<>>^v<>><^>^^>v^><v^<v^><><>v^<v<>v<<>v>v<v<<^>^^>vv^><>><<<^<^>v<^^<<v^^>v^<^^>^>v^<>>^<>^^v<<^<>>><v<v^>vv<^^v^v<v<>^^v^v^^>^^<vv<>^^<^><<<^^><vv>^v^vvvv>^<vv^<^v<vv<<v<v<v<^^v<^v^v<>>^<<<>^vvv<v>vv^<><^v>>^>^^v<v^^>>>^v^^^<^^v>v^><v^^<vv<v^v^^v^v<^^>v<^vv<<vvvvv>>^^<><^v<>^>>^<>^v<>^>>v^^<<<v<vvv>v^<><><v><v<>v^><^v>^^>^><^^<^v<vvvv<>><<>>^v^v^<^^^<<<>^>><>>>v<v<>>^v><^<^<^vv^<<><<v^>>>^>^^<vv^><^<^vv<v<^>^<^>^^^<>>^^<>vvvv<>>v>v^<<vvv^>v^<<<>^^>^<^><^<v<>>^^>^v^vv>>^^^>><v<>^v^<v^>v^^v>^v<<<vv^>><^^<>><vv<<v>^><v^><^><v<><<v<^>>^<^v<<vvv^<^>vv^>^^vv<<^^<>^<>v<v><^^v^v^<><>^>>vv<<v^v^v<^^>v>v<v>>>^><v^v^^v><v<^>>v<<^v<<^<^>^^<>>^>>>v<v>^^<>>v>>v^>v<vv^^<vvv<>v^<>>^><<v^<>>v<><^^^v<v<<<^>v<<<>>^><>vvv><^^^vv^<>>>v<>v>>><>^v^<<>>^>^v<>^v<<^<<^<<>^>><^v^<><<<<><>^vv>^<^v<^^^>^>>v>>^^<<^>>v^<^><>vvv>><<^v<<<v>v>v><<^vv><vvvv>^>v^^><v>>^v^v^^^^^^v>^^><>v>>vv><v>vvv<<><<^>v>v>v^>^^
><<^vv>>^<>v<^vv^^vv^v><v<^v>v>v^<>><^^<>^><v<>>vv>v<v^^<v>^>>^<><>>v<>^>^<^>><>^>^<vvv<^^v<>v<v^^<v<<^<v<>>v>>^v>><<>^>>v>vv<^v<^>^>vv^><v<^vvvv^<v>v>v<^^vv<^<^^<>^>v^^<<vv><v<^^><v><<vv<<<v<v<>^^vv<>vv>v>^v^vv<^^><<<<^<<v<^v<v>^<>vv<<>^>v^>>v^>>v<>v>vv>vv<>^^>>vv^>v<v^^^><<<>>>^>v<vvv>^>vv^vvv<v<>>^vvv>><v<v<^v>^v^v^^<v^^v><<^^^^<vvv^<^^^^^v>^>><^v><<><<^<^<><<>>><<^>^>>><vv>^<^<><>^<<^<<^v^>v>v<^v>>><^>v^<v>v>^<v^v>>vvv^><><>^v^>^<>^^^><<><vv><v^>^><><><^>^>><v^^<^><><>>^><>>vv>>v^v<<><^<<^<>^>^^<^<<>^vv<>v>v<>><>vvv^>><v<>vvvv>><^vv<^vv<^^<v><<v^vv>v<>>v^v<>v^>^>^>vv<>^>>^<<>v^>>><^<v>^<^>vv<<>^vvv<^<>^vvv^vvv<<>v^<v^vv<>>>><>vv<v<^vv<><vv<^<vv^<v>v^v^^v><<>><v^^>^v><>v^v<^>>v<<^<^>^^<^><>v<^v<vv<v>^^>v>>>>v<^<><^>>^<^>><<<>>^<v^^^v^^><>><>^^^^^<vv><<^<v>vv<<>v<>v>>v>>v^<<>>^>>vv^^>^<<v>>>v<vvv^<v>vvv<^vv><v<>v>v<<>>^><>^<>vv<><><v^<v<>^<v^v>v>v^<<>vv<^vv<v<<<<vv<v^<>vv<>^v^><v<><<>v><>><v>^^>^^v>vv>^><^<<^<^><vv^^>^>v>>><<>vv^^vv><><>vv<vvv>>>^<v>v><^>^^v^>>^v>><<^^^^^<>>v<v<v<^<^
<v>>>^^<>>v>v>^>>>><<>v>>>>^^vv>vv^v^>^v^^^^><v<^vv><^^<<^<vv<<^>v>><v<v^v>^vv>^>><v<<<vv<^^^v<^<>>^>^v>><<^>>><<^^^^>^^^v>v^<^^>^v><<^^<^v^v<><<v>><^v<^^^>v^v>v^v<<>^<>v^>v><<>v<^^^^^v^<<>^<<<^<vvvv^>v^>>><<v>>>v>>v>>^v<vv^>>vv>^>>v^>^<><>v^<v><vv<^>><v^v<><<v<^vv<v<<>>^>>>v>v>^v<^v^>>^v<v>v<^<^^><>v>^<<<>>>^<v<v>>v^^v^v><vv>v^v^<<v<^><v<v>>>>^^v>v^^<<>vv>^<v>v^><v^>><><<v^^>^<<<^^><<^>^v<^v><v<v^^>v<<><<<^<^v^^v^>v<v><vv<^<v<^>^v^<^^^^>^<<^^>>v^<>>>>v^<v>^^>^>v><v<>>><^><<<>^<><<>>v<v<v<<^^>>^^v^>v^^<<v<<v<<^v<>^v><<>><v<<>v><>v<vvv>>v>^v^<v>v><<><v^<>v<^><v^^<><<^>><<>vvv><^^>v<v^>v^v>^><^^><<^^v^>v^><>^vv><>^>v^^v><^<<^vv<>v<^v>v<>^>vv^v^v^v<<>^<v>>v<>>v<v<<><<v<><><<^>^<^<<<>v^vvv><<v<>v^><vv<<>vv>v><v<vv^^^<^v<<^>vvvvvv^><^>^>>><>v><<^<><>v>>><v^>><v^>^^v<v^vvv^^^><v>v^^v>vv^v<v^^v<>v<v^^^^>v^<^^^<<>>>>v>v<<vvvv<>^v^v<v^v<vv^v^^>v<<^^<^><<v>>>^^^>v><>vv>v><vv^><<v<<^^><v^>vv<^>>^^^^<^>>><vv<^<><>>^>vv<<<v^<>^<<v<><v<<v<vvv><<^>^<^v^vv>><<<<<^^^>>>v^>vv<<>v<<^><^<<<<<<<>>>^^<<^<^v
v<<^^^<v^<<v><<vv<v>^^<v>vv<v<<<<^^>vv>>^<^<vvv^^^>^v>^<^^<>v><v>^vv<^^<v<<<v^<>vv^^v^vvv<vv<>>^>^^vv<>v<vv><v><v><<^<>^^v>>vv<><<>>v>><^>^^^^>vvv>><^v<><^vvvv<<v^<v^vv^<^^><<><>>v>^vv>^^<<^<^^v<^^>vv><vvv<<<vvv<v^>^>>vv<<^><v<v^>>>v><>>v<><^^^<<<>>v^<<v>><>^><<>v>v^^v>v^^<<^<>^>v>^^>^v<>v>>^^v>^^><<^^^v>>>v<<<><^<<><vv>^^<^>>vv<<>>v><^<<>v^v^>vv^v<<>>v>v^^^^^><^>><><>v>><>>>>v>>v>v^v>^v<^^<>v>^v^^^^vvvv^^vvv^^v<^^>v>>>^v<v><<^>>>v<^v<>^<v^v>v<v>v^>^^v><>v^^<<>^<^v^>v<v^^v><<<v<<>^vvvv^^^vv>^v^vvv<v^^v^^^>>^<<>^^>^<v^>vvvv^v>vv<>vv<<<<>>^^<<v^<vvv^>>v<<^vv^>vv^><^>v^<<<^vv^<>><^<^><^^v><^v>>>^<>^v<<^>>v^v<<<>^^>>^v<<<v^^<^vv>^><<^vv>v>>>v>v<vv><v<^<v><^v><vvv^v>^><^v>^<>^^>>^<><v>^<v^<^v^v^v>>v>>v<>^<^>^<<^^>v<vv>^<<v^^>^>>v><^>v><^^<^v^^v<>>vv^><<<<v<<<^>>><<<<^>>v>vv^v>>><^><v^^><v^>v><<<^v<<>>^><^v>v^<^v>v>^<v<<<v><v>vv>v<<v^^vv<v>>>^><^<v<<<<<<<^^^<v<<v>^v><^^<<<><<vv>v<>^^<v><<>>v<><v>v<>>>^<v<v^^v^>>vv^<^><<<^><v>^^v<v^<>><<>>>>^<^<><>vv<>^>>vv^>v^<^>>><<>>>v<<v^>^vv>>^v<><^<<^>v
>>>><v>^^^<<>v^vvvv^^<<><v<>^>vv<v^><v>^^v<v><^<>^<><^<vvv<>^<>^>v^^^<v><vv>>^v<<<<^^>v<<>><<vv^v>^^v^>vvv^v<vvv^<>v>vvv<<^<^v>v>v>>vvv^^><^v<v>^^v^>^>>^>><v>^>v>v<<v^vvvv>v^^v>v<^v^<^<^>v^^^vv<^v^<><>>v>^^>^v^>^vv>v<v^v>><v><><>><<^>v><<>v>vv<>^v^>>^<^^<><><v<>><^v<><>v<><v<v<>>v^<^>^>>^>v^><<v<>^>>><v^<^<^>>^^><><v>v^<v^<<>>v>^>vv>>><>^<v<^<v>^v>^^^vv<v^^v>v>^v^>^v^v>^v^>^^^v>^>>>>>^vv>^^<>v>v<<v<>^<<vv<<v<<^><^<^<v^^<<<^^<vv<<^^<^>vv>v^v<vv^>vv><>v>^v^<v>^v<>^><^<v^^^>v<^<v>v>>^><^<^^<<<^v^>>>>vv<<v>v<>v<<v>^<vv^>v><<^^>^<<v>^<<^>^><>>v^<^<v^v<>^^>>v<v^v>v^v^>v^>>>vv>v^v^^<v<<v^v>>>v><v<>>v>^<v^v^v>v<v^^v>>vvv><>^v<v<v<<v<<v<^<^v^>v>><<^^<>>>>v<^<^^<^v^>v><v<>^<vv>>v<>>v^^>^v>><v<>>>^v<><v<>>vvv^>^^>>>>v<<^><><v<<>v^vvv>^<v>>>vv<<v>^><>^v>v<<>>>^<<<>v^^<v<v<^>^^<v<>>v^v^<<>^^^>^^<><v^v^>^vvv<v<>^<<^<v>v>^v^<>v<<>^<><<^v>v>^<^v>>v<<^^v<vv^<v^^<><v<<>v<v<>><<v>^v>v><><<<<<<v>v<v^v^v<v>v^^<^v^^<v>vv^>v>v>v<v^v^<^<v^>^<vvvv<<^v>^<>><<><^v^<<^<^^v^vv<>^<<vv>^><^>^<v<^v<v<v^<<^^^v^<<vv<>v
v^<<^v>v<v<<v><<>v>^v^v<<v^^^><^v<v^>^<v^>vv^^><v<<^>>^^^><<<<^vvvv<^>^<>v<><<<<>^>>>v<v^v^^^v><>^><<^vv^^<^<<v^>>^vv^<><<^vv>^vv<>v^>><>>^v^<^><<>vvv>>><v^^v>^><<^<vv<^v>>v^^>>><><v^^^<v>^^<^<><^v<v^v<^>>><><vv^>v<>>v^<vv<>^^v<vv<>^^^v<^>vv^vv<v<<<^^>v>><vv^vv^>>><><^>^^vv<><<^^<v<^^<vvvv<^^>>><^v>v<<>vvvvvv>>>vvv<>^^^>^v>v<v>^v><v<^^>><v><v<v>^<v^v<>v^^<>^<v^^><<<v^vvvv<<^<v^^>><^<v<<^^>><<v^v^^^<v><<^^><v^^^>^^v>v<<>v<<v^vv>>^vv<<<<^<><<^vv>^>^^>><>v^<^>v><>v^<v^>>^>v<<v^^v^^^>v>v>^>vvv>v>>v<v<v<<^v>^^<^v^^v><>>^v<^<<^^^vvv^><<<<>^^^^^v^v<<>>vvv^<<>v^<vv>><<^^v^>v>><<<><<^>v><>vvvv><v<^>^^<^<>^^v<v^><>^v<>v^<v^>>^^^^<^^>>>v<><>v<<>^v^<>v^<<^>v^^^v>><v<<^>>v<<vv>>>^v><>>>^v>^vv^<<v<>>>>v<>vv^^<v><<v>v<>v>>>>vvv^^<v>v<<<v^><<v<><^v<<<<<<>>^<vv^v<>^v^v>><^^^<<^v>>^<^v>v<v^^<^v^^v^v<><vv<v<><><v<^<^^>^^^<v<>>^v><<<><^>^v>^^>vvv<^>><<<v<v>><>^<v<v^v^^<^vv^>v^^>>><vv<v>^^^v^>v^<^v<vvv>^^<<<<^<<>^v^>^><^>^v><v>>>><>^>v<><<^>^v^vvvvvv^>^v><<v><^<<^^v<^^<^vvvvv^^v>><^v^v<><^^vvv<>>><^<vv<^vv
^^>v>v>>v>^>v><^v^v^v>v^<^^^v<^v^^^^<>v>>v^<v<>v<^>^^vv><v>><^^<^<v^>v<v<<^v>v<<^><><<<>vv<v>>>v>v><^v>>v^^<v<<<v<<^v>v<>^v^<^^^v^v<<v^v^v<<^^<>^<<<^>vv><^^^<<<>v^^^<>v^v^v<^<<v^<>>v^>vvv<><><>>v<^^<v^^v<^^vv^v^<v>v<<<>>>>^v^><^<<<>^v<>>v^<>v<^<<v<>><v^vv>v<^v<>v>>>>>^^^v>^>v^^^^<><<>v^<v>vv>^^^<v>v^^^<v^^><v^^v>>v<><^v>^<^<^^<vv^<>^^<^v^^<^><^<^^<vvv><>>^v^^><^<>^>>^^v^^<v<^>^v^<>><<>^<<vvv^v<<vvv>^^^<<v>v>>^v<v<<vv>v^<vv<<<<^v<v^v<vv>>>v>>><^^vv^<<^<^>^^>v^v^v>v^<>^>^v<<<vv>^^><v^^<^v^>>^><v>>^<>^<<<>^vv^><>>^<>^^<v^<<<><^<v<>^<<v<<>^vv<<^>v>v>v>><<>><vv><v<^>>^<<>^^<v<^><>>><^<<v>>vv<><v<v>^>^^<<^<<^v<<^^>><^^<v^^<>>vv><^<v^^^v^^v><^><^v^v^>^^^^^>v>>>><>^>vv^^<^v^>^>^>^<^<<v^<vvvv>>><^<>><^^<>><vv<<><<<^^><v^>><>^>v<v>v<v<>><^v>><<<<<<^^>><<vvvv<>^>>>^^v>>>^v^>v^>v>><<<<<>><^<v>v^><><<>>v<>^<>>^^>v>^^>>>vvv>^^<v^<v<v<<v<^v>v>>><>vvv^<v^^>^>^^>vv><^^v>^<^>v^^><>^v^<v^<^<>v<vv<v^v<vv<<v<<<<<^<^><<<>^^>vv^v<^^<>^^v<<<^^>^>v^<>><<v><<<^><^v>>^^>>>>>>^v<<v^v>vv>^v^v<^^>vv^vvvv^^><>v^<<^<
v<><<v>^^^<^>^v^^>>^vvv>v>v>^>vvv^<<<^v<<<<^^>>v<<><^v<<>>^<^>>^^<^<>vv<v>^>><^^^<^<>^v><v>v><><v>^vv<v<>^<><v>v>>^<<^><>>>^^<<>>^^^<^>>v<<<v>v<>^>><^>^vv>^v^^>v<>v><v^><vvv>^<^vv<^<<^><<^^<><>^v^>>>v><vvv<<^>^>^v<>^v>>><><v>^^^^^><<v><v<<<<>vv>>^vv^^v<<vv>v>v^^<v<^^^v<>v><<vvv>^^<>vv<v>v<>v>^>v>v>^^v<>^^>v>^<^^<^v>^<^>^<v>^^v^^><><^vv>^v^v<<>^^^><vv<><^>^v<v^>v<<^^><<^v^<<v>>^<v>vv<^v^<v<<<<><>>^^><<v^><vv>>>v<^<><>^v<v^<<>>^>v<vv^>>^^><v^<<v^>^^>vv^v<<>><vv><^<>v<<v>^v^>v^>^v<>^<v^>>^v^>^>v<v^>><>><vv<vv>>vv^^>^<<vvv>><<v<v<><>^>v>^>v>^<<v<>v^>vv>>vv^^>v^>^^v^^^^<>^><vv^^>vv<><^v><v<>^v<v^v>>vv>>^>^>><><v^v<>>^<>v^vv>^vv<<^v>vv<vv^vvvv^^v>>>^^<<<v>^>v^^v^v<^<vv<>>>v<v<v>v^vv<>>v^>v<^<^vv^v>^^><v^^>^vv^<v><><^<^v><^>^^<><v><^<<<<v>^vv<vv>>>v^^^>>>^>><<<>^>^^v><^v<v><<v<<<v<>^^vv^>^>^^v<vv><v>v<vv^v>^>><<>>><v<>v<<>>^<>vv^^<^^^^<^<v^><vv>^><^^<v^^v^<v<>>><<vv^><^<>vv>^>v<>>>^>^v><<<v<^>^^vvv^><>^v<v><v<^^<>v<<^<vvv>vv<vv^<^^>>>>v^^><^<>>^^<>^>>^>v>>v><^<v^<<><^<^^v<<>>>><>>vv>v>>v>vv>>
vv><>v<^^<^>^^v>vv^^v>v<^>>v<<>^<v>v<<<^>v^^vv>>vv^>>><>>^^<vv>><<vv>>^>v^<vv<v^v<><v^><>^v<>>><v<^v<v>><v<vv>v><><<>^^<<v^<><vv^<v<<>^^><v<<>>^v^v^^^^<><^v^<^vv^^^<<^>^v>v<^>><v^^^v><<v><>^<^^^><v><v<v<vvv^vv>vv<v<<^<^^v<vv^^<<<><<^>>^<^>v<<<<vv<<>>^<vv^vv><vv<^^><^^^<v^^v>v>^<><v^^v^><>><v^>>>>><^>v><<vvv<vv^v<^<v^v>v^v^>>v^><>v>v<^>^>^<^^^^<^v<<^>^<<v<^<>v<v^>^vv<^^>>^^><>^>vv>>v^^>>^vv^><v^><^^<<><v<>v^>v^>v<><>v>>^^<>^<>v^v<<v^^^>vv<>>>>><<^^>vvv<v>>>>v><v^<>v^<v><><>>v<<^v<v<>v^>^^<^<v>^>>^v>>v^v<^v<<v<>>^>^vvv>><v<v>v>v^^<v^v^vv^<^>^^>>^^><v>^vv<^>^<<^>v>>^^v^<vv<v<<^vvvv>^^^v<v^<>^<>>^^^<>^vv>>^<>^>>v><>>><<<^<vv<v<>v<<<<^>vvv>v>^^<vv^<v>v<<v^^vv>vv^^>vv<>><^^<^v>>v<<^v>^<^>vv^^<>^><>^<^^^>>^>^<><^vv<<>^^v^>>v^vv^v<<<^>v^^>^<vvv^><v^vvv<>vvvv><^><>^^>v<^>^<v><<>><>^v><><><v<v>^>><vv^v<v<<^>>v>^><^v>^^^<^><<>><^<><v>>^^<v^^^<^^v^v><^vv<>>v<vvvv><<<<>v<v>><vv^<^^<vv^v>v^v<^^>>^>^^v^>><^<<>^<^vv<><^<v>>><>vv>^v><v><v<<^v^<v^<v><>>^v<vvv^<v^<<^v^v^v<^^^><>vv>v<><<<^><^^^v<v<^^^v^^v
v^<<^^>vvv><vv>^<^vv^v<vv^v<^<<^v<<^v<<^vv^<v^^^><>^>vv<^vv><^>^><^><>v^v<^^v><<^>v<<>>><^>><vv^v<<<v><vv<><<><v><<<>>>^vvv>>vv<>>><v>v^^>^<>^>v<<^<^>><>^^^>v>^v<v<^v<><>^v<<^^v^<>>vvv^<^v<^<<<><vvv>v<><^^><>>v><v<^<<>vvv<^<v>>v^v>>v><v^<^vv>>>^^^>^v^>v><<^>v^^v^^>^^<v<><^^<>>^><v>>>^v<^<<v<v><<^v<^>^v^<>v<<<<v^<^>^>v^v^<vvv^>v><>^^^<>^><^<^^>^>vvv^v^^^^>^<^>>v<<v>v>><^<v^^><vv^><><^<<<^<v<<<^v^v^^<><<^>v>^<^<v^v<<<<^v<vv><>>^^<<><^v<<^<^<^<>v<<>>^v^^v>^^><vv>v>^>^^<<^<^><<^v^<^>v>^^<vv<>^<^>v<vv>^>^><v^<<<v>vv^>^v<>^>^^><vvv>>>>^^^vv<>^v>^><<v^<v>vv><v^vv><<>v^<>v>>^<<v>>^^^<<>v>^>><v<vv^v<<vv>^>>^v^^>v>><^v^<>v^v^v^v^<^>v><>v^>>>v<^<<<>v^><<>>^<>v^<^v^<v>^><^>v>^v<>^><^v<><>v<<><>vv>v^>>>^<vv><><vv^v^vv<^<<><<>v>>>>vvvv<><<<>>>^v^><^v^<<^^<v<^<<v>^<^^vv^><>^><>^v<>>>^<<vv^<<>>>>>^<v<><>vvv<<v^^><^><>v>^^^<^vv<>>>^<^^v<v>>>v^<^<^<^<<v>^>>>>><vvvv<v^>>v>>v<^v<<^v>^v<<^<v^^>>^^<<^>><><<<><v><v<^<^<>^<><>>^v^<^>^>vvv><v>>v>vvvvvv<<v^v<^<>^v<v^>>><v<^>v>v^^<<<^>^vv>>>>><^v<v>>v<^>v<<<^>v<
v^^<>v><<^vv^v<>^^>^>^<<^^^^v^^v<^<><^v<<vv^vv^^<v<^<vv>^v^vv><<<vvv<^^<v^>>^<vv>><vv>>vv<><^><>^<<<^<>><v^>><v>^>><<v<>^^^v<<>^>v^<<^^<v<vv>vv<^>>^v><<v<<^^<<v<<^<>^<><<^<>v<v>v>><vvv><<>^<<<<v^^>^>^v><^>vv><v<v<v><^><<v^<><<^><v>^^v><^>v>^v<vv>^<v<v^v>^v<v^>^v<vv^v><>v>>>v<^>^<<<>^^<^v^vv^<^><vvv<>><<^^>>>><>><v^v>^v^<><<>^^<<><vv<<v^<v<vvvv^^><<vv^>v^<v>v>><<v^>vv^>v<vv^v><<>v><^v>^^<<>vvv<^>v>v^>^vvvv>v>v>v<<v<^^v^>>v<v>^v^<>v><>>v^vvvv<>>^^<vv<>vv><v>^<v^<^^^<^<^^><><<<><^^^<><^v>v^>^<^v>><^^>><>v>>>vv^^<>^^vv^>>^><^<>><^><^<^>v>^><>>^^<^v^<v^v^>>^>>v<v^^<^<<<>v^v<<^v<vvvv>^^v>^v>>>>v>>^<>>>^v^<><^<<<<^<^v^^>v><>^>^v><v^<^^^^<^<v>^<>^v><>vvv<^vv>v^vvvv>^<v^v^<v>>^<>v<^^^<<^<<<>>v>>v<<<v^v>>><>v>v>>v<<^^>^>v^<>>^v>^v^^v^>vv>v>^>>^><>^v<^v<>>^<^<^>><v<^v^>v^v^>^>>^><<v^<><^<^^<>v><>><^^>><v>^^v>>><vvvv^v>>^^^^^>^<>>v<<<vvv<v^^<^v<<v^<>>>>>><<<<v>v<<>>>v^>v><><v^^>>^><>>v<>v><^<>>>><^><^>v<^>>vv>v^>v><<v<><v><>v<^^<<<vv>^<v>>^>>><v^<^><^v<v^>><<^<^v<v>>v^<^v^<<v>><>v<v>^<<<><^><>v>^<
>><v>><v<v^><vv<^><vv>^>>>>vv<<><>vv>vv>^^^^><v>vv^^v>vv>>^<^^<>>v^v^<>v<^v<^<<<v<>>v<^vv<^<^><^^>v<^<^v<<<v><vv^><^<^^>vv^^^vv<^>v<<>v^^^>^v^v>^<>^<v><><^<><>>v^>><^^v<vvv<><^^><>^^<^^^<<^^v<>v^<<><v><v>v^^^vv^v<>v>vv>vv<<v>v^><>v^<>>^>>^>>^>v>v<v<^^^^^^vv<^^v<>vv^>>>^v<v^vv^<^^v<>^<v^>vv^>>^>v>>^vvv<vv>>^^v>>>^<<vvv^v^>^<v^>>^<>^^v<^>^<v^^^<<<<vv^>^<v<^<v<<<><^v^v<v>v>^>>>v<<<^v<>>v^v<^<^^>><^^<>>^<<<v>v^>v<^<v>^>^^<^^><v<><>v^>v>^^^<>><^v<v^^><vv><><>^>vv^vv<<<v<^>vvv>^<<<<<<^<^<^^<v^^^v^v^>><v<v^<<><><v^<>>^v<<<>v><><<v>vv^<vvv^vv>^vvv<^><<<vvv><<v^^vv^vv^^><^vv<^v<v><><>v<<>><>^<v^>v<><<^vv<^v>^v><<^<^^<vv><<v>v<^v<<>><>vv<><vv^>^<^^v>v>v<<vvv^<><<<<<vv>vvv>>><^^v<>>>vvvv^>v><^^v<<vv>>^v^<v^v<^<>v>>^v<<^>vv>>v<v<<^><v>^v>^^^vv>>^<>vvv<^<^vv<<^>^v><vv><v><v^^<<^v><^<^>>v>>^v<^v><><v>v>><><^^<<v<^<^<<v^^^>v^^<<<>^^<v<v>v^vv<^^^^><^^v<vv<^<vv>^v^^<^^^^v^<>>^>v<>v<^<^v<^<>>^v^<v^vv><^<>^^<vv^^v<v>^<v<>><^<^^^<v^^<^v^^v>^<<^^<><vvv^<^^vvvv><^>><>v<>>^^>>^v<<<<<vv<v<^>vv<<^^^<<v^>>^><<v
<^v>v^>^<^<^><^<^>^>>vvv^><^<^>>v^<^^^>v><^><^^^<^><^v<^^^^>^^v<^<><<vvv<>vvv<v>>v><>^>v>^^^^v>^>>^vv<>^><<^v><<vvvvv<>vv><^^^^^<vv^^^<><<^^>>vv<<^vv^v<^><^<<v<>^>^v^<>v>><^><^v^><^^^^^>v<^>^^<<><^^<>^<^^<>>v^v^><^><v><><<>v^<^<>v<>^v<>^v^<><v^><^v^^><><<<v>v><><^v<^<<>>^<<>^vv><>^>>v^^<><vv>^<v>v^^^^<v<v^^>^>vv<v><vv<v<<<<<>v^v<^v<<<vvv^^v^>>vv<^>v<^<<v^<<<^>^v<vv^<<v<^>>^<><<<v<^<vv>><>>v<vvv^>^<>v>^>^vvvv<><>vv<>>>v^<v^v>v^<<><^<>^><^<>^>>^^<^v<v^v<^>v<^v^^><<^>v>><vv<>>v^<v>^^>>v>v>^>^v<v<<<^v<>^<<^^<<<^^<>vv<>>v<>>>v>>v>>><v^>v^^>>><>>^<<>^^v>v<>vvv^<<^<vv<^^<>>>v<>vv<><><<<<>>>^<^^v><><^v<v^vv<><v^v<^^^v^>v<>vv<vvvv<>v<v>vv<v>^>v><>^vvv>v>^><v<^v^>^^><v<<<^<^^v><v<<vv^v^<^^v^<v^<<>v<>v>>v<<vvv>v<^>^<^>v><^<>vv>>^>^<^v>>>v><^^v^vvv^v<vv<<^^^>v>vv<vv<^>v<^v><^v<<<v<^v>>vvv>v<v<^<^vv<<v^v<<v^^<<<>v><^<<<><<<<<>^>^<^>vvv>^v<><vvvv^<><<vv<v><<<^>v<v^^^<v>vv>v><<v>vvv<^>^vv<>^>^^v^<^<^^^^^>vvv^><v<v^^<<^^>v>v^>>v<v<v><v^>^<v^v>>^v<^v>>>vv^^>^v^vv<>^^<^>><<v^<^<>v>>>>>^^>vv>v>><^v<>vvv^
`
  .trim()
  .split('\n');

const runs = [1, 1, 7, 1];
if (runs[0]) consoleTimeit('part1 sample', () => part1(inputSample));
if (runs[1]) consoleTimeit('part1 real', () => part1(inputReal));
if (runs[2] & 1) consoleTimeit('part2 sample1', () => part2(inputSample));
if (runs[2] & 2) consoleTimeit('part2 sample2', () => part2(inputSample2, false));
if (runs[2] & 4) consoleTimeit('part2 sample3', () => part2(inputSample3, false));
if (runs[3]) consoleTimeit('part2 real', () => part2(inputReal));