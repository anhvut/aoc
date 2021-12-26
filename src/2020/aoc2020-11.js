const fs = require('fs');

const map = fs.readFileSync('aoc2020-11.txt', 'utf-8').split(/\r?\n/).map(x => Array.from(x));


const getNextMap = (current) => {
    const maxY = current.length;
    const maxX = current[0].length;
    const result = current.map(x => x.slice());
    const occ = (x, y) => x >= 0 && x < maxX && y >= 0 && y < maxY && current[y][x] === '#' ? 1 : 0;
    for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
            if (current[y][x] !== '.') {
                const nb  = occ(x - 1, y - 1) + occ(x, y - 1) + occ(x + 1, y - 1) +
                    occ(x - 1, y) + occ(x + 1, y) + occ(x - 1, y + 1) + occ(x, y + 1) + occ(x + 1, y + 1);

                if (current[y][x] === 'L' && nb === 0) result[y][x] = '#';
                if (current[y][x] === '#' && nb >= 4) result[y][x] = 'L';
            }
        }
    }
    return result;
}

const getNextMap2 = (current) => {
    const maxY = current.length;
    const maxX = current[0].length;
    const result = current.map(x => x.slice());
    let x, y;
    const occ = (dx, dy) => {
        let px = x, py = y;
        for (;;) {
            px += dx;
            py += dy;
            if (px >= 0 && px < maxX && py >= 0 && py < maxY) {
                if (current[py][px] === '#') return 1;
                if (current[py][px] === 'L') return 0;
            } else break;
        }
        return 0;
    };
    for (y = 0; y < maxY; y++) {
        for (x = 0; x < maxX; x++) {
            if (current[y][x] !== '.') {
                const nb  = occ(- 1, - 1) + occ(0, - 1) + occ(1, - 1) +
                    occ(- 1, 0) + occ(1, 0) + occ(- 1, 1) + occ(0, 1) + occ(1, 1);

                if (current[y][x] === 'L' && nb === 0) result[y][x] = '#';
                if (current[y][x] === '#' && nb >= 5) result[y][x] = 'L';
            }
        }
    }
    return result;
}

const part = (nextFct) => {
    let currentMap = map;
    let old;
    do {
        old = currentMap;
        const nextMap = nextFct(currentMap);
        currentMap = nextMap;
        // console.log(currentMap.map(x => x.join(' ')).join('\n') + '\n');
    } while (old.some((row, i) => row.some((c, j) => c !== currentMap[i][j])));
    return currentMap.reduce((s, row) => s + row.reduce((t, c) => t + (c === '#'), 0), 0);
};

console.log(part(getNextMap));
console.log(part(getNextMap2));
