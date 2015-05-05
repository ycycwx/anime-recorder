var sha1 = require('sha1');

var shows = require('./shows.json');
// console.log(shows[0]);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var animeSchema = new mongoose.Schema({
    title: {type: String, index: {unique: true}},
    // completed : Boolean,
    note: String,
    score: {type: Number, min: 0, max: 100},
    episode: {type: Number, min: 1},
});

var animeModel = mongoose.model('anime', animeSchema);

function insertEntity(entity, model) {

    var anime = new model(entity);

    anime.save(function (err) {
        if (err) // ...
            console.log('Insertion Error');
    });
};

shows.forEach(function(entry){
    // entry["hash"] = sha1(entry.title)
    insertEntity(entry, animeModel);
});

var callback = function (err, data) {
    if (err) return console.error(err);
    else console.log(data);
};

animeModel.find({note: "nice"}, callback);
