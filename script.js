// plateau
let board
let boardWidth = 750;
let boardHeight = 250;
let context;

// bobo
let boboWidth = 36;
let boboHeight = 48;
let boboX = 50;
let boboY = boardHeight - boboHeight;
let boboImg;
let boboIsJumping = false;

let bobo = {
    x: boboX,
    y: boboY,
    width: boboWidth,
    height: boboHeight
}

// bobo enemy
let boboEnemyArray = [];

let boboEnemyWidth1 = 36;
let boboEnemyWidth2 = 39;
let boboEnemyWidth3 = 51;
let boboEnemyWidth4 = 102;

let boboEnemyHeight = 48;
let boboEnemyX = 700;
let boboEnemyY = boardHeight - boboEnemyHeight;

let boboEnemy1Img;
let boboEnemy2Img;
let boboEnemy3Img;
let boboEnemy4Img;

// physics
let velocityX = -6; // enemy movespeed
let velocityY = 0;
let gravity = 0.4;

// game management
let gameOver = false;
let score = 0;

// animation
let boboImages = [];
let currentBoboImageIndex = 0;

let boboEnemyImages = [];
let currentEnemyImageIndex = 0;


window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    // load images for animations
    loadImages();

    // switch images every 0.2s (=animation)
    setInterval(changeBoboImage, 200);
    setInterval(changeEnemyImage, 200);

    // refresh
    requestAnimationFrame(update);

    // new enemy every 1s
    setInterval(placeBoboEnemy, 1000);
    document.addEventListener("keydown", moveBobo);
}

function loadImages() {
    for (let i = 1; i <= 2; i++) {
        let img = new Image();
        img.src = `./graphics/bo_walk${i}.png`;
        boboImages.push(img);
    }

    boboImg = boboImages[currentBoboImageIndex];

    boboImgJumping = new Image();
    boboImgJumping.src = "./graphics/bo_jump1.png";

    for (let i = 1; i <= 2; i++) {
        let img = new Image();
        img.src = `./graphics/light_bo_walk${i}.png`;
        boboEnemyImages.push(img);
    }

    boboEnemy1Img = boboEnemyImages[currentEnemyImageIndex];

    boboEnemy2Img = new Image();
    boboEnemy2Img.src = "./graphics/bo_rush1.png"

    boboEnemy3Img = new Image();
    boboEnemy3Img.src = "./graphics/bo_rush2.png"

    boboEnemy4Img = new Image();
    boboEnemy4Img.src = "./graphics/bo_rush3.png"
}

function changeBoboImage() {
    currentBoboImageIndex = (currentBoboImageIndex + 1) % boboImages.length;
    boboImg = boboImages[currentBoboImageIndex];
}

function changeEnemyImage() {
    currentEnemyImageIndex = (currentEnemyImageIndex + 1) % boboEnemyImages.length;
    boboEnemy1Img = boboEnemyImages[currentEnemyImageIndex];
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return; // CODER ICI LE FAIT QUE L'ON PUISSE APPUYER SUR ESPACE POUR REPLAY
    }

    context.clearRect(0, 0, board.width, board.height);

    // draw bobo
    velocityY += gravity;
    bobo.y = Math.min(bobo.y + velocityY, boboY); // apply gravity (fall or stay on the dance floor)
    boboIsJumping = bobo.y != boboY;
    if (boboIsJumping) {
        context.drawImage(boboImgJumping, bobo.x, bobo.y, bobo.width, bobo.height);
    }
    else {
        context.drawImage(boboImg, bobo.x, bobo.y, bobo.width, bobo.height);
    }

    // draw enemy
    for (let i = 0; i < boboEnemyArray.length; i++) {
        let enemy = boboEnemyArray[i];
        enemy.x += velocityX;
        context.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    
        if (collisionDectection(bobo, enemy)) {
            gameOver = true;
            boboImg.src = "./graphics/bobo_dead.png"
            boboImg.onload = function() {
                context.drawImage(boboImg, bobo.x, bobo.y, bobo.width, bobo.height);
            }
        }
    }

    // score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, boardWidth - 75, 20);
}

function moveBobo(event) {
    if (gameOver) {
        return;
    }

    if ((event.code == "Space" || event.code == "ArrowUp") && bobo.y == boboY) { // press space or arrow up AND bobo is on the dance floor
        velocityY = -9;
    }
}

function placeBoboEnemy() {
    if (gameOver) {
        return;
    }

    let enemy = {
        img: null,
        x: boboEnemyX,
        y: boboEnemyY,
        width: null,
        height: boboEnemyHeight
    }

    let placeEnemyChance = Math.random(); // from 0 to 0.999...

    if (placeEnemyChance > 0.90) {
        enemy.img = boboEnemy4Img;
        enemy.width = boboEnemyWidth4;
        boboEnemyArray.push(enemy);
    }
    else if (placeEnemyChance > 0.75) {
        enemy.img = boboEnemy3Img;
        enemy.width = boboEnemyWidth3;
        boboEnemyArray.push(enemy);
    }
    else if (placeEnemyChance > 0.60) {
        enemy.img = boboEnemy2Img;
        enemy.width = boboEnemyWidth2;
        boboEnemyArray.push(enemy);
    }
    else if (placeEnemyChance > 0.40) {
        enemy.img = boboEnemy1Img;
        enemy.width = boboEnemyWidth1;
        boboEnemyArray.push(enemy);
    }

    if (boboEnemyArray.length > 6) {
        boboEnemyArray.shift(); // remove first elt from the array to not surchage it
    }
}

function collisionDectection(entityA, entityB) {
    return entityA.x < entityB.x + entityB.width && // the two first conditions are refering to the bobo x being
        entityA.x + entityA.width > entityB.x && // inside both x and x + width of the enemy
        entityA.y < entityB.y + entityB.height && // same thing here but exploiting the y and height
        entityA.y + entityA.height > entityB.y; // of bobo and the enemy
}