export {};
const fs = require('fs');
const lines: string[] = fs.readFileSync(__filename.replace(/\.js$/, '.txt'), 'utf-8').split(/\n/g);
const inputDigits: number[] = lines[0].split('').map(Number);

const compute = (nbPhases: number = 100, input: number[] = inputDigits): number[] => {
  const length = input.length;
  let digits = Array(length * 2).fill(0);   // work with length * 2 to avoid boundary checks
  for (let i = 0; i < length; i++) digits[i] = input[i];
  let nextDigits = Array(digits.length).fill(0);
  const start = new Date();
  console.log(`${start}: start computing`);
  for (let phase = 0; phase < nbPhases; phase++) {
    for (let repetition = 1; repetition <= length; repetition++) {
      let i = repetition - 1;
      let acc = 0;
      do {
        for (let j = 0; j < repetition; j++) acc += digits[i++];
        i += repetition;
        if (i >= length) break;
        for (let j = 0; j < repetition; j++) acc -= digits[i++];
        i += repetition;
      } while (i < length);
      nextDigits[repetition - 1] = Math.abs(acc) % 10;
    }
    let swap = digits;
    digits = nextDigits;
    nextDigits = swap;
  }
  console.log(`Duration: ${(Number(new Date()) - Number(start)) / 1000}s`);
  return digits.slice(0, length);
};

const compute2ndHalf = (nbPhases: number = 100, input: number[] = inputDigits): number[] => {
  let digits = input.slice();
  let nextDigits = new Array(digits.length);
  const start = new Date();
  console.log(`${start}: start computing`);
  for (let phase = 0; phase < nbPhases; phase++) {
    // from end to beginning : only add first digit
    let acc = 0;
    for (let k = input.length-1; k >= 0; k--) {
      acc += digits[k];
      nextDigits[k] = Math.abs(acc) % 10;
    }
    let swap = digits;
    digits = nextDigits;
    nextDigits = swap;
  }
  console.log(`Duration: ${(Number(new Date()) - Number(start)) / 1000}s`);
  return digits;
};

const part1 = (): number => {
  const digits = compute();
  return +digits.slice(0, 8).join('');
};

const part2 = (): number => {
  const offset = +inputDigits.slice(0, 7).join('');
  const offsetFromEnd = inputDigits.length*10_000 - offset;
  const repetitionNeeded = Math.ceil(offsetFromEnd / inputDigits.length);
  const offsetReduced = inputDigits.length * repetitionNeeded - offsetFromEnd
  const digits = Array(repetitionNeeded).fill(0).flatMap(_ => inputDigits);
  const output = compute2ndHalf(100, digits);
  return +output.slice(offsetReduced, offsetReduced + 8).join('');
};

console.log(part1());
console.log(part2());