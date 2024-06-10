// Awesome Tanks Game
// Andrew Li
// June 14th 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//NTS:
// rewrite code where tank is two squares on top of eachother to simplify collision detection - done
// figure out breaking walls (change states for every bullet) - collide2D? Best way to determine the location of each block? How to elegantly convert between levels
// figure out how to set angle of bullet once (fix aimbot) - check p5js, fix current tx/ty issue in code
// figure out stationary shooting for turrets - check p5js
// clean up classes/variable names
// figure out how to create perimeter barrier detection - check p5js
// figure out perimeter bullet detection/deletion - check mptesting - vscode
// figure out how to have a spotlight-like FOV for playerTank
// apply all bullet and rotation features to turrets - how do you make sure that the turrets are not OP in the sense that they autolock onto player position? add random error of +- 5 degrees?

class Bullet {
  constructor(x, y, transX, transY, dy, size) {
    this.position = createVector(x, y);
    this.dy = dy;
    this.transX = transX;
    this.transY = transY;
    this.size = size;
    this.rotateX = mouseX - this.transX;
    this.rotateY = mouseY - this.transY;
    this.rotateAngle = atan2(this.rotateY, this.rotateX) - 90;
    this.locationX, this.locationY;
  }
  display() {
    push();
    fill("black");
    translate(this.transX, this.transY);
    rotate(this.rotateAngle);
    //console.log(this.rotateAngle);
    circle(this.position.x, this.position.y, this.size);
    pop();
  }
  move() {
    this.position.y += this.dy;
  }
  locationConversion() {
    if (this.rotateAngle > -180 && this.rotateAngle < -90) { //Quadrant 1
      this.locationX = this.transX + Math.abs(this.position.y*sin(this.rotateAngle)); 
      this.locationY = this.transY - Math.abs(this.position.y*cos(this.rotateAngle));
    }
    else if (this.rotateAngle > -90 && this.rotateAngle < 0) { //Quadrant 2
      this.locationX = this.transX + Math.abs(this.position.y*sin(this.rotateAngle));
      this.locationY = this.transY + Math.abs(this.position.y*cos(this.rotateAngle));
    }
    else if (this.rotateAngle > 0 && this.rotateAngle < 90) { //Quadrant 3
      this.locationX = this.transX - Math.abs(this.position.y*sin(this.rotateAngle));
      this.locationY = this.transY + Math.abs(this.position.y*cos(this.rotateAngle));
    }
    else if (this.rotateAngle > -270 && this.rotateAngle < -180) { //Quadrant 4
      this.locationX = this.transX - Math.abs(this.position.y*sin(this.rotateAngle));
      this.locationY = this.transY - Math.abs(this.position.y*cos(this.rotateAngle));
    }
  }
}

class Player {
  constructor(x, y, dx, dy, transX, transY, size) {
    this.position = createVector(x, y);
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.transX = transX + this.size;
    this.transY = transY + this.size; 
    this.rotateX = mouseX - this.transX;
    this.rotateY = mouseY - this.transY;
    this.rotateAngle = atan2(this.rotateY, this.rotateX)
  }
  display() {
    push();
    fill("yellow");
    translate(this.transX, this.transY);
    rect(this.position.x, this.position.y, this.size*2, this.size*2);
    pop();
    push();
    fill("orange");
    translate(this.transX, this.transY);
    rotate(this.rotateAngle);
    rect(this.position.x, this.position.y, this.size, this.size);
    pop();
  }
  move() {
    if (keyIsDown(87)) {
      this.transY -= this.dy;
    }
    else if (keyIsDown(83)) {
      this.transY += this.dy;
    }
    else if (keyIsDown(65)) {
      this.transX -= this.dx;
    }
    else if (keyIsDown(68)) {
      this.transX += this.dx;
    }
  }
  rotate() {
    this.rotateX = mouseX - this.transX;
    this.rotateY = mouseY - this.transY;
    this.rotateAngle = atan2(this.rotateY, this.rotateX)
  }
  update() {
    character.move();
    character.rotate();
    character.display();
  }
}

class EnemyTank {
  constructor(x, y, transX, transY, size) {
    this.position = createVector(x, y);
    this.transX = transX;
    this.transY = transY;
    this.size = size;
    this.rotateX = mouseX - this.transX;
    this.rotateY = mouseY - this.transY;
    this.rotateAngle = atan2(this.rotateY, this.rotateX) - 90;
  }
  display() {
    push();
    fill("red");
    translate(this.transX, this.transY);
    rotate(this.rotateAngle);
    rect(this.position.x, this.position.y, this.size, this.size);
    pop();
  }
  shoot() {
    if (millis() > lastShot + waitTime && dist(mouseX, mouseY, this.transX, this.transY) < 200) {
      enemyBullets.push(new Bullet(0, 0, this.transX, this.transY, 5, 5, 25));
      //console.log(enemyBullets);
      lastShot = millis();
    }
  }
  rotate() {
    this.rotateX = mouseX - this.transX;
    this.rotateY = mouseY - this.transY;
    this.rotateAngle = atan2(this.rotateY, this.rotateX) - 90;
  }
}

let transX, transY;
let dx, dy;
let bulletTravelDistance, enemyBulletTravelDistance;
let gridSize;
let bullets = [];
let enemyBullets = [];
let character, enemy;
let cellSize;
let levelToLoad, lines;
let lastShot = 0;
let waitTime = 300;

function preload() {
  levelToLoad = "level1.txt"
  lines = loadStrings(levelToLoad);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER)
  angleMode(DEGREES);
  dx = 5;
  dy = 5;
  bulletTravelDistance = 200;
  enemyBulletTravelDistance = 300;
  gridSize = 10; //consider changing to a const
  cellSize = height/gridSize;
  transX = cellSize;
  transY = cellSize;
  character = new Player(0, 0, dx, dy, transX, transY, 25);
  enemy = new EnemyTank(0, 0, (gridSize - 2)*cellSize, cellSize, 50)
  level1 = grid(gridSize, gridSize);
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let cellType = lines[i][j];
      level1[i][j] = cellType;
    }
  }

}

function draw() {
  background(200);
  displayGrid(level1);
  character.update();
  bulletDelete();
  perimeterBarrierDetection();
  perimeterBulletDetection();
  characterLocation();

  enemy.display();
  enemy.shoot();
  enemy.rotate();

  for (let someBullet of bullets) {
    someBullet.move();
    someBullet.display();
    someBullet.locationConversion();
    //console.log(someBullet.locationX, someBullet.locationY)
    //console.log(bullet.position.y);
  }
  for (let someBullet of enemyBullets) {
    someBullet.move();
    someBullet.display();
  }
  //console.log(mouseX, mouseY); 
}

function mousePressed() {
  bullets.push(new Bullet(0, 0, character.transX, character.transY, 1, 5));
}

function bulletDelete() {
  for (let someBullet of bullets) {
    if (dist(someBullet.position.x, someBullet.position.y, character.position.x, character.position.y) > bulletTravelDistance) {
      let theIndex = bullets.indexOf(someBullet);
      bullets.splice(theIndex, 1);
    } 
  }
  for (let someBullet of enemyBullets) {
    if (dist(enemy.position.x, enemy.position.y, someBullet.position.x, someBullet.position.y) > enemyBulletTravelDistance) {
      let theIndex = enemyBullets.indexOf(someBullet);
      enemyBullets.splice(theIndex, 1);
    }
  }
}

function grid(cols, rows) {
  let emptyGrid = [];
  for (let i = 0; i < cols; i++) {
    emptyGrid.push([])
    for (let j = 0; j < rows; j++) {
      emptyGrid[i].push(0);
    }
  }
  return emptyGrid;
}

function displayGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      showCell(level1[j][i], j, i);
    }
  }
}

function showCell(location, j, i) {
  // push();
  // noStroke();
  switch (location) {
    case "S":
      fill("grey");
      rect(i * cellSize + cellSize/2, j * cellSize + cellSize/2, cellSize, cellSize);
      break;
    case "B":
      fill("blue")
      rect(i * cellSize + cellSize/2, j * cellSize + cellSize/2, cellSize, cellSize);
      break;
    case "W":
      fill("green")
      rect(i * cellSize + cellSize/2, j * cellSize + cellSize/2, cellSize, cellSize);
      break;
    case "E":
      fill("white")
      rect(i * cellSize + cellSize/2, j * cellSize + cellSize/2, cellSize, cellSize);
      break;
  }
  //pop();
}

function perimeterBarrierDetection() {
  if (character.transX - character.size < cellSize) {
    character.transX = cellSize + character.size;
  } 
  else if (character.transY - character.size < cellSize) {
    character.transY = cellSize + character.size;
  } 
  else if (character.transX + character.size > (gridSize - 1)*cellSize) {
    character.transX = (gridSize - 1)*cellSize - character.size;
  } 
  else if (character.transY + character.size > height - cellSize) {
    character.transY = height - cellSize - character.size;
  }
}

function perimeterBulletDetection() {
  for (let someBullet of bullets) {
    let theIndex = bullets.indexOf(someBullet);
    if (someBullet.locationX - someBullet.size < cellSize || 
      someBullet.locationY - someBullet.size < cellSize ||
      someBullet.locationX + someBullet.size > (gridSize - 1)*cellSize ||
      someBullet.locationY + someBullet.size > height - cellSize) {
      bullets.splice(theIndex, 1);
    }
  }
}

function characterLocation() {
  console.log(Math.floor(character.transX/cellSize), Math.floor(character.transY/cellSize));
}