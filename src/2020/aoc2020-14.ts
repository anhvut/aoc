export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

const maxInt32Bits = 2147483648; // 2^31

const bigOr = (a: number, b: number) => {
  const ah = Math.floor(a / maxInt32Bits);
  const al = a % maxInt32Bits;
  const bh = Math.floor(b / maxInt32Bits);
  const bl = b % maxInt32Bits;
  return (al | bl) + (ah | bh) * maxInt32Bits;
};

const bigAnd = (a: number, b: number) => {
  const ah = Math.floor(a / maxInt32Bits);
  const al = a % maxInt32Bits;
  const bh = Math.floor(b / maxInt32Bits);
  const bl = b % maxInt32Bits;
  return (al & bl) + (ah & bh) * maxInt32Bits;
};

const part1 = () => {
  type AGG = {
    mem: Record<number, number>;
    mask0: number;
    mask1: number;
  };
  const { mem } = lines.reduce<AGG>(
    ({ mem, mask0, mask1 }, line) => {
      if (line.startsWith('mask = ')) {
        const maskRaw = Array.from(line.slice(7));
        mask0 = parseInt(maskRaw.map((x) => (x === '0' ? '0' : '1')).join(''), 2);
        mask1 = parseInt(maskRaw.map((x) => (x === '1' ? '1' : '0')).join(''), 2);
      } else {
        const matches = line.match(/^mem\[(\d*)\] = (\d*)$/);
        const offset = +matches[1];
        const value = +matches[2];
        mem[offset] = bigOr(bigAnd(value, mask0), mask1);
      }
      return { mem, mask0, mask1 };
    },
    { mem: {}, mask0: 0, mask1: 0 }
  );
  return Object.values(mem).reduce((a, b) => a + b, 0);
};

const pad0 = (input: string[], length: number) => {
  let r = input;
  while (r.length < length) r = ['0', ...r];
  return r;
};

const writeX = (mem: Record<number, number>, baseOffset: number, mask: string[], value: number) => {
  const positions = mask.map((x, i) => (x === 'X' ? i : -1)).filter((x) => x > -1);
  const max = Math.pow(2, positions.length);
  for (let i = 0; i < max; i++) {
    const nbBin = pad0(Array.from(i.toString(2)), positions.length);
    const maxBin = nbBin.reduce((agg, nb, pos) => {
      agg[positions[pos]] = nb;
      return agg;
    }, Array(mask.length).fill('0'));
    const offset = bigOr(baseOffset, parseInt(maxBin.join(''), 2));
    mem[offset] = value;
  }
};

const part2 = () => {
  type AGG = {
    mem: Record<number, number>;
    mask0: number;
    mask1: number;
    maskX: string[];
  };
  const { mem } = lines.reduce<AGG>(
    ({ mem, mask0, mask1, maskX }, line) => {
      if (line.startsWith('mask = ')) {
        const maskRaw = Array.from(line.slice(7));
        maskX = maskRaw.map((x) => (x === 'X' ? 'X' : '0'));
        mask0 = parseInt(maskRaw.map((x) => (x === 'X' ? '0' : '1')).join(''), 2);
        mask1 = parseInt(maskRaw.map((x) => (x === '1' ? '1' : '0')).join(''), 2);
      } else {
        const matches = line.match(/^mem\[(\d*)\] = (\d*)$/);
        const offset = +matches[1];
        const value = +matches[2];
        const maskedOffset = bigOr(bigAnd(offset, mask0), mask1);
        writeX(mem, maskedOffset, maskX, value);
      }
      return { mem, mask0, mask1, maskX };
    },
    { mem: {}, mask0: 0, mask1: 0, maskX: [] }
  );
  return Object.values(mem).reduce((a, b) => a + b, 0);
};

console.log(part1());
console.log(part2());
