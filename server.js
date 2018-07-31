require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('cookie-session');
const flash = require('connect-flash');
const csrf = require('csurf');
const crypto = require('crypto');
const cors = require('cors');
const morgan = require('morgan');

//globals
const app = express();
const PORT = process.env.PORT || 3000;
const secret = process.env.SECRET_KEY;
const { admin, referrer, home, api } = require('./routes');
//set templating engine
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

//csurf route middlewares
//password hashing
app.use(session({ secret }));
app.use(cors());
app.use('/vhx', api); // make sure this is before CSRF
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(csrf({ cookie: false }));

//initializing passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//flash messages
app.use(flash());

app.use(function (req, res, next) {
  res.locals.message = req.flash('message');
  res.locals.success = req.flash('success');
  res.locals.currentUser = req.user;
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use('/', home);
app.use('/admin', admin);
app.use('/referrer', referrer);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  return next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.render('partials/error', {
    message: err.message,
    /*
     if we're in development mode, include stack trace (full error object)
     otherwise, it's an empty object so the user doesn't see all of that
    */
    error: app.get('env') === 'development' ? err : {}
  });
});

app.listen(PORT, function () {
  console.log(`Express is running on port ${PORT}`);
});
