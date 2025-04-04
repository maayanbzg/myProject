const express = require('express');
const router = express.Router();
const mysqlDB = require('../mysql');

// Get all persons or a specific person
router.get('/persons/:id?', (req, res) => {
    const { id } = req.params;
    let query = id ? 'SELECT * FROM persons WHERE id = ?' : 'SELECT * FROM persons';
    mysqlDB.query(query, id ? [id] : [], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get all dogs or a specific dog or a specific person’s dogs
router.get('/dogs/:id?', (req, res) => {
    const { id } = req.params;
    const { person_id } = req.query;
    let query = 'SELECT * FROM dogs';
    let queryParams = [];

    if (id || person_id) {
        query += ' WHERE ' + (id ? 'id = ?' : '') + (id && person_id ? ' AND ' : '') + (person_id ? 'person_id = ?' : '');
        queryParams.push(...(id ? [id] : []), ...(person_id ? [person_id] : []));
    }

    mysqlDB.query(query, queryParams, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a person
router.post('/persons', express.json(), (req, res) => {
    const { name, age } = req.body;
    mysqlDB.query('INSERT INTO persons (name, age) VALUES (?, ?)', [name, age], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Person added', personId: results.insertId });
    });
});

// Add a dog
router.post('/dogs', express.json(), (req, res) => {
    const { name, person_id = null } = req.body;
    mysqlDB.query('INSERT INTO dogs (name, person_id) VALUES (?, ?)', [name, person_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Dog added', dogId: results.insertId });
    });
});

// Assign a person to a dog
router.put('/dogs/:id/person', express.json(), (req, res) => {
    const { id } = req.params;
    mysqlDB.query('UPDATE dogs SET person_id = ? WHERE id = ?', [req.body.person_id, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.affectedRows ? { message: 'Person ID updated for dog' } : { message: 'Dog not found' });
    });
});

// Delete a person
router.delete('/persons/:id', (req, res) => {
    mysqlDB.query('DELETE FROM persons WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.affectedRows ? { message: 'Person deleted' } : { message: 'Person not found' });
    });
});

// Delete a dog
router.delete('/dogs/:id', (req, res) => {
    mysqlDB.query('DELETE FROM dogs WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.affectedRows ? { message: 'Dog deleted' } : { message: 'Dog not found' });
    });
});

module.exports = router;
