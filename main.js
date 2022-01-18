const dotenv = require("dotenv").config();

const { MongoClient } = require("mongodb");

const main = async () => {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
};

main().catch(console.error);
