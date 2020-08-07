// require dependencies
const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

// variables
let sentiment;

// create express app
const app = express();

/* Dependencies */
dotenv.config();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// point to dist folder
app.use(express.static('dist'));

/* Setup Server */
const port = 8080;

// Spin up the server
const server = app.listen(port, listening);

// Callback to debug
function listening() {
    console.log("server running");
    console.log(`running on localhost: ${port}`);

// root route
app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
    // res.sendFile(path.resolve('src/client/views/index.html'))
});

// get sentiment route sends the sentiment object to client
app.get('/sentiment', (req, res) => {
    res.send(sentiment);
});

// post url route to call the api
app.post('/title', async (req, res) => {
    console.log(`https://api.meaningcloud.com/sentiment-2.1?key=${process.env.API_KEY}&lang=en&url=${req.body.urlKey}`);
    try {
        console.log(req.body);
        const result = await axios.post(
            `http://api.meaningcloud.com/sentiment-2.1?key=${process.env.API_KEY}&of=json&lang=en&txt=&url=${req.body.urlKey}` // TODO make sure the url is piping correctly
        );
        // console.log("result", result);
        const { data } = result;
        // console.log("data", data);
        const code = data.status.code;
        console.log("code", code);
        // check code for error - code 200 indicates error
        if (code !== "200") {
            const score_tag = data.score_tag;
            const agreement = data.agreement;
            const subjectivity = data.subjectivity;
            const confidence = data.confidence;
            const irony = data.irony;
            console.log("score_tag", score_tag);
            console.log("agreement", agreement);
            console.log("subjectivity", subjectivity);
            console.log("confidence", confidence);
            console.log("irony", irony);

            // const { score_tag, agreement, subjectivity, confidence, irony } = data;
            
            // store api response in sentiment object
            sentiment = {
                score_tag,
                agreement,
                subjectivity, 
                confidence, 
                irony
            };
            // for (let i=0; i<sentiment.length; i++) {
            //     sentiment[i] = sentiment[i].charAt(0).toUpperCase() + sentiment[i].slice(1).toLowerCase()
            // };
            console.log('sentiment', sentiment);
        } else {
            // if there was an error falsify the sentiment object
            sentiment = false;
        } res.send(sentiment);
        

    } catch (error) {
        console.log(`Error = ${error}`);
    }
});
}

// var textapi = new sentiment({
//     application_key: process.env.API_KEY
//  });





// const corsOptions = {
//     origin: 'http://api.openweathermap.org',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }



// console.log(__dirname)




