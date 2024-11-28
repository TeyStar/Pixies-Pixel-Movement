// battleMode.js

function getRandomChance() {
    return Math.random() * 100;
}

function blendColors(color1, color2) {
    const blendMap = { 'redgreen': 'yellow', 'redblue': 'magenta', 'greenblue': 'cyan' };
    return blendMap[color1 + color2] || blendMap[color2 + color1] || color1;
}

function handleBattle(pixel, otherPixel) {
    const primaryColors = ['red', 'green', 'blue'];
    const secondaryColors = ['yellow', 'magenta', 'cyan'];

    if (pixel.color === otherPixel.color) {
        return; // No change if they are the same color
    }

    let chance = getRandomChance();

    if (primaryColors.includes(pixel.color) && primaryColors.includes(otherPixel.color)) {
        if (chance < 65) {
            otherPixel.color = pixel.color;
        } else if (chance < 85) {
            pixel.color = blendColors(pixel.color, otherPixel.color);
            otherPixel.color = pixel.color;
        } else {
            pixel.color = otherPixel.color;
        }
    } else if (primaryColors.includes(pixel.color) && secondaryColors.includes(otherPixel.color)) {
        if (chance < 65) {
            otherPixel.color = pixel.color;
        } else {
            pixel.color = otherPixel.color;
        }
    } else if (secondaryColors.includes(pixel.color) && primaryColors.includes(otherPixel.color)) {
        if (chance < 65) {
            otherPixel.color = pixel.color;
        } else {
            pixel.color = otherPixel.color;
        }
    } else if (secondaryColors.includes(pixel.color) && secondaryColors.includes(otherPixel.color)) {
        if (chance < 65) {
            otherPixel.color = pixel.color;
        } else {
            pixel.color = otherPixel.color;
        }
    }
}

function updateScores(pixels) {
    const colorCounts = { red: 0, green: 0, blue: 0, yellow: 0, magenta: 0, cyan: 0 };
    pixels.forEach(pixel => {
        colorCounts[pixel.color] = (colorCounts[pixel.color] || 0) + 1;
    });
    document.getElementById('redScore').textContent = `Red: ${colorCounts.red}`;
    document.getElementById('greenScore').textContent = `Green: ${colorCounts.green}`;
    document.getElementById('blueScore').textContent = `Blue: ${colorCounts.blue}`;
    document.getElementById('yellowScore').textContent = `Yellow: ${colorCounts.yellow}`;
    document.getElementById('magentaScore').textContent = `Magenta: ${colorCounts.magenta}`;
    document.getElementById('cyanScore').textContent = `Cyan: ${colorCounts.cyan}`;
}
