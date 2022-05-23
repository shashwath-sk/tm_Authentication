const express = require('express');
// const http = require('http');
const flash = require('connect-flash')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts');
// const req = require('express/lib/request');
const mongoose = require('mongoose');
// const passport = require('./config/passport');
const app =express();
const myKey = require('./config/keys').mongoUri
const passport = require('passport')


//passport config
require('./config/passport.js')(passport);
//body parser
app.use(express.urlencoded({ extended:false}))
//express session middle ware
app.use(session({
    secret: 'blacky',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))
//passport middleware -- very imp to place btwn session and flash
app.use(passport.initialize());
app.use(passport.session())
//connect flash
app.use(flash());  

// global vars
app.use( (req,res,next)=>
{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')
    next()
})
mongoose.connect(myKey,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    family:4
})
const db = mongoose.connection
db.on('error',err=>
{
    console.error(err)
})
db.once('open',()=>
{
    console.log("Connected to mongoose")
})
app.use(expressLayouts)

app.set('view engine','ejs');
app.set('layout','layouts')
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
const PORT = process.env.PORT || 5000 ;

app.listen(PORT , console.log(`Server is running at ${PORT}`));
