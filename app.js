var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var config = require('./config/configdb');
var User=require('./modelo/usuario'); 
var flash = require('connect-flash');
 



var app = express();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey',cookie : {
  expires: false,
  //domain: config.cookie.domain
  },
  //store: redisSessionStore
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }      
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
passport.use(new GoogleStrategy({
  clientID:"315280222826-elbngt2abk2lhikseq4fquolosogd146.apps.googleusercontent.com",
  clientSecret: "hZozIw4MbttM7I2V1dkVkTEK",
  callbackURL: "http://localhost:3000/auth/google/callback"
                                     
},
function(token, tokenSecret, profile, done) {
  console.log("*************************************************");
  console.log(token+"----"+tokenSecret);
    User.findOne({ 'google.id': profile.id }, function (err, user) {
      console.info("este es el usuario registrado",user);
      if(err)
        return done(err);
      if(user)
        return done(null, user);  
      else
        {
          var cre=new User();
          cre.google.id=profile.id;
          cre.google.token=token;
          cre.google.name=profile.displayName;
          cre.google.email=profile.emails[0].value;
          cre.save(function(err){
            if(err)
              throw err;
            return done(null,cre);
          })
        //return done(err, user);
        }
    });
}
));
//app.use((req, res, next) => {req.user = req.user; next()})
var tema=require('./modelo/temas');
app.use(function(req, res, next){
  res.locals.user = req.user || null
  tema.find((err,lista)=>{
    res.locals.listamenu=lista;
    next();
  });
  
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




var index = require('./routes/index')(passport);
var temas = require('./routes/temas');
var users = require('./routes/users');



app.use('/', index);
app.use('/users', users);
app.use('/temas', temas);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
