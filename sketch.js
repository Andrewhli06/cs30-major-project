// Awesome Tanks Game
// Andrew Li
// June 15th 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//NTS:
// rewrite code where tank is two squares on top of eachother to simplify collision detection
// figure out breaking walls (change states for every bullet)
// figure out how to set angle of bullet once (fix aimbot)
// figure out stationary shooting for turrets
// clean up classes

class Bullet {
  constructor(x, y, tx, ty, dy) {
    this.pos = createVector(x, y)
    this.dy = dy;
    this.tx = tx;
    this.ty = ty;
    this.radius = 5;
    this.rotX = mouseX - this.tx;
    this.rotY = mouseY - this.ty;
    this.rotateAngle = atan2(this.rotY , this.rotX) - 90;
  }
  display() {
    push();
    translate(this.tx, this.ty);
    rotate(this.rotateAngle);
    fill("black");
    circle(this.pos.x, this.pos.y, this.radius);
    pop();
  }
  move() {
    this.pos.y += this.dy;
  }
}

class Player {
  constructor(x, y, dx, dy, transX, transY, size) {
    this.position = createVector(x, y);
    this.dx = dx;
    this.dy = dy;
    this.transX = transX;
    this.transY = transY;
    this.size = size;
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
  constructor(x, y, px, py, tx, ty, dx, dy, size) {
    this.pos = createVector(x, y);
    this.size = size;
    this.px = px;
    this.py = py;
    this.tx = tx;
    this.ty = ty;
    this.dx = dx;
    this.dy = dy;
    this.rotX = this.px - this.tx;
    this.rotY = this.py - this.ty;
    this.rotAngle = atan2(this.rotY, this.rotX);
    this.enemyBullets = [];
  }
  display() {
    push();
    fill("red");
    translate(this.tx, this.ty);
    rotate(this.rotAngle);
    rect(this.pos.x, this.pos.y, this.size, this.size);
    pop();
  }
  shoot() {
    while (dist(this.tx, this.ty, this.px, this.py) < bulletTravelDistance) {
      this.enemyBullets.push(new Bullet(0, 0, this.pos.x, this.pos.y, 5));
      this.enemyBullets.move();
      this.enemyBullets.display();
      console.log(this.enemyBullets);
    }
  }
  rotate() {
    this.rotX = this.px - this.tx;
    this.rotY = this.py - this.ty;
    this.rotAngle = atan2(this.rotY, this.rotX);
  }
  update() {
    if (keyIsDown(87)) {
      this.py -= this.dy;
    }
    else if (keyIsDown(83)) {
      this.py += this.dy;
    }
    else if (keyIsDown(65)) {
      this.px -= this.dx;
    }
    else if (keyIsDown(68)) {
      this.px += this.dx;
    }
    enemy.rotate();
    enemy.display();
  }
}

let tx, ty;
let dx, dy;
let bulletTravelDistance;
let gridSize;
let bullets = [];
let character;
let cellSize;
let levelToLoad;
let lines;
let enemy;

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
  tx = width/2;
  ty = height/2;
  bulletTravelDistance = 200;
  gridSize = 10;
  cellSize = height/gridSize;
  character = new Player(0, 0, dx, dy, tx, ty, 25);
  level1 = grid(gridSize, gridSize);
  enemy = new EnemyTank(0, 0, tx, ty, width/4, height/4, dx, dy, 50);
  
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
  enemy.update();
  //console.log(enemy.px, enemy.py);
  character.update();
  movement();
  bulletDelete();
  for (let bullet of bullets) {
    bullet.move();
    bullet.display();
  } 
}

function movement() {
  if (keyIsDown(87)) {
    ty -= dy;
  }
  else if (keyIsDown(83)) {
    ty += dy;
  }
  else if (keyIsDown(65)) {
    tx -= dx;
  }
  else if (keyIsDown(68)) {
    tx += dx;
  }
}

function mousePressed() {
  bullets.push(new Bullet(0, 0, tx, ty, 5));
}

function bulletDelete() {
  for (let someBullet of bullets) {
    if (dist(someBullet.pos.x, someBullet.pos.y, character.position.x, character.position.y) > bulletTravelDistance) {
      let theIndex = bullets.indexOf(someBullet);
      bullets.splice(theIndex, 1);
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
      barrierDetection(level1[j][i], j, i);
    }
  }
}

function showCell(location, j, i) {
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
}

function barrierDetection(location, j, i) {
  switch (location) {
    case "S":
      if (collideRectRect(character.position.x, character.position.y, character.size, character.size, i * cellSize + cellSize/2, j * cellSize + cellSize/2, cellSize, cellSize)) {
        character.dx = 0;
      }
  }
}