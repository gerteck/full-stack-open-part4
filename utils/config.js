const logger = require(`./logger`);
require(`dotenv`).config(); // Load environment variables .env file

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

// logger.info(MONGODB_URL);

module.exports = {
    MONGODB_URL,
    PORT
};