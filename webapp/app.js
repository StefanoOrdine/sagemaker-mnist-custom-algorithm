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

function sendData() {
  var data = context.getImageData(0, 0, context.canvas.width, context.canvas.height).data
  data = R.map(R.compose(R.ifElse(R.lt(0), R.flip(R.divide)(3), R.identity), R.sum, R.slice(0,3)), R.splitEvery(4, data))

  data = R.compose(resize, R.splitEvery(280))(data)

  let small_context = document.getElementById('canvas').getContext("2d");
  small_context.clearRect(0, 0, 28, 28); // Clears the canvas
  small_context.fillStyle = "#FFF";

  for (let i=0; i<28; i++) {
    for (let j=0; j<28; j++) {
      if (data[i][j] > 0) {
        small_context.fillRect(j,i,1,1);
      }
    }
  }

  let image = small_context.getImageData(0, 0, 28, 28)
  let com = center_of_mass(28,28,image)

  $('#center_of_mass').html(`x: ${com[0]} y: ${com[1]}`)

  data = image.data
  data = R.map(R.compose(R.ifElse(R.lt(0), R.flip(R.divide)(3), R.identity), R.sum, R.slice(0,3)), R.splitEvery(4, data))

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

let imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);


function handleImage(e){
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = "#FFF";
  ctx.clearRect(0,0,28,28)

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

    let image = ctx.getImageData(0, 0, 28, 28)
    let data = image.data
    let com = center_of_mass(28,28,image)

    $('#center_of_mass').html(`x: ${com[0]} y: ${com[1]}`)

    data = R.map(R.compose(R.ifElse(R.lt(0), R.flip(R.divide)(3), R.identity), R.sum, R.slice(0,3)), R.splitEvery(4, data))

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
  reader.readAsDataURL(e.target.files[0]);
}

function resize(input) {
  let width = 280;
  let height = 280;

  let thumbwidth = 28;
  let thumbheight = 28;

  let output = R.repeat(null, 28).map(i => R.repeat(0, 28))

  let xscale = (thumbwidth+0.0) / width;
  let yscale = (thumbheight+0.0) / height;
  let threshold = 0.5 / (xscale * yscale);
  let yend = 0.0;

  for (let f = 0; f < thumbheight; f++) // y on output
  {
      let ystart = yend;
      yend = (f + 1) / yscale;
      if (yend >= height) yend = height - 0.000001;
      let xend = 0.0;
      for (let g = 0; g < thumbwidth; g++) // x on output
      {
          let xstart = xend;
          xend = (g + 1) / xscale;
          if (xend >= width) xend = width - 0.000001;
          let sum = 0.0;
          for (let y = parseInt(ystart); y <= parseInt(yend); ++y)
          {
              let yportion = 1.0;
              if (y == parseInt(ystart)) yportion -= ystart - y;
              if (y == parseInt(yend)) yportion -= y+1 - yend;
              for (let x = parseInt(xstart); x <= parseInt(xend); ++x)
              {
                  let xportion = 1.0;
                  if (x == parseInt(xstart)) xportion -= xstart - x;
                  if (x == parseInt(xend)) xportion -= x+1 - xend;
                  sum += input[y][x] * yportion * xportion;
              }
          }
          output[f][g] = (sum > threshold) ? 1 : 0;
      }
  }

  return output
}

function center_of_mass(width, height, data_a)
{
  //Calculate center of mass
  var x_coords = [];
  var y_coords = [];

  for (let i = 0; i < data_a.data.length; i+=4)
  {
    //for each pixel
    var x_pos = (i/4) % width;
    var y_pos = (i/4) / height;
    var r = data_a.data[i];
    var g = data_a.data[i+1];
    var b = data_a.data[i+2];
    if (r == 255 && g == 255 && b == 255)
    {
      //red pixel
      x_coords.push(x_pos);
      y_coords.push(y_pos);
    }
  }

  //Average of x_coords and y_coords
  var center_x = 0;
  var center_y = 0;

  for (let i = 0; i < x_coords.length; i++) {
    center_x += x_coords[i];
  }
  center_x = Math.ceil(center_x / x_coords.length);

  for (let i = 0; i < y_coords.length; i++) {
    center_y += y_coords[i];
  }
  center_y = Math.ceil(center_y / y_coords.length);

  return [center_x, center_y];
}
