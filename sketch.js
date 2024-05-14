// Awesome Tanks Game
// Andrew Li
// June 15th 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Bullet {
  constructor(x, y, tx, ty, dx, dy) {
    this.pos = createVector(x, y)
    this.dx = dx
    this.dy = dy;
    this.transX = tx;
    this.transY = ty;
    this.radius = 5;
    this.rotX = mouseX - this.transX;
    this.rotY = mouseY - this.transY;
    this.rotateAngle = atan2(this.rotY, this.rotX) - 90;
  }
  display() {
    push();
    translate(this.transX, this.transY);
    rotate(this.rotateAngle);
    fill("black");
    circle(this.pos.x, this.pos.y, this.radius);
    pop();
  }
  update() {
    this.pos.y += this.dy;
    this.rotX = mouseX - this.transX;
    this.rotY = mouseY - this.transY;
    this.rotateAngle = atan2(this.rotY, this.rotX) - 90;
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
}

let bullets = [];
let character;
let tx, ty;
function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER)
  angleMode(DEGREES);
  tx = width/2;
  ty = height/2
  character = new Player(0, 0, 5, 5, tx, ty, 50);
}

function draw() {
  background(200);
  character.rotate();
  character.move();
  character.display();
  for (let bullet of bullets) {
    bullet.update();
    bullet.display();
  } 
  console.log(bullets);
}

function mousePressed() {
  bullets.push(new Bullet(0, 0, tx, ty, 5, 5));
}
