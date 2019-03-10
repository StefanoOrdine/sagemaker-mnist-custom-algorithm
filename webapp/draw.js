
let context = document.getElementById('big').getContext("2d");

$('#big').mousedown(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;

  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
});

$('#big').mousemove(function(e){
  if(paint){
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});

$('#big').mouseup(function(e){
  paint = false;
});

$('#big').mouseleave(function(e){
  paint = false;
});

var clickX = []
var clickY = []
var clickDrag = []
var paint;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
  //context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.strokeStyle = "#fff";
  context.lineJoin = "round";
  context.lineWidth = 30;

  for(var i=0; i < clickX.length; i++) {
    context.beginPath();
    if(clickDrag[i] && i){
    context.moveTo(clickX[i-1], clickY[i-1]);
    }else{
    context.moveTo(clickX[i]-1, clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    context.stroke();
  }
}

window.clearBigCanvas = function() {
  clickX = []
  clickY = []
  clickDrag = []

  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
}


