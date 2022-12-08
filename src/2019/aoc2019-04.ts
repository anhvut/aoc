export {};
const [min, max] = [134792, 675810];

const matchCriteria = (nb: number): boolean => {
  const digits: number[] = nb
    .toString(10)
    .split('')
    .map((x) => +x);
  const digitsButFirst = digits.slice(1);
  return digitsButFirst.every((n, i) => n >= digits[i]) && digitsButFirst.some((n, i) => n === digits[i]);
};

const matchCriteria2 = (nb: number): boolean => {
  const digits: number[] = nb
    .toString(10)
    .split('')
    .map((x) => +x);
  const digitsButFirst = digits.slice(1);
  return (
    digitsButFirst.every((n, i) => n >= digits[i]) &&
    digits.some((n, i) => n === digits[i - 1] && n !== digits[i - 2] && n !== digits[i + 1])
  );
};

const part1 = (): number => {
  let result = 0;
  for (let n = min; n <= max; n++) if (matchCriteria(n)) result++;
  return result;
};

const part2 = (): number => {
  let result = 0;
  for (let n = min; n <= max; n++) if (matchCriteria2(n)) result++;
  return result;
};

console.log(part1());
console.log(part2());
