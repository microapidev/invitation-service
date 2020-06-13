const jwt = require("jsonwebtoken");

const secret = process.env.JWT_KEY;

const verify = async (req, res, next) => {
  const { token, id: companyId } = req.headers;
  try {
    const decoded = jwt.verify(token, secret);

    if (decoded.companyId === +companyId) {
      req.body.companyId = +companyId;
      return next();
    } else {
      return res.status(401).json({ message: "invalid token 1" });
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "session expired, please log in again" });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "invalid token 2" });
    }

    return next(err);
  }
};

module.exports = verify;
