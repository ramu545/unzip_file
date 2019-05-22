const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const StreamZip = require('node-stream-zip');

const uploadRouter = require('./routes/uploadRouter');

const BUCKET_NAME = 'laalsadev';
const expires = 60 * 60;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(path.join(__dirname)));
// app.use(express.static(path.join(__dirname,'views')));
app.use('/',uploadRouter);
app.listen(4040, () => {
    console.log('App is listening on port 4040');
});