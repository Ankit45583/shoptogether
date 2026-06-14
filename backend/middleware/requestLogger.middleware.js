import logger from "../utils/logger.js";

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 400) {
      logger.error(log);
    } else {
      logger.info(log);
    }
  });

  next();
};

export default requestLogger;