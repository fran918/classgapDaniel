var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var autorSchema = new Schema({
	nombre: String,
    title: String,
    fecha: String,
    nacionalidad: String
});
module.exports = mongoose.model('Autor', autorSchema);