# SageMaker Custom algorithm

## Algorithm

 * Input:  s3://mnist-training-set-eu-central-1/img-train
 * Output: s3://mnist-training-set-eu-central-1/output

### Hyperparameters configuration

```json
[
	{
		"Name": "rate",
		"Description": "Learning Rate",
		"Type": "Continuous",
		"Range": {
			"ContinuousParameterRangeSpecification": {
				"MinValue": "0",
				"MaxValue": "1"
			}
		},
		"IsTunable": false,
		"IsRequired": true,
		"DefaultValue": "0.2"
	},
	{
		"Name": "iterations",
		"Description": "Number of iterations",
		"Type": "Integer",
		"Range": {
			"IntegerParameterRangeSpecification": {
				"MinValue": "1",
				"MaxValue": "1000"
			}
		},
		"IsTunable": false,
		"IsRequired": true,
		"DefaultValue": "80"
	},
	{
		"Name": "error",
		"Description": "Error rate",
		"Type": "Continuous",
		"Range": {
			"ContinuousParameterRangeSpecification": {
				"MinValue": "0",
				"MaxValue": "1"
			}
		},
		"IsTunable": false,
		"IsRequired": true,
		"DefaultValue": "0.05"
	},
	{
		"Name": "shuffle",
		"Description": "Learning shuffle",
		"Type": "Integer",
		"Range": {
			"IntegerParameterRangeSpecification": {
				"MinValue": "0",
				"MaxValue": "1"
			}
		},
		"IsTunable": false,
		"IsRequired": true,
		"DefaultValue": "1"
	},
	{
		"Name": "log",
		"Description": "Learning shuffle",
		"Type": "Integer",
		"Range": {
			"IntegerParameterRangeSpecification": {
				"MinValue": "0",
				"MaxValue": "1"
			}
		},
		"IsTunable": false,
		"IsRequired": true,
		"DefaultValue": "1"
	},
	{
		"Name": "cost",
		"Description": "Cost Algorithm",
		"Type": "Categorical",
		"Range": {
			"CategoricalParameterRangeSpecification": {
				"Values": [
					"CROSS_ENTROPY",
					"MSE",
					"BINARY"
				]
			}
		},
		"IsTunable": false,
		"IsRequired": true,
		"DefaultValue": "CROSS_ENTROPY"
	}
]
```

## Get a prediction on an image

```
aws sagemaker-runtime invoke-endpoint  \
--region eu-central-1 \
--endpoint-name handwritten-digits-endpoint \
--body fileb://img-test/1.data  \
--content-type application/x-www-form-urlencoded  >(cat)
```
