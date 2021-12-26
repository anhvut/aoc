const fs = require('fs')
const lines = fs.readFileSync(__dirname + '/aoc2021-20.txt', 'utf-8').split(/\r?\n/);

const algo = lines[0];
const rawImage = lines.slice(2).map(x => Array.from(x));
const padding = Math.max(rawImage.length, 100);

const image0 = [...Array(padding).fill(0).map(x => Array(padding * 2 + rawImage[0].length).fill('.')),
  ...rawImage.map(x => [...Array(padding).fill('.'), ...x, ...Array(padding).fill('.')]),
  ...Array(padding).fill(0).map(x => Array(padding * 2 + rawImage[0].length).fill('.'))];

const enhance = (img) => {
  const getPixelNumber = (x, y) => img[y]?.[x] === '#' ? '1' : '0';
  const computePixel = (x, y) => {
    const numbers = [-1, 0, 1].flatMap(yIncr => [-1, 0, 1].map(xIncr => getPixelNumber(x + xIncr, y + yIncr)));
    const nb = parseInt(numbers.join(''), 2);
    return algo[nb];
  }
  return img.map((line, y) => line.map((_, x) => computePixel(x, y)));
}

const part = (image, nb) => {
  for (let i = 0; i < nb; i++) image = enhance(image);
  const trimmedImage = image.slice(nb, image.length - nb).map(x => x.slice(nb, image[0].length - nb));
  return trimmedImage.reduce((a, line) => a + line.reduce((b, x) => b + (x === '#'), 0), 0);
};

console.log(part(image0, 2));
console.log(part(image0, 50));