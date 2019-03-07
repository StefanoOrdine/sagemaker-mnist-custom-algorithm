
const synaptic = require('synaptic');

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// loaded at position by sagemaker
const data = require('/opt/ml/model/network.json');

const network = synaptic.Network.fromJSON(data);

const app = express()
app.use(cors())

const conv = (arr) => arr.indexOf(Math.max(...arr));

app.use(bodyParser.raw({ type: 'application/x-www-form-urlencoded' }))

app.get('/ping', (req, res) => res.send(''))
app.post('/invocations', (req, res) => {

  let input = req.body

  let result = network.activate(input);
  let converted = conv(result);

  return res.json({
    output: converted,
  })
})

app.listen(8080, () => console.log(`Example app listening on port 8080!`))
