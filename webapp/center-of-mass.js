
window.center_of_mass = R.curry(function(width, height, data_a) {

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
})
