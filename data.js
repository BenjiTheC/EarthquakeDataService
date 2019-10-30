const URI = require('urijs');
const fetch = require('node-fetch');

const BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1';
const RANGE = 30; // data range by days
const MIN_MAG = 3;

module.exports = {
    getEarthQuake: async (range = RANGE, minmagnitude = MIN_MAG) => {
        const endtime = new Date(Date.now());
        const starttime = new Date();
        starttime.setDate(endtime.getDate() - range);

        const header = { Accept: 'application/json' };

        const url = new URI(BASE_URL);
        url.segment('query');
        url.query({
            format: 'geojson',
            starttime: starttime.toISOString().split('T')[0],
            endtime: endtime.toISOString().split('T')[0],
            minmagnitude,
        });

        let response;
        let responseJson;
        try {
            response = await fetch(url.toString(), { method: 'GET', headers: header });
            responseJson = await response.json();
        } catch (error) {
            console.log(error);
        }

        return responseJson;
    },
};
