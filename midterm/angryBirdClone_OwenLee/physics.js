////////////////////////////////////////////////////////////////
function setupGround() {
  ground = Bodies.rectangle(500, 600, 1000, 40, {
    isStatic: true, angle: 0
  });
  World.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
function drawGround() {
  push();
  fill(46, 184, 60);
  strokeWeight(0);
  drawVertices(ground.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller() {
  // your code here
  propeller = Bodies.rectangle(150, 480, 200, 15, { isStatic: true, angle: angle });

  World.add(engine.world, [propeller]);
}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller() {
  push();
  // your code here
  angle = angle;
  Body.setAngle(propeller, angle);
  Body.setAngularVelocity(propeller, angleSpeed);
  angle = angle + angleSpeed;

  fill(191, 123, 46);
  drawVertices(propeller.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupBird() {
  var bird = Bodies.circle(mouseX, mouseY, 20, {
    friction: 0,
    restitution: 0.95
  });
  Matter.Body.setMass(bird, bird.mass * 10);
  World.add(engine.world, [bird]);
  birds.push(bird);
}
////////////////////////////////////////////////////////////////
function drawBirds() {
  push();
  for (var i = 0; i < birds.length; i++) {
    fill(255, 0, 0);
    drawVertices(birds[i].vertices);

    if (isOffScreen(birds[i])) {
      World.remove(engine.world, birds[i]);
      birds.splice(i, 1);
      i--;
    }
  }
  pop();
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower() {
  //you code here
  const stackOptions = {
    isStatic: false
  }

  stack = Composites.stack(680, height - 480, 3, 6, 0, 0, function (x, y) {
    return Bodies.rectangle(x, y, 80, 80, stackOptions);
  })

  World.add(engine.world, [stack]);
}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower() {
  push();
  //your code here
  for (var i = 0; i < stack.bodies.length; i++) {
    colors.push(random(55, 255));
    fill(0, colors[i], 0);
    strokeWeight(0);
    drawVertices(stack.bodies[i].vertices);

    if (isOffScreen(stack.bodies[i])) {    //remove objects that are off-screen
      World.remove(engine.world, stack.bodies[i]);
      stack.bodies.splice(i, 1);
      colors.splice(i, 1);
      i--;
    }
  }

  pop();
}

////////////////////////////////////////////////////////////////
function setupSlingshot() {
  //your code here
  var bWidth = (width / 4) - 100;
  var bHeight = height / 4;
  slingshotBird = Bodies.circle(bWidth, bHeight, 25,
    { friction: 0, restitution: 0.95 });
  Matter.Body.setMass(slingshotBird, slingshotBird.mass * 10);

  slingshotConstraint = Constraint.create({
    pointA: { x: 200, y: 100 },
    bodyB: slingshotBird,
    // pointB: { x: bWidth, y: bHeight },
    stiffness: 0.01,
    damping: 0.0001,
    length: 25
  });

  World.add(engine.world, [slingshotBird, slingshotConstraint]);
}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot() {
  push();
  fill(255, 230, 0);
  strokeWeight(0);
  drawVertices(slingshotBird.vertices);

  stroke(128);
  strokeWeight(1);
  drawConstraint(slingshotConstraint);
  pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction() {
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);
}

function isOffScreen(body) {
  var pos = body.position;
  return (pos.y > height || pos.x < 0 || pos.x > width);
}
