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

// class Player {
//   constructor() {

//   }
//   display() {

//   }
//   move() {

//   }
// }

// class EnemyTank {
//   constructor() {

//   }
//   display() {

//   }
//   move() {

//   }
// }

let bullets = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  
}

function draw() {
  background(220);
  for (let bullet of bullets) {
    bullet.move();
    bullet.display();
  } 
  
}

function mousePressed() {
  bullets.push(new Bullet(mouseX, mouseY, random(-5,5), random(-5,5)));
  console.log(bullets);
}


