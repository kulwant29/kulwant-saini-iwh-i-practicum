require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.get('/', async (req, res) => {
    const cars = 'https://api.hubspot.com/crm/v3/objects/2-272297928?properties=name,model,color';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(cars, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Object Table | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error);
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    const newCar = {
        properties: {
            "name": req.body.name,
            "model": req.body.model,
            "color": req.body.color
        }
    };

    const createCar = 'https://api.hubspot.com/crm/v3/objects/2-272297928';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createCar, newCar, { headers });
        res.redirect('/');
    } catch (err) {
        console.error(err);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));