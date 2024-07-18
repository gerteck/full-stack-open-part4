require(`dotenv`).config(); // Load environment variables .env file

const PORT = process.env.PORT;

console.log(process.env.NODE_ENV);

const MONGODB_URL = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URL
    : process.env.MONGODB_URL;



// logger.info(MONGODB_URL);

module.exports = {
    MONGODB_URL,
    PORT
};