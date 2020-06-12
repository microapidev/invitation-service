const { body, sanitizeBody, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getCompanyLogin } = require("../services/store");

const authenticateUser = [
  body("email", "cannot be empty").isLength({ min: 1 }).trim(),
  body("email", "invalid email").isEmail(),
  body("password", "cannot be empty").isLength({ min: 1 }),
  sanitizeBody("*").escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "please make sure all fields are filled" });
    }

    try {
      let { email, password } = req.body;
      const savedLogin = await getCompanyLogin(email);
      if (!savedLogin) {
        return res.status(401).json({ message: "company not found" });
      }

      const hash = savedLogin.hash;
      const authResult = await bcrypt.compare(password, hash);
      if (!authResult) {
        return res.status(401).json({
          message: "incorrect email and password combination",
        });
      }

      const payload = {
        name: savedLogin.name,
        companyId: +savedLogin.companyId,
      };
      const secret = process.env.JWT_KEY;
      const token = await jwt.sign(payload, secret, { expiresIn: "1h" });

      return res.json({
        companyId: +savedLogin.companyId,
        token,
      });
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = authenticateUser;
