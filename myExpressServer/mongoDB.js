const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myMongoDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose.connection;