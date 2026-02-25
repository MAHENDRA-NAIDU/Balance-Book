const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const Transaction = require('../models/Transaction');

// POST /api/persons
router.post('/', async (req, res) => {
    try {
        const newPerson = new Person(req.body);
        const savedPerson = await newPerson.save();
        res.status(201).json(savedPerson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET /api/persons
router.get('/', async (req, res) => {
    try {
        const persons = await Person.find().sort({ createdAt: -1 });
        res.json(persons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/persons/:id
router.get('/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) return res.status(404).json({ message: 'Person not found' });
        res.json(person);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/persons/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedPerson = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPerson) return res.status(404).json({ message: 'Person not found' });
        res.json(updatedPerson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/persons/:id
router.delete('/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) return res.status(404).json({ message: 'Person not found' });

        // Also delete associated transactions
        await Transaction.deleteMany({ personId: person._id });
        await person.deleteOne();

        res.json({ message: 'Person and associated transactions deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
