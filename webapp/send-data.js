
function sendData(data) {
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

