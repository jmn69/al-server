import winston from 'winston';

export default winston.createLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
  ],
});
