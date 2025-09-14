const express = require('express');
const cors = require('cors');
const path = require('path');  

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../../frontend')));


app.post('/predict', async (req, res) => {
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ error: 'No comment provided' });
    }

    try {
        // comment to the Flask API for prediction
        const flaskResponse = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment })
        });

        if (!flaskResponse.ok) {
            throw new Error('Error calling Flask API');
        }

        const prediction = await flaskResponse.json();
        res.json(prediction); 

    } catch (error) {
        console.error('Error in /predict route:', error);
        res.status(500).json({ error: 'Error in predicting toxicity' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Node server running at http://localhost:${PORT}`);
});
