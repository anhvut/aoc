const fs = require('fs')
const lines = fs.readFileSync(__dirname + '/aoc2020-22.txt', 'utf-8').split(/\r?\n/g);

const decks0 = [];
lines.filter(x => !!x).forEach(l => l.startsWith('Player') ? decks0.push([]) : decks0[decks0.length - 1].push(+l));

const playGame = (initialDecks, sub = false) => {
  const decks = initialDecks.map(x => x.slice());
  const previousDecks = {};
  do {
    const decksKey = decks.map(d => d.join(',')).join('-');
    if (previousDecks[decksKey]) return [decks[0], []];
    previousDecks[decksKey] = true;
    const card1 = decks[0].shift();
    const card2 = decks[1].shift();
    let player1Wins;
    if (sub && decks[0].length >= card1 && decks[1].length >= card2)
      player1Wins = (playGame([decks[0].slice(0, card1), decks[1].slice(0, card2)], sub))[0].length > 0;
    else player1Wins = card1 > card2;
    if (player1Wins) decks[0].push(card1, card2);
    else decks[1].push(card2, card1);
  } while (!decks.some(x => x.length === 0));
  return decks;
}

const part = (sub) => {
  const decks = playGame(decks0, sub);
  return decks.find(x => x.length > 0).reduce((a, card, i, deck) => a + card * (deck.length - i), 0);
};

console.log(part(false));
console.log(part(true));
