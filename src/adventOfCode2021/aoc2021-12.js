const fs = require('fs')

const lines = fs.readFileSync(__dirname + '/aoc2021-12.txt', 'utf-8').split(/\r?\n/);

const vertexByName = {};
const smallVertex = {};

const edgesByVertices = {};

const registerVertex = (a) => {
  if (!vertexByName[a]) {
    vertexByName[a] = true;
    if (Array.from(a).every(x => 'a' <= x && x <= 'z')) smallVertex[a] = true;
  }
}

const registerEdge = (a, b) => {
  let edges = edgesByVertices[a];
  if (!edges) {
    edges = [];
    edgesByVertices[a] = edges;
  }
  edges.push(b);
}

lines.forEach(x => {
  const [a, b] = x.split('-');
  registerVertex(a);
  registerVertex(b);
  registerEdge(a, b);
  registerEdge(b, a);
});

function *visitAll(vertex, visited, path) {
  for (const next of edgesByVertices[vertex]) {
    if (!visited[next]) {
      const newPath = [...path, next];
      if (smallVertex[next]) visited[next] = true;
      if (next === 'end') yield newPath;
      else {
        yield *visitAll(next, visited, newPath);
      }
      delete visited[next];
    }
  }
}

const part1 = () => {
  const visited = {'start': true};
  const currentPath = ['start'];
  const paths = [...visitAll('start', visited, currentPath)];
  return paths.length;
}

function *visitAll2(vertex, visited, path, visitedTwice) {
  for (const next of edgesByVertices[vertex]) {
    if ((!visitedTwice && visited[next] !== 2) || (visitedTwice && !visited[next])) {
      const newPath = [...path, next];
      if (smallVertex[next]) visited[next] = (visited[next] || 0) + 1;
      const newVisitedTwice = visitedTwice || visited[next] === 2;
      if (next === 'end') yield newPath;
      else {
        yield *visitAll2(next, visited, newPath, newVisitedTwice);
      }
      if (smallVertex[next]) visited[next]--;
    }
  }
}

const part2 = () => {
  const visited = {'start': 2};
  const currentPath = ['start'];
  const paths = [...visitAll2('start', visited, currentPath, false)];
  return paths.length;
};

console.log(part1());
console.log(part2());
