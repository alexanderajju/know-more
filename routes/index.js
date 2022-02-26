var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.user){
  let user = req.session.user;
  res.render('index', { title: 'Express' ,user:user});
   console.log(req.session.user,"user>>>>>>>>>>>>>>>>>>")
  }else{
res.render('index', { title: 'Express'});
 console.log(req.session.user,"user12345>>>>>>>>>>>>>>>>>>")
  }
  
});



module.exports = router;
