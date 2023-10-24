const { connectToDatabase } = require("./services/DB_Connection");

// Get an instance of our database
const db = await connectToDatabase({
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DATABASE_NAME: process.env.MONGODB_DATABASE_NAME,
});

module.exports = { db: db };