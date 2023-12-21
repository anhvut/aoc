const parse = (input: string[]) => {
  return input;
};

const part1 = (input: string[]) => {
  return parse(input);
};

const part2 = (input: string[]) => {
  return parse(input);
};

const runs = [1, 0, 0, 0];

const inputSample = `
`
  .trim()
  .split('\n');

const inputReal = `
`
  .trim()
  .split('\n');

if (runs[0]) console.log('part1 sample', part1(inputSample));
if (runs[1]) console.log('part1 real', part1(inputReal));
if (runs[2]) console.log('part2 sample', part2(inputSample));
if (runs[3]) console.log('part2 real', part2(inputReal));
