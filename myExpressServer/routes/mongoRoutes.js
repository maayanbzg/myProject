import express from 'express';
import Person from '../models/Person.js';
import Dog from '../models/Dog.js';
import { getCache, setCache, incrementKey, addUnassignedDog, getNextUnassignedDog } from '../utils/redisClient.js';

const router = express.Router();

// Get all persons or a specific person
router.get('/persons/:id?', async (req, res) => {
    const { id } = req.params;
    try {
        if (id) {
            const cached = await getCache(`person:${id}`);
            if (cached) return res.json(cached);

            const person = await Person.findById(id);
            if (!person) return res.status(404).json({ message: 'Person not found' });
            await setCache(`person:${id}`, person, 60);
            return res.json(person);
        }
        const persons = await Person.find();
        res.json(persons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all dogs or a specific dog or a specific person dog
router.get('/dogs/:id?', async (req, res) => {
    const { id } = req.params;
    const { person_id } = req.query;
    try {
        if (id) {
            const dog = await Dog.findById(id);
            if (!dog) return res.status(404).json({ message: 'Dog not found' });
            return res.json(dog);
        }
        if (person_id) {
            const dogs = await Dog.find({ person_id });
            if (dogs.length === 0) return res.status(404).json({ message: 'Dog not found' });
            return res.json(dogs);
        }
        await incrementKey('stats:dogs:get');
        const dogs = await Dog.find();
        res.json(dogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a person
router.post('/persons', express.json(), async (req, res) => {
    const { name, age } = req.body;
    try {
        const newPerson = new Person({ name, age });
        await newPerson.save();
        res.status(201).json(newPerson);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a dog
router.post('/dogs', express.json(), async (req, res) => {
    const { name, person_id = null } = req.body;
    try {
        const newDog = new Dog({ name, person_id });
        if(!person_id) await addUnassignedDog(newDog._id);
        await newDog.save();
        res.status(201).json(newDog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Assign a person to a dog
router.put('/dogs/person', express.json(), async (req, res) => {
    const { person_id } = req.body;
    const id = await getNextUnassignedDog();
    if (!id) return res.status(404).json({ message: 'No unassigned dogs available' });

    try {
        const dog = await Dog.findById(id);
        if (!dog) return res.status(404).json({ message: 'Dog not found' });
        const person = await Person.findById(person_id);        
        if (!person) return res.status(404).json({ message: 'Person not found' });
        dog.person_id = person_id;
        await dog.save();
        res.json({ message: 'Person assigned to dog', dog });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a person
router.delete('/persons/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPerson = await Person.findByIdAndDelete(id);
        if (!deletedPerson) return res.status(404).json({ message: 'Person not found' });

        res.json({ message: 'Person deleted successfully', deletedPerson });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a dog
router.delete('/dogs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedDog = await Dog.findByIdAndDelete(id);
        if (!deletedDog) return res.status(404).json({ message: 'Dog not found' });

        return res.json({ message: 'Dog deleted successfully', deletedDog });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;