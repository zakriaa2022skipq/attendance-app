const errorMiddleware = (error, req, res, next) => {
    const statusCode = req.statusCode || 500;
    let message;
    if (error.reason) {
      message = "Something went wrong try again later!";
    } else {
      message = error.message || "Something went wrong try again later!";
    }
    console.log(error)
    return res.status(statusCode).json(message);
  };
  
  module.exports = { errorMiddleware };