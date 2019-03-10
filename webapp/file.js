let imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);

let canvas = document.getElementById('canvas');

function clearSmallCanvas() {
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,28,28)
}

function handleImage(e){
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = "#FFF";

  clearBigCanvas()
  clearSmallCanvas()

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

    sendData(data)
  }
  reader.readAsDataURL(e.target.files[0]);
}


