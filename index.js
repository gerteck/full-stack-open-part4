const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// Blog object in models/blog.js

const mongoUrl = config.MONGODB_URL;
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

const blogsRouter = require('./controllers/blogs');
app.use('/api/blogs', blogsRouter);


const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})