var mongoose = require('mongoose');

var animeSchema = new mongoose.Schema({
    title: {type: String, index: {unique: true}},
    // completed : Boolean,
    note: {type: String, default: null},
    score: {type: Number, min: 0, max: 100},
    episode: {type: Number, min: 1},
    year: {type: Number, min: 1960, max: 2099},
    done: {type: Boolean, default: false}
});

module.exports = mongoose.model('anime', animeSchema);

// var animeModel = mongoose.model('anime', animeSchema);
// module.exports = mongoose.model('anime', animeSchema);

// var callback = function (err, data) {
//     if (err) return console.error(err);
//     else console.log(data);
// };

// animeModel.find({note: "nice"}, callback);
