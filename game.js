var requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) { setTimeout (callback, 1000 / 30); };

var canvas = document.getElementById("canvas-id");
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext("2d");

window.addEventListener("keydown", function (args) {

}, false);

window.addEventListener("keyup", function (args) {

}, false);

window.addEventListener("mousemove", function (args) {
}, false);


function update() {

	setTimeout(update, 10);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;

    
}
update();
draw();
