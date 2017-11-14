var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Autor = mongoose.model('Autor');

var libroSchema = new Schema({
	isbn: String,
    title: Number,
    publisher: String,
    autor: { type: Schema.ObjectId, ref: "Autor" } ,
    price:Number
}); 
module.exports = mongoose.model("Libro", libroSchema);