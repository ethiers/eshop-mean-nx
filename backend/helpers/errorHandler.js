const errorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res
      .status(err.status)
      .json({ message: 'The user is not authorized' });
  }

  if (err.name === 'ValidationError') {
    return res.status(err.status).json({ message: err });
  }

  res.status(500).json(err);
};

module.exports = errorHandler;
