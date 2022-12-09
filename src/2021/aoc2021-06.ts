export {};

const input = [
  4, 1, 3, 2, 4, 3, 1, 4, 4, 1, 1, 1, 5, 2, 4, 4, 2, 1, 2, 3, 4, 1, 2, 4, 3, 4, 5, 1, 1, 3, 1, 2, 1, 4, 1, 1, 3, 4, 1,
  2, 5, 1, 4, 2, 2, 1, 1, 1, 3, 1, 5, 3, 1, 2, 1, 1, 1, 1, 4, 1, 1, 1, 2, 2, 1, 3, 1, 3, 1, 3, 4, 5, 1, 2, 2, 1, 1, 1,
  4, 1, 5, 1, 3, 1, 3, 4, 1, 3, 2, 3, 4, 4, 4, 3, 4, 5, 1, 3, 1, 3, 5, 1, 1, 1, 1, 1, 2, 4, 1, 2, 1, 1, 1, 5, 1, 1, 2,
  1, 3, 1, 4, 2, 3, 4, 4, 3, 1, 1, 3, 5, 3, 1, 1, 5, 2, 4, 1, 1, 3, 5, 1, 4, 3, 1, 1, 4, 2, 1, 1, 1, 1, 1, 1, 3, 1, 1,
  1, 1, 1, 4, 5, 1, 2, 5, 3, 1, 1, 3, 1, 1, 1, 1, 5, 1, 2, 5, 1, 1, 1, 1, 1, 1, 3, 5, 1, 3, 2, 1, 1, 1, 1, 1, 1, 1, 4,
  5, 1, 1, 3, 1, 5, 1, 1, 1, 1, 3, 3, 1, 1, 1, 4, 4, 1, 1, 4, 1, 2, 1, 4, 4, 1, 1, 3, 4, 3, 5, 4, 1, 1, 4, 1, 3, 1, 1,
  5, 5, 1, 2, 1, 2, 1, 2, 3, 1, 1, 3, 1, 1, 2, 1, 1, 3, 4, 3, 1, 1, 3, 3, 5, 1, 2, 1, 4, 1, 1, 2, 1, 3, 1, 1, 1, 1, 1,
  1, 1, 4, 5, 5, 1, 1, 1, 4, 1, 1, 1, 2, 1, 2, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 5,
];

const part = (n: number) => {
  let nbs = Array(9).fill(0);
  input.forEach((n) => (nbs[n] = nbs[n] + 1));
  for (let i = 0; i < n; i++) {
    const newNbs = Array(9).fill(0);
    for (let t = 0; t < 9; t++) {
      const v = nbs[t];
      if (!t) {
        newNbs[6] += v;
        newNbs[8] += v;
      } else newNbs[t - 1] += v;
    }
    nbs = newNbs;
  }
  return nbs.reduce((a, b) => a + b, 0);
};

console.log(part(80));
console.log(part(256));
