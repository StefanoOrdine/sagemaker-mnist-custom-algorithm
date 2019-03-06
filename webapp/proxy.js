const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const AWS = require('aws-sdk')
const sagemakerruntime = new AWS.SageMakerRuntime({
  region: 'eu-central-1',
});

const app = express()
app.use(cors())

app.use(bodyParser.raw({ type: 'application/x-www-form-urlencoded' }))

app.get('/ping', (req, res) => res.send(''))
app.post('/invocations', (req, res) => {
	var params = {
    Body: req.body,
    EndpointName: 'handwritten-digits-endpoint', /* required */
    ContentType: 'application/x-www-form-urlencoded',
  };
  sagemakerruntime.invokeEndpoint(params, function(err, data) {
    console.log()
    if (err) res.status(500).json(err)
    else     res.status(200).send(data.Body.toString())
  });
})

app.listen(3000, () => console.log(`Example app listening on port 3000!`))
