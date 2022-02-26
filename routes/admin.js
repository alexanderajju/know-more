
var express = require('express');
var router = express.Router();
const {
  doAdminLogIn,
 addPost,
 getAllPost,
 sortPost
} = require("../helper/user_helpers");


const verifyAdmin = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin/login" );
  }
};

/* GET home page. */
router.get('/',verifyAdmin, function(req, res, next) {
  getAllPost().then((response)=>{
res.render('admin/home',{  admin: true,post:response });
  })
});


router.get("/login", (req, res) => {
  console.log(req.session.admin,"admin>>>>>>>>")
  if (req.session.admin!=null) {
    res.redirect("/");
  } else {
    res.render("admin/adminlogin", { loginErr: req.session.userLoginErr });
    req.session.userLoginErr = null;
  }
});

router.post("/login", (req, res) => {
  doAdminLogIn(req.body).then((response) => {
    if (response.status) {
      req.session.admin = response.username;
      req.session.user = response.username;
      req.session.admin.loggedIn = true;
      res.redirect("/admin");
    } else {
      req.session.userLoginErr = "Invalid admin or password";
      res.redirect("/admin/login");
    }
  });
});
router.get("/posts",verifyAdmin,(req,res) => {
    res.render("admin/posts")
})
router.post("/posts",(req,res) => {
    addPost(req.body).then((response)=>{
if(response==true){
res.redirect("/admin")
        }
    })
   
})

router.get("/logout", (req, res) => {
  req.session.admin = null;
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
