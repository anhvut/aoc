const fs = require('fs');

const lines = fs.readFileSync(__dirname + '/aoc2021-02.txt', 'utf-8').split(/\r?\n/);
const commands = lines.map(l => {
    const w = l.split(' ');
    return [w[0], parseInt(w[1])];
});

const compute = (commands, reducer) => {
    const [horizontal, depth] = commands.reduce(reducer, [0, 0, 0]);
    return horizontal*depth;
}

const reducer1 = ([horizontal, depth], [cmd, nb]) => {
    switch (cmd) {
        case 'forward': horizontal += nb; break;
        case 'up': depth -= nb; break;
        case 'down': depth += nb; break;
    }
    return [horizontal, depth];
};

const reducer2 = ([horizontal, depth, aim], [cmd, nb]) => {
    switch (cmd) {
        case 'forward': horizontal += nb;depth += aim * nb; break;
        case 'up': aim -= nb; break;
        case 'down': aim += nb; break;
    }
    return [horizontal, depth, aim];
};

console.log(compute(commands, reducer1));
console.log(compute(commands, reducer2));
