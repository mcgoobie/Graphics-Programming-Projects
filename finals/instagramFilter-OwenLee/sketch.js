// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var currentFilter = 0;
var grayscaleBtn;

var matrix = [
  [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
  [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
  [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
  [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
  [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
  [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
  [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
  [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64]
];
/////////////////////////////////////////////////////////////////
function preload() {
  imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
  createCanvas((imgIn.width * 2), imgIn.height);
}
/////////////////////////////////////////////////////////////////
function draw() {
  background(125);
  image(imgIn, 0, 0);
  image(earlyBirdFilter(imgIn), imgIn.width, 0);
  textSize(18);
  text('Try different filters with UP and DOWN arrow keys. Press SHIFT to reset to sepia. Remember to click on the canvas to update the current filter.', 10, 10, 500, 100);
  fill(50);
  console.log(currentFilter);
  noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed() {
  loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img) {
  var resultImg = createImage(imgIn.width, imgIn.height);
  if (currentFilter == 0)
    resultImg = sepiaFilter(imgIn);
  else if (currentFilter == 1)
    resultImg = grayscaleFilter(imgIn);
  else if (currentFilter == 2)
    resultImg = invertFilter(imgIn);
  resultImg = darkCorners(resultImg);
  resultImg = radialBlurFilter(resultImg);
  resultImg = borderFilter(resultImg);
  return resultImg;
}

// Sepia
function sepiaFilter(img) {
  var imgOut = createImage(img.width, img.height);
  var newRed, newGreen, newBlue;

  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (y * img.width + x) * 4;

      var oldRed = img.pixels[index + 0];
      var oldGreen = img.pixels[index + 1];
      var oldBlue = img.pixels[index + 2];

      newRed = (oldRed * .393) + (oldGreen * .769) + (oldBlue * .189)
      newGreen = (oldRed * .349) + (oldGreen * .686) + (oldBlue * .168)
      newBlue = (oldRed * .272) + (oldGreen * .534) + (oldBlue * .131)

      imgOut.pixels[index + 0] = newRed;
      imgOut.pixels[index + 1] = newGreen;
      imgOut.pixels[index + 2] = newBlue;
      imgOut.pixels[index + 3] = 255;
    }
  }
  imgOut.updatePixels();
  return imgOut;
}

// Darken Corners
function darkCorners(img) {
  var imgOut = createImage(img.width, img.height);

  imgOut.loadPixels();
  img.loadPixels();

  var corner = dist(0, 0, imgOut.width / 2, imgOut.height / 2);
  var dynLum;

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (y * img.width + x) * 4;
      var d = dist(img.width / 2, img.height / 2, x, y);

      if (d <= 300)
        dynLum = 1;
      else if (d >= 300 && d <= 450)
        dynLum = map(d, 300, 450, 1, 0.4);
      else
        dynLum = map(d, 450, corner, 0.4, 0);

      var r = img.pixels[index + 0] * dynLum;
      var g = img.pixels[index + 1] * dynLum;
      var b = img.pixels[index + 2] * dynLum;
      var a = img.pixels[index + 3] * dynLum;

      r = constrain(r, 0, 255);
      g = constrain(g, 0, 255);
      b = constrain(b, 0, 255);
      a = constrain(a, 0, 255);

      imgOut.pixels[index] = r;
      imgOut.pixels[index + 1] = g;
      imgOut.pixels[index + 2] = b;
      imgOut.pixels[index + 3] = (r + g + b) * a;
    }
  }
  imgOut.updatePixels();
  return imgOut;
}

// Blur
function radialBlurFilter(img) {
  var imgOut = createImage(img.width, img.height);
  var matrixSize = matrix.length;

  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (y * img.width + x) * 4;

      var c = convolution(x, y, matrix, matrixSize, img);

      var r = img.pixels[index + 0];
      var g = img.pixels[index + 1];
      var b = img.pixels[index + 2];

      var mouseDist = dist(x, y, mouseX, mouseY);
      var dynBlur = map(mouseDist, 100, 300, 0, 1);
      dynBlur = constrain(dynBlur, 0, 1);

      imgOut.pixels[index + 0] = c[0] * dynBlur + r * (1 - dynBlur);
      imgOut.pixels[index + 1] = c[1] * dynBlur + g * (1 - dynBlur);
      imgOut.pixels[index + 2] = c[2] * dynBlur + b * (1 - dynBlur);
      imgOut.pixels[index + 3] = 255;
    }
  }
  imgOut.updatePixels();
  return imgOut;
}

function convolution(x, y, matrix, matrixSize, img) {
  var totalRed = 0;
  var totalGreen = 0;
  var totalBlue = 0;

  var offset = floor(matrixSize / 2);

  for (var i = 0; i < matrixSize; i++) {
    for (var j = 0; j < matrixSize; j++) {
      var xloc = x + i - offset;
      var yloc = y + j - offset;

      var index = (img.width * yloc + xloc) * 4;

      index = constrain(index, 0, img.pixels.length - 1);

      totalRed += img.pixels[index + 0] * matrix[i][j];
      totalGreen += img.pixels[index + 1] * matrix[i][j];
      totalBlue += img.pixels[index + 2] * matrix[i][j];

    }
  }

  return [totalRed, totalGreen, totalBlue];
}

// Border
function borderFilter(img) {
  var buffer = createGraphics(img.width, img.height);
  buffer.image(img, 0, 0);

  buffer.noFill();
  buffer.stroke(255);
  buffer.strokeWeight(20);
  buffer.rect(0, 0, img.width, img.height, 50);
  buffer.rect(0, 0, img.width, img.height);

  return buffer;
}



// Step 5 : Extra Features
function grayscaleFilter(img) {
  var imgOut = createImage(img.width, img.height);

  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (y * img.width + x) * 4;

      var r = img.pixels[index + 0];
      var g = img.pixels[index + 1];
      var b = img.pixels[index + 2];

      gray = (r + g + b) / 3;

      imgOut.pixels[index + 0] = gray;
      imgOut.pixels[index + 1] = gray;
      imgOut.pixels[index + 2] = gray;
      imgOut.pixels[index + 3] = 255;
    }
  }
  imgOut.updatePixels();
  return imgOut;
}

function invertFilter(img) {
  var imgOut = createImage(img.width, img.height);

  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (y * img.width + x) * 4;

      var r = 255 - img.pixels[index + 0];
      var g = 255 - img.pixels[index + 1];
      var b = 255 - img.pixels[index + 2];

      imgOut.pixels[index + 0] = r;
      imgOut.pixels[index + 1] = g;
      imgOut.pixels[index + 2] = b;
      imgOut.pixels[index + 3] = 255;
    }
  }
  imgOut.updatePixels();
  return imgOut;
}

function keyPressed() {
  if (keyCode == UP_ARROW)
    currentFilter = 1;
  if (keyCode == DOWN_ARROW)
    currentFilter = 2;
  if (keyCode == SHIFT)
    currentFilter = 0;
}