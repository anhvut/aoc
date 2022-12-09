export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

const vertexByName: Record<string, boolean> = {};
const smallVertex: Record<string, boolean> = {};

const edgesByVertices: Record<string, string[]> = {};

const registerVertex = (a: string) => {
  if (!vertexByName[a]) {
    vertexByName[a] = true;
    if (Array.from(a).every((x) => 'a' <= x && x <= 'z')) smallVertex[a] = true;
  }
};

const registerEdge = (a: string, b: string) => {
  let edges = edgesByVertices[a];
  if (!edges) {
    edges = [];
    edgesByVertices[a] = edges;
  }
  edges.push(b);
};

lines.forEach((x) => {
  const [a, b] = x.split('-');
  registerVertex(a);
  registerVertex(b);
  registerEdge(a, b);
  registerEdge(b, a);
});

function* visitAll(vertex: string, visited: Record<string, boolean>, path: string[]): Generator<string[]> {
  for (const next of edgesByVertices[vertex]) {
    if (!visited[next]) {
      const newPath = [...path, next];
      if (smallVertex[next]) visited[next] = true;
      if (next === 'end') yield newPath;
      else {
        yield* visitAll(next, visited, newPath);
      }
      delete visited[next];
    }
  }
}

const part1 = () => {
  const visited = { start: true };
  const currentPath = ['start'];
  const paths = [...visitAll('start', visited, currentPath)];
  return paths.length;
};

function* visitAll2(
  vertex: string,
  visited: Record<string, number>,
  path: string[],
  visitedTwice: boolean
): Generator<string[]> {
  for (const next of edgesByVertices[vertex]) {
    if ((!visitedTwice && visited[next] !== 2) || (visitedTwice && !visited[next])) {
      const newPath = [...path, next];
      if (smallVertex[next]) visited[next] = (visited[next] || 0) + 1;
      const newVisitedTwice = visitedTwice || visited[next] === 2;
      if (next === 'end') yield newPath;
      else {
        yield* visitAll2(next, visited, newPath, newVisitedTwice);
      }
      if (smallVertex[next]) visited[next]--;
    }
  }
}

const part2 = () => {
  const visited = { start: 2 };
  const currentPath = ['start'];
  const paths = [...visitAll2('start', visited, currentPath, false)];
  return paths.length;
};

console.log(part1());
console.log(part2());
