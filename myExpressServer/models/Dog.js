const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    person_id: String
}, { collection: 'dogs' });

const Dog = mongoose.model('Dog', dogSchema);
module.exports = Dog;