const fs = require('fs')

const lines = fs.readFileSync(__dirname + '/aoc2021-08.txt', 'utf-8').split(/\r?\n/);
const input = lines.map(l => {
  const w = l.split(' | ');
  return [w[0].split(' '), w[1].split(' ')];
});

const part1 = () => {
  return input.reduce((agg, l) => agg + l[1].reduce((r, t) => r + [2, 3, 4, 7].includes(t.length), 0), 0);
};

const digits = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg'];
const digitMap = {};
digits.forEach((x, i) => digitMap[x] = i);
const toDigit = (s) => {
  const sorted = s.slice().sort().join('');
  return digitMap[sorted];
}

const getReducedPossibilities = (l) => {
  const p = {
    'a': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    'b': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    'c': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    'd': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    'e': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    'f': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    'g': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  };
  for (const t of l[0]) {
    if ([2, 3, 4].includes(t.length)) {
      const m = digits.find(x => x.length === t.length);
      for (const c of Array.from(t)) {
        if (p[c].length > m.length) {
          p[c] = Array.from(m);
        }
      }
    }
  }
  return p;
}

const applyMapping = (w, m) => Array.from(w).map(c => m[c]);

const findMapping = (l, p) => {
  const mapping = {};
  const used = {};
  const recurse = (c) => {
    for (const b of p[c]) {
      if (used[b]) continue;
      mapping[c] = b;
      used[b] = true;
      if (c !== 'g') {
        const mapping = recurse(String.fromCodePoint(c.codePointAt(0) + 1));
        if (mapping) return mapping;
      } else {
        if (l[0].every(w => toDigit(applyMapping(w, mapping)) != null)) return mapping;
      }
      used[b] = false;
    }
  }
  return recurse('a');
}

const part2 = () => {
  return input.reduce((r, l) => {
    const p = getReducedPossibilities(l);
    const m = findMapping(l, p);
    return r + l[1].reduce((n, w) => n*10 + toDigit(applyMapping(w, m)), 0);
  }, 0);
};

console.log(part1());
console.log(part2());
