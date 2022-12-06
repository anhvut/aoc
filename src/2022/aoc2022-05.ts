const allIndices = (arr, val) => {
  const r = [];
  let i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) r.push(i);
  return r;
};

const parse = (input: string[]) => {
  const stacks: string[][] = [];
  const instructions: number[][] = [];

  for (const line of input) {
    const indices = allIndices(line, "[");
    if (indices.length > 0) {
      for (const n of indices) {
        const i = n / 4 + 1;
        if (!stacks[i]) stacks[i] = [];
        stacks[i].push(line[n + 1]);
      }
    } else if (line.startsWith("move")) {
      instructions.push(
        line
          .replace("move ", "")
          .replace(" from ", " ")
          .replace(" to ", " ")
          .split(" ")
          .map((x) => +x)
      );
    }
  }
  return [stacks, instructions];
};

const part1 = (input: string[]) => {
  const [stacks, instructions] = parse(input);
  for (const [nb, from, to] of instructions) {
    for (let i = 0; i < nb; i++) {
      const top = stacks[from][0];
      stacks[from] = stacks[from].slice(1);
      stacks[to] = [top, ...stacks[to]];
    }
  }
  return stacks
    .slice(1)
    .map((x) => x[0])
    .join("");
};

const part2 = (input: string[]) => {
  const [stacks, instructions] = parse(input);
  for (const [nb, from, to] of instructions) {
    const top = stacks[from].slice(0, nb);
    stacks[from] = stacks[from].slice(nb);
    stacks[to] = [...top, ...stacks[to]];
  }
  return stacks
    .slice(1)
    .map((x) => x[0])
    .join("");
};

const inputSample = `    [D]    
[N] [C]    
[Z] [M] [P]
 1 2 3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`.split("\n");

const inputReal = `[T]     [D]         [L]            
[R]     [S] [G]     [P]         [H]
[G]     [H] [W]     [R] [L]     [P]
[W]     [G] [F] [H] [S] [M]     [L]
[Q]     [V] [B] [J] [H] [N] [R] [N]
[M] [R] [R] [P] [M] [T] [H] [Q] [C]
[F] [F] [Z] [H] [S] [Z] [T] [D] [S]
[P] [H] [P] [Q] [P] [M] [P] [F] [D]
 1   2   3   4   5   6   7   8   9 

move 3 from 8 to 9
move 2 from 2 to 8
move 5 from 4 to 2
move 7 from 1 to 4
move 3 from 8 to 2
move 3 from 2 to 7
move 1 from 7 to 4
move 3 from 2 to 9
move 4 from 7 to 9
move 1 from 5 to 2
move 2 from 3 to 4
move 5 from 9 to 5
move 6 from 9 to 3
move 5 from 9 to 5
move 1 from 9 to 7
move 2 from 3 to 1
move 7 from 3 to 9
move 2 from 7 to 2
move 5 from 2 to 4
move 1 from 2 to 9
move 2 from 1 to 9
move 7 from 6 to 1
move 2 from 7 to 3
move 2 from 3 to 9
move 1 from 7 to 4
move 1 from 9 to 2
move 3 from 1 to 8
move 2 from 3 to 4
move 5 from 9 to 2
move 1 from 3 to 9
move 8 from 5 to 7
move 1 from 6 to 1
move 15 from 4 to 1
move 4 from 2 to 5
move 5 from 9 to 7
move 1 from 9 to 5
move 5 from 1 to 2
move 3 from 8 to 9
move 1 from 7 to 6
move 11 from 1 to 2
move 7 from 5 to 3
move 4 from 2 to 6
move 7 from 3 to 4
move 3 from 5 to 9
move 2 from 2 to 5
move 5 from 1 to 8
move 2 from 6 to 8
move 3 from 8 to 9
move 9 from 4 to 9
move 9 from 7 to 4
move 2 from 8 to 1
move 1 from 8 to 7
move 6 from 2 to 7
move 5 from 2 to 4
move 5 from 7 to 2
move 2 from 1 to 7
move 2 from 6 to 4
move 7 from 7 to 1
move 3 from 2 to 6
move 1 from 8 to 7
move 2 from 9 to 3
move 2 from 3 to 1
move 1 from 2 to 5
move 4 from 6 to 5
move 2 from 2 to 3
move 3 from 5 to 7
move 1 from 5 to 3
move 9 from 1 to 7
move 2 from 9 to 5
move 13 from 4 to 1
move 5 from 7 to 2
move 3 from 3 to 1
move 2 from 2 to 9
move 1 from 2 to 7
move 5 from 5 to 6
move 2 from 2 to 4
move 5 from 1 to 3
move 9 from 7 to 8
move 2 from 9 to 5
move 3 from 5 to 4
move 5 from 9 to 2
move 10 from 4 to 8
move 1 from 4 to 1
move 2 from 8 to 4
move 4 from 8 to 2
move 3 from 6 to 8
move 7 from 8 to 7
move 10 from 9 to 3
move 7 from 3 to 2
move 11 from 2 to 3
move 13 from 3 to 9
move 1 from 6 to 3
move 1 from 1 to 2
move 1 from 2 to 8
move 3 from 3 to 4
move 1 from 2 to 9
move 1 from 4 to 1
move 10 from 8 to 3
move 11 from 9 to 7
move 1 from 6 to 2
move 14 from 7 to 1
move 2 from 2 to 9
move 4 from 7 to 6
move 1 from 2 to 4
move 3 from 4 to 2
move 4 from 2 to 9
move 10 from 3 to 4
move 3 from 6 to 1
move 5 from 9 to 5
move 5 from 5 to 8
move 1 from 9 to 7
move 2 from 9 to 6
move 1 from 9 to 8
move 2 from 4 to 8
move 1 from 4 to 5
move 2 from 3 to 1
move 2 from 3 to 7
move 27 from 1 to 2
move 2 from 7 to 1
move 9 from 4 to 6
move 9 from 6 to 5
move 5 from 8 to 6
move 26 from 2 to 3
move 1 from 2 to 5
move 1 from 2 to 7
move 1 from 8 to 4
move 1 from 7 to 8
move 24 from 3 to 5
move 1 from 8 to 5
move 1 from 4 to 3
move 1 from 7 to 1
move 1 from 8 to 9
move 7 from 1 to 7
move 8 from 6 to 4
move 4 from 7 to 6
move 1 from 3 to 9
move 2 from 9 to 1
move 3 from 7 to 9
move 8 from 4 to 6
move 3 from 9 to 1
move 1 from 3 to 6
move 1 from 8 to 2
move 10 from 5 to 4
move 1 from 3 to 8
move 13 from 5 to 3
move 1 from 2 to 9
move 1 from 8 to 9
move 1 from 3 to 8
move 1 from 9 to 2
move 3 from 6 to 9
move 7 from 4 to 9
move 4 from 3 to 9
move 2 from 6 to 8
move 2 from 4 to 5
move 10 from 9 to 3
move 1 from 1 to 9
move 1 from 4 to 8
move 1 from 1 to 4
move 1 from 4 to 5
move 4 from 6 to 3
move 1 from 9 to 5
move 1 from 6 to 9
move 2 from 6 to 5
move 1 from 9 to 2
move 1 from 6 to 7
move 18 from 5 to 2
move 22 from 3 to 7
move 19 from 7 to 1
move 3 from 8 to 5
move 4 from 9 to 3
move 2 from 7 to 2
move 1 from 8 to 1
move 19 from 1 to 3
move 2 from 7 to 5
move 13 from 3 to 9
move 4 from 1 to 2
move 3 from 5 to 1
move 11 from 9 to 1
move 11 from 2 to 8
move 3 from 9 to 3
move 3 from 5 to 2
move 2 from 1 to 4
move 5 from 2 to 7
move 12 from 1 to 5
move 2 from 4 to 5
move 9 from 5 to 8
move 1 from 5 to 3
move 4 from 2 to 3
move 2 from 7 to 5
move 6 from 2 to 8
move 17 from 8 to 9
move 2 from 9 to 6
move 2 from 7 to 1
move 15 from 9 to 6
move 2 from 2 to 4
move 9 from 8 to 5
move 2 from 1 to 3
move 12 from 6 to 2
move 2 from 3 to 9
move 5 from 6 to 3
move 4 from 5 to 3
move 11 from 3 to 4
move 2 from 9 to 4
move 6 from 5 to 2
move 13 from 4 to 3
move 1 from 4 to 5
move 1 from 4 to 8
move 18 from 2 to 6
move 2 from 5 to 3
move 1 from 8 to 3
move 1 from 2 to 5
move 1 from 7 to 8
move 28 from 3 to 6
move 2 from 3 to 4
move 3 from 5 to 9
move 2 from 5 to 9
move 3 from 9 to 3
move 5 from 3 to 4
move 1 from 9 to 3
move 1 from 9 to 1
move 1 from 3 to 4
move 45 from 6 to 2
move 1 from 8 to 3
move 2 from 4 to 6
move 5 from 4 to 2
move 1 from 3 to 7
move 3 from 2 to 9
move 1 from 4 to 8
move 3 from 6 to 1
move 42 from 2 to 8
move 2 from 9 to 2
move 4 from 2 to 6
move 2 from 2 to 7
move 1 from 9 to 6
move 2 from 8 to 9
move 4 from 1 to 8
move 1 from 6 to 4
move 1 from 4 to 8
move 1 from 2 to 5
move 3 from 7 to 4
move 39 from 8 to 3
move 7 from 8 to 5
move 8 from 5 to 7
move 35 from 3 to 1
move 4 from 3 to 7
move 10 from 7 to 2
move 2 from 9 to 6
move 3 from 4 to 2
move 1 from 7 to 5
move 1 from 7 to 8
move 1 from 5 to 4
move 12 from 1 to 6
move 1 from 8 to 1
move 1 from 4 to 5
move 14 from 6 to 8
move 9 from 8 to 6
move 5 from 6 to 1
move 11 from 2 to 9
move 1 from 9 to 8
move 6 from 8 to 3
move 6 from 9 to 2
move 8 from 1 to 9
move 3 from 3 to 6
move 7 from 1 to 4
move 1 from 5 to 9
move 8 from 9 to 8
move 7 from 6 to 8
move 1 from 9 to 3
move 3 from 6 to 4
move 3 from 9 to 1
move 4 from 3 to 2
move 1 from 6 to 7
move 1 from 4 to 2
move 13 from 1 to 7
move 6 from 4 to 8
move 1 from 7 to 3
move 1 from 4 to 6
move 1 from 9 to 5
move 1 from 3 to 5
move 19 from 8 to 9
move 1 from 6 to 5
move 6 from 9 to 2
move 2 from 5 to 8
move 1 from 5 to 2
move 4 from 1 to 4
move 8 from 9 to 4
move 3 from 9 to 8
move 2 from 9 to 1
move 6 from 7 to 5
move 12 from 4 to 2
move 6 from 8 to 3
move 1 from 4 to 1
move 1 from 3 to 1
move 13 from 2 to 3
move 4 from 5 to 3
move 1 from 4 to 9
move 1 from 8 to 9
move 12 from 3 to 2
move 1 from 9 to 1
move 2 from 5 to 9
move 3 from 9 to 5
move 1 from 7 to 5
move 3 from 7 to 3
move 1 from 5 to 4
move 1 from 5 to 8
move 9 from 2 to 3
move 2 from 2 to 3
move 3 from 1 to 9
move 1 from 8 to 9
move 3 from 9 to 1
move 9 from 2 to 6
move 1 from 9 to 5
move 6 from 2 to 3
move 2 from 6 to 9
move 3 from 6 to 3
move 1 from 4 to 3
move 2 from 9 to 6
move 2 from 7 to 2
move 2 from 2 to 8
move 24 from 3 to 7
move 2 from 5 to 6
move 2 from 8 to 2
move 7 from 2 to 8
move 8 from 3 to 6
move 2 from 1 to 3
move 1 from 1 to 2
move 1 from 5 to 2
move 15 from 7 to 4
move 9 from 7 to 9
move 7 from 9 to 1
move 5 from 8 to 1
move 4 from 1 to 4
move 19 from 4 to 3
move 22 from 3 to 5
move 1 from 7 to 5
move 9 from 5 to 4
move 6 from 1 to 3
move 6 from 3 to 1
move 4 from 5 to 4
move 1 from 2 to 1
move 1 from 2 to 6
move 4 from 6 to 1
move 1 from 3 to 6
move 3 from 6 to 3
move 2 from 9 to 8
move 2 from 5 to 3
move 2 from 5 to 1
move 10 from 6 to 4
move 4 from 4 to 9
move 7 from 4 to 3
move 2 from 8 to 7
move 4 from 9 to 3
move 5 from 5 to 7
move 1 from 5 to 1
move 1 from 6 to 3
move 1 from 8 to 4
move 1 from 8 to 3
move 13 from 4 to 5
move 1 from 1 to 8
move 6 from 5 to 3
move 1 from 7 to 6
move 5 from 7 to 6
move 9 from 1 to 8
move 1 from 8 to 4
move 1 from 7 to 1
move 1 from 4 to 1
move 5 from 3 to 7
move 3 from 7 to 9
move 1 from 5 to 4
move 6 from 8 to 6
move 1 from 9 to 3
move 2 from 9 to 5
move 7 from 5 to 9
move 1 from 7 to 5
move 2 from 5 to 3
move 10 from 6 to 8
move 2 from 6 to 1
move 1 from 4 to 9
move 1 from 7 to 5
move 8 from 8 to 2
move 1 from 1 to 7
move 1 from 9 to 7
move 1 from 5 to 1
move 3 from 9 to 8
move 7 from 8 to 7
move 6 from 7 to 1
move 1 from 8 to 7
move 4 from 7 to 1
move 16 from 3 to 7
move 4 from 3 to 1
move 5 from 7 to 8
move 16 from 1 to 4
move 9 from 1 to 7
move 1 from 3 to 4
move 15 from 4 to 8
move 1 from 3 to 1
move 2 from 1 to 6
move 2 from 4 to 9
move 17 from 8 to 2
move 6 from 9 to 5
move 8 from 7 to 8
move 2 from 6 to 9
move 4 from 5 to 7
move 2 from 8 to 5
move 1 from 5 to 9
move 11 from 2 to 6
move 4 from 6 to 1
move 5 from 2 to 8
move 2 from 9 to 2
move 1 from 9 to 3
move 3 from 1 to 8
move 1 from 3 to 6
move 7 from 6 to 9
move 2 from 5 to 4
move 6 from 7 to 4
move 4 from 8 to 1
move 1 from 5 to 2
move 1 from 6 to 1
move 7 from 9 to 8
move 2 from 7 to 9
move 9 from 2 to 9
move 5 from 9 to 3
move 3 from 2 to 8
move 4 from 8 to 7
move 9 from 7 to 2
move 3 from 1 to 3
move 14 from 8 to 1
move 2 from 8 to 3
move 1 from 9 to 4
move 3 from 7 to 9
move 8 from 3 to 9
move 2 from 2 to 7
move 12 from 1 to 8
move 4 from 1 to 6
move 2 from 6 to 7
move 1 from 6 to 7
move 9 from 4 to 7
move 9 from 7 to 4
move 1 from 1 to 6
move 2 from 3 to 6
move 2 from 6 to 8
move 12 from 9 to 8
move 2 from 6 to 9
move 2 from 9 to 7
move 1 from 8 to 5
move 5 from 7 to 5
move 1 from 9 to 1
move 3 from 4 to 1
move 5 from 4 to 8
move 4 from 1 to 7
move 1 from 4 to 2
move 19 from 8 to 4
move 2 from 7 to 5
move 14 from 8 to 5
move 2 from 7 to 8
move 3 from 9 to 8
move 19 from 4 to 2
move 9 from 2 to 4
move 2 from 7 to 8
move 15 from 5 to 9
move 15 from 9 to 8
move 1 from 5 to 9
move 11 from 8 to 7
move 4 from 5 to 8
move 1 from 5 to 9
move 2 from 9 to 5
move 2 from 2 to 6
move 14 from 2 to 9
move 12 from 8 to 9
move 3 from 8 to 4
move 7 from 9 to 2
move 4 from 7 to 9
move 1 from 6 to 9
move 1 from 7 to 5
move 1 from 6 to 2
move 3 from 5 to 4
move 19 from 9 to 4
move 1 from 5 to 1
move 1 from 9 to 8
move 1 from 1 to 7
move 1 from 8 to 9
move 4 from 7 to 2
move 3 from 7 to 6
move 18 from 4 to 2
move 17 from 2 to 3
move 2 from 6 to 8
move 17 from 3 to 6
move 13 from 2 to 1
move 2 from 8 to 3
move 2 from 2 to 9
move 6 from 1 to 9
move 1 from 3 to 4
move 1 from 3 to 9
move 8 from 6 to 4
move 20 from 4 to 8
move 3 from 4 to 8
move 15 from 8 to 2
move 11 from 2 to 6
move 2 from 1 to 7
move 7 from 9 to 8
move 6 from 9 to 3
move 1 from 6 to 5`.split("\n");

console.log(part1(inputReal));
console.log(part2(inputReal));