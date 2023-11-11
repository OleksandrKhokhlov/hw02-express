const handleMongoooseErr = (err, data, next) => {
  err.status = 400;
  next();
};

module.exports = handleMongoooseErr;