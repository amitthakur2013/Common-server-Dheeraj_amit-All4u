module.exports = function (req, res, next) {
  if (req.user && req.user.role.trim() === "merchant") {
    console.log("User is a merchant");
    next();
  } else {
    console.log("User is not authorized.");
  }
};
