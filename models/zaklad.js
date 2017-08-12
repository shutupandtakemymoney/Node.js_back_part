var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ZakladShema = new Schema({
    Name: String,
    Coordinates: Number,
    Descriptions: Number,
    Adress: Number,
    Contacts: Number,
    Distance: Number
}, {
    versionKey: false
});
module.exports = mongoose.model('Zaklad', ZakladShema);