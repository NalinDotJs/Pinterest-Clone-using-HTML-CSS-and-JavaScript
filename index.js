var express = require('express');
var router = express.Router();
const usermodel = require('./users');
const postmodel = require('./posts');

const passport = require('passport');
const upload = require('./multer')
const localstrategy = require('passport-local');
passport.use(new localstrategy(usermodel.authenticate())); 

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pinterest' });
});

router.get('/profile', isLoggedIn, async (req,res,next)=>{
  const user = await usermodel.findOne({username: req.session.passport.user})
  .populate('posts')
  console.log(user)
  res.render('profile',{user});
})



router.post('/register',(req,res)=>{
  const user = new usermodel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname
  })

  usermodel.register(user, req.body.password)
  .then(()=>{
    passport.authenticate('local')(req,res,()=>{
      res.redirect('/feed');
    })
  })
})

router.get('/register',(req,res)=>{
  res.redirect('/')
})

router.get('/login',(req,res)=>{
  res.render('login' , { title: 'Login | Pinterest', error: req.flash('error')})
})

router.get('/feed',(req,res)=>{
  res.render('feed' , { title: 'Feeds | Pinterest' })
})

router.post('/upload',isLoggedIn, upload.single('file'), async (req,res,next)=>{
  if(!req.file){
    return res.status(404).send('no files were given')
  }
  const user = await usermodel.findOne({username: req.session.passport.user})
  user.dp = req.file.filename;
  const post = await postmodel.create({
    image: req.file.filename, 
    imageText: req.body.filecaption,
    user: user._id
  })
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile')
})

router.post('/login',passport.authenticate('local',{
  successRedirect: '/feed',
  failureRedirect: '/login',
  failureFlash: true
}),(req,res)=>{});


router.get('/logout', (req,res)=>{
  req.logout((err)=>{
    if(err){return next(err);}
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){ return next();}
  res.redirect('/login')
};

module.exports = router;
