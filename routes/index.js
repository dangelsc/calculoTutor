var express = require('express');
var router = express.Router();
var usuario=require("../modelo/usuario");
module.exports =function(passport){
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
  }
/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  console.info("/////////////////////////////////",req.user);
  res.render('index', { titulo: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.post('/login',  passport.authenticate('local', { successRedirect: '/',
failureRedirect: '/login',
failureFlash: false })
);
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});
///google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email']}));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback', 
  passport.authenticate('google', { successRedirect:'/', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
///local
router.get('/registro', function(req, res, next) {
  res.render('registro', { title: 'Express' });
});
router.post('/registro', function(req, res, next) {
  var x=new usuario({
    nombre:req.body.nombre,
    apellidos:req.body.apellidos,
    email:req.body.email,
    edad:req.body.edad,
    contrasena:req.body.contrasena,
    genero:req.body.genero,
    estado:1
  });
  x.save().then(function(e){
    console.log(e);
  });
  res.redirect('/login');
  res.render('registro', { title: 'Express' });
});
return  router;
}
