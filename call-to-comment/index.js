const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;

const app = express();

// Parse incoming POST params with Express middleware
app.use(urlencoded({ extended: false }));

app.post('/voice', (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();

    /** helper function to set up a <Gather> */
    function gather() {
        const gatherNode = twiml.gather({ numDigits: 1 });
        gatherNode.say('For sales, press 1. For support, press 2.');

        // If the user doesn't enter input, loop
        twiml.redirect('/voice');
    }

    // If the user entered digits, process their request
    if (request.body.Digits) {
        switch (request.body.Digits) {
            case '1':
                twiml.say('You selected sales. Good for you!');
                break;
            case '2':
                twiml.say('You need support. We will help!');
                break;
            default:
                twiml.say("Sorry, I don't understand that choice.").pause();
                gather();
                break;
        }
    } else {
        // If no input was sent, use the <Gather> verb to collect user input
        gather();
    }

    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
});

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
        console.log('Node app is running on port', PORT)
})