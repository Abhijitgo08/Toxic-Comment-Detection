const express = require('express');
const axios = require('axios');
const router = express.Router();

//route to predict toxicity
router.post('/', async (req, res) => {
    const comment = req.body.comment;  

    if (!comment) {
        return res.status(400).json({ error: 'No comment provided' });
    }

    try {
        const response = await axios.post('http://192.168.193.88:5000/predict', { comment });

        res.json(response.data);
    } catch (error) {
        console.error('Error calling Flask API:', error);
        res.status(500).json({ error: 'Error processing the comment' });
    }
});

module.exports = router;
