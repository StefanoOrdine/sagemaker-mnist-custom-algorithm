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

  data = R.map(R.compose(R.ifElse(R.lt(0), R.flip(R.divide)(3), R.identity), R.sum, R.slice(0,3)), R.splitEvery(4, data))

  console.log(data)


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

  context.strokeStyle = "#fff";
  context.lineJoin = "round";
  context.lineWidth = 2.8;

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

let imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);


function handleImage(e){
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = "#FFF";

  var reader = new FileReader();
  reader.onload = function(event){
    let img = R.splitEvery(28, atob(event.srcElement.result.split(",").slice(-1).pop().trim()))

    for (let i=0; i<28; i++) {
      for (let j=0; j<28; j++) {
        if (img[i][j].charCodeAt(0)) {
          ctx.fillRect(j,i,1,1);
        }
      }
    }
  }
  reader.readAsDataURL(e.target.files[0]);
}

