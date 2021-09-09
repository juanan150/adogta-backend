const User = require("../api/models/User");
var jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.authenticate(email, password);

  if (user) {
    const token = jwt.sign({ userId: user._id }, "secret key");
    res.json({ token, user });
  } else {
    user = await Foundation.authenticate(email, password);
    if (user) {
      const token = jwt.sign({ userId: user._id }, "secret key");
      res.json({ token, user });
    } else {
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  }
};

module.exports = login;
