const express = require('express');
// const { findOne } = require('../model/users');
const router = express.Router();
const Myusers = require('../model/users')
const bcrypt = require('bcryptjs');
const passport = require('passport')

//route login
router.get('/login',(req,res)=> res.render('login'));

//route register
router.get('/register',(req,res)=>
{
    res.render('register')
});

router.post('/login',(req,res,next)=>
{
    // res.end("hey u just loged in")
    // res.render('dashboards')
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect :'./login',
        failureFlash : true
    })(req,res,next)
})

router.post('/register',(req,res)=>
{
    // console.log(req.body)
    const { name ,email , password , password2} = req.body
     let errors = []
    if(!name || !email|| !password|| !password2)
    {
        errors.push({ msg : "All fields are mandatory"})
    }
    if(password !== password2)
    {
        errors.push({ msg : "confirm your password, its not matching"})
    }
    if(password.length<6)
    {
        errors.push({ msg : "password must be atleast 6 characters"})
    }
    if(errors.length>0)
    {
        console.log(errors)
        res.render('register', 
        {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        Myusers.findOne({email : email}).then( user=>
            {
                if(user)
                {
                errors.push({msg:"Email already exists"})
                res.render('register',{
                    errors,
                    name,
                    password,
                    password2
                })
                }
                else
                {

                // console.log(req.body)
                const newUser = new Myusers({  
                    name:name,
                    email:email,
                    password:password    
                })
                bcrypt.genSalt(10, (err,salt)=>
                {
                    bcrypt.hash(newUser.password,salt,(err,hash)=>
                    {
                        if(err) throw err
                        newUser.password = hash;
                        newUser.save().then( user=>
                            { 
                                req.flash('success_msg','You are now registered and can log in')
                                res.redirect('./login')
                            })
                            .catch(err=> console.log(err))
                        
                })
                })
                 }     
            })
        } 
    })

            // }
        // catch{
        //     errors.push({msg:"Error occured,Please try again"})
        //     res.render('register',{
        //         errors,
        //         name,
        //         password,
        //         password2})
                   

router.get('/logout',(req,res)=>
{
    req.logout();
    req.flash('success_msg','You are logged out')
    res.redirect('./login')
})
module.exports = router