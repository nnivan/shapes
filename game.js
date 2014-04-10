var requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) { setTimeout (callback, 1000 / 30); };

var canvas = document.getElementById("canvas-id");
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext("2d");

function Vector(_x, _y){
    this.x = _x;
    this.y = _y;

    this.add = function(vec2){
        this.x += vec2.x;
        this.y += vec2.y;
    }
}

function Shaper(){
    this.shape = [];

    this.newShape = function newShape(_nodes,_edges,_color){
        var shape = {};
        if(_edges != undefined){
            shape = _edges;
            if(_color == undefined) shape.color = prompt("color","red");
            else shape.color = _color;
            this.shape.push(shape);
        }else{
            var consoled = ".newShape(" + _nodes + " ,[";
            shape = [];
            if(_color == undefined) shape.color = prompt("color","red");
            else shape.color = _color;
            for(var i=0; i<_nodes; i++){
                var a = eval("["+prompt("x, y")+"]");
                shape.push(new Vector(a[0], a[1]));
                if(i==0) consoled += " new Vector(" + a[0] + ", " + a[1] + ")";
                else consoled += ", new Vector(" + a[0] + ", " + a[1] + ")"
            }
            consoled+="]);";
            console.log(consoled);
            this.shape.push(shape);
        }
    }

    this.drawShape = function drawShape(shape){
        context.beginPath();
        for(var i=0;i<shape.length;i++){
            context.lineTo(shape[i].x,shape[i].y);
        }
        context.fillStyle = shape.color;
        context.fill();
        context.closePath();
    }
}

window.addEventListener("keydown", function (args) {

}, false);

window.addEventListener("keyup", function (args) {

}, false);

window.addEventListener("mousemove", function (args) {
}, false);

var Shapes = new Shaper();
Shapes.newShape(4 ,[ new Vector(50, 50), new Vector(10, 50), new Vector(10, 10), new Vector(50, 10)], "red");;

function update() {

	setTimeout(update, 10);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;

    for(var i=0;i<Shapes.shape.length;i++) Shapes.drawShape(Shapes.shape[i]);

    requestAnimationFrame(draw);
}
update();
draw();
