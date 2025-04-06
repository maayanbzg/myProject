import mongoose from '../mongoDB.js';

const dogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    person_id: String
}, { collection: 'dogs' });

const Dog = mongoose.model('Dog', dogSchema);

export default Dog;