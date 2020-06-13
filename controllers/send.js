let { body, sanitizeBody, validationResult } = require("express-validator");

let { send } = require("../services/mail");
let { add, getCompanyInfo } = require("../services/store");
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

let constructMessage = (name, team, code) => `
Hello, you have been invited to ${team ? "Team " + team : name}

This is your invitation code: ${code}

This code can only be used once.

Welcome
(${team ? "Team " + team : name})
`;

const sendHandler = [
  body("email", "cannot be empty").isLength({ min: 1 }).trim(),
  body("email", "invalid email").isEmail(),
  sanitizeBody("*").escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "please make sure all inputs are filled" });
    }

    let { email, companyId } = req.body;
    let code = generateCode();

    try {
      let message = await getCompanyInfo(companyId, "message");
      let name = await getCompanyInfo(companyId, "name");
      let team = await getCompanyInfo(companyId, "team");
      if (!message) {
        message = constructMessage(name, team, code);
      } else {
        message = message.replace("?code", code);
      }

      let subject = await getCompanyInfo(companyId, "subject");
      console.log(message);

      await send(message, email, subject || `Invitation from ${name}`, name);
      await add(companyId, email, code);
      return res.json({
        message: `We sent a one use code to ${email}`,
      });
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = sendHandler;
