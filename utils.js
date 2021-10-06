const jwt = require("jsonwebtoken");

function generateJWT(user) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60,
      userId: user._id,
    },
    process.env.JWT_KEY || "secret key"
  );
}

module.exports = {
  generateJWT,
};
