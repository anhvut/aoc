export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

const fields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid' /*, 'cid'*/];

const passes = lines.reduce(
  (all, line) => {
    if (line.length < 2) {
      all.push({});
      return all;
    }
    const current = all[all.length - 1];
    line.split(' ').forEach((token) => {
      const [key, value] = token.split(':');
      current[key] = value;
    });
    return all;
  },
  [{}] as Array<Record<string, string>>
);

function part1() {
  console.log(passes.reduce((r, pass) => r + Number(fields.every((f) => !!pass[f])), 0));
}

function part2() {
  const between = (a: number, b: number, c: number) => a <= b && b <= c;
  const validFct: Record<string, (x: string) => boolean> = {
    byr: (x: string) => between(1920, +x, 2002),
    iyr: (x: string) => between(2010, +x, 2020),
    eyr: (x: string) => between(2020, +x, 2030),
    hgt: (x: string) =>
      (x && x.endsWith('cm') && between(150, +x.slice(0, -2), 193)) ||
      (x && x.endsWith('in') && between(59, +x.slice(0, -2), 76)),
    hcl: (x: string) => Boolean(x?.match(/^#[0-9,a-f]{6}$/)),
    ecl: (x: string) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(x),
    pid: (x: string) => Boolean(x?.match(/^[0-9]{9}$/)),
    cid: (_: string) => true,
  };
  console.log(passes.reduce((r, pass) => r + Number(fields.every((f) => !!validFct[f](pass[f]))), 0));
}

part1();
part2();
