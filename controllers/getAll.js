let { getAll } = require("../services/store");

const getInvites = async (req, res, next) => {
  try {
    let allPending = await getAll();
    return res.json(allPending);
  } catch (err) {
    return next(err);
  }
};

module.exports = getInvites;
