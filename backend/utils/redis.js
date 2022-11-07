const { createClient } = require("redis")

const redisClient = createClient({ legacyMode: true })
redisClient.connect()
.then(() => console.log("Connected to redis"))
.catch(console.error)

module.exports = redisClient;