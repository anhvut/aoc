const fs = require('fs')

const lines = fs.readFileSync(__dirname + '/aoc2021-10.txt', 'utf-8').split(/\r?\n/);
const input = lines.map(x => Array.from(x));

const matching = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>'
};

const pointError = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
};

function analyseLine(line) {
  let errorPoint = 0;
  const completion = [];
  for (const c of line) {
    if (matching[c]) {
      completion.push(matching[c]);
    } else {
      const expected = completion.pop();
      if (expected !== c) errorPoint += pointError[c];
    }
  }
  return [completion, errorPoint];
}

const part1 = () => {
  return input.reduce((agg, line) => agg + analyseLine(line)[1], 0);
}

const part2 = () => {
  const pointMissing = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
  };
  const scores = input.flatMap(line => {
    const [completion, error] = analyseLine(line);
    return error ? [] : completion.reduceRight((agg, c) => agg*5 + pointMissing[c], 0);
  });
  return scores.sort((b, a) => b-a)[Math.floor(scores.length / 2)];
};

console.log(part1());
console.log(part2());
