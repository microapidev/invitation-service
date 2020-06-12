const { configureCompany } = require("../services/store");
const { sanitizeBody, body, validationResult } = require("express-validator");

const configureHandler = [
  body("*", "cannot be empty").isLength({ min: 1 }).trim(),
  sanitizeBody("*"),
  async (req, res, next) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "empty fields not allowed",
      });
    }
    try {
      let { companyId, ...rest } = req.body;
      await configureCompany(companyId, rest);

      return res.json({ message: "company settings successfully updated" });
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = configureHandler;
