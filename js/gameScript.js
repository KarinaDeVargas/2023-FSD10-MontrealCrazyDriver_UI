/*
FSD10 - User Interfaces
Final Project
Group: Charlie
    Claudiu || ID:
    Sophie || ID: 0754336
    Karina de Vargas Pereira || ID:2300594
Date: September 15, 2023
Description: js file for game "GAME NAME"
*/

window.addEventListener("load", prepForm); //onload event listener (same as Stephanie uses)

// Variables to define the board
let board;
let boardWidth = 1300;
let boardHeight = 350;
let context;

// Variables to define the car
let carWidth = 148;
let carHeight = 100;
let carX = 50;
let carY = boardHeight - carHeight;
let carImg;

let car = {
  x: carX,
  y: carY,
  width: carWidth,
  height: carHeight,
};

// Variables to define the Montreal cones
let coneArray = [];

let cone1Width = 30;
let cone2Width = 70;
let cone3Width = 41;

let coneHeight = 50;
let coneX = 1200;
let coneY = boardHeight - coneHeight;

let cone1Img;
let cone2Img;
let cone3Img;

// Variables related to the physics of the game
let velocityX = -8; //speed for the cones moving to the left (the orinal speed was -8, I thought it could be a little bit slower, so a switched to -4)
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

function prepForm() {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d"); //used for drawing on the board

  carImg = new Image();
  carImg.src = "./img/car01.png";
  carImg.onload = function () {
    context.drawImage(carImg, car.x, car.y, car.width, car.height);
  };

  cone1Img = new Image();
  cone1Img.src = "./img/cone1.png";

  cone2Img = new Image();
  cone2Img.src = "./img/cone1.1.jpg";

  cone3Img = new Image();
  cone3Img.src = "./img/cone1.3.png"; // Charlie Group, we need to change this image

  requestAnimationFrame(update);
  setInterval(placeCone, 1000); //1000 milliseconds = 1 second
  document.addEventListener("keydown", moveCar);
}

function update() {
  requestAnimationFrame(update);
  //If the car colides with the cone ther is no need to draw any image
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  // Draw car image
  velocityY += gravity;
  car.y = Math.min(car.y + velocityY, carY); // gravity places role, current car.y does not exceed the ground
  context.drawImage(carImg, car.x, car.y, car.width, car.height);

  // Draw cone image
  for (let i = 0; i < coneArray.length; i++) {
    let cone = coneArray[i];
    cone.x += velocityX; // going negative is going to the left
    context.drawImage(cone.img, cone.x, cone.y, cone.width, cone.height);

    if (detectCollision(car, cone)) {
      gameOver = true;
      carImg.src = "./img/carTrashed.png"; // Charlie Group, we need to change this image
      carImg.onload = function () {
        context.drawImage(carImg, car.x, car.y, car.width, car.height);
      };
    }
  }
}

function moveCar(e) {
  if (gameOver) {
    return;
  }

  // Key events keyboard Space and Arrow Up
  if ((e.code == "Space" || e.code == "ArrowUp") && car.y == carY) {
    // being car.y is the car object property and carY is the default y position of the car (car on the ground)
    // when the car jumps
    velocityY = -10;
  }
}

function placeCone() {
  //If the car colides with the cone ther is no need to place any cones
  if (gameOver) {
    return;
  }

  //place the cone in the board
  let cone = {
    img: null,
    x: coneX,
    y: coneY,
    width: null,
    height: coneHeight,
  };

  let placeConeRandom = Math.random(); //

  if (placeConeRandom > 0.9) {
    // 10% chance you get a cone3
    cone.img = cone3Img;
    cone.width = cone3Width;
    coneArray.push(cone);
  } else if (placeConeRandom > 0.7) {
    //30% chance you get a cone2
    cone.img = cone2Img;
    cone.width = cone3Width;
    coneArray.push(cone);
  } else if (placeConeRandom > 0.5) {
    //50% chance you get a cone1
    cone.img = cone1Img;
    cone.width = cone3Width;
    coneArray.push(cone);
  }

  // avoid accumulation of cones images to save memory - cactus that passed are not going to be use any more
  if (coneArray.length > 8) {
    coneArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //
    a.x + a.width > b.x && //
    a.y < b.y + b.height && //
    a.y + a.height > b.y
  ); //
}

// collision function added, however it needs to find a way of deleting the normal car behind the trashed car.

// stopped at 37:10

// https://www.youtube.com/watch?v=lgck-txzp9o
