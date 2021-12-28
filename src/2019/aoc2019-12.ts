export {};
const fs = require('fs');
const lines: string[] = fs.readFileSync(__filename.replace(/\.js$/, '.txt'), 'utf-8').split(/\n/g);

type Point3D = [number, number, number];

const moons: Point3D[] = lines.map(l => l.match(/<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/)!.slice(1).map(Number) as Point3D);

const energy = (p: Point3D) => p.reduce((acc, x) => acc + Math.abs(x), 0);

function runStep(pos: Point3D[], vel: Point3D[]) {
  for (let i = 0; i < moons.length - 1; i++) {
    for (let j = i + 1; j < moons.length; j++) {
      for (let k = 0; k < 3; k++) {
        if (pos[i][k] < pos[j][k]) {
          vel[i][k]++;
          vel[j][k]--;
        } else if (pos[i][k] > pos[j][k]) {
          vel[i][k]--;
          vel[j][k]++;
        }
      }
    }
  }
  for (let i = 0; i < moons.length; i++) {
    for (let k = 0; k < 3; k++) {
      pos[i][k] += vel[i][k];
    }
  }
}

function serializeCoordinate(pos: Point3D[], vel: Point3D[], k: number) {
  return pos.map((p, i) => p[k] + ',' + vel[i][k]).join('|');
}

const computeGcd = (a: number, b: number): number => {
  const r = a % b;
  if (!r) return b;
  return computeGcd(b, r);
}

const computeLcm = (a: number, b: number): number => a / computeGcd(a, b) * b;


const part1 = (maxSteps = 1000): number => {
  const pos: Point3D[] = moons.map(m => m.slice() as Point3D);
  const vel: Point3D[] = moons.map(() => [0, 0, 0]);
  for (let step = 0; step < maxSteps; step++) {
    runStep(pos, vel);
  }
  return pos.map((p, i) => energy(p) * energy(vel[i])).reduce((a, b) => a + b);
}

const part2 = (): number => {
  const pos: Point3D[] = moons.map(m => m.slice() as Point3D);
  const vel: Point3D[] = moons.map(() => [0, 0, 0]);

  const keys: Array<Record<string, number>> = pos[0].map((_, i) => ({[serializeCoordinate(pos, vel, i)]: 0}));
  const rev: number[] = Array(3).fill(0);
  for (let step = 1; rev.some(x => !x); step++) {
    runStep(pos, vel);
    for (let i = 0; i < 3; i++) {
      if (!rev[i]) {
        const key = serializeCoordinate(pos, vel, i);
        const prev = keys[i][key];
        if (prev !== null) {
          rev[i] = step - prev;
        }
      }
    }
  }
  return rev.reduce((a, b) => computeLcm(a, b));
};

console.log(part1());
console.log(part2());