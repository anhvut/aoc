export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

type COORD = [number, number, number, number, number, number];

const commands0: Array<[number, COORD]> = lines.map((l) => {
  const s = l.split(' ');
  const on = s[0] === 'on' ? 1 : 0;
  const coords = s[1].split(',').flatMap((x) =>
    x
      .slice(2)
      .split('..')
      .map((y) => +y)
  );
  return [on, coords] as [number, COORD];
});

const part1 = () => {
  const boundedCommands: Array<[number, COORD]> = commands0.flatMap(([on, [x0, x1, y0, y1, z0, z1]]) =>
    ((-50 <= x0 && x0 <= 50) || (-50 <= x1 && x1 <= 50)) &&
    ((-50 <= y0 && y0 <= 50) || (-50 <= y1 && y1 <= 50)) &&
    ((-50 <= z0 && z0 <= 50) || (-50 <= z1 && z1 <= 50))
      ? [
          [
            on,
            [
              Math.max(x0, -50),
              Math.min(x1, 50),
              Math.max(y0, -50),
              Math.min(y1, 50),
              Math.max(z0, -50),
              Math.min(z1, 50),
            ],
          ],
        ]
      : []
  );
  return part2(boundedCommands);
};

const cubeDisjoint = ([x0, x1, y0, y1, z0, z1]: COORD, [x2, x3, y2, y3, z2, z3]: COORD) =>
  x0 > x3 || x1 < x2 || y0 > y3 || y1 < y2 || z0 > z3 || z1 < z2;

const cubeIntersection = ([x0, x1, y0, y1, z0, z1]: COORD, [x2, x3, y2, y3, z2, z3]: COORD): COORD => [
  Math.max(x0, x2),
  Math.min(x1, x3),
  Math.max(y0, y2),
  Math.min(y1, y3),
  Math.max(z0, z2),
  Math.min(z1, z3),
];

const cubeVolume = ([x0, x1, y0, y1, z0, z1]: COORD) => (x1 - x0 + 1) * (y1 - y0 + 1) * (z1 - z0 + 1);

const part2 = (commands = commands0) => {
  const cubes = [];
  const antiCubes = [];
  for (const command of commands) {
    const [on, cubeToAdd] = command;
    const newCubes: COORD[] = [];
    const newAntiCubes: COORD[] = [];
    for (const cube of cubes) if (!cubeDisjoint(cube, cubeToAdd)) newAntiCubes.push(cubeIntersection(cube, cubeToAdd));
    for (const cube of antiCubes) if (!cubeDisjoint(cube, cubeToAdd)) newCubes.push(cubeIntersection(cube, cubeToAdd));
    cubes.push(...newCubes);
    antiCubes.push(...newAntiCubes);
    if (on) cubes.push(cubeToAdd);
  }
  return cubes.reduce((r, cube) => r + cubeVolume(cube), 0) - antiCubes.reduce((r, cube) => r + cubeVolume(cube), 0);
};

console.log(part1());
console.log(part2());
