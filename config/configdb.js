'use strict'
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/curso_calculo');
mongoose.set('debug', true);