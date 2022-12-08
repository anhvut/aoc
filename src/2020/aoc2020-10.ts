export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

const nbs = lines.map((x) => +x).sort((a, b) => +a - +b);

const part1 = () => {
  const occurrences: Record<number, number> = { 1: 1, 3: 1 };
  nbs.forEach((n, i) => {
    if (i > 0) {
      const diff = n - nbs[i - 1];
      occurrences[diff] = (occurrences[diff] || 0) + 1;
    }
  });
  return occurrences[1] * occurrences[3];
};

const part2 = () => {
  const rev = [0, ...nbs].reverse();
  const cache = Array(rev[0] + 4).fill(0);
  cache[rev[0]] = 1;
  rev.slice(1).forEach((r) => {
    cache[r] = cache[r + 1] + cache[r + 2] + cache[r + 3];
  });
  return cache.find((x) => x > 0);
};

console.log(part1());
console.log(part2());
