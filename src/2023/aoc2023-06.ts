function compute(t: number, d: number) {
  let min: number, max: number;
  for (min = 1; min < t; min++) if (min * (t - min) > d) break;
  for (max = t - min + 1; max >= min; max--) if (max * (t - max) > d) break;
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

if (runs[0]) console.log('part1 sample', part1(inputSample));
if (runs[1]) console.log('part1 real', part1(inputReal));
if (runs[2]) console.log('part2 sample', part2(inputSample));
if (runs[3]) console.log('part2 real', part2(inputReal));
