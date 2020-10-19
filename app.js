const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const app = express()
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

//Passport config
require('./config/passport')(passport)

//DB config
const db = require('./config/keys').mongoURI

//Connect to Mongo
mongoose.connect(db, { useUrlParser:true,  useUnifiedTopology: true })
    .then(()=>console.log('MongoDB connected...'))
    .catch(err=>console.log(err))

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//Body Parser
app.use(express.urlencoded({ extended: false }))


//Express session
app.use(session({
    secret: 'ramalaso',
    resave: true,
    saveUninitialized: true,
  }))


app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash())

//Global vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('App listening on port '+ PORT);
});
