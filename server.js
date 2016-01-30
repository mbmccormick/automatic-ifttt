var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var redis = require('redis');

var app = express();

app.use(bodyParser.json());

var client = redis.createClient(process.env.REDIS_URL);

var lastFuelReading = 100.0;
var notificationSent = false;

app.post('/api/automatic/webhook', function(req, res) {
    var payload = req.body;

    console.log('Webhook received of type \'' + payload.type + '\'')

    if (payload.type == 'trip:finished') {
        console.log('Checking remaining fuel in vehicle');

        request.get({
            uri: 'https://api.automatic.com/vehicle/' + payload.vehicle.id + '/',
            headers: {
                Authorization: 'Bearer ' + process.env.AUTOMATIC_ACCESS_TOKEN
            },
            json: true
        }, function(error, response, body) {
            if (body.fuel_level_percent <= process.env.FUEL_PERCENT_THRESHOLD) {
                console.log('Fuel level at ' + body.fuel_level_percent + '%, below threshold');

                client.get('lastFuelReading', function(err, lastFuelReading) {
                    if (lastFuelReading == null) {
                        lastFuelReading = 100.0;
                    }

                    client.get('notificationSent', function(err, notificationSent) {
                        if (notificationSent == null) {
                            notificationSent = false;
                        }

                        if (body.fuel_level_percent > lastFuelReading) {
                            notificationSent = false;
                        }

                        if (notificationSent == false) {
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

                            notificationSent = true;
                        } else {
                            console.log('Notification has already been sent');
                        }

                        client.set('notificationSent', notificationSent);
                    });
                });
            } else {
                console.log('Fuel level at ' + body.fuel_level_percent + '%, above threshold');
            }

            client.set('lastFuelReading', body.fuel_level_percent);
        });
    } else {
        console.log('Ignored');
    }

    res.status(200).end();
});

app.listen(process.env.PORT || 3000);
