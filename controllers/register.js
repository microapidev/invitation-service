const { body, sanitizeBody, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  registerCompany,
  getNewId,
  configureCompany,
} = require("../services/store");

const createUser = [
  body("name", "cannot be empty").isLength({ min: 1 }).trim(),
  body("password", "cannot be empty").isLength({ min: 1 }).trim(),
  body("email", "must be a valid email").isLength({ min: 1 }).isEmail().trim(),
  sanitizeBody("*").escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "please make sure all fields are filled" });
    }

    try {
      const { name, email, password } = req.body;
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      const companyId = await getNewId();

      await registerCompany(email, { companyId, name, hash });
      await configureCompany(companyId, { name });
      const secret = process.env.JWT_KEY;
      const token = jwt.sign({ name, companyId }, secret, {
        expiresIn: "1h",
      });

      return res.status(201).json({
        message: "Company account successfully created",
        companyId,
        token,
      });
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = createUser;
