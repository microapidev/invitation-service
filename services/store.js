const { promisify } = require("util");

const redis = require("redis");

let redisPort = process.env.REDIS_PORT || "6379";
let redisClient = process.env.REDIS_CLIENT || "redis-server";
const client = redis.createClient(redisPort, redisClient);

client.on("connect", () => {
  console.log("Database successfully connected");
});
client.on("error", () => {
  console.log("Error connecting to the database");
});

let hmset = promisify(client.hmset).bind(client);
let keys = promisify(client.keys).bind(client);
let hgetall = promisify(client.hgetall).bind(client);
let hget = promisify(client.hget).bind(client);
let hdel = promisify(client.hdel).bind(client);
let get = promisify(client.get).bind(client);
let set = promisify(client.set).bind(client);
let exists = promisify(client.exists).bind(client);

const add = async (companyId, email, code) => {
  console.log(companyId);
  await hmset(`${companyId}-invites`, email, code);
};

const verify = async (companyId, email, code) => {
  let savedCode = await hget(`${companyId}-invites`, email);
  return savedCode === code;
};

const remove = async (companyId, email) => {
  console.log("deleting");
  await hdel(`${companyId}-invites`, email);
};

const getAll = async (companyId) => {
  let allValues = await hgetall(`${companyId}-invites`);
  allValues = allValues || [];
  return Object.keys(allValues);
};

const configureCompany = async (companyId, settings) => {
  await hmset(companyId.toString(), settings);
};

const getCompanyInfo = async (companyId, info) => {
  return hget(companyId.toString(), info);
};

let emailExist = async (email) => {
  let res = await exists(email);
  return res === 1;
};

const registerCompany = async (email, details) => {
  await hmset(email, details);
};

const getCompanyLogin = async (email) => {
  return hgetall(email);
};

const getNewId = async () => {
  let prev = await get("count");
  if (prev) {
    let current = +prev + 1;
    await set("count", current.toString());
    return current;
  } else {
    let current = 1;
    await set("count", current.toString());
    return current;
  }
};

module.exports = {
  add,
  verify,
  remove,
  getAll,
  configureCompany,
  getCompanyInfo,
  getNewId,
  registerCompany,
  getCompanyLogin,
  emailExist,
};
