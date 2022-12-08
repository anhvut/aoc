export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

const part1 = () => {
  const headingX = (a: number) => (a === 90 ? 1 : a === 270 ? -1 : 0);
  const headingY = (a: number) => (a === 0 ? -1 : a === 180 ? 1 : 0);

  const { x, y } = lines.reduce(
    ({ x, y, angle }, instr) => {
      const l = instr[0];
      const nb = +instr.slice(1);
      switch (l) {
        case 'N':
          y -= nb;
          break;
        case 'S':
          y += nb;
          break;
        case 'E':
          x += nb;
          break;
        case 'W':
          x -= nb;
          break;
        case 'R':
          angle = (angle + nb) % 360;
          break;
        case 'L':
          angle = (angle - nb + 360) % 360;
          break;
        case 'F':
          x += headingX(angle) * nb;
          y += headingY(angle) * nb;
          break;
      }
      return { x, y, angle };
    },
    { x: 0, y: 0, angle: 90 }
  );
  return Math.abs(x) + Math.abs(y);
};

const part2 = () => {
  const { x, y } = lines.reduce(
    ({ x, y, wx, wy }, instr) => {
      const l = instr[0];
      const nb = +instr.slice(1);
      const rotate1 = () => {
        const oldWx = wx;
        wx = -wy;
        wy = oldWx;
      };
      const rotate = (n: number) =>
        Array(n)
          .fill(0)
          .forEach((_) => rotate1());
      switch (l) {
        case 'N':
          wy -= nb;
          break;
        case 'S':
          wy += nb;
          break;
        case 'E':
          wx += nb;
          break;
        case 'W':
          wx -= nb;
          break;
        case 'R':
          rotate((nb / 90) % 4);
          break;
        case 'L':
          rotate((-nb / 90 + 4) % 4);
          break;
        case 'F':
          x += wx * nb;
          y += wy * nb;
          break;
      }
      return { x, y, wx, wy };
    },
    { x: 0, y: 0, wx: 10, wy: -1 }
  );
  return Math.abs(x) + Math.abs(y);
};

console.log(part1());
console.log(part2());
