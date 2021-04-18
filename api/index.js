const express = require('express')
const app = express()

const fs = require("fs");
var json = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));

app.get('/', (req, res) => {
    console.log('lat: ' + req.query.lat)
    console.log('lng: ' + req.query.lng)
    geoJson = {
        "type": "FeatureCollection",
        "features": []
    }
    json.features.forEach((obj) => {
        dis = distance(req.query.lat, req.query.lng, obj.geometry.coordinates[1], obj.geometry.coordinates[0])
        if (dis < 1) {
            geoJson.features.push(obj);
        }
    });
    console.log('cnt: ' + geoJson.features.length)
    res.json(geoJson)
})
function distance(lat1, lng1, lat2, lng2) {
    lat1 *= Math.PI / 180;
    lng1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    lng2 *= Math.PI / 180;
    return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
}
module.exports = {
    path: '/api',
    handler: app
}