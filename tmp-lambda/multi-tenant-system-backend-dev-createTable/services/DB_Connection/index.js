// Import the MongoDB driver
const MongoClient = require("mongodb").MongoClient;

// Once we connect to the database once, we'll store that connection and reuse it so that we don't have to connect to the database on every request.
let cachedDb = null;

const connectToDatabase = async ({ MONGODB_URI, MONGODB_DATABASE_NAME }) => {
  if (cachedDb) {
    return cachedDb;
  }
  console.log("DB Connection Called!");
  // Connect to our MongoDB database hosted on MongoDB Atlas
  const client = await MongoClient.connect(MONGODB_URI);
  // Specify which database we want to use
  const db = client.db(MONGODB_DATABASE_NAME);
  cachedDb = db;
  return db;
};

const getCollectionCollection = async (collectionName) => {
  const db = await connectToDatabase({
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DATABASE_NAME: process.env.MONGODB_DATABASE_NAME,
  });
  return await db.collection(collectionName);
};

module.exports = { connectToDatabase, getCollectionCollection };
