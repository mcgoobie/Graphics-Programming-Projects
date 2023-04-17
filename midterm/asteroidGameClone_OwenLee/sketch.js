var spaceship;
var asteroids;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];

var score;
var highScore;



//////////////////////////////////////////////////
function setup() {
  createCanvas(1200, 800);
  spaceship = new Spaceship();
  asteroids = new AsteroidSystem();

  //location and size of earth and its atmosphere
  atmosphereLoc = new createVector(width / 2, height * 2.9);
  atmosphereSize = new createVector(width * 3, width * 3);
  earthLoc = new createVector(width / 2, height * 3.1);
  earthSize = new createVector(width * 3, width * 3);

  // initialise a new score
  score = 0;

  // fetch high score from session if exists, else initialize as 0
  if (sessionStorage.getItem("highScore"))
    highScore = sessionStorage.getItem("highScore");
  else
    highScore = 0;

}

//////////////////////////////////////////////////
function draw() {
  background(0);
  sky();

  spaceship.run();
  asteroids.run();

  drawEarth();

  updateScore();

  checkCollisions(spaceship, asteroids); // function that checks collision between various elements
}

//////////////////////////////////////////////////
//draws earth and atmosphere
function drawEarth() {
  noStroke();
  //draw atmosphere
  fill(150, 200, 255, 50);
  ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x, atmosphereSize.y);
  //draw earth
  fill(0, 0, 255);
  ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

//////////////////////////////////////////////////
//checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids) {

  //spaceship-2-earth
  if (isInside(spaceship.location, spaceship.size, earthLoc, earthSize.x)) {
    gameOver();
  }

  //spaceship-2-atmosphere
  if (isInside(spaceship.location, spaceship.size, atmosphereLoc, atmosphereSize.x)) {
    orbitWarning();
    spaceship.setNearEarth();
  }

  for (var i = 0; i < asteroids.locations.length; i++) {
    //spaceship-2-asteroid collisions
    if (isInside(spaceship.location, spaceship.size, asteroids.locations[i], asteroids.diams[i])) {
      gameOver();
    }
  }

  for (var i = 0; i < asteroids.locations.length; i++) {
    //asteroid-2-earth collisions
    if (isInside(earthLoc, earthSize.x, asteroids.locations[i], asteroids.diams[i])) {
      gameOver();
    }
  }

  //bullet collisions
  for (var i = 0; i < asteroids.locations.length; i++) {
    for (var b = 0; b < spaceship.bulletSys.bullets.length; b++)
      if (isInside(asteroids.locations[i], asteroids.diams[i], spaceship.bulletSys.bullets[b], spaceship.bulletSys.diam)) {
        asteroids.destroy(i);
        score += 1;
        break;
      }
  }
}

//////////////////////////////////////////////////
//helper function checking if there's collision between object A and object B
function isInside(locA, sizeA, locB, sizeB) {
  var d = dist(
    locA.x,
    locA.y,
    locB.x,
    locB.y
  );

  if (d < sizeA / 2 + sizeB / 2) {
    return true;
  } else {
    return false;
  }
}

//////////////////////////////////////////////////
function keyPressed() {
  if (keyIsPressed && keyCode === 32) { // if spacebar is pressed, fire!
    spaceship.fire();
  }
}

//////////////////////////////////////////////////
// function that ends the game by stopping the loops and displaying "Game Over"
function gameOver() {
  fill(255, 0, 0);
  textSize(80);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 2);

  // Restart Button
  button = createButton('Try Again?');
  button.position(width / 2 - 50, height / 2 + 25);
  button.style('border', 'none');
  button.style('background-color', 'transparent');
  button.style('color', 'white');
  button.style('font-size', '21px');
  button.style('cursor', 'pointer');
  button.mousePressed(restart);

  // Save Highest Score
  if (this.score > this.highScore) {
    highScore = sessionStorage.setItem('highScore', this.score);
  }

  noLoop();
}

// Warns player to leave earth atmosphere
function orbitWarning() {
  fill(255, 0, 0, random(150, 255));
  textSize(26);
  textAlign(CENTER);

  text("WARNING! Entering Earth Atmosphere, Engage Thrusters Now!", width / 2, height - 175);
}

//////////////////////////////////////////////////
// function that creates a star lit sky
function sky() {
  push();
  while (starLocs.length < 300) {
    starLocs.push(new createVector(random(width), random(height)));
  }
  fill(255);
  for (var i = 0; i < starLocs.length; i++) {
    rect(starLocs[i].x, starLocs[i].y, 2, 2);
  }

  if (random(1) < 0.3) starLocs.splice(int(random(starLocs.length)), 1);
  pop();
}

// score function
function updateScore() {
  var currentScore = "Score: " + this.score;
  var highestScore = "High Score: " + this.highScore;

  fill(255, 255, 255);
  textSize(21);
  textAlign(LEFT);
  text(currentScore, 10, 25);

  fill(255, 255, 0);
  text(highestScore, 10, 50);
}

// Restart Game
function restart() {
  window.location.reload();
}