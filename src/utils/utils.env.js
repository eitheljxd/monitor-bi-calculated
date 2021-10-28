const AWS = require("aws-sdk");
const sm = new AWS.SecretsManager({ region: "us-east-1" });
const getSecrets = async (SecretId) => {
  return await new Promise((resolve, reject) => {
    sm.getSecretValue({ SecretId }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(result.SecretString));
      }
    });
  });
};

module.exports = {
  getSecrets,
};
