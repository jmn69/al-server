import Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number().default(4040),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
  ACCESS_SECRET: Joi.string()
    .required()
    .description('Access token Secret required to sign'),
  REFRESH_SECRET: Joi.string()
    .required()
    .description('Refresh token Secret required to sign'),
  TOKEN_LIFE: Joi.number()
    .required()
    .description('Token life in seconds required to sign'),
  REFRESH_TOKEN_LIFE: Joi.string()
    .required()
    .description('Refresh token life in seconds required to sign'),
  MONGO_HOST: Joi.string()
    .required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number().default(27017),
  AWS_ACCESS_KEY: Joi.string()
    .required()
    .description('AWS access key required'),
  AWS_SECRET_ACCESS_KEY: Joi.string()
    .required()
    .description('AWS secret access key required'),
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  accessSecret: envVars.ACCESS_SECRET,
  tokenLife: envVars.TOKEN_LIFE,
  refreshSecret: envVars.REFRESH_SECRET,
  refreshTokenLife: envVars.REFRESH_TOKEN_LIFE,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
  },
  aws: {
    accessKey: envVars.AWS_ACCESS_KEY,
    accessSecretKey: envVars.AWS_SECRET_ACCESS_KEY,
  },
};

export default config;
