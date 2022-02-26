var express = require('express');
var router = express.Router();
require("../passport_config");
const passport = require("passport");



/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.user){
  let user = req.session.user;
  res.render('index', { title: 'Express' ,user:user});
   console.log(req.session.user,"user>>>>>>>>>>>>>>>>>>")
  }else{
res.render('index', { title: 'Express'});
 console.log(sessionStorage)
  }
  
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

module.exports = router;
