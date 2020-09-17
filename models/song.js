const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const Song = Schema({
    songId: String,
    songTitle: String
});

module.exports = mongoose.model('Song', Song);