const express = require('express');

const router = express.Router();
const {ensureAuthenticated} = require('../config/auth')
//welcome
router.get('/',(req,res)=> res.render('welcome'));
//DashBoard

router.get('/dashboard',ensureAuthenticated,(req,res)=>
{
    res.render('dashboards',{
        name:req.user.name
    })
})


module.exports = router;