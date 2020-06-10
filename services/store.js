const { promisify } = require("util");

const redis = require("redis");
const client = redis.createClient();

client.on("connect", () => {
  console.log("Database successfully connected");
});
client.on("error", () => {
  console.log("Error connecting to the database");
});

let hmset = promisify(client.hmset).bind(client);
let keys = promisify(client.keys).bind(client);
let hgetall = promisify(client.hgetall).bind(client);
let del = promisify(client.del).bind(client);

const add = async (user, code) => {
  await hmset(code, user);
};

const verify = async (email, code) => {
  let result = await hgetall(code);
  if (result && result.email === email) {
    return { name: result.name };
  }
  return null;
};

const remove = async (code) => {
  await del(code);
};

const getAll = async () => {
  let allKeys = await keys("*");
  let allValues = [];
  for (let key of allKeys) {
    value = await hgetall(key);
    allValues.push(value);
  }
  return allValues;
};

module.exports = {
  add,
  verify,
  remove,
  getAll,
};
