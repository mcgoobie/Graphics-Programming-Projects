var confLocs = [];
var confTheta = [];
var freqSlider;
var heightSlider;

function setup() {
    createCanvas(900, 800, WEBGL);

    freqSlider = createSlider(10, 600, 300, 10);
    freqSlider.position(10, 10);

    heightSlider = createSlider(150, 400, 300, 10);
    heightSlider.position(10, 50);

    for (var i = 0; i <= 200; i++) {
        let vector = createVector(random(-500, 500), random(-800, 0), random(-500, 500));
        confLocs.push(vector);

        let angle = random(0, 360);
        confTheta.push(angle);
    }
}

function draw() {
    background(0);

    let frequency = freqSlider.value();
    let b_height = heightSlider.value();

    // Red ambient light shining from top right
    ambientLight(60, 60, 60);
    pointLight(255, 0, 0, width / 2, -height / 2, 100);
    // Yellow ambient light shining from top left
    ambientLight(60, 60, 60);
    pointLight(255, 255, 0, - width / 2, height / 2, 100);

    angleMode(DEGREES);
    var xLoc = (cos(frameCount / 6) * height);
    var zLoc = (sin(frameCount / 6) * height);
    camera(xLoc, -600, zLoc, 0, 0, 0, 0, 1, 0);

    confetti();

    angleMode(RADIANS);
    translate(-400, 0, -400);
    for (var x = 0; x <= 800; x += 50) {
        for (var z = 0; z <= 800; z += 50) {
            push();
            // normalMaterial();
            // stroke(1);
            stroke(76, 2, 186);
            fill(100, 0, 255);
            translate(x, 0, z);
            let distance = dist(x, z, 800 / 2, 800 / 2);
            let length = (((sin(TWO_PI * distance / frequency + frameCount * 0.05) + 1) / 2) * b_height);

            box(50, max(100, length), 50);
            pop();
        }
    }
}

function confetti() {
    var xLoc;
    var yLoc;
    var zLoc;

    for (var i = 0; i < confLocs.length; i++) {
        push();
        rectMode(CENTER);
        xLoc = confLocs[i].x;
        yLoc = confLocs[i].y += 1;
        zLoc = confLocs[i].z;

        translate(xLoc, yLoc, zLoc);
        rotateX(confTheta[i] += 10);
        normalMaterial(255);
        plane(15, 15);

        if (yLoc > 0) {
            confLocs[i].y = -800;
        }

        pop();
    }
}
