module.exports = function (req, res, next) {
  if (req.user && req.user.role.trim() === "admin") {
    console.log("User is a admin");
    next();
  } else {
    console.log("User is not authorized.");
  }
};
