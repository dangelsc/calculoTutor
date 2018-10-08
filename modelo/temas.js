var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var Schema = new Schema({
  titulo:    { type: String },
  contenido:     { type: String },
  tipo:    { type: String, enum: ['s', 'p'] },
  dificultad:    { type: String, enum: ['b', 'm','a'] },
  estado:  { type: String }
});
module.exports = mongoose.model('tbtemas', Schema);