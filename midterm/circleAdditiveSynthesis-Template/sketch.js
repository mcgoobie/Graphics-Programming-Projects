function setup() {
    createCanvas(550,550);
    background(0);
    angleMode(DEGREES);
}
/////////////////////////////////////////////////
function draw() {
    background(0);
    noStroke();
    fill(255,0,255);

    translate(width/2,height/2);

    //ADDITIVE SYNTHESIS IN A CIRCLE
    var radius = 150;
    beginShape();
    for (var theta=0; theta<360; theta+=1){
      var wave1 = sin(theta * 10) * height / 10;
      var wave2 = noise(theta / 5 + frameCount/100.) * 100;
      var r = radius + wave1 + wave2;
      var x = cos(theta) * r;
      var y = sin(theta) * r;
      vertex(x,y);
    }
    endShape(CLOSE);
}
