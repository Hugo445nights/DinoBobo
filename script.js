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

let bobo = {
    x: boboX,
    y: boboY,
    width: boboWidth,
    height: boboHeight
}

// animation
let boboImages = [];
let currentImageIndex = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    // load images for animations
    loadImages();

    // switch images every 0.2s (=animation)
    setInterval(changeImage, 200);

    requestAnimationFrame(update);

}

function loadImages() {
    for (let i = 1; i <= 2; i++) {
        let img = new Image();
        img.src = `./graphics/bo_walk${i}.png`;
        boboImages.push(img);
    }

    boboImg = boboImages[currentImageIndex];
}

function changeImage() {
    currentImageIndex = (currentImageIndex + 1) % boboImages.length;
    boboImg = boboImages[currentImageIndex];
}

function update() {
    requestAnimationFrame(update);

    context.clearRect(0, 0, board.width, board.height);

    context.drawImage(boboImg, bobo.x, bobo.y, bobo.width, bobo.height);
}