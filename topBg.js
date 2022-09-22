
const canvas = document.getElementById('topBg'),
    context = canvas.getContext('2d');

let scale = 1, // device pixel ratio
    width,
    height;
height = 200;

let layers = [];

let horizontalCount = 25;
let unitSize = width / horizontalCount;
let mouseX;

setup();
resize();
step();

window.onresize = resize;
document.onmousemove = handleMouseMove;

function map(value,in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function handleMouseMove(event)
{
    mouseX = event.clientX;
}

function setup() {
    addLayers();
}

function addLayers() {
    addLayer(80, 90, '#2d2b4d');
    addLayer(70, 80, '#593863');
    addLayer(60, 70, '#b94e6d');
    addLayer(50, 60, '#de6461');
    addLayer(40, 50, '#f5854f');
    addLayer(30, 40, '#fbae3c');
}

function addLayer(minY, maxY, color)
{
    for (let i = 0; i < horizontalCount; i++) {
        layers.push({
            x: i,
            currentHeight: (Math.random() * maxY) + minY,
            progress: 0,
            speed: (Math.random() * 0.003) + 0.01,
            color: color,
            minY: minY,
            maxY: maxY
        });
        layers[i].progress = map(layers[i].currentHeight, minY, maxY, 0.0, 1.0);
    }
}

function resize() {

    scale = window.devicePixelRatio || 1;

    width = window.innerWidth * scale;
    height = window.innerHeight * scale;

    canvas.width = width;
    //canvas.height = height;
    //console.log(height);
    horizontalCount = Math.floor(width / 50);

    layers = [];
    addLayers();

    unitSize = width / horizontalCount;
}

function step() {

    context.clearRect(0, 0, width, height);

    update();
    render();

    requestAnimationFrame(step);

}

function update()
{
    layers.forEach((block) =>
    {
        block.progress += block.speed;
        block.currentHeight = map(Math.sin(block.progress), 0.0, 1.0, block.minY, block.maxY);

    })
}


function render() {
    let maxDistance = 150;
    layers.forEach((block) =>
    {
        context.fillStyle = block.color;
        let mouseDistance = Math.abs(block.x * unitSize - mouseX);
        if (mouseDistance > maxDistance) { mouseDistance = 0; } else { mouseDistance = (maxDistance - mouseDistance); }
        context.fillRect(unitSize * block.x, 0, width / horizontalCount, block.currentHeight + 0.5 * mouseDistance);
    })
}