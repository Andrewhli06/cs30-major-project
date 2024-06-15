// Awesome Tanks Game
// Andrew Li
// June 14th 2024
//
// Extra for Experts:
// use of framerate(), atan2(), createVector(), and setTimeout(())
// I wish I was able to implement more, but it was hard to think of many that weren't the likes of A* or Line of Sight algorithms.

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
    circle(this.position.x, this.position.y, this.size);
    pop();
  }
  locationConversion() { //converts bullet y-position to accurate cartesian coordinates based on fired quadrant
    //this.location(X,Y) is the accurate cartesian coordinates
    //this.grid(X,Y) is the location of the bullet with respect to the grid
    //this.kill(X,Y) is the location in which a bullet may hit an enemy
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
    //deletes bullets if hits an object
    //if case is "B", "W", it takes one hitpoint away from the object
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

      //perimeter bullet detection
      if (someBullet.locationX - someBullet.size < cellSize ||
        someBullet.locationY - someBullet.size < cellSize ||
        someBullet.locationX + someBullet.size > (gridSize - 1) * cellSize ||
        someBullet.locationY + someBullet.size > height - cellSize) {
        bullets.splice(theIndex, 1);
      }

      //deletes the bullet if it travels too far
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
    this.originalTransX = transX + this.size;
    this.originalTransY = transY + this.size;
    this.transX = structuredClone(this.originalTransX);
    this.transY = structuredClone(this.originalTransY);
    this.rotateX = mouseX - this.transX;
    this.rotateY = mouseY - this.transY;
    this.rotateAngle = atan2(this.rotateY, this.rotateX);
    this.originalHealth = 10;
    this.health = structuredClone(this.originalHealth);
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

    //Perimeter detection for player
    if (this.transX - this.size - this.dx < cellSize) {
      this.transX = cellSize + this.size;
    }
    else if (this.transY - this.size - this.dy < cellSize) {
      this.transY = cellSize + this.size;
    }
    else if (this.transX + this.size + this.dx > (gridSize - 1) * cellSize) {
      this.transX = (gridSize - 1) * cellSize - this.size;
    }
    else if (this.transY + this.size + this.dy > height - cellSize) {
      this.transY = height - cellSize - this.size;
    }

    //playerLeftLocation(X,Y), playerCenterLocation(X,Y), playerRightLocation(X,Y), are all parameters to check for collisions within grid
    //the inclusion of 3 points ensures no deadzones

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
    else if (keyIsDown(83)) { //s 
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
    else if (keyIsDown(68)) { //d 
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
    //constantly updates rotation angle based on mouse location
    this.rotateX = mouseX - this.transX;
    this.rotateY = mouseY - this.transY;
    this.rotateAngle = atan2(this.rotateY, this.rotateX)
  }
  update() {
    if (this.health > 0) {
      //only shows the player if alive
      this.move();
      this.rotate();
      this.display();
    }
    else {
      //plays explosion sound upon death
      tankDeath.play();

      //deletes all bullets after death, and resets player health/location after 250ms so it is ready for another level
      setTimeout(() => {
        state = "lose";
        bullets.length = 0;
        this.health = this.originalHealth;
        this.transX = this.originalTransX;
        this.transY = this.originalTransY;
      }, 250);
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
    this.waitTime = 400;
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
      this.bullets.push(new Bullet(0, 0, this.transX, this.transY, character.transX, character.transY, 5, 5));
      enemyBullet.play();
      this.lastShot = millis();
    }
    if (this.health === 0) {
      this.bullets.length = 0;
    }
  }
  rotate() {
    //constantly updates rotate angle based on player location
    this.rotateX = character.transX - this.transX;
    this.rotateY = character.transY - this.transY;
    this.rotateAngle = atan2(this.rotateY, this.rotateX) - 90;
  }
  update() {
    //only shoots and rotates if player is alive
    if (character.health > 0) {
      this.shoot();
      this.rotate();
    }

    //checks if a player bullet has hit the tank
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

//initializing global variables
let transX, transY;
let dx, dy;
let bulletTravelDistance, enemyBulletTravelDistance;
let gridSize;
let enemyTanks = [];
let bullets = [];
let character, enemySize;
let cellSize;
let tank;
let playerBullet, enemyBullet, tankDeath, bgMusic, levelMusic;
let fontSize, buttonSize;
let fps;
let playButton, level1Button, level2Button, level3Button, level4Button, levelSelectionButton;
let level1, level2, level3, level4, lines, level;
let loadedLevels = [];
let cells = [];
let lastShot = 0;
let delay = 500;
let waitTime = 200;
let wallHealth = 5;
let brickHealth = 8
let state = "start";

function preload() {
  //loading only image
  tank = loadImage("images/tank.png");

  //loading sounds (music, sfx)
  playerBullet = loadSound("sounds/200ms_bullet.mp3");
  enemyBullet = loadSound("sounds/400ms_bullet.mp3");
  tankDeath = loadSound("sounds/tank_explosion.mp3");
  bgMusic = loadSound("sounds/intro.mp3");

  //loading levels from txt files
  level1 = loadStrings("levels/level1.txt");
  level2 = loadStrings("levels/level2.txt");
  level3 = loadStrings("levels/level3.txt");
  level4 = loadStrings("levels/level4.txt");

  //putting loaded levels into an array for later use
  loadedLevels.push(level1);
  loadedLevels.push(level2);
  loadedLevels.push(level3);
  loadedLevels.push(level4);
}

//makes sure canvas isnt affected by changes in window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  dx = 5;
  dy = 5;
  bulletTravelDistance = 200;
  enemyBulletTravelDistance = 300;
  fontSize = 50;
  buttonSize = 300;
  gridSize = 10; 
  cellSize = height / gridSize;
  transX = cellSize;
  transY = cellSize;
  enemySize = 25;
  character = new Player(0, 0, dx, dy, transX, transY, 25);
  level = grid(gridSize, gridSize);

  //generates play button
  playButton = new Clickable();
  playButton.locate(width/2 - buttonSize/2, (3*height)/4);
  playButton.resize(buttonSize, buttonSize/3);
  playButton.onPress = function () {
    state = "levelSelection";
  }
  playButton.textFont = "Impact";
  playButton.text = "Play";

  //plays background music and sets its volume to 50%
  bgMusic.loop();
  bgMusic.setVolume(0.5);
}

function draw() {
  startScreen();
  levelSelectionScreen();
  endScreen();
  displayFrameRate();

  if (state === "play") {
    rectMode(CENTER);
    background(200);
    displayGrid(level);
    character.update();
    playerHealth();
    displayFrameRate();

    //displays tanks, and allows for enemy tank functioning
    //deletes tanks once dead, and plays death sfx
    for (let i = enemyTanks.length - 1; i >= 0; i--) {
      enemyTanks[i].display();
      enemyTanks[i].update();
      if (enemyTanks[i].health === 0) {
        enemyTanks.splice(i, 1);
        tankDeath.play();
      }
    }

    //displays player bullets
    for (let someBullet of bullets) {
      someBullet.move();
      someBullet.display();
      someBullet.locationConversion();
    }
  }
}

//start screen, prompting user to click the play button
function startScreen() {
  if (state === "start") {
    rectMode(CORNER);
    background("#4B5320") //army green
    image(tank, width/3, height/5, 500, 500);
    textFont("Impact", fontSize*2)
    textAlign(CENTER);
    text("AndyTanks", width/2, height/3)
    playButton.draw();
  }
}

//where level selections are made
function levelSelectionScreen() {
  if (state === "levelSelection") {
    enemyTanks.length = 0;
    background("#4B5320");

    //generates level 1 button
    level1Button = new Clickable();
    level1Button.locate(width/16, buttonSize); 
    level1Button.resize(buttonSize, buttonSize);
    level1Button.onPress = function () {
      state = "play";
      bgMusic.setVolume(0.3);

      //spawns in tanks in the corners of the level
      enemyTanks.push(new EnemyTank(0, 0, ((gridSize - 1) * cellSize) - enemySize, cellSize + enemySize, enemySize));
      enemyTanks.push(new EnemyTank(0, 0, ((gridSize - 1) * cellSize) - enemySize, ((gridSize - 1) * cellSize) - enemySize, enemySize));
      enemyTanks.push(new EnemyTank(0, 0, cellSize + enemySize, ((gridSize - 1) * cellSize) - enemySize, enemySize));

      //converts specific loaded text file into an array, where it is drawn as a 2D grid
      lines = loadedLevels[0];
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          let cellType = lines[i][j];
          level[i][j] = cellType;
        }
      }
    }
    level1Button.textFont = "Impact";
    level1Button.text = "level 1";
    level1Button.draw();

    //generates level 2 button
    level2Button = new Clickable();
    level2Button.locate(width/4, buttonSize);
    level2Button.resize(buttonSize, buttonSize);
    level2Button.onPress = function () {
      state = "play";
      bgMusic.setVolume(0.3);

      //spawns in tanks in the corners of the level
      enemyTanks.push(new EnemyTank(0, 0, ((gridSize - 1) * cellSize) - enemySize, cellSize + enemySize, enemySize));
      enemyTanks.push(new EnemyTank(0, 0, ((gridSize - 1) * cellSize) - enemySize, ((gridSize - 1) * cellSize) - enemySize, enemySize));
      enemyTanks.push(new EnemyTank(0, 0, cellSize + enemySize, ((gridSize - 1) * cellSize) - enemySize, enemySize));

      //converts specific loaded text file into an array, where it is drawn as a 2D grid
      lines = loadedLevels[1];
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          let cellType = lines[i][j];
          level[i][j] = cellType;
        }
      }
    }
    level2Button.textFont = "Impact";
    level2Button.text = "level 2";
    level2Button.draw();

    //generates level 3 button
    level3Button = new Clickable();
    level3Button.locate(width/2, buttonSize); 
    level3Button.resize(buttonSize, buttonSize);
    level3Button.onPress = function () {
      state = "play";
      bgMusic.setVolume(0.3);

      //spawns in tanks in the corners of the level
      enemyTanks.push(new EnemyTank(0, 0, ((gridSize - 1) * cellSize) - enemySize, cellSize + enemySize, enemySize));
      enemyTanks.push(new EnemyTank(0, 0, ((gridSize - 1) * cellSize) - enemySize, ((gridSize - 1) * cellSize) - enemySize, enemySize));
      enemyTanks.push(new EnemyTank(0, 0, cellSize + enemySize, ((gridSize - 1) * cellSize) - enemySize, enemySize));

      //converts specific loaded text file into an array, where it is drawn as a 2D grid
      lines = loadedLevels[2];
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          let cellType = lines[i][j];
          level[i][j] = cellType;
        }
      }
    }
    level3Button.textFont = "Impact";
    level3Button.text = "level 3";
    level3Button.draw();

    //generates level 4 button
    level4Button = new Clickable();
    level4Button.locate((11*width)/16, buttonSize);
    level4Button.resize(buttonSize, buttonSize);
    level4Button.onPress = function () {
      state = "play";
      bgMusic.setVolume(0.3);
      enemyTanks.push(new EnemyTank(0, 0, ((gridSize - 1) * cellSize) - enemySize, cellSize + enemySize, enemySize));
      enemyTanks.push(new EnemyTank(0, 0, ((gridSize - 1) * cellSize) - enemySize, ((gridSize - 1) * cellSize) - enemySize, enemySize));
      enemyTanks.push(new EnemyTank(0, 0, cellSize + enemySize, ((gridSize - 1) * cellSize) - enemySize, enemySize));

      //converts specific loaded text file into an array, where it is drawn as a 2D grid
      lines = loadedLevels[3];
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          let cellType = lines[i][j];
          level[i][j] = cellType;
        }
      }
    }
    level4Button.textFont = "Impact";
    level4Button.text = "level 4";
    level4Button.draw();
  }
}

//prompts user to select another level upon victory/defeat
function endScreen() {
  //if there are no tanks remaining, player wins
  if (state === "play" && enemyTanks.length === 0) {
    bullets.length = 0;
    setTimeout(() => {
      state = "win";
    }, 250);
  }

  //upon win, player stats and location is reset, screen prompts user to select another level
  if (state === "win") {
    rectMode(CORNER);
    character.health = character.originalHealth;
    character.transX = character.originalTransX;
    character.transY = character.originalTransY;
    background("#4B5320");
    textFont("Impact", 100);
    textAlign(CENTER);
    text("Level Complete!", width/2, height/2);

    //generates level selection button
    levelSelectionButton = new Clickable();
    levelSelectionButton.locate(width/2 - buttonSize/2, (3*height)/4);
    levelSelectionButton.resize(buttonSize, buttonSize/3);
    levelSelectionButton.onPress = function () {
      state = "levelSelection";
    }
    levelSelectionButton.textFont = "Impact";
    levelSelectionButton.text = "Select Level"
    levelSelectionButton.draw();
  }

  else if (state === "lose") {
    rectMode(CORNER);
    background("#4B5320");
    textFont("Impact", 100)
    textAlign(CENTER);
    text("Level Failed!", width/2, height/2)

    //generates level selection button
    levelSelectionButton = new Clickable();
    levelSelectionButton.locate(width/2 - buttonSize/2, (3*height)/4);
    levelSelectionButton.resize(buttonSize, buttonSize/3);
    levelSelectionButton.onPress = function () {
      state = "levelSelection";
    }
    levelSelectionButton.textFont = "Impact";
    levelSelectionButton.text = "Select Level"
    levelSelectionButton.draw();
  }
}

function mousePressed() {
  //shoots bullets upon input, only in 200ms increments
  if (state === "play" && millis() > lastShot + waitTime) {
    bullets.push(new Bullet(0, 0, character.transX, character.transY, mouseX, mouseY, 5, 5));
    playerBullet.play();
    lastShot = millis();
  }
}

//generates a 2d grid
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

//displays the grid
function displayGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      showCell(level[j][i], j, i);
    }
  }
}

//assigns a colour to each cell of the grid that was created
function showCell(location, j, i) {
  switch (location) {
    case "S":
      fill("#928E85");
      rect(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, cellSize, cellSize);
      break;
    case "B":
      fill("#BC4A3C")
      rect(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, cellSize, cellSize);
      break;
    case "W":
      fill("green")
      rect(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, cellSize, cellSize);
      break;
    case "E":
      fill("#C4A484")
      rect(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, cellSize, cellSize);
      break;
  }
}

//shows user their current hp
function playerHealth() {
  textFont("Impact", fontSize)
  textAlign(CORNER);
  text("Your Health: " + character.health, width - fontSize*4, fontSize)
}

//constantly displays the frame rate
function displayFrameRate() {
  fps = frameRate();
  textFont("Impact", fontSize)
  textAlign(CORNER);
  text("Frame Rate: " + Math.round(fps), width - fontSize*4, height)
}
