var stepSize = 20;
var gridSize = 0;

function setup() {
  createCanvas(500, 500);
}
///////////////////////////////////////////////////////////////////////
function draw() {
  background(125);

  colorGrid();
  compassGrid();
}
///////////////////////////////////////////////////////////////////////
function colorGrid() {
  // your code here
  for (var x = 0; x < 25; x += 1) {
    for (var y = 0; y < 25; y += 1) {
      var gridX = x * stepSize;
      var gridY = y * stepSize;
      noStroke();
      fill(255);

      var c = map(mouseX, 0, 500, 0, width);
      var n = noise(gridX / 500, gridY / 500, frameCount / c);

      let purp = color(255, 255, 255);
      let blue = color(0, 0, 255);
      colorMode(RGB);
      let polatedColor = lerpColor(blue, purp, n);

      fill(polatedColor);

      rect(gridX, gridY, stepSize, stepSize);
    }
  }

}
///////////////////////////////////////////////////////////////////////
function compassGrid() {
  // your code here
  for (var x = 0; x < 25; x += 1) {
    for (var y = 0; y < 25; y += 1) {
      var gridX = x * stepSize;
      var gridY = y * stepSize;

      var lineX = gridX + (stepSize / 2);
      var lineY = gridY + (stepSize / 2);

      push();
      var c = map(mouseX, 0, 500, 0, width);
      var n = noise(gridX / 500, gridY / 500, frameCount / c);
      var angle = map(n, 0, 1, 0, 720);

      if (angle > 350) // if angle larger than 350, turn line to red.
        stroke(255, 0, 0);
      else
        stroke(0); // else use standard black

      strokeWeight(2);
      translate(lineX, lineY);

      rotate(radians(angle));
      line(0, stepSize, 0, 0);
      pop();
    }
  }
}
