var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ZakladShema = new Schema({
    name: String,
    coordinates: String,
    descriptions: String,
    adress: String,
    contacts: Number,
    medianCost: Number,
    image: String,
    distance: Number
}, {
    versionKey: false
});
module.exports = mongoose.model('Zaklad', ZakladShema);