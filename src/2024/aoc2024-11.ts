import {consoleTimeit} from '../util';
import {sum} from 'es-toolkit';

const part = (nbTimes: number) => (input: string) => {
  let nbs = input.split(' ').map((x) => +x);
  for (let i = 0; i < nbTimes; i++) {
    nbs = nbs.flatMap((x) => {
      if (x === 0) return [1];
      const s = x.toString();
      if (s.length % 2 === 0) return [s.substring(0, s.length / 2), s.substring(s.length / 2)].map((x) => +x);
      return x * 2024;
    });
  }
  return nbs.length;
};

const partFast = (nbTimes: number) => (input: string) => {
  let nbs = Object.fromEntries(input.split(' ').map((x) => [x, 1]));
  for (let i = 0; i < nbTimes; i++) {
    let nextNbs = {};
    for (const [k, v] of Object.entries(nbs)) {
      const x = +k;
      if (x === 0) {
        nextNbs[1] = (nextNbs[1] ?? 0) + v;
        continue;
      }
      const s = x.toString();
      if (s.length % 2 === 0) {
        const k1 = s.substring(0, s.length / 2);
        nextNbs[k1] = (nextNbs[k1] ?? 0) + v;
        const k2 = s.substring(s.length / 2);
        nextNbs[k2] = (nextNbs[k2] ?? 0) + v;
      } else {
        const key = x * 2024;
        nextNbs[key] = (nextNbs[key] ?? 0) + v;
      }
    }
    nbs = nextNbs;
  }
  return sum(Object.values(nbs));
};

const part1 = part(25);
const part2 = partFast(75);

// noinspection SpellCheckingInspection
const inputSample = `125 17`;

// noinspection SpellCheckingInspection
const inputReal = `0 7 6618216 26481 885 42 202642 8791`;

const runs = [1, 1, 1, 1];
if (runs[0]) consoleTimeit('part1 sample', () => part1(inputSample));
if (runs[1]) consoleTimeit('part1 real', () => part1(inputReal));
if (runs[2]) consoleTimeit('part2 sample', () => part2(inputSample));
if (runs[3]) consoleTimeit('part2 real', () => part2(inputReal));
