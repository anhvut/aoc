/*
Solve
x * (t - x) > d
x² - t.x + d < 0

delta = t² - 4.d

x1 = (t - sqrt(t² - 4.d)) / 2
x2 = (t + sqrt(t² - 4.d)) / 2
*/
function compute(t: number, d: number) {
  const delta = t * t - 4 * d;
  let min = ((t - Math.sqrt(delta)) / 2);
  let max = ((t + Math.sqrt(delta)) / 2);
  if (Number.isInteger(min)) min++;
  else min = Math.ceil(min);
  if (Number.isInteger(max)) max--;
  else max = Math.floor(max);
  return max - min + 1;
}

const part1 = ({Time, Distance}) => Time.map((t: number, i: number) => compute(t, Distance[i])).reduce((a: number, b: number) => a * b);

const part2 = ({Time, Distance}) => compute(+Time.join(''), +Distance.join(''));

const runs = [1, 1, 1, 1];

const inputSample = {
  Time: [7, 15, 30],
  Distance: [9, 40, 200]
};

const inputReal = {
  Time: [50, 74, 86, 85],
  Distance: [242, 1017, 1691, 1252]
};

console.time('time');
if (runs[0]) console.log('part1 sample', part1(inputSample));
if (runs[1]) console.log('part1 real', part1(inputReal));
if (runs[2]) console.log('part2 sample', part2(inputSample));
if (runs[3]) console.log('part2 real', part2(inputReal));
console.timeEnd('time');
