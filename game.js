var requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) { setTimeout (callback, 1000 / 30); };

var canvas = document.getElementById("canvas-id");
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext("2d");
document.body.style.cursor = 'none';

function Vector(_x, _y){
    this.x = _x;
    this.y = _y;

    this.add = function(vec2){
        this.x += vec2.x;
        this.y += vec2.y;
    }

    this.crossProduct = function crossProduct(vec2, vec3){
    	return (vec2.x - this.x) * (vec3.y - this.y) - (vec2.y - this.y) * (vec3.x - this.x);
    }
}
var m = new Vector();

function Shaper(){
    this.shape = [];
    this.isItClicked = false;

    this.nodes_Clicker = [];
    this.ClickShape = function ClickShape(add){
        //console.log(add);
        if(this.nodes_Clicker.length<3 || (add.x-this.nodes_Clicker[0].x)*(add.x-this.nodes_Clicker[0].x)
            +(add.y-this.nodes_Clicker[0].y)*(add.y-this.nodes_Clicker[0].y)>10*10){
            this.nodes_Clicker.push(add);
        }else{
            this.newShape(this.nodes_Clicker.length,this.nodes_Clicker);
            this.nodes_Clicker = [];
            this.isItClicked = false;
        }
    }

    this.selecting = function selecting(shape){
    	var pres = 0;
    	for(var i=0;i<shape.length-1;i++){
    		if(m.crossProduct(shape[i],shape[i+1])>=0 && (m.y > shape[i].y && m.y < shape[i+1].y)
    		 ||m.crossProduct(shape[i],shape[i+1])<=0 && (m.y < shape[i].y && m.y > shape[i+1].y)){
    			pres++;
    		}
    	}
		if(m.crossProduct(shape[0],shape[shape.length-1])>=0 && (m.y > shape[0].y && m.y < shape[shape.length-1].y)
		 ||m.crossProduct(shape[0],shape[shape.length-1])<=0 && (m.y < shape[0].y && m.y > shape[shape.length-1].y)){
			pres++;
		}
    	return pres%2==0;
    }

    this.newShape = function newShape(_nodes,_edges,_color){
    	if(_nodes==undefined){
	    	this.isItClicked = true;
    	}else{
	        var shape = {};
	        if(_edges != undefined){
	            var consoled = ".newShape(" + _nodes + " ,[";
	            shape = _edges;
	            for(var i=0;i<_edges.length;i++){
	                consoled+="new Vector("+_edges[i].x+", "+_edges[i].y+")";
	                if(i + 1 != _edges.length) consoled+=", ";
	            }
	            if(_color == undefined) shape.color = prompt("color","red");
	            else shape.color = _color;
	            consoled+="], " +'"'+ shape.color +'"' +");";
	            console.log(consoled);
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
	            consoled+="], "+'"'+ shape.color+'"'+");";
	            console.log(consoled);
	            this.shape.push(shape);
	        }
	    }
    }

    this.drawShape = function drawShape(shape){
    	context.shadowBlur = 20;
    	context.shadowColor = shape.color;
        context.beginPath();
        for(var i=0;i<shape.length;i++){
            context.lineTo(shape[i].x,shape[i].y);
        }
        context.fillStyle = shape.color;
        context.fill();
        context.closePath();
    	context.shadowBlur = 0;
    }
}

window.addEventListener("keydown", function (args) {

}, false);

window.addEventListener("keyup", function (args) {
}, false);

window.addEventListener("mouseup", function (args) {
    if(S.isItClicked) S.ClickShape(new Vector(args.x,args.y));
}, false);
window.addEventListener("mousemove", function (args) {
    m.x = args.x;
    m.y = args.y;
}, false);

var S = new Shaper();
S.newShape(4 ,[ new Vector(50, 50), new Vector(10, 50), new Vector(10, 10), new Vector(50, 10)], "red");
S.newShape();

function update() {
	var __isitcolide = true;
	for(var i=0;i<S.shape.length;i++) 
		if(S.selecting(S.shape[i])==false)
			__isitcolide = false;

	console.log(__isitcolide);
	setTimeout(update, 50);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;

    for(var i=0;i<S.shape.length;i++) S.drawShape(S.shape[i]);

    for(var i=0;i<S.nodes_Clicker.length;i++){
        context.beginPath();
        for(var i=0;i<S.nodes_Clicker.length;i++){
            context.lineTo(S.nodes_Clicker[i].x,S.nodes_Clicker[i].y);
        }
        context.lineTo(m.x,m.y);
        context.stroke();
        context.closePath();
    }

    context.beginPath();
    context.arc(m.x, m.y, 10, 0*Math.PI, 2*Math.PI);
    context.stroke();
    context.closePath();

    if(S.isItClicked){
    	context.beginPath();
    	context.arc(m.x, m.y, 6, 0*Math.PI, 0.5*Math.PI);
	    context.stroke();
	    context.closePath();
    	context.beginPath();
    	context.arc(m.x, m.y, 6, 1*Math.PI, 1.5*Math.PI);
	    context.stroke();
	    context.closePath();
    }


    requestAnimationFrame(draw);
}
update();
draw();
