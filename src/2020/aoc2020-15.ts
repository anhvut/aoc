export {};

const part1 = (arr: number[], max: number) => {
  const acc = [null, ...arr];
  while (acc.length <= max) {
    const last = acc[acc.length - 1];
    const lastIndex = acc.lastIndexOf(last, acc.length - 2);
    if (lastIndex < 0) {
      acc.push(0);
    } else {
      acc.push(acc.length - 1 - lastIndex);
    }
  }
  return acc[max];
};

const part2 = (arr: number[], max: number) => {
  const acc = Array(max + 1).fill(0);
  arr.slice(0, arr.length - 1).forEach((a, i) => (acc[a] = i + 1));
  let last = arr[arr.length - 1];
  let next = 0;
  for (let turn = arr.length + 1; turn <= max; turn++) {
    next = 0;
    const lastTurn = acc[last];
    if (lastTurn > 0) {
      next = turn - 1 - lastTurn;
    }
    acc[last] = turn - 1;
    last = next;
  }
  return next;
};

console.log(part1([1, 17, 0, 10, 18, 11, 6], 2020));
console.log(part2([1, 17, 0, 10, 18, 11, 6], 2020));
console.time();
console.log(part2([1, 17, 0, 10, 18, 11, 6], 30000000));
console.timeEnd();
