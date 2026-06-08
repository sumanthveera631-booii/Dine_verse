// Express central error handler middleware

const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose cast errors (bad ObjectIds)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Resource not found: invalid ID format';
  }

  // Handle duplicate key error in MongoDB
  if (err.code === 11000) {
    statusCode = 400;
    const keyName = Object.keys(err.keyValue)[0];
    message = `Duplicate field value error: ${keyName} is already in use.`;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
