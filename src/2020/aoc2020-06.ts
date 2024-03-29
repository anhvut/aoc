export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

const groups = lines.reduce(
  (all, line) => {
    if (line.length < 1) {
      all.push({});
      return all;
    }
    const current = all[all.length - 1];
    Array.from(line).forEach((l) => (current[l] = true));
    return all;
  },
  [{}] as Array<Record<string, boolean>>
);

const groups2 = lines.reduce(
  (all, line) => {
    if (line.length < 1) {
      all.push(null);
      return all;
    }
    const lineKeys: Record<string, boolean> = {};
    Array.from(line).forEach((l) => (lineKeys[l] = true));
    const current = all[all.length - 1];
    if (!current) {
      all[all.length - 1] = lineKeys;
    } else {
      Object.keys(current).forEach((key) => {
        if (!lineKeys[key]) {
          delete current[key];
        }
      });
    }
    return all;
  },
  [null]
);

const part = (g: Array<Record<string, boolean>>) => g.map((x) => Object.keys(x).length).reduce((a, b) => a + b, 0);

console.log(part(groups));
console.log(part(groups2));
