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

    this.crossProduct = function (vec2, vec3){
    	return (vec2.x - this.x) * (vec3.y - this.y) - (vec2.y - this.y) * (vec3.x - this.x);
    }
}
var m = new Vector();
var mScrol = -1;

function Shaper(){
    this.shape = [];
    this.isImDrawing = false;
    this.select;

    this.nodes_Clicker = [];
    this.ClickShape = function ClickShape(add){
        //console.log(add);
        if(this.nodes_Clicker.length<3 || (add.x-this.nodes_Clicker[0].x)*(add.x-this.nodes_Clicker[0].x)
            +(add.y-this.nodes_Clicker[0].y)*(add.y-this.nodes_Clicker[0].y)>10*10){
            this.nodes_Clicker.push(add);
        }else{
            this.newShape(this.nodes_Clicker.length,this.nodes_Clicker);
            this.nodes_Clicker = [];
            this.isImDrawing = false;
        }
    }

    this.isItColide = function isItColide(shape,vec){
    	var pres = 0;
    	for(var i=0;i<shape.length-1;i++){
    		if(vec.crossProduct(shape[i],shape[i+1])>=0 && (vec.y >= shape[i].y && vec.y <= shape[i+1].y)
    		 ||vec.crossProduct(shape[i],shape[i+1])<=0 && (vec.y <= shape[i].y && vec.y >= shape[i+1].y)){
    			pres++;
    		}
    	}
		if(vec.crossProduct(shape[0],shape[shape.length-1])>=0 &&
		 (vec.y >= shape[0].y && vec.y<=shape[shape.length-1].y)
		 ||vec.crossProduct(shape[0],shape[shape.length-1])<=0 &&
		  (vec.y <= shape[0].y && vec.y>=shape[shape.length-1].y)){
			pres++;
		}
    	return pres%2!=0;
    }

    this.OSrotate = function OSrotate(shape){
        for(var i=0;i<shape.length;i++){
            shape[i].x = shape[i].x + 2*(shape.averagePoint.x - shape[i].x);
            //shape[i].y = shape[i].y + 2*(shape.averagePoint.y - shape[i].y);
        }
    }

    this.rotate = function rotate(shape,angle){
        var rad = angle * Math.PI / 180;
        //console.log(shape);
        for(var i=0;i<shape.length;i++){
            var rotX = (shape[i].x - shape.averagePoint.x) * Math.cos(rad) -
             (shape[i].y - shape.averagePoint.y) * Math.sin(rad);
            var rotY = (shape[i].x - shape.averagePoint.x) * Math.sin(rad) +
             (shape[i].y - shape.averagePoint.y) * Math.cos(rad);
            
            shape[i].x = rotX + shape.averagePoint.x;
            shape[i].y = rotY + shape.averagePoint.y;
        }
        //console.log(rotX, rotY);
    }

    this.move = function move(shape,moveVec){
        shape.averagePoint.add(moveVec);
        for(var i=0;i<shape.length;i++){
            shape[i].add(moveVec);
        }
    }

    this.newShape = function newShape(_nodes,_edges,_color){
        S.select = -1;;
    	if(_nodes==undefined){
	    	this.isImDrawing = true;
            return 1;
    	}else{
	        var shape = {};
	        if(_edges != undefined){
	            var consoled = "S.newShape(" + _nodes + " ,[";
	            shape = _edges;
	            for(var i=0;i<_edges.length;i++){
	                consoled+="new Vector("+_edges[i].x+", "+_edges[i].y+")";
	                if(i + 1 != _edges.length) consoled+=", ";
	            }
	        }else{
	            var consoled = "S.newShape(" + _nodes + " ,[";
	            shape = [];
	            for(var i=0; i<_nodes; i++){
	                var a = eval("["+prompt("x, y")+"]");
	                shape.push(new Vector(a[0], a[1]));
	                if(i==0) consoled += " new Vector(" + a[0] + ", " + a[1] + ")";
	                else consoled += ", new Vector(" + a[0] + ", " + a[1] + ")"
	            }
	        }
            if(_color == undefined) shape.color = prompt("color","red");
            else shape.color = _color;
            consoled+="], "+'"'+ shape.color+'"'+");";
            var _averagePoint = new Vector(0,0);
            for(var i = 0; i < shape.length; i++){
                _averagePoint.add(shape[i]);
            }
            shape.averagePoint = new Vector(_averagePoint.x/shape.length, _averagePoint.y/shape.length);
            //console.log(shape.averagePoint);
            console.log(consoled);
            this.shape.push(shape);
	    }
    }

    this.drawShape = function drawShape(shape){
    	if(shape == this.select){
    		context.shadowColor = "white";
    		context.shadowBlur = 20;
    	}else{
    		context.shadowColor = shape.color;
    		context.shadowBlur = 10;
    	}
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

var isKeyPressed = [];
window.addEventListener("keydown", function (args) {
    isKeyPressed[args.keyCode] = true;
}, false);

window.addEventListener("keyup", function (args) {
    isKeyPressed[args.keyCode] = false;

    if(S.select != -1){
        if(args.keyCode==32){
            S.OSrotate(S.select);
        }
    }

}, false);

window.addEventListener("mousedown", function (args) {
	if(mScrol == -1){
		mScrol = new Vector(args.x, args.y);
	}

    if(S.isImDrawing){
        S.ClickShape(new Vector(args.x,args.y));
    }else{
        var s = false;
        for(var i=0;i<S.shape.length;i++){
            if(S.isItColide(S.shape[i],m)){
                S.select = S.shape[i];
                s = true;
            }
        }
        if(!s){
        	S.select = -1;
        }
    }
}, false);
window.addEventListener("mousemove", function (args) {
    m.x = args.x;
    m.y = args.y;
    if(mScrol != -1){
    	if(S.select != -1){
			if(S.isItColide(S.select, mScrol)){
					if(S.select != -1){
					//console.log(m,mScrol);
						S.move(S.select,new Vector(m.x - mScrol.x, m.y - mScrol.y));
						mScrol.x = m.x;
						mScrol.y = m.y;
				}
			}
		}
	}
}, false);
window.addEventListener("scrolldown", function (args) {
	console.log(args);
}, false);
window.addEventListener("mouseup", function (args) {
	mScrol = -1;
    /*if(S.isImDrawing){
        S.ClickShape(new Vector(args.x,args.y));
    }else{
        var s = false;
        for(var i=0;i<S.shape.length;i++){
            if(S.isItColide(S.shape[i],m)){
                S.select = S.shape[i];
                s = true;
            }
        }
        if(!s){
        	S.select = -1;
        }
    }*/
}, false);

var S = new Shaper();
/*S.newShape(4 ,[ new Vector(50, 50), new Vector(100, 100), new Vector(100, 50), new Vector(50, 100)], "red");
S.newShape();*/


S.newShape(3 ,[ new Vector(300, 400), new Vector(200, 400), new Vector(200, 500)], "#900");
S.newShape(4 ,[ new Vector(300, 100), new Vector(400, 100), new Vector(400, 300), new Vector(300, 400)], "#f00");
S.newShape(4 ,[ new Vector(450, 400), new Vector(500, 400), new Vector(500, 500), new Vector(350, 500)], "#b00");
S.newShape(5 ,[ new Vector(200, 500), new Vector(400, 300),
 new Vector(400, 400), new Vector(450, 400), new Vector(350, 500)], "#d00");

var lastLog = true;
function update() {
    if(S.select != -1){
        if(isKeyPressed[81]){
            S.rotate(S.select,-1);
        }
        if(isKeyPressed[69]){
            S.rotate(S.select,1);
        }
        if(isKeyPressed[87]){
            S.move(S.select,new Vector(0,-1));
        }
        if(isKeyPressed[83]){
            S.move(S.select,new Vector(0,1));
        }
        if(isKeyPressed[65]){
            S.move(S.select,new Vector(-1,0));
        }
        if(isKeyPressed[68]){
            S.move(S.select,new Vector(1,0));
        }
    }
	/*var __isitcolide = true;
	for(var i=0;i<S.shape.length;i++) 
		if(S.isItColide(S.shape[i])==false)
			__isitcolide = false;

	if(__isitcolide != lastLog){
		if(__isitcolide) console.log("izleze");
		else console.log("vleze");
		lastLog = __isitcolide;
	}*/
	setTimeout(update, 10);
}

function draw() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
    context.fillStyle = "white";

    for(var i=0;i<S.shape.length;i++) S.drawShape(S.shape[i]);
    	S.drawShape(S.select);

    for(var i=0;i<S.nodes_Clicker.length;i++){
        context.beginPath();
        for(var i=0;i<S.nodes_Clicker.length;i++){
            context.lineTo(S.nodes_Clicker[i].x,S.nodes_Clicker[i].y);
        }
        context.lineTo(m.x,m.y);
        context.stroke();
        context.closePath();
    }

    context.fillStyle = "white";
    for(var j=0;j<S.shape.length;j++){
        for(var i=0;i<S.shape[j].length;i++){
            context.beginPath();
            context.arc(S.shape[j][i].x, S.shape[j][i].y, 3, 0, 2*Math.PI);
            context.fill();
            context.closePath();
        }
    }

    context.fillStyle = "white";
    context.strokeStyle = "white";

    context.beginPath();
    context.arc(m.x, m.y, 10, 0*Math.PI, 2*Math.PI);
    context.stroke();
    context.closePath();
    context.fillRect(m.x-1, m.y-1, 2, 2);

    if(S.isImDrawing){
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
