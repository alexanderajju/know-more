
var express = require('express');
var router = express.Router();
const session = require("express-session");
const { sortPost, getPost } = require('../helper/user_helpers');

/* GET users listing. */

const verifyuser = (req, res, next) => {
  // console.log(req.session.user)
  if (req.session.user) {
    next();
  } else {
    res.redirect("/users/login");
  }
};

router.get('/', function(req, res, next) {

  res.send('respond with a resource');
});

router.get('/login',(req,res)=>{
  if(req.session.user){
 console.log("user present>>>>>>>>>>>>>>")
 console.log(req.session.user,"user>>>>>>>>>>>>>>>>>>")
    res.redirect("/")
  }else{
     console.log("calling /google")
    res.redirect("/google");
    
  }
})

router.post('/search',verifyuser, function(req, res, next) {
  // console.log(req.body.keywords)
  sortPost(req.body.keywords).then((response)=>{
   res.render("posts",{post:response})
  })
  
});
router.get('/po',verifyuser, async (req,res)=>{
  // console.log(req.query.id)
  await getPost(req.query.id).then((response)=>{
    console.log("respos>>>>>>>>>",response)
    res.render("post",{post:response[0]})
  })
})
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("connect.sid"); // clean up!
    res.redirect("/");
  } else {
    return res.json({ msg: "no user to log out!" });
  }
});

module.exports = router;
