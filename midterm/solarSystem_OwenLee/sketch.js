var speed;

function setup() {
    createCanvas(900, 700);
}

function draw() {
    background(0);
    speed = frameCount;

    push();
        translate(width/2, height/2);

        rotate(radians(speed / 3));
        celestialObj(color(255,150,0), 200); // SUN

        push();
        
            rotate(radians(speed));
            translate(0, 300); // set orbit of earth to 300px from sun.
            celestialObj(color(0, 0, 255), 80); // EARTH
            
            push();
                rotate(radians(-speed * 2));
                translate(0, 100); // set orbit of moon to 100px from earth.
                celestialObj(color(255, 255, 255), 30); // MOON

                push();
                    rotate(radians(-speed * 1.5));
                    translate(0, 30); // set orbit of asteroid to 30px from moon    .
                    celestialObj(color(137, 77, 0), 20); // asteroid
                pop();

            pop();

        pop();


    pop();
}

function celestialObj(c, size){
    strokeWeight(5);
    fill(c);
    stroke(0);
    ellipse(0, 0, size, size);
    line(0, 0, size/2, 0);
}
