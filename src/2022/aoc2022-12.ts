export {};

type MAZE = string[][];
type POINT = [number, number];
type POINT_STR = `${number}_${number}`;

const asKey = ([x, y]: POINT): POINT_STR => `${x}_${y}`;
const fromKey = (s: POINT_STR): POINT => s.split('_').map((x) => +x) as POINT;

const bfs = (maze: MAZE, start: POINT, goal: POINT): number | undefined => {
  const ex = maze[0].length - 1;
  const ey = maze.length - 1;
  const INF = 100 * maze[0].length * maze.length;

  function* findNeighbors(currentKey: POINT_STR): Generator<POINT> {
    const [x, y] = fromKey(currentKey);
    const v0 = maze[y][x];
    const isValid = (dx: number, dy: number) => {
      const v = maze[dy][dx];
      return (
        v0 === v ||
        (v0 === 'S' && v === 'a') ||
        (v0 === 'z' && v === 'E') ||
        (v !== 'E' && v.codePointAt(0) <= v0.codePointAt(0) + 1)
      );
    };
    if (x > 0 && isValid(x - 1, y)) yield [x - 1, y];
    if (x < ex && isValid(x + 1, y)) yield [x + 1, y];
    if (y > 0 && isValid(x, y - 1)) yield [x, y - 1];
    if (y < ey && isValid(x, y + 1)) yield [x, y + 1];
  }

  const startKey = asKey(start);
  const goalKey = asKey(goal);
  const distanceTo: Record<POINT_STR, number> = { [startKey]: 0 };
  const comeFrom: Record<POINT_STR, POINT_STR> = {};

  const queue: POINT_STR[] = [startKey];
  while (queue.length > 0) {
    const currentKey = queue.shift();
    const distanceToCurrent = distanceTo[currentKey];
    const dTotal = distanceToCurrent + 1;
    for (const neighbor of findNeighbors(currentKey)) {
      const neighborKey = asKey(neighbor);
      if (dTotal < (distanceTo[neighborKey] ?? INF)) {
        distanceTo[neighborKey] = dTotal;
        comeFrom[neighborKey] = currentKey;
        let i = 0;
        while (i < queue.length && dTotal > distanceTo[queue[i]]) i++;
        queue.splice(i, 0, neighborKey);
      }
    }
  }
  return distanceTo[goalKey];
};

const getStartEnd = (maze: MAZE): [POINT, POINT] => {
  let start: POINT, end: POINT;
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[0].length; x++) {
      if (maze[y][x] === 'S') start = [x, y];
      if (maze[y][x] === 'E') end = [x, y];
    }
  }
  return [start, end];
};

const part1 = (maze: MAZE) => {
  const [start, end] = getStartEnd(maze);
  const distance = bfs(maze, start, end);
  return distance;
};

const getStartsEnd = (maze: MAZE): [POINT[], POINT] => {
  const starts: POINT[] = [];
  let end: POINT;
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[0].length; x++) {
      if (maze[y][x] === 'a') starts.push([x, y]);
      if (maze[y][x] === 'E') end = [x, y];
    }
  }
  return [starts, end];
};

const part2 = (maze0: MAZE) => {
  const maze = maze0.map((x) => x.map((y) => (y === 'S' ? 'a' : y)));
  const [starts, end] = getStartsEnd(maze);
  let min = maze.length * maze[0].length;
  for (const start of starts) {
    const found = bfs(maze, start, end);
    if (found !== undefined) min = Math.min(min, found);
  }
  return min;
};

const inputSample: string[][] = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`
  .split('\n')
  .map((x) => Array.from(x));

const inputReal = `abccccaaaaaaacccaaaaaaaccccccccccccccccccccccccccccccccccaaaa
abcccccaaaaaacccaaaaaaaaaaccccccccccccccccccccccccccccccaaaaa
abccaaaaaaaaccaaaaaaaaaaaaaccccccccccccccccccccccccccccaaaaaa
abccaaaaaaaaaaaaaaaaaaaaaaacccccccccaaaccccacccccccccccaaacaa
abaccaaaaaaaaaaaaaaaaaacacacccccccccaaacccaaaccccccccccccccaa
abaccccaaaaaaaaaaaaaaaacccccccccccccaaaaaaaaaccccccccccccccaa
abaccccaacccccccccaaaaaacccccccccccccaaaaaaaacccccccccccccccc
abcccccaaaacccccccaaaaaaccccccccijjjjjjaaaaaccccccaaccaaccccc
abccccccaaaaacccccaaaacccccccciiijjjjjjjjjkkkkkkccaaaaaaccccc
abcccccaaaaacccccccccccccccccciiiirrrjjjjjkkkkkkkkaaaaaaccccc
abcccccaaaaaccccccccccccccccciiiirrrrrrjjjkkkkkkkkkaaaaaccccc
abaaccacaaaaacccccccccccccccciiiqrrrrrrrrrrssssskkkkaaaaacccc
abaaaaacaaccccccccccccccccccciiiqqrtuurrrrrsssssskklaaaaacccc
abaaaaacccccccccccaaccccccccciiqqqttuuuurrssusssslllaaccccccc
abaaaaaccccccccaaaaccccccccciiiqqqttuuuuuuuuuuusslllaaccccccc
abaaaaaacccccccaaaaaaccccccciiiqqqttxxxuuuuuuuusslllccccccccc
abaaaaaaccccaaccaaaaacccccchhiiqqtttxxxxuyyyyvvsslllccccccccc
abaaacacccccaacaaaaaccccccchhhqqqqttxxxxxyyyyvvsslllccccccccc
abaaacccccccaaaaaaaacccccchhhqqqqtttxxxxxyyyvvssqlllccccccccc
abacccccaaaaaaaaaaccaaacchhhpqqqtttxxxxxyyyyvvqqqlllccccccccc
SbaaacaaaaaaaaaaaacaaaaahhhhppttttxxEzzzzyyvvvqqqqlllcccccccc
abaaaaaaacaaaaaacccaaaaahhhppptttxxxxxyyyyyyyvvqqqlllcccccccc
abaaaaaaccaaaaaaaccaaaaahhhppptttxxxxywyyyyyyvvvqqqmmcccccccc
abaaaaaaacaaaaaaacccaaaahhhpppsssxxwwwyyyyyyvvvvqqqmmmccccccc
abaaaaaaaaaaaaaaacccaacahhhpppssssssswyyywwvvvvvqqqmmmccccccc
abaaaaaaaacacaaaacccccccgggppppsssssswwywwwwvvvqqqqmmmccccccc
abcaaacaaaccccaaaccccccccgggppppppssswwwwwrrrrrqqqmmmmccccccc
abcaaacccccccccccccccccccgggggpppoosswwwwwrrrrrqqmmmmddcccccc
abccaacccccccccccccccccccccgggggoooosswwwrrrnnnmmmmmddddccccc
abccccccccccccccccccccccccccgggggooossrrrrrnnnnnmmmddddaccccc
abaccccaacccccccccccccccccccccgggfoossrrrrnnnnndddddddaaacccc
abaccaaaaaaccccccccccccccccccccgffooorrrrnnnneeddddddaaaacccc
abaccaaaaaacccccccccccccccccccccfffooooonnnneeeddddaaaacccccc
abacccaaaaaccccccccaaccaaaccccccffffoooonnneeeeccaaaaaacccccc
abcccaaaaacccccccccaaccaaaaccccccffffoooneeeeeaccccccaacccccc
abaccaaaaaccccccccaaaacaaaaccccccafffffeeeeeaaacccccccccccccc
abacccccccccccccccaaaacaaacccccccccffffeeeecccccccccccccccaac
abaaaacccccccaaaaaaaaaaaaaacccccccccfffeeeccccccccccccccccaaa
abaaaacccccccaaaaaaaaaaaaaaccccccccccccaacccccccccccccccccaaa
abaacccccccccaaaaaaaaaaaaaaccccccccccccaacccccccccccccccaaaaa
abaaaccccccccccaaaaaaaaccccccccccccccccccccccccccccccccaaaaaa`
  .split('\n')
  .map((x) => Array.from(x));

console.log(part1(inputSample));
console.log(part1(inputReal));
console.log(part2(inputSample));
console.log(part2(inputReal));
