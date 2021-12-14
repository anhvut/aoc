const fs = require('fs')

const lines = fs.readFileSync(__dirname + '/aoc2021-14.txt', 'utf-8').split(/\r?\n/);
const start = Array.from(lines[0]);
const rules = lines.slice(2).map(x => x.split(' -> '));
const rule = {};
rules.forEach(([a, b]) => rule[a] = b);

const initCount = (input) => {
  let a = input[0];
  const result = {};
  input.slice(1).forEach(b => {
    const ab = a+b;
    result[ab] = (result[ab] || 0) + 1;
    a = b;
  });
  return result;
}

const iterate = (input) => {
  const result = {};
  Object.entries(input).forEach(([ab, number]) => {
    const [a, b] = ab;
    const n = rule[ab];
    const an = a + n;
    let nb = n + b;
    result[an] = (result[an] || 0) + number;
    result[nb] = (result[nb] || 0) + number;
  });
  return result;
}

const part = (N=40) => {
  let r = initCount(start);
  for (let i = 0; i < N; i++) {
    r = iterate(r);
  }
  const countByChar = {};
  Object.entries(r).forEach(([ab, number]) => {
    const [a, b] = Array.from(ab);
    if (a === b) {
      countByChar[a] = (countByChar[a] || 0) + number;
    } else {
      countByChar[a] = (countByChar[a] || 0) + number/2;
      countByChar[b] = (countByChar[b] || 0) + number/2;
    }
  });
  Object.keys(countByChar).forEach((a) => countByChar[a] = Math.ceil(countByChar[a]));
  const count = Object.values(countByChar).sort((a, b) => a-b);
  return count[count.length-1] - count[0];
};

console.log(part(10));
console.log(part(40));
