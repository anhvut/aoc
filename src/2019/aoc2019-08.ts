export {};
import fs from 'fs';
const width = 25;
const height = 6;
const size = width * height;
const line = fs.readFileSync(__filename.replace(/\.[jt]s/, '.txt'), 'utf-8');

function toChunks<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  let pos = 0;
  do {
    const nextPos = pos + size;
    result.push(array.slice(pos, nextPos));
    pos = nextPos;
  } while (pos < array.length);
  return result;
}

const chunks: number[][] = toChunks(
  Array.from(line).map((x) => +x),
  size
);

const part1 = (): number => {
  const nbZero = chunks.map((chunk) => chunk.reduce((a, b) => a + Number(b === 0), 0));
  const [, index] = nbZero.reduce(([min, index], nb, i) => (nb < min ? [nb, i] : [min, index]), [Infinity, -1]);
  const nb1 = chunks[index].reduce((a, b) => a + Number(b === 1), 0);
  const nb2 = chunks[index].reduce((a, b) => a + Number(b === 2), 0);
  return nb1 * nb2;
};

const part2 = (): void => {
  const pixels = chunks[0].map((_, i) => chunks.find((chunk) => chunk[i] !== 2)?.[i]);
  const img = toChunks(pixels, width);
  img.forEach((x) => console.log(x.map((y) => (y ? '#' : ' ')).join('')));
};

console.log(part1());
part2();
