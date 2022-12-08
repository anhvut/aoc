export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

const MAX_Z = 20;
const MAX_Y = lines.length + 20;
const MAX_X = lines[0].length + 20;

const map = Array(MAX_Z)
  .fill(null)
  .map((_) =>
    Array(MAX_Y)
      .fill(null)
      .map((__) => Array(MAX_X).fill(0))
  );

lines.forEach((line, y) => {
  Array.from(line).forEach((v, x) => {
    if (v === '#') map[10][10 + y][10 + x] = 1;
  });
});

const MAX_W = 20;

const wmap = Array(MAX_W)
  .fill(null)
  .map((___) =>
    Array(MAX_Z)
      .fill(null)
      .map((_) =>
        Array(MAX_Y)
          .fill(null)
          .map((__) => Array(MAX_X).fill(0))
      )
  );

lines.forEach((line, y) => {
  Array.from(line).forEach((v, x) => {
    if (v === '#') wmap[10][10][10 + y][10 + x] = 1;
  });
});

const part1 = () => {
  let current = map;

  let x = 0,
    y = 0,
    z = 0;
  const used = (dx: number, dy: number, dz: number) => {
    const sx = x + dx;
    if (sx < 0 || sx >= MAX_X) return 0;
    const sy = y + dy;
    if (sy < 0 || sy >= MAX_Y) return 0;
    const sz = z + dz;
    if (sz < 0 || sz >= MAX_Z) return 0;
    return current[sz][sy][sx];
  };

  for (let turn = 0; turn < 6; turn++) {
    const next = current.map((arr2d) => arr2d.map((arr) => arr.slice()));

    for (z = 0; z < MAX_Z; z++) {
      for (y = 0; y < MAX_Y; y++) {
        for (x = 0; x < MAX_X; x++) {
          const initial = used(0, 0, 0);
          let nb = -initial;
          for (let dz = -1; dz <= 1; dz++)
            for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) nb += used(dx, dy, dz);
          if (initial) {
            next[z][y][x] = nb === 2 || nb === 3 ? 1 : 0;
          } else {
            next[z][y][x] = nb === 3 ? 1 : 0;
          }
        }
      }
    }
    current = next;
  }
  return current.reduce((sz, xy) => sz + xy.reduce((sy, xs) => sy + xs.reduce((sx, x) => sx + x, 0), 0), 0);
};

const part2 = () => {
  let current = wmap;

  let x = 0,
    y = 0,
    z = 0,
    w = 0;
  const used = (dx: number, dy: number, dz: number, dw: number) => {
    const sx = x + dx;
    if (sx < 0 || sx >= MAX_X) return 0;
    const sy = y + dy;
    if (sy < 0 || sy >= MAX_Y) return 0;
    const sz = z + dz;
    if (sz < 0 || sz >= MAX_Z) return 0;
    const sw = w + dw;
    if (sw < 0 || sw >= MAX_W) return 0;
    return current[sw][sz][sy][sx];
  };

  for (let turn = 0; turn < 6; turn++) {
    const next = current.map((arr3d) => arr3d.map((arr2d) => arr2d.map((arr) => arr.slice())));

    for (w = 0; w < MAX_W; w++) {
      for (z = 0; z < MAX_Z; z++) {
        for (y = 0; y < MAX_Y; y++) {
          for (x = 0; x < MAX_X; x++) {
            const initial = used(0, 0, 0, 0);
            let nb = -initial;
            for (let dw = -1; dw <= 1; dw++)
              for (let dz = -1; dz <= 1; dz++)
                for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) nb += used(dx, dy, dz, dw);
            if (initial) {
              next[w][z][y][x] = nb === 2 || nb === 3 ? 1 : 0;
            } else {
              next[w][z][y][x] = nb === 3 ? 1 : 0;
            }
          }
        }
      }
    }
    current = next;
  }
  return current.reduce(
    (sw, xyz) => sw + xyz.reduce((sz, xy) => sz + xy.reduce((sy, xs) => sy + xs.reduce((sx, x) => sx + x, 0), 0), 0),
    0
  );
};

console.log(part1());
console.log(part2());
