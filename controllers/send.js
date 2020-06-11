let { body, sanitizeBody, validationResult } = require("express-validator");

let { send } = require("../services/mail");
let { add } = require("../services/store");
let { generateCode } = require("../invitation");

const EmailValidator = require("email-deep-validator");
const emailValidator = new EmailValidator();

const verifyMail = async (user_email_address) => {
  let mail_status = false;
  const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(
    user_email_address
  );
  return wellFormed && validDomain && validMailbox;
};

let constructMessage = (name, code) => `
Hello ${name}, you have been invited to Team Silver

This is your invitation code: ${code}

This code can only be used once.

Welcome
(Team silver administrators)
`;

const sendHandler = [
  body("email", "cannot be empty").isLength({ min: 1 }).trim(),
  body("email", "invalid email").isEmail(),
  body("name", "cannot be empty").isLength({ min: 1 }).trim(),
  sanitizeBody("*").escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "please supply a valid request" });
    }

    let email = req.body.email;
    let name = req.body.name;
    let code = generateCode();
    let message = constructMessage(name, code);

    try {
      let result = await verifyMail(email);
      if (!result)
        return res
          .status(400)
          .json({ message: "please supply a valid email address " });

      await add({ email, name }, code);
      await send(message, email);
      return res.json({
        message: `We sent a one use code to ${email}`,
      });
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = sendHandler;
