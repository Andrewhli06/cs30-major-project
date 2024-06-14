// Awesome Tanks Game
// Andrew Li
// June 14th 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//NTS/TDL:
// figure out how to have a spotlight-like FOV for playerTank
// implement a camera?
// A* and/or line of sight algorithms

//actual TDL, now that I have majority of the logic figured out:
// convert every grid cell into an object? that way I can have individual health for each wall? consider noloop() or redraw()
// add rotational error to turrets
// figure out a more elegant way to do level selection, create more levels, p5 clickable
// general optimization, look for big chunks of code and look for improvements that don't affect legibility
// states: start, play, death, levels, etc.
// pngs, sfx, background music, etc.


//known bugs:
// down and right movements leave the character roughly dx/dy distance away from object
// objects placed within grid are quite buggy, the mathematical deduction of player location has a bit of error
// player will slightly sink into corners of grid due to same "deadzone" type issue
// bullet phases slightly in objects/certain "deadzones" with bullet-turret collision
// all destructible objects of the same species have influence on eachother's health values - consider making every block an object

// potential suggestions (if you have time):

class Bullet {
  constructor(x, y, transX, transY, trackX, trackY, dy, size) {
    this.position = createVector(x, y);
    this.dy = dy;
    this.transX = transX;
    this.transY = transY;
    this.size = size;
    this.rotateX = trackX - this.transX;
    this.rotateY = trackY - this.transY;
    this.rotateAngle = atan2(this.rotateY, this.rotateX) - 90;
    this.locationX, this.locationY;
    this.gridX, this.gridY;
    this.killX, this.killY;
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
  locationConversion() {
    if (this.rotateAngle > -180 && this.rotateAngle < -90) { //Quadrant 1
      this.locationX = this.transX + Math.abs(this.position.y * sin(this.rotateAngle));
      this.locationY = this.transY - Math.abs(this.position.y * cos(this.rotateAngle));
      this.gridX = Math.floor((this.locationX + (this.size / 2 + this.dy) * cos(this.rotateAngle)) / cellSize);
      this.gridY = Math.floor((this.locationY - (this.size / 2 + this.dy) * sin(this.rotateAngle)) / cellSize);
      this.killX = this.locationX + (this.size / 2 + this.dy) * cos(this.rotateAngle);
      this.killY = this.locationY - (this.size / 2 + this.dy) * sin(this.rotateAngle);
    }
    else if (this.rotateAngle > -90 && this.rotateAngle < 0) { //Quadrant 2
      this.locationX = this.transX + Math.abs(this.position.y * sin(this.rotateAngle));
      this.locationY = this.transY + Math.abs(this.position.y * cos(this.rotateAngle));
      this.gridX = Math.floor((this.locationX - (this.size / 2 + this.dy) * cos(this.rotateAngle)) / cellSize);
      this.gridY = Math.floor((this.locationY - (this.size / 2 + this.dy) * sin(this.rotateAngle)) / cellSize);
      this.killX = this.locationX - (this.size / 2 + this.dy) * cos(this.rotateAngle)
      this.killY = this.locationY - (this.size / 2 + this.dy) * sin(this.rotateAngle)
    }
    else if (this.rotateAngle > 0 && this.rotateAngle < 90) { //Quadrant 3
      this.locationX = this.transX - Math.abs(this.position.y * sin(this.rotateAngle));
      this.locationY = this.transY + Math.abs(this.position.y * cos(this.rotateAngle));
      this.gridX = Math.floor((this.locationX - (this.size / 2 + this.dy) * cos(this.rotateAngle)) / cellSize);
      this.gridY = Math.floor((this.locationY + (this.size / 2 + this.dy) * sin(this.rotateAngle)) / cellSize);
      this.killX = this.locationX - (this.size / 2 + this.dy) * cos(this.rotateAngle)
      this.killY = this.locationY + (this.size / 2 + this.dy) * sin(this.rotateAngle)
    }
    else if (this.rotateAngle > -270 && this.rotateAngle < -180) { //Quadrant 4
      this.locationX = this.transX - Math.abs(this.position.y * sin(this.rotateAngle));
      this.locationY = this.transY - Math.abs(this.position.y * cos(this.rotateAngle));
      this.gridX = Math.floor((this.locationX + (this.size / 2 + this.dy) * cos(this.rotateAngle)) / cellSize);
      this.gridY = Math.floor((this.locationY + (this.size / 2 + this.dy) * sin(this.rotateAngle)) / cellSize);
      this.killX = this.locationX + (this.size / 2 + this.dy) * cos(this.rotateAngle)
      this.killY = this.locationY + (this.size / 2 + this.dy) * sin(this.rotateAngle)
    }
  }
  move() {
    for (let someBullet of bullets) {
      let theIndex = bullets.indexOf(someBullet);
      if (someBullet.gridX > 0 && someBullet.gridY > 0) {
        switch (level[someBullet.gridY][someBullet.gridX]) {
          case "S":
            bullets.splice(theIndex, 1);
            break;
          case "B":
            if (brickHealth > 0) {
              brickHealth--;
              bullets.splice(theIndex, 1);
            }
            else {
              level[someBullet.gridY][someBullet.gridX] = "E";
              brickHealth = 8;
            }
            break;
          case "W":
            if (wallHealth > 0) {
              wallHealth--
              bullets.splice(theIndex, 1);
            }
            else {
              level[someBullet.gridY][someBullet.gridX] = "E";
              wallHealth = 5; // this is stupid
            }
            break;
        }
      }
      if (someBullet.locationX - someBullet.size < cellSize ||
        someBullet.locationY - someBullet.size < cellSize ||
        someBullet.locationX + someBullet.size > (gridSize - 1) * cellSize ||
        someBullet.locationY + someBullet.size > height - cellSize) {
        bullets.splice(theIndex, 1);
      }
      if (dist(someBullet.position.x, someBullet.position.y, character.position.x, character.position.y) > bulletTravelDistance) {
        bullets.splice(theIndex, 1);
      }
    }
    this.position.y += this.dy;
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
    this.rotateAngle = atan2(this.rotateY, this.rotateX);
    this.health = 5;
  }
  display() {
    push();
    fill("yellow");
    translate(this.transX, this.transY);
    rect(this.position.x, this.position.y, this.size * 2, this.size * 2);
    pop();
    push();
    fill("orange");
    translate(this.transX, this.transY);
    rotate(this.rotateAngle);
    rect(this.position.x, this.position.y, this.size, this.size);
    pop();
  }
  move() {
    let playerLeftLocationX, playerLeftLocationY;
    let playerCenterLocationX, playerCenterLocationY;
    let playerRightLocationX, playerRightLocationY;
    if (keyIsDown(87)) { // w
      playerLeftLocationX = Math.floor((this.transX - this.size) / cellSize);
      playerLeftLocationY = Math.floor((this.transY - this.size - this.dy) / cellSize);
      playerCenterLocationX = Math.floor(this.transX / cellSize);
      playerCenterLocationY = Math.floor((this.transY - this.size - this.dy) / cellSize);
      playerRightLocationX = Math.floor((this.transX + this.size) / cellSize);
      playerRightLocationY = Math.floor((this.transY - this.size - this.dy) / cellSize);
      if (level[playerLeftLocationY][playerLeftLocationX] === "E" &&
        level[playerCenterLocationY][playerCenterLocationX] === "E" &&
        level[playerRightLocationY][playerRightLocationX] === "E") {
        this.transY -= this.dy
      }
    }
    else if (keyIsDown(83)) { //s //why does this one not require a dy consideration
      playerLeftLocationX = Math.floor((this.transX - this.size) / cellSize);
      playerLeftLocationY = Math.floor((this.transY + this.size + this.dy) / cellSize);
      playerCenterLocationX = Math.floor(this.transX / cellSize);
      playerCenterLocationY = Math.floor((this.transY + this.size + this.dy) / cellSize);
      playerRightLocationX = Math.floor((this.transX + this.size) / cellSize);
      playerRightLocationY = Math.floor((this.transY + this.size + this.dy) / cellSize);
      if (level[playerLeftLocationY][playerLeftLocationX] === "E" &&
        level[playerCenterLocationY][playerCenterLocationX] === "E" &&
        level[playerRightLocationY][playerRightLocationX] === "E") {
        this.transY += this.dy;
      }
    }
    else if (keyIsDown(65)) { //a
      playerLeftLocationX = Math.floor((this.transX - this.size - this.dx) / cellSize);
      playerLeftLocationY = Math.floor((this.transY + this.size) / cellSize);
      playerCenterLocationX = Math.floor((this.transX - this.size - this.dx) / cellSize);
      playerCenterLocationY = Math.floor(this.transY / cellSize);
      playerRightLocationX = Math.floor((this.transX - this.size - this.dx) / cellSize);
      playerRightLocationY = Math.floor((this.transY - this.size) / cellSize);
      if (level[playerLeftLocationY][playerLeftLocationX] === "E" &&
        level[playerCenterLocationY][playerCenterLocationX] === "E" &&
        level[playerRightLocationY][playerRightLocationX] === "E") {
        this.transX -= this.dx;
      }
    }
    else if (keyIsDown(68)) { //d // why does this one not require a dx consideration
      playerLeftLocationX = Math.floor((this.transX + this.size + this.dx) / cellSize);
      playerLeftLocationY = Math.floor((this.transY + this.size) / cellSize);
      playerCenterLocationX = Math.floor((this.transX + this.size + this.dx) / cellSize);
      playerCenterLocationY = Math.floor(this.transY / cellSize);
      playerRightLocationX = Math.floor((this.transX + this.size + this.dx) / cellSize);
      playerRightLocationY = Math.floor((this.transY - this.size) / cellSize);
      if (level[playerLeftLocationY][playerLeftLocationX] === "E" &&
        level[playerCenterLocationY][playerCenterLocationX] === "E" &&
        level[playerRightLocationY][playerRightLocationX] === "E") {
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
    if (this.health > 0) {
      this.move();
      this.rotate();
      this.display();
    }
  }
}

class EnemyTank {
  constructor(x, y, transX, transY, size) {
    this.position = createVector(x, y);
    this.transX = transX;
    this.transY = transY;
    this.size = size;
    this.rotateX = character.transX - this.transX;
    this.rotateY = character.transY - this.transY;
    this.rotateAngle = atan2(this.rotateY, this.rotateX) - 90;
    this.bullets = [];
    this.lastShot = 0;
    this.waitTime = 300;
    this.health = 3;
  }
  display() {
    push();
    fill("yellow");
    translate(this.transX, this.transY);
    rect(this.position.x, this.position.y, this.size * 2, this.size * 2);
    pop();
    push();
    fill("red");
    translate(this.transX, this.transY);
    rotate(this.rotateAngle);
    rect(this.position.x, this.position.y, this.size, this.size);
    pop();
  }
  shoot() { // add some sort of error in player tracking
    for (let someBullet of this.bullets) {
      let theIndex = this.bullets.indexOf(someBullet);
      if (character.health > 0) {
        someBullet.move();
        someBullet.display();
        someBullet.locationConversion();
        if (dist(someBullet.killX, someBullet.killY, character.transX, character.transY) < character.size) {
          this.bullets.splice(theIndex, 1);
          character.health--
        }
      }
      if (someBullet.locationX - someBullet.size < cellSize ||
        someBullet.locationY - someBullet.size < cellSize ||
        someBullet.locationX + someBullet.size > (gridSize - 1) * cellSize ||
        someBullet.locationY + someBullet.size > height - cellSize) {
        this.bullets.splice(theIndex, 1);
      }
      if (someBullet.gridY > 0 && someBullet.gridX > 0) {
        if (level[someBullet.gridY][someBullet.gridX] !== "E") {
          this.bullets.splice(theIndex, 1);
        }
      }
      if (dist(this.position.x, this.position.y, someBullet.position.x, someBullet.position.y) > enemyBulletTravelDistance) {
        let theIndex = this.bullets.indexOf(someBullet);
        this.bullets.splice(theIndex, 1);
      }
    }
    if (millis() > this.lastShot + this.waitTime && dist(character.transX, character.transY, this.transX, this.transY) < enemyBulletTravelDistance) {
      this.bullets.push(new Bullet(0, 0, this.transX, this.transY, character.transX, character.transY, 1, 5));
      this.lastShot = millis();
    }
    if (this.health === 0) {
      this.bullets.length = 0;
    }
  }
  rotate() {
    this.rotateX = character.transX - this.transX;
    this.rotateY = character.transY - this.transY;
    this.rotateAngle = atan2(this.rotateY, this.rotateX) - 90;
  }
  update() {
    if (character.health > 0) {
      this.shoot();
      this.rotate();
    }
    for (let someBullet of bullets) {
      let theIndex = bullets.indexOf(someBullet);
      if (someBullet.killX > 0 && someBullet.killY > 0) {
        if (bullets.length > 0 && dist(someBullet.killX, someBullet.killY, this.transX, this.transY) < this.size) {
          bullets.splice(someBullet);
          this.health--;
        }
      }
    }
  }
}

let transX, transY;
let dx, dy;
let bulletTravelDistance, enemyBulletTravelDistance;
let gridSize;
let enemyTanks = [];
let bullets = [];
let character, enemy;
let cellSize;
let level1, level2, lines, level;
let loadedLevels = [];
let lastShot = 0;
let waitTime = 200;
let wallHealth = 5;
let brickHealth = 8
let state;

function preload() { // either load all levels or search up "callback"
  level1 = loadStrings("levels/level1.txt");
  level2 = loadStrings("levels/level2.txt");
  loadedLevels.push(level1);
  loadedLevels.push(level2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
  cellSize = height / gridSize;
  transX = cellSize;
  transY = cellSize;
  character = new Player(0, 0, dx, dy, transX, transY, 25);
  enemyTanks.push(new EnemyTank(0, 0, (gridSize - 4) * cellSize, cellSize * 2, 25));
  enemyTanks.push(new EnemyTank(0, 0, (gridSize - 4.5) * cellSize, cellSize * 2, 25));
  level = grid(gridSize, gridSize);

}

function draw() {
  background(200);
  displayGrid(level);
  character.update();
  perimeterBarrierDetection();
  levelSelection();

  for (let i = enemyTanks.length - 1; i >= 0; i--) {
    enemyTanks[i].display();
    enemyTanks[i].update();
    if (enemyTanks[i].health === 0) {
      enemyTanks.splice(i, 1);
    }
  }

  for (let someBullet of bullets) {
    someBullet.move();
    someBullet.display();
    someBullet.locationConversion();
  }
}

function mousePressed() {
  if (millis() > lastShot + waitTime) {
    bullets.push(new Bullet(0, 0, character.transX, character.transY, mouseX, mouseY, 5, 5));
    lastShot = millis();
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
      rect(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, cellSize, cellSize);
      break;
    case "B":
      fill("blue")
      rect(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, cellSize, cellSize);
      break;
    case "W":
      fill("green")
      rect(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, cellSize, cellSize);
      break;
    case "E":
      fill("white")
      rect(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, cellSize, cellSize);
      break;
  }
  //pop();
}

function perimeterBarrierDetection() { //plug into character movement function
  if (character.transX - character.size - character.dx < cellSize) {
    character.transX = cellSize + character.size;
  }
  else if (character.transY - character.size - character.dy < cellSize) {
    character.transY = cellSize + character.size;
  }
  else if (character.transX + character.size + character.dx > (gridSize - 1) * cellSize) {
    character.transX = (gridSize - 1) * cellSize - character.size;
  }
  else if (character.transY + character.size + character.dy > height - cellSize) {
    character.transY = height - cellSize - character.size;
  }
}

function levelSelection() { //not very elegant, make it so it switches states so that the player/turrets are not permanently there
  switch (keyCode) {
    case 49:
      lines = loadedLevels[0];
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          let cellType = lines[i][j];
          level[i][j] = cellType;
        }
      }
      break;
    case 50:
      lines = loadedLevels[1];
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          let cellType = lines[i][j];
          level[i][j] = cellType;
        }
      }
      break;
  }
}