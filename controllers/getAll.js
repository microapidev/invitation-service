let { getAll } = require("../services/store");

const getInvites = async (req, res, next) => {
  let { companyId } = req.body;
  try {
    let allPending = await getAll(companyId);
    return res.json(allPending);
  } catch (err) {
    return next(err);
  }
};

module.exports = getInvites;
