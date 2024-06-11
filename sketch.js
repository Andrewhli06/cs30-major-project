// Awesome Tanks Game
// Andrew Li
// June 14th 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//NTS/TDL:
// figure out breaking walls (change states for every bullet) - collide2D? Best way to determine the location of each block? How to elegantly convert between levels
// figure out how to have a spotlight-like FOV for playerTank
// apply all bullet and rotation features to turrets - how do you make sure that the turrets are not OP in the sense that they autolock onto player position? add random error of +- 5 degrees?
// apply object detection to bullets
// implement a camera?
// pictures, sound, loading screens
// create more levels
// A* and/or line of sight algorithms


//known bugs:
// objects placed within the grid have a "deadzone" where player can ever so slightly pass through - potential solution: 3 point check?
// objects placed within grid are quite buggy, the mathematical deduction of player location has a bit of error
// player will slightly sink into corners of grid due to same "deadzone" type issue

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
    let playerLocationX, playerLocationY;
    if (keyIsDown(87)) { // w
      playerLocationX = Math.floor(this.transX/cellSize);
      playerLocationY = Math.floor((this.transY - this.size - this.dy)/cellSize);
      if (level[playerLocationY][playerLocationX] !== "E") {
        playerLocationY += this.dy; 
      }
      else {
        this.transY -= this.dy
      }
    }
    else if (keyIsDown(83)) { //s //why does this one not require a dy consideration
      playerLocationX = Math.floor(this.transX/cellSize);
      playerLocationY = Math.floor((this.transY + this.size)/cellSize);
      if (level[playerLocationY][playerLocationX] !== "E") {
        playerLocationY -= this.dy; 
      }
      else {
        this.transY += this.dy;
      }
    }
    else if (keyIsDown(65)) { //a
      playerLocationX = Math.floor((this.transX - this.size - this.dx)/cellSize);
      playerLocationY = Math.floor(this.transY/cellSize);
      if (level[playerLocationY][playerLocationX] !== "E") {
        playerLocationX += this.dx;
      }
      else {
        this.transX -= this.dx;
      }
    }
    else if (keyIsDown(68)) { //d // why does this one not require a dx consideration
      playerLocationX = Math.floor((this.transX + this.size)/cellSize);
      playerLocationY = Math.floor(this.transY/cellSize);
      if (level[playerLocationY][playerLocationX] !== "E") {
        playerLocationX -= this.dx;
      }
      else {
        this.transX += this.dx;
      }
      
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
let levelToLoad, lines, level;
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
  level = grid(gridSize, gridSize);
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let cellType = lines[i][j];
      level[i][j] = cellType;
    }
  }

}

function draw() {
  background(200);
  displayGrid(level);
  character.update();
  bulletDelete();
  perimeterBarrierDetection();
  perimeterBulletDetection();
  //characterLocation();

  enemy.display();
  //enemy.shoot();
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
  bullets.push(new Bullet(0, 0, character.transX, character.transY, 5, 5));
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
      showCell(level[j][i], j, i);
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
  if (character.transX - character.size - character.dx < cellSize) {
    character.transX = cellSize + character.size;
  } 
  else if (character.transY - character.size - character.dy < cellSize) {
    character.transY = cellSize + character.size;
  } 
  else if (character.transX + character.size + character.dx > (gridSize - 1)*cellSize) {
    character.transX = (gridSize - 1)*cellSize - character.size;
  } 
  else if (character.transY + character.size + character.dy > height - cellSize) {
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
  let playerLocationX = Math.floor(character.transX/cellSize)
  let playerLocationY = Math.floor((character.transY - character.size)/cellSize)
  console.log(level[playerLocationY][playerLocationX]);

}