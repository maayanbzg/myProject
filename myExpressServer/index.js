const express = require('express');
const mysqlDB = require('./mysql');
const mongoDB = require('./mongoDB');
const Person = require('./models/Person');
const Dog = require('./models/Dog');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Get all persons or a specific person (mongo)
app.get('/persons/:id?', async (req, res) => {
    const { id } = req.params;

    try {
        if (id) {
            const person = await Person.findById(id);
            if (!person) {
                return res.status(404).json({ message: 'Person not found' });
            }
            return res.json(person);
        }

        const persons = await Person.find();
        res.json(persons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all dogs or a specific dog or a specific person dog (mongo)
app.get('/dogs/:id?', async (req, res) => {
    const { id } = req.params;
    const { person_id } = req.query;

    try {
        if (id) {
            const dog = await Dog.findById(id);
            if (!dog) {
                return res.status(404).json({ message: 'Dog not found' });
            }
            return res.json(dog);
        }

        if (person_id) {
            const dogs = await Dog.find({ person_id: person_id });
            if (dogs.length === 0) {
                return res.status(404).json({ message: 'Dog not found' });
            }
            return res.json(dogs);
        }

        const dogs = await Dog.find();
        res.json(dogs);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// Add a person (mongo)
app.post('/persons', express.json(), async (req, res) => {
    const { name, age } = req.body;

    try {
        const newPerson = new Person({ name, age });
        await newPerson.save();
        res.status(201).json(newPerson);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a dog (mongo)
app.post('/dogs', express.json(), async (req, res) => {
    const { name, person_id = null } = req.body;

    try {
        const newDog = new Dog({ name, person_id });
        await newDog.save();
        res.status(201).json(newDog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a person_id to a dog (mongo)
app.put('/dogs/:id/person', express.json(), async (req, res) => {
    const { id } = req.params;
    const { person_id } = req.body;

    try{
        const dog = await Dog.findById(id);
        if(!dog) {
            return res.status(404).json({ message: 'Dog not found' });
        }

        const person = await Person.findById(person_id);
        if(!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        dog.person_id = person_id;
        await dog.save();

        res.json({ message: 'Person assigned to dog', dog });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a person (mnongo)
app.delete('/persons/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPerson = await Person.findByIdAndDelete(id);
        
        if (!deletedPerson) {
            return res.status(404).json({ message: 'Person not found' });
        }

        res.json({ message: 'Person deleted successfully', deletedPerson });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a dog (mongo)
app.delete('/dogs/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDog = await Dog.findByIdAndDelete(id);

        if(!deletedDog) {
            return res.status(404).json({ message: 'Dog not found' });
        }

        return res.json({ message: 'Dog deleted successfully', deletedDog });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});  

// // Get all persons or a specific person
// app.get('/persons/:id?', (req, res) => {
//     const { id } = req.params;

//     let query = 'SELECT * FROM persons';
//     let queryParams = [];

//     if(id) {
//         query += ' WHERE id = ?';
//         queryParams.push(id);
//     }

//     mysqlDB.query(query, queryParams, (err, results) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json(results);
//     });
// });

// // Get all dogs or a specific dog or specific person dogs
// app.get('/dogs/:id?', (req, res) => {
//     const { id } = req.params;
//     const { person_id } = req.query;

//     let query = 'SELECT * FROM dogs';
//     let queryParams = [];

//     if(id || person_id) {
//         query += ' WHERE';

//         if(id) {
//             query += ' id = ?';
//             queryParams.push(id);
//         }

//         if (id && person_id) {
//             query += ' AND';
//         }

//         if(person_id) {
//             query += ' person_id = ?';
//             queryParams.push(person_id);
//         }
//     }

//     mysqlDB.query(query, queryParams, (err, results) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }

//         res.json(results);
//     });
// });

// // Add a person
// app.post('/persons', express.json(), (req, res) => {
//     const { name, age } = req.body;

//     mysqlDB.query('INSERT INTO persons (name, age) VALUES (?, ?)', [name, age], (err, results) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }

//         res.json({ message: 'Person added', personId: results.insertId });
//     });
// });

// // Add a dog
// app.post('/dogs', express.json(), (req, res) => {
//     const { name, preson_id = null } = req.body;

//     mysqlDB.query('INSERT INTO dogs (name, person_id) VALUES (?, ?)', [name, preson_id], (err, results) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }

//         res.json({ message: 'Dog added', dogId: results.insertId });
//     })
// });

// // Add a person_id to a dog
// app.put('/dogs/:id/person', express.json(), (req, res) => {
//     const { id } = req.params;
//     const { person_id } = req.body;

//     if (!person_id) {
//         return res.status(400).json({ error: "person_id is required" });
//     }

//     mysqlDB.query('UPDATE dogs SET person_id = ? WHERE id = ?', [person_id, id], (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }

//         if (results.affectedRows === 0) {
//             return res.status(404).json({ error: 'Dog not found' });
//         }

//         res.json({ message: 'Person ID updated for dog' });
//     })
// });

// // Delete a person
// app.delete('/persons/:id', (req, res) => {
//     const { id } = req.params;

//     mysqlDB.query('DELETE FROM persons WHERE id = ?', [id], (err, results) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }

//         if (results.affectedRows === 0) {
//             res.status(404).json({ message: 'Person not found' });
//             return;
//         }

//         res.json({ message: `Person with ID ${id} deleted successfully` });
//     })
// });

// // Delete a dog
// app.delete('/dogs/:id', (req, res) => {
//     const { id } = req.params;

//     mysqlDB.query('DELETE FROM dogs WHERE id = ?', [id], (err, results) => {
//         if(err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }

//         if(results.affectedRows === 0) {
//             res.status(404).json({ message: 'Dog not found' });
//             return;
//         }

//         res.json({ message: `Dog with ID ${id} deleted successfully` })
//     })
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});