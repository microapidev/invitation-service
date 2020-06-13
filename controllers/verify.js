let { body, sanitizeBody, validationResult } = require("express-validator");

let { verify, remove } = require("../services/store");

const verifyHandler = [
  body("email", "cannot be empty").isLength({ min: 1 }).trim(),
  body("email", "invalid email").isEmail(),
  body("code", "cannot be empty").isLength({ min: 1 }).trim(),
  sanitizeBody("*").escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          message: "please make sure all input are filled",
          errors: errors.errors,
        });
    }

    let { email, code, companyId } = req.body;

    try {
      let result = await verify(companyId, email, code);
      if (result) {
        await remove(companyId, email);
        return res.json({
          message: "successfully verified",
          name: result.name,
        });
      } else {
        return res.status(401).json({
          message: "cannot verify",
        });
      }
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = verifyHandler;
