
window.image_resize = R.curry(function(width, height, thumbwidth, thumbheight, input) {
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
})

window.draw_to_canvas = R.curry(function(width, height, canvas, data) {
  clearSmallCanvas()
  canvas.fillStyle = "#fff";

  for (let i=0; i<28; i++) {
    for (let j=0; j<28; j++) {
      if (data[i][j] > 0) {
        canvas.fillRect(j,i,1,1);
      }
    }
  }
})

window.resizeAndCopyImage = R.curry(function(from_x, from_y, to_x, to_y, from_canvas, to_canvas) {
  var data = from_canvas.getImageData(0, 0, from_x, from_y).data
  data = R.map(R.compose(R.ifElse(R.lt(0), R.flip(R.divide)(3), R.identity), R.sum, R.slice(0,3)), R.splitEvery(4, data))

  data = R.compose(image_resize(from_x, from_y, to_x, to_y), R.splitEvery(from_x))(data)

  draw_to_canvas(28, 28, to_canvas, data)

  return data;
})
