var imgs = [];
var avgImg;
var defaultImg;
var numOfImages = 30;

var lerpSize = 30;

//////////////////////////////////////////////////////////
function preload() { // preload() runs once
    for (let i = 0; i < 30; i++) {
        var filename = "assets/" + i + ".jpg";
        filename = loadImage(filename);
        imgs.push(filename);
    }
}
//////////////////////////////////////////////////////////
function setup() {
    createCanvas(imgs[0].width * 2, imgs[0].height);
    pixelDensity(1);

    defaultImg = random(imgs);

    avgImg = createGraphics(imgs[0].width, imgs[0].height);
}
//////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(defaultImg, 0, 0);

    for (let i = 0; i < imgs.length; i++) {
        imgs[i].loadPixels();
    }
    avgImg.loadPixels();

    for (let x = 0; x < imgs[0].width; x++) {
        for (let y = 0; y < imgs[0].height; y++) {
            var index = (imgs[0].width * y + x) * 4;

            var sumR = 0;
            var sumG = 0;
            var sumB = 0;

            for (let j = 0; j < lerpSize; j++) {
                sumR += imgs[j].pixels[index + 0];
                sumG += imgs[j].pixels[index + 1];
                sumB += imgs[j].pixels[index + 1];
            }

            avgImg.pixels[index + 0] = sumR / lerpSize;
            avgImg.pixels[index + 1] = sumG / lerpSize;
            avgImg.pixels[index + 2] = sumB / lerpSize;
            avgImg.pixels[index + 3] = 255;
        }
    }
    avgImg.updatePixels();
    image(avgImg, imgs[0].width, 0);
    noLoop();
}

function keyPressed() {
    if (keyCode === ENTER) {
        defaultImg = random(imgs);
        image(defaultImg, 0, 0);
    }
}

function mousePressed() {
    lerpSize = lerp(1, 30, mouseX / width);
    lerpSize = parseInt(lerpSize);

    if (lerpSize > 30)
        lerpSize = 30;

    loop();
    return lerpSize;
}
