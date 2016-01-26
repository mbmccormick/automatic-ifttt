var express = require("express");
var app = express();

var request = require('request');

app.post('/api/automatic/webhook', function(req, res) {
    console.log('Webhook received of type \'' + req.body.type + '\'')
    
    if (req.body.type == 'trip:finished') {
        console.log('Checking remaining fuel in vehicle');
        
        request.get({
            uri: 'https://api.automatic.com/vehicle/' + req.body.vehicle.id + '/',
            headers: {
                Authorization: 'bearer ' + process.env.AUTOMATIC_ACCESS_TOKEN
            },
            json: true
        }, function(error, response, body) {
            if (body.fuel_level_percent <= process.env.FUEL_PERCENT_THRESHOLD) {
                console.log('Fuel level at ' + body.fuel_level_percent + '%, below threshold');
                
                console.log('Sending IFTTT event to Maker channel');
                
                request.post('https://maker.ifttt.com/trigger/automatic-ifttt/with/key/' + process.env.IFTTT_SECRET_KEY, {
                    form: {
                        value1: body.display_name,
                        value2: body.fuel_level_percent,
                        value3: body.fuel_grade
                    }
                }, function(err, response, body) {
                    console.log('Succeeded');
                });
            } else {
                console.log('Fuel level at ' + body.fuel_level_percent + '%, above threshold');
            }
        });
    } else {
        console.log('Ignored');
    }
    
    res.status(200).end();
});

app.listen(3000);
