// <script src="battleMode.js"></script>

const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');

let pixelSize = 40, areaSize = 20, speed = 10, pixelCount = 100, animationFrameId, soloMode = true, battleMode = false;
const pixels = [], colors = ['red', 'green', 'blue'];

document.getElementById('solo').checked = soloMode;
document.getElementById('battle').checked = battleMode;

function initializePixels() {
    pixels.length = 0;
    const positions = [
        { x: Math.floor(areaSize / 4), y: Math.floor(areaSize / 4), color: 'red' },
        { x: Math.floor(3 * areaSize / 4), y: Math.floor(areaSize / 4), color: 'green' },
        { x: Math.floor(areaSize / 2), y: Math.floor(3 * areaSize / 4), color: 'blue' }
    ];
    positions.forEach(pos => {
        for (let i = 0; i < pixelCount; i++) {
            pixels.push({ x: Math.floor(Math.random() * (areaSize / 4)) + pos.x, y: Math.floor(Math.random() * (areaSize / 4)) + pos.y, color: pos.color });
        }
    });
}


function drawPixel(pixel) {
    ctx.fillStyle = pixel.color;
    ctx.fillRect(pixel.x * pixelSize, pixel.y * pixelSize, pixelSize, pixelSize);
}

function movePixel(pixel) {
    const direction = Math.floor(Math.random() * 4);
    if (direction < 2) pixel.x = (pixel.x + (direction === 0 ? 1 : -1) + areaSize) % areaSize;
    else pixel.y = (pixel.y + (direction === 2 ? 1 : -1) + areaSize) % areaSize;
}

function blendColors(color1, color2) {
    const blendMap = { 'redgreen': 'yellow', 'redblue': 'magenta', 'greenblue': 'cyan' };
    return blendMap[color1 + color2] || blendMap[color2 + color1] || color1;
}

function checkWhitePixel(overlapColors) {
    return overlapColors.size === 3 ? 'white' : null;
}

function checkOverlap() {
    pixels.forEach((pixel, i) => {
        let overlapColors = new Set([pixel.color]);
        pixels.forEach((otherPixel, j) => {
            if (i !== j && pixel.x === otherPixel.x && pixel.y === otherPixel.y) {
                overlapColors.add(otherPixel.color);
                if (battleMode) {
                    handleBattle(pixel, otherPixel);
                }
            }
        });
        const whitePixel = checkWhitePixel(overlapColors);
        if (whitePixel) {
            pixel.displayColor = whitePixel;
        } else {
            pixel.displayColor = pixel.color;
        }
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    (soloMode ? [pixels[Math.floor(Math.random() * pixels.length)]] : pixels).forEach(movePixel);
    checkOverlap();
    pixels.forEach(pixel => {
        let displayColor = pixel.displayColor || pixel.color;
        pixels.forEach(otherPixel => {
            if (pixel !== otherPixel && pixel.x === otherPixel.x && pixel.y === otherPixel.y) displayColor = blendColors(displayColor, otherPixel.color);
        });
        drawPixel({ ...pixel, color: displayColor });
    });
    if (battleMode) {
        updateScores(pixels);
    }
    animationFrameId = setTimeout(() => requestAnimationFrame(update), 1000 / speed);
}

function updateCanvas() {
    pixelSize = parseInt(document.getElementById('pixelSize').value);
    areaSize = parseInt(document.getElementById('areaSize').value);
    speed = parseInt(document.getElementById('speed').value);
    pixelCount = parseInt(document.getElementById('pixelCount').value);
    canvas.width = areaSize * pixelSize;
    canvas.height = areaSize * pixelSize;
    initializePixels();
    clearTimeout(animationFrameId);
    update();
}

['pixelSize', 'areaSize', 'pixelCount'].forEach(id => document.getElementById(id).addEventListener('input', updateCanvas));
document.getElementById('speed').addEventListener('input', () => speed = parseInt(document.getElementById('speed').value));
document.getElementById('solo').addEventListener('change', (event) => soloMode = event.target.checked);
document.getElementById('battle').addEventListener('change', (event) => {
    battleMode = event.target.checked;
    document.getElementById('scoreBoard').style.display = battleMode ? 'block' : 'none';
});

initializePixels();
update();
