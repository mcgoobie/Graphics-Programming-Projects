class Grid {
  /////////////////////////////////
  constructor(_w, _h) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.noteSize = 40;
    this.notePos = [];
    this.noteState = [];
    this.theta = 0;

    // initalise grid structure and state
    for (var x=0;x<_w;x+=this.noteSize){
      var posColumn = [];
      var stateColumn = [];
      for (var y=0;y<_h;y+=this.noteSize){
        posColumn.push(createVector(x+this.noteSize/2,y+this.noteSize/2));
        stateColumn.push(0);
      }
      this.notePos.push(posColumn);
      this.noteState.push(stateColumn);
    }
  }
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }
  /////////////////////////////////
  drawActiveNotes(img){
    // draw active notes
    fill(255);
    noStroke();
    for (var i=0;i<this.notePos.length;i++){
      for (var j=0;j<this.notePos[i].length;j++){
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
        if (this.noteState[i][j]>0) {
          var alpha = this.noteState[i][j] * 200;
          // var c1 = color(255,0,0,alpha);
          // var c2 = color(0,255,0,alpha);

          // Custom Colors
          var c1 = color(0, 0, 255, alpha);
          var c2 = color(255, 255, 0, alpha);

          var mix = lerpColor(c1, c2, map(i, 0, this.notePos.length, 0, 1));
          fill(mix);
          var s = this.noteState[i][j];
          
          // Note Size pulses
          var nSize = (this.noteSize) + sin(this.theta) * this.noteSize / 2;

          ellipse(x, y,  nSize*s,  nSize*s);
        }
        this.noteState[i][j]-=0.05;
        this.noteState[i][j]=constrain(this.noteState[i][j],0,1);
      }
    }
    this.theta += .1;
  }
  /////////////////////////////////
  findActiveNotes(img){
    for (var x = 0; x < img.width; x += 1) {
        for (var y = 0; y < img.height; y += 1) {
            var index = (x + (y * img.width)) * 4;
            var state = img.pixels[index + 0];
            if (state==0){ // if pixel is black (ie there is movement)
              // find which note to activate
              var screenX = map(x, 0, img.width, 0, this.gridWidth);
              var screenY = map(y, 0, img.height, 0, this.gridHeight);
              var i = int(screenX/this.noteSize);
              var j = int(screenY/this.noteSize);
              this.noteState[i][j] = 1;
            }
        }
    }
  }

  // Extra Functions
  starShape(x, y, r1, r2, noPoints) {
    var angle = TWO_PI / noPoints;
    var halfAngle = angle / 2;

    beginShape();
    for (var a = 0; a < TWO_PI; a += angle) {
      var sx = x + cos(a) * r2;
      var sy = y + sin(a) * r2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * r1;
      sy = y + sin(a + halfAngle) * r1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
}
