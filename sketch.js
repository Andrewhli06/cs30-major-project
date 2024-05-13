// Awesome Tanks Game
// Andrew Li
// June 15th 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// class Bullet {
//   constructor(x, y, tx, ty, dy) {
//     this.pos = createVector(x, y)
//     //this.dx = dx;
//     this.dy = dy;
//     this.tx = tx;
//     this.ty = ty;
//     this.radius = 5;
//     this.rotX = mouseX - this.tx;
//     this.rotY = mouseY - this.ty;
//     this.rotateAngle = atan2(this.rotY, this.rotX) - 90;
//   }
//   display() {
//     push();
//     translate(this.tx, this.ty);
//     rotate(this.rotateAngle);
//     fill("black");
//     circle(this.pos.x, this.pos.y, this.radius);
//     pop();
//   }
//   move() {
//     //this.pos.x += this.dx;
//     this.pos.y += this.dy;
//   }
// }

// class Player {
//   constructor(x, y, dx, dy, transX, transY, size) {
//     this.position = createVector(x, y);
//     this.dx = dx;
//     this.dy = dy;
//     this.transX = transX;
//     this.transY = transY;
//     this.size = size;
//     this.rotateX = mouseX - this.transX;
//     this.rotateY = mouseY - this.transY;
//     this.rotateAngle = atan2(this.rotateY, this.rotateX)
//   }
//   display() {
//     push();
//     translate(this.transX, this.transY);
//     rotate(this.rotateAngle);
//     rect(this.position.x, this.position.y, this.size, this.size);
//   }
//   move() {
//     if (keyIsDown(87)) {
//       this.transY -= this.dy;
//     }
//     else if (keyIsDown(83)) {
//       this.transY += this.dy;
//     }
//     else if (keyIsDown(65)) {
//       this.transX -= this.dx;
//     }
//     else if (keyIsDown(68)) {
//       this.transX += this.dx;
//     }
//   }
// }

// let bullets = [];
// let character;
// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   rectMode(CENTER)
//   angleMode(DEGREES);
  
// }

// function draw() {
//   background(200);
//   character = new Player(0, 0, 5, 5, width/2, height/2, 50);
//   character.display();
//   character.move();
//   for (let bullet of bullets) {
//     bullet.move();
//     bullet.display();
//   } 
// }

// function movement() {
//   if (keyIsDown(87)) {
//     ty -= dy;
//   }
//   else if (keyIsDown(83)) {
//     ty += dy;
//   }
//   else if (keyIsDown(65)) {
//     tx -= dx;
//   }
//   else if (keyIsDown(68)) {
//     tx += dx;
//   }
// }

function mousePressed() {
  bullets.push(new Bullet(0, 0, tx, ty, 5));
  // console.log(bullets);
}


//working one from p5js
class Bullet {
  constructor(x, y, tx, ty, dy) {
    this.pos = createVector(x, y)
    //this.dx = dx;
    this.dy = dy;
    this.tx = tx;
    this.ty = ty;
    this.radius = 5;
    this.rotX = mouseX - this.tx;
    this.rotY = mouseY - this.ty;
    this.rotateAngle = atan2(this.rotY, this.rotX) -90;
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
    //this.pos.x += this.dx;
    this.pos.y += this.dy;
  }
}
let charX;
let charY;
let tx, ty;
let dx, dy;
let bullets = [];
function setup() {
  createCanvas(400, 400);
  rectMode(CENTER)
  angleMode(DEGREES);
  charX = 0;
  charY = 0;
  dx = 5;
  dy = 5;
  tx = 200;
  ty = 200;
}

function draw() {
  background(200);
  push();
  // Translate the origin to the center.
  translate(tx, ty);
  // Get the mouse's coordinates relative to the origin.
  let x = mouseX - tx;
  let y = mouseY - ty;
  // Calculate the angle between the mouse and the origin.
  let a = atan2(y, x);
  // Rotate.
  rotate(a);

  // Draw the shape.
  rect(charX, charY, 50, 50);
  movement();
  pop();

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
