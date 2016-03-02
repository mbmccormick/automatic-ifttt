# automatic-ifttt
Node.js app to trigger an IFTTT Maker Channel event when Automatic indicates low fuel for one of your vehicles.

## How It Works
When your [Automatic Link](https://www.automatic.com/) records a new trip, it will send a notification to your `automatic-ifttt` instance. The app will then query Automatic's REST API for the current fuel level in your vehicle. If the remaining fuel level percentage is below a value that you set, then the app triggers an [IFTTT Maker Channel](http://ifttt.com/maker) event. You can then use IFTTT to do just about anything when you need gas: send you a text message, add a reminder to your todo list, or blink your lights.

## Setup
To setup your own `automatic-ifttt` instance, you'll need to create register a new application for the Automatic API. You can do that at [developer.automatic.com](http://developer.automatic.com). Once you've created your application, enable the Webhooks API. Use `http://<YOUR_HOSTNAME>/webhook` as the Webhook URL.

To make this process even easier, you can use the button below to deploy `automatic-ifttt` to Heroku.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

If you choose to deploy somewhere other than Heroku or you don't want to use the button above, be sure to provide values for the following environment variables:

| Name                     | Description                                                                                                                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AUTOMATIC_ACCESS_TOKEN` | Your Automatic access token. Get this from Automatic at http://developer.automatic.com.                                                                                                                                    |
| `IFTTT_SECRET_KEY`       | Your IFTTT Maker Channel secret key. Get this from IFTTT at http://ifttt.com/maker.                                                                                                                                        |
| `FUEL_PERCENT_THRESHOLD` | Your vehicle's fuel level percentage below which you'd like to trigger an IFTTT Maker Channel event. For example: to be notified when the remaining fuel level in your vehicle drops below 25%, you would use `25.0` here. |
| `REDIS_URL`              | Connection string to a Redis instance where certain variables can be persisted across requests.                                                                                                                            |

## Configuration
When `automatic-ifttt` receives a notification from Automatic that your vehicle's remaining fuel level has dropped below your configured threshold, it triggers an IFTTT Maker Channel event with the following properties:

| Name     | Description                                                                                     |
| -------- | ----------------------------------------------------------------------------------------------- |
| `Value1` | Your vehicle's fuel level percentage at the time the event was triggered.                       |
| `Value2` | The latitude coordinate from your vehicle's last location at the time the event was triggered.  |
| `Value3` | The longitude coordinate from your vehicle's last location at the time the event was triggered. |

You can view an example IFTTT recipe here: https://ifttt.com/recipes/392072-example-automatic-ifttt-recipe

## License
This software, and its dependencies, are distributed free of charge and licensed under the GNU General Public License v2. For more information about this license and the terms of use of this software, please review the LICENSE.txt file.
