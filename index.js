const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

mongoose.Promise = global.Promise;

app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const song_routes = require('./controllers/song-controller'); 

app.use('/', song_routes);

mongoose.connect('mongodb://localhost:27017/bd-spotify')
.then(() => {
    console.log("connected to mongodb")
    app.listen(3000);
})
.catch(err => console.log(err));