require(`dotenv`).config(); // Load environment variables .env file

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

// console.log(MONGODB_URL);

module.exports = {
    MONGODB_URL,
    PORT
};