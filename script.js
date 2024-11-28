const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');

let pixelSize = 1;
let areaSize = 20;
let speed = 5;
let animationFrameId;

const pixels = [];
const colors = ['red', 'green', 'blue'];

function initializePixels() {
    pixels.length = 0; // Clear existing pixels

    // Initialize red pixels in the bottom left corner
    for (let i = 0; i < 100; i++) {
        pixels.push({ x: Math.floor(Math.random() * (areaSize / 2)), y: Math.floor(Math.random() * (areaSize / 2)) + areaSize / 2, color: 'red' });
    }

    // Initialize green pixels in the top right corner
    for (let i = 0; i < 100; i++) {
        pixels.push({ x: Math.floor(Math.random() * (areaSize / 2)) + areaSize / 2, y: Math.floor(Math.random() * (areaSize / 2)), color: 'green' });
    }

    // Initialize blue pixels in the bottom right corner
    for (let i = 0; i < 100; i++) {
        pixels.push({ x: Math.floor(Math.random() * (areaSize / 2)) + areaSize / 2, y: Math.floor(Math.random() * (areaSize / 2)) + areaSize / 2, color: 'blue' });
    }
}

function drawPixel(pixel, color) {
    ctx.fillStyle = color;
    ctx.fillRect(pixel.x * pixelSize, pixel.y * pixelSize, pixelSize, pixelSize);
}

function movePixel(pixel) {
    const direction = Math.floor(Math.random() * 4);
    switch (direction) {
        case 0: pixel.x = (pixel.x + 1) % areaSize; break; // move right
        case 1: pixel.x = (pixel.x - 1 + areaSize) % areaSize; break; // move left
        case 2: pixel.y = (pixel.y + 1) % areaSize; break; // move down
        case 3: pixel.y = (pixel.y - 1 + areaSize) % areaSize; break; // move up
    }
}

function blendColors(color1, color2) {
    const blendMap = {
        'redgreen': 'yellow',
        'redblue': 'magenta',
        'greenblue': 'cyan',
        'greenred': 'yellow',
        'bluered': 'magenta',
        'bluegreen': 'cyan'
    };
    return blendMap[color1 + color2] || blendMap[color2 + color1] || color1;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < pixels.length; i++) {
        movePixel(pixels[i]);
        let displayColor = pixels[i].color;
        for (let j = i + 1; j < pixels.length; j++) {
            if (pixels[i].x === pixels[j].x && pixels[i].y === pixels[j].y) {
                displayColor = blendColors(displayColor, pixels[j].color);
            }
        }
        drawPixel(pixels[i], displayColor);
    }
    animationFrameId = setTimeout(() => requestAnimationFrame(update), 1000 / speed);
}

function updateCanvas() {
    pixelSize = parseInt(document.getElementById('pixelSize').value);
    areaSize = parseInt(document.getElementById('areaSize').value);
    speed = parseInt(document.getElementById('speed').value);
    canvas.width = areaSize * pixelSize;
    canvas.height = areaSize * pixelSize;
    initializePixels();
    clearTimeout(animationFrameId);
    update();
}

document.getElementById('pixelSize').addEventListener('input', updateCanvas);
document.getElementById('areaSize').addEventListener('input', updateCanvas);
document.getElementById('speed').addEventListener('input', () => {
    speed = parseInt(document.getElementById('speed').value);
});

initializePixels();
update();