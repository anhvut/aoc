const fs = require('fs')

const lines = fs.readFileSync(__dirname + '/aoc2021-19.txt', 'utf-8').split(/\r?\n/);

const scanners = [];
let currentScanner = null;
lines.forEach(l => {
  if (l.length <= 1);
  else if (l.startsWith('---')) {
    currentScanner = [];
    scanners.push(currentScanner);
  } else currentScanner.push(l.split(',').map(x => +x));
})

const matrixIdentity = (dimension) => {
  return Array(dimension).fill(0).map((_, i) => {
    const l = Array(dimension).fill(0);
    l[i] = 1;
    return l;
  });
}

const matrixMultiply = (m1, m2) => {
  // m1 size (y1, x1) x m2 size (y2, x2) => size (y3=y1, x3=x2) - x1 must be equal y2
  const result = [];
  for (let yTarget = 0; yTarget < m1.length; yTarget++) {
    const line = [];
    result.push(line);
    for (let xTarget = 0; xTarget < m2[0].length; xTarget++) {
      let cell = 0;
      for (let i = 0; i < m2.length; i++) {
        cell += m1[yTarget][i] * m2[i][xTarget];
      }
      line.push(cell);
    }
  }
  return result;
}

const matrixPow = (matrix, n) => {
  let result = matrixIdentity(matrix.length);
  for (let i = 0; i < n; i++) result = matrixMultiply(result, matrix);
  return result;
}

const matrixSerialize = (m) => m.map(x => x.join(',')).join('|');

// 24 uniques rotation matrices with quarter turn in X, Y, Z
const combinations = ['', 'X', 'Y', 'XX', 'XY', 'YX', 'YY', 'XXX', 'XXY', 'XYX', 'XYY', 'YXX', 'YYX', 'YYY',
  'XXXY', 'XXYX', 'XXYY', 'XYXX', 'XYYY', 'YXXX', 'YYYX', 'XXXYX', 'XYXXX', 'XYYYX'];

const inverseCombinations = ['', 'XXX', 'YYY', 'XX', 'YYYXXX', 'XXXYYY', 'YY', 'X', 'YYYXX', 'XYX', 'XYY', 'YXX', 'YYX', 'Y',
  'YYYX', 'XXXYYYXX', 'YYXX', 'XXYYYXXX', 'YXXX', 'XYYY', 'XXXY', 'XXXYYYX', 'XYYYXXX', 'XYYYX'];

const getRotationMatrices = () => {
  const matrixX = [
    [1, 0, 0],
    [0, Math.round(Math.cos(Math.PI / 2)), Math.round(Math.sin(Math.PI / 2))],
    [0, Math.round(-Math.sin(Math.PI / 2)), Math.round(Math.cos(Math.PI / 2))]
  ];
  const matrixY = [
    [Math.round(Math.cos(Math.PI / 2)), 0, Math.round(-Math.sin(Math.PI / 2))],
    [0, 1, 0],
    [Math.round(Math.sin(Math.PI / 2)), 0, Math.round(Math.cos(Math.PI / 2))]
  ];
  const matrixZ = [
    [Math.round(Math.cos(Math.PI / 2)), Math.round(Math.sin(Math.PI / 2)), 0],
    [Math.round(-Math.sin(Math.PI / 2)), Math.round(Math.cos(Math.PI / 2)), 0],
    [0, 0, 1]
  ];
/*
  const rotationsMatrices = [];
  for (let x = 0; x < 4; x++) {
    const X = matrixPow(matrixX, x);
    for (let y = 0; y < 4; y++) {
      const Y = matrixPow(matrixY, y);
      const XY = matrixMultiply(X, Y);
      for (let z = 0; z < 4; z++) {
        const Z = matrixPow(matrixZ, z);
        const XYZ = matrixMultiply(XY, Z);
        rotationsMatrices.push(XYZ);
      }
    }
  }
  const hashes = rotationsMatrices.map(matrixSerialize);
  const hashesToIndex = Object.fromEntries(Object.entries(hashes).map(([k, v]) => [v, k]));
  const indexes = Object.values(hashesToIndex).map(a => +a).sort((a, b) => a - b);
  return indexes.map(i => rotationsMatrices[i]);
*/
  const genMatrix = combinations => combinations.map(c => {
    let m = matrixIdentity(3);
    for (const axis of Array.from(c)) {
      if (axis === 'X') m = matrixMultiply(m, matrixX);
      if (axis === 'Y') m = matrixMultiply(m, matrixY);
      if (axis === 'Z') m = matrixMultiply(m, matrixZ);
    }
    return m;
  });

  const result1 = genMatrix(combinations);
  const result2 = genMatrix(inverseCombinations);

  const rotationMatrixToIndex = {};
  for (let i = 0; i < result1.length; i++) {
    const m = matrixMultiply(result1[i], result2[i]);
    if (matrixSerialize(m) !== '1,0,0|0,1,0|0,0,1')
      throw new Error(`Error rotation matrix ${i}: ${combinations[i]} is not inverse of ${inverseCombinations[i]}`);
    rotationMatrixToIndex[matrixSerialize(result1[i])] = i;
  }
  return [result1, result2, rotationMatrixToIndex];
};

const [rotationMatrices, inverseRotationMatrices, rotationMatrixToIndex] = getRotationMatrices();

const vectorDiff = (pt1, pt2) => pt1.map((x, i) => x - pt2[i]);
const vectorAdd = (pt1, pt2) => pt1.map((x, i) => x + pt2[i]);
const vectorDistManhattan = (pt1, pt2) => pt1.reduce((agg, x, i) => agg + Math.abs(x - pt2[i]), 0);

const getPointsBestMatch = (scan1, scan2) => {
  const pointCounts0 = {};
  for (const pt of scan1) {
    const key = pt.join(',');
    pointCounts0[key] = (pointCounts0[key] ?? 0) + 1;
  }

  for (let i = 0; i < rotationMatrices.length; i++) {
    const rotationMatrix = rotationMatrices[i];
    const rotatedPoints = scan2.map(pt => matrixMultiply([pt], rotationMatrix)[0]);
    for (const pt1 of scan1) {
      for (const pt2 of rotatedPoints) {
        const translation = vectorDiff(pt1, pt2);
        const translatedPts = rotatedPoints.map(pt => vectorAdd(pt, translation));

        const pointCounts = {...pointCounts0};
        for (const pt of translatedPts) {
          const key = pt.join(',');
          pointCounts[key] = (pointCounts[key] ?? 0) + 1;
        }
        const nbCommon = Object.values(pointCounts).filter(x => x === 2).length;
        if (nbCommon >= 12) {
          return {
            rotationIndex: i,
            translation
          };
        }
      }
    }
  }
  return null;
}

function getInverseRelation(match, from, to) {
  const inverseMatrix = inverseRotationMatrices[match.rotationIndex];
  const inverseMatrixIndex = rotationMatrixToIndex[matrixSerialize(inverseMatrix)];
  const inverseRotationMatrix = rotationMatrices[inverseMatrixIndex];
  const inverseTranslation = matrixMultiply([match.translation], inverseRotationMatrix)[0].map(x => -x);
  return {
    from: to,
    to: from,
    added: false,
    rotationIndex: inverseMatrixIndex,
    translation: inverseTranslation
  };
}

const getPointsInScanner0Coordinate = (index, tree, points) => {
  const findPath = (index, tree, currentTransformation) => {
    if (tree.links[index]) return [...currentTransformation, tree.links[index].transformation];
    for (const link of Object.values(tree.links)) {
      const result = findPath(index, link, [...currentTransformation, link.transformation]);
      if (result) return result;
    }
    return null;
  }
  const transformations = findPath(index, tree, []);

  let translation = [0, 0, 0];
  let pts = points;
  for (const t of transformations.reverse()) {
    translation = vectorAdd(matrixMultiply([translation], rotationMatrices[t.rotationIndex])[0], t.translation);
    pts = pts.map(pt => vectorAdd(matrixMultiply([pt], rotationMatrices[t.rotationIndex])[0], t.translation));
  }

  return [translation, pts];
};

function computeTransformations() {
  const relativePositions = [];
  for (let to = 0; to < scanners.length - 1; to++) {
    for (let from = to + 1; from < scanners.length; from++) {
      const match = getPointsBestMatch(scanners[to], scanners[from]);
      if (match) {
        console.log(`Found transformation from ${from} to ${to} with rotation ${combinations[match.rotationIndex]} and translation [${match.translation.join(',')}]`);
        relativePositions.push({
          from,
          to,
          added: false,
          ...match
        });
        relativePositions.push(getInverseRelation(match, from, to));
      }
    }
  }
  return relativePositions;
}

function computeTranslationTree(transformations) {
  const translationTree = {links: {}};
  const indexToTree = [translationTree];
  while (!transformations.every(x => x.added)) {
    for (const r of transformations) {
      if (r.added) continue;
      const toNode = indexToTree[r.to];
      if (toNode) {
        toNode.links[r.from] = {transformation: r, links: {}};
        r.added = true;
        if (!indexToTree[r.from]) {
          indexToTree[r.from] = toNode.links[r.from];
        }
      }
    }
  }
  return translationTree;
}

const part = () => {
  const transformations = computeTransformations();
  const translationTree = computeTranslationTree(transformations);

  const positions = [[0, 0, 0]];
  const points = scanners[0].slice();
  for (let index = 1; index < scanners.length; index++) {
    const [translation, pts] = getPointsInScanner0Coordinate(index, translationTree, scanners[index]);
    points.push(...pts);
    positions.push(translation);
  }

  const hashes = points.map(x => x.join(','));
  const hashesToIndex = Object.fromEntries(Object.entries(hashes).map(([k, v]) => [v, k]));
  const indexes = Object.values(hashesToIndex).map(a => +a).sort((a, b) => a - b);
  const nbDistinctPoints = indexes.length;

  let maxDist = 0;
  for (let i = 0; i < positions.length - 1; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const d = vectorDistManhattan(positions[i], positions[j]);
      maxDist = Math.max(maxDist, d);
    }
  }
  return [nbDistinctPoints, maxDist];
};

console.log(part());