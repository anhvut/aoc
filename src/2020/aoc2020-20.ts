export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

type TILE = string[];

type VARIANT = {
  border: string;
  borderId: number;
  flip: boolean;
};

type MATCH = VARIANT & {
  tileId: number;
};

const tiles: Record<string, TILE> = {};
let currentTile: TILE = [];
lines
  .filter((x) => !!x)
  .forEach((l) => {
    if (l.startsWith('Tile ')) {
      currentTile = [];
      const tileId = l.slice(5).split(':')[0];
      tiles[tileId] = currentTile;
    } else {
      currentTile.push(l);
    }
  });

function* getBorders(tile: TILE, withFlip: boolean): Generator<VARIANT> {
  yield { border: tile[0], borderId: 0, flip: false };
  if (withFlip) yield { border: Array.from(tile[0]).reverse().join(''), borderId: 0, flip: true };
  const line1 = tile.map((x) => x.slice(-1));
  yield { border: line1.join(''), borderId: 1, flip: false };
  if (withFlip) yield { border: line1.reverse().join(''), borderId: 1, flip: true };
  const line2 = Array.from(tile[tile.length - 1]).reverse();
  yield { border: line2.join(''), borderId: 2, flip: false };
  if (withFlip) yield { border: line2.reverse().join(''), borderId: 2, flip: true };
  const line3 = tile.map((x) => x[0]).reverse();
  yield { border: line3.join(''), borderId: 3, flip: false };
  if (withFlip) yield { border: line3.reverse().join(''), borderId: 3, flip: true };
}

const searchMatches = () => {
  const searchMatch = (tile1: TILE, tile2: TILE) => {
    for (const variant1 of getBorders(tile1, false)) {
      for (const variant2 of getBorders(tile2, true)) {
        if (variant1.border === variant2.border) return { variant1, variant2 };
      }
    }
    return null;
  };
  const matches: MATCH[][] = [];
  const tileIds = Object.keys(tiles)
    .map((x) => +x)
    .sort((a, b) => a - b);
  for (let i = 0; i < tileIds.length - 1; i++) {
    const tileId1 = tileIds[i];
    const tile1 = tiles[tileId1];
    for (let j = i + 1; j < tileIds.length; j++) {
      const tileId2 = tileIds[j];
      const tile2 = tiles[tileId2];
      const match = searchMatch(tile1, tile2);
      if (match)
        matches.push([
          { tileId: tileId1, ...match.variant1 },
          { tileId: tileId2, ...match.variant2 },
        ]);
    }
  }
  return matches;
};

const tileIdCounts = (candidates: MATCH[]) => {
  const counts: Record<number, number> = {};
  candidates.forEach(({ tileId }) => (counts[tileId] = (counts[tileId] ?? 0) + 1));
  return counts;
};

const getMatchContext = (): [MATCH[][], number[]] => {
  const matches = searchMatches();
  const counts = tileIdCounts(matches.flat());
  const match2 = Object.entries(counts).flatMap(([id, counts]) => (counts === 2 ? [+id] : []));
  return [matches, match2];
};

const part1 = () => {
  const [, match2] = getMatchContext();
  return match2.reduce((a, b) => a * b);
};

function* getTileVariants(tile: TILE) {
  yield tile;
  yield tile.slice().reverse();
  let currentRotation = tile;
  const lastY = tile.length - 1;
  for (let i = 0; i < 3; i++) {
    const nextRotation = Array(currentRotation[0].length)
      .fill(0)
      .map((_, x) => currentRotation.map((_line, y, a) => a[lastY - y][x]).join(''));
    yield nextRotation;
    yield nextRotation.slice().reverse();
    currentRotation = nextRotation;
  }
}

const pasteRight = (superTile: TILE, pasteTile: TILE, xPaste: number, yPaste: number) => {
  const startYIndex = yPaste * pasteTile.length;
  const lineXIndex = xPaste * pasteTile[0].length - 1;
  const line = superTile
    .slice(startYIndex, startYIndex + pasteTile.length)
    .map((x) => x[lineXIndex])
    .join('');
  let rotatedTile;
  for (rotatedTile of getTileVariants(pasteTile)) {
    const otherLine = rotatedTile.map((x) => x[0]).join('');
    if (line === otherLine) break;
  }
  rotatedTile.forEach((row, y) => (superTile[startYIndex + y] += row));
};

const pasteBottom = (superTile: TILE, pasteTile: TILE, xPaste: number, yPaste: number) => {
  const lineYIndex = yPaste * pasteTile.length - 1;
  const lineXIndex = xPaste * pasteTile[0].length;
  const line = superTile[lineYIndex].slice(lineXIndex, lineXIndex + pasteTile[0].length);
  let rotatedTile;
  for (rotatedTile of getTileVariants(pasteTile)) {
    const otherLine = rotatedTile[0];
    if (line === otherLine) break;
  }
  rotatedTile.forEach((row, y) => (xPaste ? (superTile[lineYIndex + y + 1] += row) : superTile.push(row)));
};

const removeBorder = (tile: TILE, size: number) => {
  const result = [];
  for (let ry = 0; ry < tile.length; ry += size) {
    for (let y = ry + 1; y < ry + size - 1; y++) {
      let currentLine = '';
      for (let rx = 0; rx < tile[0].length; rx += size) currentLine += tile[y].slice(rx + 1, rx + size - 1);
      result.push(currentLine);
    }
  }
  return result;
};

const part2 = () => {
  const [matches, match2] = getMatchContext();
  const firstTileId = match2[0];
  const matchesFirstTile = matches.filter((m) => m[0].tileId === firstTileId || m[1].tileId === firstTileId);
  const needFlipHoriz =
    matchesFirstTile.flat().find((x) => x.tileId === firstTileId && [1, 3].includes(x.borderId)).borderId === 3;
  const needFlipVert =
    matchesFirstTile.flat().find((x) => x.tileId === firstTileId && [0, 2].includes(x.borderId)).borderId === 0;

  const superTile = tiles[firstTileId].map((x) => (needFlipHoriz ? Array.from(x).reverse().join('') : x));
  if (needFlipVert) superTile.reverse();

  // first tile put - complete with 3 next tiles
  const rightTileId = matches
    .find((x) => x.some((y) => y.tileId === firstTileId && [1, 3].includes(y.borderId)))
    .flat()
    .find((x) => x.tileId !== firstTileId).tileId;
  const bottomTileId = matches
    .find((x) => x.some((y) => y.tileId === firstTileId && [0, 2].includes(y.borderId)))
    .flat()
    .find((x) => x.tileId !== firstTileId).tileId;
  const alreadyFoundId: Record<number | string, boolean> = {
    [firstTileId]: true,
    [rightTileId]: true,
    [bottomTileId]: true,
  };
  const rightBottomMatches = matches.filter((x) =>
    x.some((y) => y.tileId === rightTileId || y.tileId === bottomTileId)
  );
  const rightBottomCounts = tileIdCounts(rightBottomMatches.flat());
  const rightBottomTileId = +Object.entries(rightBottomCounts).find(
    ([id, counts]) => counts === 2 && !alreadyFoundId[id]
  )[0];

  pasteRight(superTile, tiles[rightTileId], 1, 0);
  pasteBottom(superTile, tiles[bottomTileId], 0, 1);
  pasteRight(superTile, tiles[rightBottomTileId], 1, 1);

  alreadyFoundId[rightBottomTileId] = true;
  const tileMap = [
    [firstTileId, rightTileId],
    [bottomTileId, rightBottomTileId],
  ];
  const puzzleSize = Math.sqrt(Object.values(tiles).length);

  const complete = (x: number, y: number) => {
    const lastId = tileMap[y]?.[x - 1];
    const lastId2 = tileMap[y - 1]?.[x];
    const foundExceptLast = {
      ...alreadyFoundId,
      ...(lastId && { [lastId]: false }),
      ...(lastId2 && { [lastId2]: false }),
    };
    const candidates = matches
      .filter((a) => a.some((b) => [lastId, lastId2].includes(b.tileId)) && !a.some((b) => foundExceptLast[b.tileId]))
      .flat()
      .filter((a) => !alreadyFoundId[a.tileId]);
    const counts = tileIdCounts(candidates);
    const tileId = +Object.entries(counts).sort(([, c1], [, c2]) => c2 - c1)[0][0];
    (x ? pasteRight : pasteBottom)(superTile, tiles[tileId], x, y);
    x ? tileMap[y].push(tileId) : tileMap.push([tileId]);
    alreadyFoundId[tileId] = true;
  };

  for (let x = 2; x < puzzleSize; x++) {
    complete(x, 0);
    complete(x, 1);
  }

  for (let y = 2; y < puzzleSize; y++) for (let x = 0; x < puzzleSize; x++) complete(x, y);

  const tileNoBorder = removeBorder(superTile, tiles[firstTileId].length);
  const monster = ['                  # ', '#    ##    ##    ###', ' #  #  #  #  #  #   '].map((x) => Array.from(x));
  const monsterPos = [];
  for (let y = 0; y < monster.length; y++)
    for (let x = 0; x < monster[0].length; x++) if (monster[y][x] === '#') monsterPos.push([x, y]);
  let maxMonsters = 0;
  for (const rotatedTile of getTileVariants(tileNoBorder)) {
    let nbMonster = 0;
    for (let ry = 0; ry < rotatedTile.length - monster.length + 1; ry++) {
      for (let rx = 0; rx < rotatedTile[0].length - monster[0].length; rx++) {
        nbMonster += Number(monsterPos.every(([x, y]) => rotatedTile[ry + y][rx + x] === '#'));
      }
    }
    maxMonsters = Math.max(maxMonsters, nbMonster);
  }
  return (
    tileNoBorder.reduce((a, l) => a + Array.from(l).reduce((b, x) => b + Number(x === '#'), 0), 0) -
    maxMonsters * monsterPos.length
  );
};

console.log(part1());
console.log(part2());
