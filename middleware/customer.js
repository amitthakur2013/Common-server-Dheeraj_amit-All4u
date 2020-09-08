module.exports = function (req, res, next) {
  if (req.user && req.user.role.trim() === "customer") {
    console.log("User is a customer");
    next();
  } else {
    console.log("User is not authorized.");
  }
};
