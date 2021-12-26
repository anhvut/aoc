const players0 = [9, 4];

function *getDie() {
  let value = 1;
  while (true) {
    yield value;
    value++;
    if (value > 100) value -= 100;
  }
}

const part1 = () => {
  const die = getDie();
  const players = players0.map(position => ({score: 0, position}));

  let nextPlayer = 0;
  let maxScore = 0;
  let rolls = 0;
  do {
    const player = players[nextPlayer];
    const values = die.next().value + die.next().value + die.next().value;
    rolls += 3;
    player.position = (player.position - 1 + values) % 10 + 1;
    player.score += player.position;
    maxScore = Math.max(maxScore, player.score);

    nextPlayer = (nextPlayer + 1) % players.length;
  } while (maxScore < 1000);
  return players[nextPlayer].score * rolls;
}

const quantumDice = [[3, 1], [4, 3], [5, 6], [6, 7], [7, 6], [8, 3], [9, 1]];
const part2 = (endScore = 21) => {
  const players = players0.map(position => ({score: 0, position}));
  let universes = [{count: 1, players}];

  let nextPlayer = 0;
  const nbWin = players.map(_ => 0);
  do {
    let nextUniverses = [];
    for (const [value, count] of quantumDice) {
      for (const w of universes) {
        const newCount = w.count * count;
        const player = w.players[nextPlayer];
        const position = (player.position - 1 + value) % 10 + 1;
        const score = player.score + position;
        if (score >= endScore) nbWin[nextPlayer] += newCount;
        else nextUniverses.push({count: newCount, players: w.players.map((x, i) => i === nextPlayer ? {position, score} : x)});
      }
    }
    universes = nextUniverses;
    nextPlayer = (nextPlayer + 1) % players.length;
    console.log(universes.length);
  } while (universes.length > 0);
  console.log(nbWin);
  return nbWin.reduce((a, b) => Math.max(a, b));
}

const part2Fast = (endScore = 21) => {
  const cache = {};
  const solve = (currentPlayer, currentPosition, otherPosition, currentScore, otherScore) => {
    const key = `${currentPlayer}_${currentPosition}_${otherPosition}_${currentScore}_${otherScore}`;
    let wins = cache[key];
    if (wins) return wins;
    wins = [0, 0];
    for (const [value, count] of quantumDice) {
      const nextPosition = ((currentPosition + value - 1) % 10) + 1;
      const nextScore = currentScore + nextPosition;
      if (nextScore >= endScore) wins[currentPlayer] += count;
      else solve(1 - currentPlayer, otherPosition, nextPosition, otherScore, nextScore).forEach((w, i) => wins[i] += w*count);
    }
    cache[key] = wins;
    return wins;
  };
  return Math.max(...solve(0, ...players0, 0, 0));
}

console.log(part1());
console.log(part2Fast());