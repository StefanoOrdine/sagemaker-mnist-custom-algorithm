# SageMaker Custom algorithm

## Get a prediction on an image

```
aws sagemaker-runtime invoke-endpoint  \
--region eu-central-1 \
--endpoint-name handwritten-digits-endpoint \
--body fileb://img-test/1.data  \
--content-type application/x-www-form-urlencoded  >(cat)
```
