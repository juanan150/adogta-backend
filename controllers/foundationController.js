const Foundation = require("../api/models/Foundation");
var jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Foundation.authenticate(email, password);

  if (user) {
    const token = jwt.sign({ userId: user._id }, "secret key");
    res.json({ token });
  } else {
    res.status(401).json({ error: "Credenciales inválidas" });
  }
};

module.exports = login;
