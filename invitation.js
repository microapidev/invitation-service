const { v4 } = require("uuid");

const generateCode = () => v4().split("-").pop();

module.exports = {
  generateCode,
};
