require("dotenv").config({ path: ".env.dev" });
const http = require("http");

const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const { connection } = require("./db/mongoose");

server.listen(PORT, async () => {
  await connection();

  console.log(`server is listening on port ${PORT} `);
});
