// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// add also Benedict Gross credit

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;
var Composites = Matter.Composites;

var engine;
var propeller;
var boxes = [];
var birds = [];
var colors = [];
var ground;
var slingshotBird, slingshotConstraint;
var angle = 0;
var angleSpeed = 0;
var canvas;
var stack;

var timer;
////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1000, 600);

  engine = Engine.create();  // create an engine

  timer = 60;

  setupGround();

  setupPropeller();

  setupTower();

  setupSlingshot();

  setupMouseInteraction();
}
////////////////////////////////////////////////////////////
function draw() {
  background(66, 221, 245);

  Engine.update(engine);

  drawGround();

  drawPropeller();

  drawTower();

  drawBirds();

  drawSlingshot();

  if (stack.bodies.length != 18) {
    startTimer();
  }
}
////////////////////////////////////////////////////////////
//use arrow keys to control propeller
function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    angleSpeed += 0.01;
  }
  else if (keyCode == RIGHT_ARROW) {
    angleSpeed -= 0.01;
  }
}
////////////////////////////////////////////////////////////
function keyTyped() {
  //if 'b' create a new bird to use with propeller
  if (key === 'b') {
    setupBird();
  }

  //if 'r' reset the slingshot
  if (key === 'r') {
    removeFromWorld(slingshotBird);
    removeFromWorld(slingshotConstraint);
    setupSlingshot();
  }
}

function startTimer() {
  textAlign(CENTER);
  textSize(21);
  text("Time Remaining: " + timer, 100, 25);

  if (frameCount % 60 == 0 && timer > 0 && this.stack.bodies.length != 0) {
    timer--;
  }

  if (timer == 0 && this.stack.bodies.length != 0) {
    textAlign(CENTER);
    textSize(32);
    fill(255, 0, 0);
    text("GAME OVER", width / 2, height / 2);
  } 
  else if (timer >= 0 && this.stack.bodies.length == 0) {
    timer = timer;
    textAlign(CENTER);
    textSize(32);
    fill(0, 255, 0);
    text("LEVEL CLEARED", width / 2, height / 2);
  }
}

//**********************************************************************
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

//if mouse is released destroy slingshot constraint so that
//slingshot bird can fly off
function mouseReleased() {
  setTimeout(() => {
    slingshotConstraint.bodyB = null;
    slingshotConstraint.pointA = { x: 0, y: 0 };
  }, 100);
}
////////////////////////////////////////////////////////////
//tells you if a body is off-screen
function isOffScreen(body) {
  var pos = body.position;
  return (pos.y > height || pos.x < 0 || pos.x > width);
}
////////////////////////////////////////////////////////////
//removes a body from the physics world
function removeFromWorld(body) {
  World.remove(engine.world, body);
}
////////////////////////////////////////////////////////////
function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
  push();
  var offsetA = constraint.pointA;
  var posA = { x: 0, y: 0 };
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  var offsetB = constraint.pointB;
  var posB = { x: 0, y: 0 };
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  strokeWeight(5);
  stroke(255);
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  pop();
}