let context = document.getElementById('canvas').getContext("2d");

$('#canvas').mousedown(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;

  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
});

$('#canvas').mousemove(function(e){
  if(paint){
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});

$('#canvas').mouseup(function(e){
  paint = false;
});

$('#canvas').mouseleave(function(e){
  paint = false;
});

var clickX = []
var clickY = []
var clickDrag = []
var paint;

function sendData() {
  var data = context.getImageData(0, 0, context.canvas.width, context.canvas.height).data

  data = R.map(R.compose(R.ifElse(R.lt(0), R.always(255), R.identity), R.sum), R.splitEvery(4, data))

  data = new Uint8Array(data);

  $.ajax({
    url: 'http://localhost:8080/invocations',
    type: 'POST',
    dataType:'json',
    contentType: 'application/x-www-form-urlencoded',
    data: data,
    processData:false,
    success: function(data) {
      //data = JSON.parse(data)
      console.log(data)

      $('#result').html(data.output)
    },
    error: console.error
  });
}

function clearCanvas() {
  clickX = []
  clickY = []
  clickDrag = []

  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
}

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
  //context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.strokeStyle = "#000";
  context.lineJoin = "round";
  context.lineWidth = 2.4;

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

