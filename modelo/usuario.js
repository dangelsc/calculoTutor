var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
const crypto = require('crypto');
var Schema = new Schema({
  nombre:    { type: String },
  apellidos:     { type: String },
  email:  { type: String },
  edad:   { type: Number },
  contrasena:  { type: String },
  genero:    { type: String, enum: ['H', 'M'] },
  estado:  { type: String },
  google:{
      id:String,
      token:String,
      email:String,
      name:String
  }
});
Schema.methods.validPassword=function(pass){
    const secret = pass;
    const hash = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes123456')
                   .digest('hex');
    console.log(this.contrasena+"--"+hash);
    
    return this.contrasena==hash;
}
Schema.methods.encodePassword=function(pass){
    const secret = pass;
    console.log(pass);
    if(secret!=undefined){
        console.log(pass);
    const hash = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes123456')
                   .digest('hex');
    
        return hash;
    }
    else
        return "";
}
Schema.pre('save',function(next){
    this.contrasena=this.encodePassword(this.contrasena);
    next();
});

module.exports = mongoose.model('tbusuario', Schema);