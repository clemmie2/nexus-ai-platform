const { prisma } = require('../database/prisma');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({ success: false, error: 'Database validation failed.' });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({ success: false, error: 'Invalid request data.' });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Something went wrong.' : err.message;

  res.status(statusCode).json({ success: false, error: message });
};

module.exports = { errorHandler };
