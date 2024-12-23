const express = require('express');
const router = express.Router();
const { client } = require('../config/database');

router.post('/', async (req, res) => {
  try {
    const reservation = req.body;
    const database = client.db('restaurant');
    const reservations = database.collection('reservations');
    
    const result = await reservations.insertOne({
      ...reservation,
      createdAt: new Date()
    });
    
    res.status(201).json({ message: 'Reservation created successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Error creating reservation' });
  }
});

module.exports = router;