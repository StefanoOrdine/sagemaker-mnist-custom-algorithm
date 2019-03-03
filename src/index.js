
const synaptic = require('synaptic');

const express = require('express')
const fileUpload = require('express-fileupload')

// loaded at position by sagemaker
const data = require('/opt/ml/model/network.json');

const network = synaptic.Network.fromJSON(data);

const app = express()

const conv = (arr) => arr.indexOf(Math.max(...arr));

app.use(fileUpload());

app.get('/ping', (req, res) => res.send(''))
app.post('/invocations', (req, res) => {
  if (!req.files || Object.keys(req.files).length == 0) {
    return res.status(400).json('No files were uploaded.');
  }

  let input = req.files[Object.keys(req.files).pop()].data.map(i => parseInt(i)/255)

  let result = network.activate(input);
  let converted = conv(result);

  return res.json({
    output: converted,
  })
})

app.listen(8080, () => console.log(`Example app listening on port 8080!`))
