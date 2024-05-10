// Awesome Tanks Game
// Andrew Li
// June 15th 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Bullet {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = 5;
  }
  display() {
    fill("black");
    circle(this.x, this.y, this.radius);
  }
  move() {
    this.x += this.dx;
    this.y += this.dy;
  }
}

class Player {
  constructor(x, y, dx, dy) {
    this.x = 0;
    this.y = 0;
    this.transX = x;
    this.transY = y;
    this.dx = dx;
    this.dy = dy;
    this.size = 50;
    this.angle = atan2(mouseY, mouseX);
  }
  display() {
    fill("red");
    push();
    rotate(this.angle);
    translate(this.transX, this.transY);
    rect(this.x, this.y, this.size, this.size);
    pop();
  }
  move() {
    if (keyIsDown(87)) {
      this.y -= this.dy;
    }
    else if (keyIsDown(83)) {
      this.y += this.dy;
    }
    else if (keyIsDown(65)) {
      this.x -= this.dx;
    }
    else if (keyIsDown(68)) {
      this.x += this.dx;
    }
  }
}

// class EnemyTank {
//   constructor() {

//   }
//   display() {

//   }
//   move() {

//   }
// }

let bullets = [];
let character;
function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  character = new Player(width/2, height/2, 5, 5);
}

function draw() {
  background(220);
  for (let bullet of bullets) {
    bullet.move();
    bullet.display();
  } 
  character.display();
  character.move();
}

function mousePressed() {
  bullets.push(new Bullet(mouseX, mouseY, random(-5,5), random(-5,5)));
  // console.log(bullets);
}


