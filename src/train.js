
const fs = require('fs');
const synaptic = require('synaptic'); // this line is not needed in the browser

const out = (number) => {
  switch (number) {
    case '0': return [1,0,0,0,0,0,0,0,0,0];
    case '1': return [0,1,0,0,0,0,0,0,0,0];
    case '2': return [0,0,1,0,0,0,0,0,0,0];
    case '3': return [0,0,0,1,0,0,0,0,0,0];
    case '4': return [0,0,0,0,1,0,0,0,0,0];
    case '5': return [0,0,0,0,0,1,0,0,0,0];
    case '6': return [0,0,0,0,0,0,1,0,0,0];
    case '7': return [0,0,0,0,0,0,0,1,0,0];
    case '8': return [0,0,0,0,0,0,0,0,1,0];
    case '9': return [0,0,0,0,0,0,0,0,0,1];
  }
};
const conv = (arr) => arr.indexOf(Math.max(...arr));

const network = new synaptic.Architect.Perceptron(784,30,10);

const trainer = new synaptic.Trainer(network);

let trainFolder = "/opt/ml/input/data/train"

fs.readdir(trainFolder, (err, files) => {
  files = files.filter((file) => /\.data$/.test(file));

  let trainSet = [];

  process.stdout.write(`Let me create the training set for ${files.length} pictures\n`);
  for (let i=0; i<files.length; i++) {
    let file = files[i];
    let desiredFile = trainFolder + "/" + file.replace(/\.data$/, ".txt");
    let desired = fs.readFileSync(desiredFile).toString();

    let input = [...fs.readFileSync(trainFolder + "/" + file)]
      .map((intensity) => intensity/255);

    trainSet.push({input: input, output: out(desired)});
  }

  process.stdout.write("Now we learn\n");
  trainer.train(trainSet, {
    rate: 0.2,
    //iterations: 80,
    iterations: 1,
    error: 0.05,
    shuffle: true,
    log: 1,
    cost: synaptic.Trainer.cost.CROSS_ENTROPY
  });

  process.stdout.write("Learning complete...\n");
  fs.writeFileSync("/opt/ml/model/network.json", JSON.stringify(network.toJSON()));
})

