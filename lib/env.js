if (process.env.PROXY_ENV) {
  var envPath = __dirname + '/../.env-' + process.env.PROXY_ENV;
  var envDeployPath = __dirname + '/../.env-' + process.env.PROXY_ENV + '-deploy';
} else {
  var envPath = __dirname + '/../.env';
  var envDeployPath = __dirname + '/../.env-deploy';
}

process.env.PROXY_ENV_PATH = envPath;
process.env.PROXY_ENV_DEPLOY_PATH = envDeployPath;

require('dotenv').config({ path: envPath });