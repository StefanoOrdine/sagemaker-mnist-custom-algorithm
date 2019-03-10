function getFigure() {
  let big = document.getElementById('big').getContext('2d')
  let small = document.getElementById('canvas').getContext('2d')

  data = resizeAndCopyImage(280, 280, 28, 28, big, small)

  let image = small.getImageData(0, 0, 28, 28)
  let com = center_of_mass(28,28,image)

  $('#center_of_mass').html(`x: ${com[0]} y: ${com[1]}`)

  return sendData(R.flatten(data))
}

