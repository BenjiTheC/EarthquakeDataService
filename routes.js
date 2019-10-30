const { Router } = require('express');
const { getEarthQuake } = require('./data');

const router = Router();

const earthquakeDataFilter = earthquake => {
    const { properties, geometry, id } = earthquake;
    const { mag, place, time, sig } = properties;

    const [longitude, latitude, depth] = geometry.coordinates;
    const timeString = new Date(time);

    return {
        id,
        longitude,
        latitude,
        depth,
        mag,
        place,
        sig,
        timeInt: time,
        timeString: timeString.toISOString(),
    };
};

router.get('/earthquakes', async (req, res) => {
    const { range, minmagnitude } = req.query;

    let earthquakesResponse;
    try {
        earthquakesResponse = await getEarthQuake(range, minmagnitude);
    } catch (e) {
        return res.status(500).json({ status: 500, msg: 'oops something goes wrong', error: e });
    }

    return res.json(earthquakesResponse.features.map(earthquake => earthquakeDataFilter(earthquake)));
});

module.exports = app => {
    app.use('/', router);
    app.use('*', (req, res) => {
        res.status(404).json({ status: 404, error: 'Not Found' });
    });
};
