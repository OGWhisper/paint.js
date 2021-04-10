const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

var fillStyle = "black";
var strokeWidth = 2;
var strokeStyle = "black";
var font = "20px Georgia";
var textAlign = "center";

var width = null;
var height = null;

var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;

var frames = [];

var frameRate = 200;

var fps = frameRate;

var lastFrame = new Date().getTime();

var draw = () => { }

const setBounds = (w, h) => {
    width = w;
    height = h;
}

const setFont = (z) => {
    font = z;
}

const setTextAlign = (z) => {
    textAlign = z;
}

const setFillStyle = (z) => {
    if (z == false) z = 'rgba(0,0,0,0)';
    fillStyle = z;
}

const setStrokeStyle = (z) => {
    if (z == false) z = 'rgba(0,0,0,0)';
    strokeStyle = z;
}

const setStrokeWidth = (z) => {
    strokeWidth = z;
}

const line = (x1, y1, x2, y2, t) => {
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = strokeWidth;

    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.closePath();
    ctx.stroke();
}

const ellipse = (x, y, r) => {
    ctx.beginPath();

    ctx.arc(x, y, r, 0, 2 * Math.PI)

    ctx.closePath();

    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = strokeWidth;

    ctx.fill();

    ctx.stroke();
}

const rect = (x, y, w, h) => {
    ctx.beginPath();

    ctx.rect(x, y, w, h);
    ctx.closePath();


    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = strokeWidth;

    ctx.fill();

    ctx.stroke();
}

const triangle = (points) => {
    ctx.beginPath();

    ctx.moveTo(...points[0]);
    ctx.lineTo(...points[1]);
    ctx.lineTo(...points[2]);
    ctx.lineTo(...points[0]);

    ctx.closePath();

    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = strokeWidth;

    ctx.fill();

    ctx.stroke();
}

const text = (text, x, y) => {
    ctx.font = font;
    ctx.textAlign = textAlign;
    ctx.fillText(text, x, y);
}

const mesh = (width, height, points, g) => {
    for (let x = 0; x < width - 1; x++) {
        for (let y = 0; y < height - 1; y++) {
            if (g) setFillStyle(points[x][y][2]);

            triangle([
                points[x][y].slice(0, 2),
                points[x + 1][y].slice(0, 2),
                points[x][y + 1].slice(0, 2),
            ]);

            if (g) setFillStyle(points[x][y][3]);

            triangle([
                points[x + 1][y].slice(0, 2),
                points[x + 1][y + 1].slice(0, 2),
                points[x][y + 1].slice(0, 2),
            ]);
        }
    }
}

const tick = () => {
    lastDuration = typeof frameDuration == typeof 0 ? frameDuration : 1000 / frameRate;

    let currentFrame = new Date().getTime();
    frameDuration = currentFrame - lastFrame;
    lastFrame = currentFrame;
    preDraw()

    frames.push(1000 / frameDuration);
    if (frames.length > 200) frames.shift()

    fps = 1000 / (frameDuration + 0.01)

    let next = 1000 / (frameRate * 2 - 1000 / lastDuration);

    setTimeout(() => {
        tick();
    }, next);
}

const preDraw = () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = width ?? canvasWidth;
    canvas.height = height ?? canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = strokeStyle;
    ctx.filllStyle = fillStyle;
    ctx.lineWidth = strokeWidth;

    draw();
}

const procedural = (params) => {
    //return perlin.get(params[0], params[1]);
    let sum = 0;

    sum += Math.abs(perlin.get(params[0]/16, params[1]/16));
    sum += Math.abs(perlin.get(params[0]/8, params[1]/8))/2;
    sum += Math.abs(perlin.get(params[0]/4, params[1]/4))/4;

    return sum;
}

const rgbaHEX = (params) => {
    params = params.map(x => {
        x = parseInt(x).toString(16);

        if (x.length == 1) x = '0' + x;

        return x;
    });

    return '#' + params.reduce((a, b) => a + b);
}

const hexRGBA = (hex) => {
    hex = hex.replace('#', '');

    return hex.match(/.{2}/g).map(x => parseInt(x, 16));
}

const formatRGBA = (z) => {
    return `rgb${z.length == 4 ? 'a' : ''}(${z.join(', ')})`;
}

const pythagoras = (z) => {
    return z.map(x => x ** 2).reduce((a, b) => a + b) ** 0.5;
}

const binomialInterpolation = (start, end, depth) => {
    let n = [];

    for (let x = 0; x < start.length; x++) {
        let s = start[x];
        let e = end[x];
        let d = (e - s) * depth;

        n.push(s + d);
    }

    return n;
}

tick();