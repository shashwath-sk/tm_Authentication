const LocalStartergy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const users = require('../model/users')

module.exports = function(passport){
    passport.use( new LocalStartergy( {usernameField:'email'},(email,password,done)=>
    {
        users.findOne({email:email}).then( user=>
            {
                if(!user)
                {
                    return done(null,false,{message : 'That email is not registered'})
                }
                else
                {
                    bcrypt.compare(password,user.password,(err,isMatch)=>
                    {
                        if(err)
                        {
                            // return done(err,false,{message:'Error occured while bcrypting'})
                            throw err
                        }
                        if(isMatch)
                        {
                            return done(null,user)
                        }
                        else
                        {
                            return done(null,false,{message:'Password incorrect'})
                        }
                    })
                }
            })
            .catch( err=>console.log(err))
    }))



passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    users.findById(id, function(err, user) {
      done(err, user);
    });
  });

}