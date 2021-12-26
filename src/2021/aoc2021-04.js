const fs = require('fs');

const lines = fs.readFileSync(__dirname + '/aoc2021-04.txt', 'utf-8').split(/\r?\n/);

const nbs = lines[0].split(',').map(x => parseInt(x, 10));
const boards = [];

while (lines[boards.length * 6 + 2]) {
    boards.push(lines.slice(boards.length * 6 + 2, (boards.length) * 6 + 2 + 5).map(line => line.trim().split(/\s+/).map(x => parseInt(x))));
}

const markers = boards.map(board => board.map(line => Array(line.length).fill(false)));

const findInBoard = (board, nb, boardIndex) => {
    const result = [];
    board.forEach((line, y) => line.forEach((n, x) => {
        if (n === nb) result.push([x, y, true]);
    }));
    if (result.length > 1) {
        console.log(`Duplicate number ${nb} in board ${boardIndex}`, board);
        throw Error(`Duplicate number ${nb} in board ${boardIndex}`);
    }
    if (result.length === 1) return result[0];
    return [-1, -1, false];
}

const markBoard = (i, x, y) => {
    markers[i][y][x] = true;
}

const boardFullVertical = (board, x0, y0, i) => {
    const boardMarker = markers[i];
    for (let y = 0; y < board.length; y++) {
        if (! boardMarker[y][x0]) return false;
    }
    return true;
}

const boardFullHorizontal = (board, x0, y0, i) => {
    const boardMarker = markers[i];
    for (let x = 0; x < board[y0].length; x++) {
        if (! boardMarker[y0][x]) return false;
    }
    return true;
}

const score = (i, nb) => {
    let sum = 0;
    const boardMarker = markers[i];
    const board = boards[i];
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (!boardMarker[y][x]) sum += board[y][x];
        }
    }

    return sum * nb;
}

const part1 = () => {
    for (const nb of nbs) {
        let boardIndex = 0;
        for (const board of boards) {
            const [x, y, found] = findInBoard(board, nb, boardIndex);
            if (found) {
                markBoard(boardIndex, x, y);
                const vertical = boardFullVertical(board, x, y, boardIndex);
                const horizontal = boardFullHorizontal(board, x, y, boardIndex);
                if (vertical || horizontal) {
                    return score(boardIndex, nb);
                }
            }
            boardIndex++;
        }
    }
}

const part2 = () => {
    markers.forEach(board => board.map((line, i) => board[i] = Array(line.length).fill(false)));    // reset
    const winBoard = {};
    const scores = [];
    for (const nb of nbs) {
        let boardIndex = 0;
        for (const board of boards) {
            if (!winBoard[boardIndex]) {
                const [x, y, found] = findInBoard(board, nb, boardIndex);
                if (found) {
                    markBoard(boardIndex, x, y);
                    const vertical = boardFullVertical(board, x, y, boardIndex);
                    const horizontal = boardFullHorizontal(board, x, y, boardIndex);
                    if (vertical || horizontal) {
                        scores.push(score(boardIndex, nb));
                        winBoard[boardIndex] = true;
                    }
                }
            }
            boardIndex++;
        }
    }
    return scores[scores.length - 1];
}

console.log(part1())
console.log(part2())
