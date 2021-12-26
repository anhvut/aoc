const input = [[207, 263], [-115, -63]];

const part = ([[xMin, xMax], [yMin, yMax]]) => {
  let count = 0;
  let bestY = yMax;
  for (let x0 = 1; x0 <= xMax; x0++) {
    for (let y0 = yMin; y0 < 150; y0++) {
      let localBestY = yMax;
      let xSpeed = x0, ySpeed = y0;
      let xPos = 0, yPos = 0;
      let found = false;
      while (yPos >= yMin && !found) {
        xPos += xSpeed;
        yPos += ySpeed;
        if (xSpeed > 0) xSpeed--;
        ySpeed--;
        localBestY = Math.max(localBestY, yPos);
        found = xMin <= xPos && xPos <= xMax && yMin <= yPos && yPos <= yMax;
      }
      if (found) {
        bestY = Math.max(bestY, localBestY);
        count++;
        console.log(`Update for speed (${x0}, ${y0}): ${bestY} - count = ${count}`);
      }
    }
  }
  return [bestY, count];
}

console.log(part(input))
