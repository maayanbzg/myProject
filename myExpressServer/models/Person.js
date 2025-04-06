import mongoose from '../mongoDB.js';

const personSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2 },
    age: { type: Number, required: true }
}, { collection: 'persons' });

const Person = mongoose.model('Person', personSchema);

export default Person;