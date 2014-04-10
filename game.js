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
var m = new Vector();

function Shaper(){
    this.shape = [];

    this.nodes_Clicker = [];
    this.ClickShape = function ClickShape(add){
        console.log(add);
        if(this.nodes_Clicker.length<3 || (add.x-this.nodes_Clicker[0].x)*(add.x-this.nodes_Clicker[0].x)+(add.y-this.nodes_Clicker[0].y)*(add.y-this.nodes_Clicker[0].y)>20*20){
            this.nodes_Clicker.push(add);
        }else{
            this.newShape(this.nodes_Clicker.length,this.nodes_Clicker);
            this.nodes_Clicker = [];
        }
    }

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

window.addEventListener("mouseup", function (args) {
    Shapes.ClickShape(new Vector(args.x,args.y));
}, false);
window.addEventListener("mousemove", function (args) {
    m.x = args.x;
    m.y = args.y;
}, false);

var Shapes = new Shaper();
Shapes.newShape(4 ,[ new Vector(50, 50), new Vector(10, 50), new Vector(10, 10), new Vector(50, 10)], "red");

function update() {

	setTimeout(update, 10);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;

    for(var i=0;i<Shapes.shape.length;i++) Shapes.drawShape(Shapes.shape[i]);

    for(var i=0;i<Shapes.nodes_Clicker.length;i++){
        context.beginPath();
        for(var i=0;i<Shapes.nodes_Clicker.length;i++){
            context.lineTo(Shapes.nodes_Clicker[i].x,Shapes.nodes_Clicker[i].y);
        }
        context.lineTo(m.x,m.y);
        context.stroke();
        context.closePath();
    }

    requestAnimationFrame(draw);
}
update();
draw();
