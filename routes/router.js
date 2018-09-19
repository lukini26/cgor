var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Pokedex = require('pokedex') ; 

router.get('/pokedex', function(req,res,next){
  pokedex = new Pokedex() ; 
    res.render('pokdex', {pokedex: pokedex}) ; 

})
  



// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
});


//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
      pokeid: req.body.pokeid, 
      team: req.body.team , 
      nomape: req.body.nomape
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})





//custom

router.get('/list', (req, res) =>{
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          if (user === null) {
            var err = new Error('Not authorized! Go back!');
            err.status = 400; 
            return next(err);
          } else { User.find().sort({team: 1})
            .then((users) => {
             
              res.render('list', { title: 'users', users : users,team: user.team , uemail: user.email , uname: user.username , uid: user.pokeid});
            })
              
          }
        }
      });
  }
  
)
  
  
  
  
  
  
  
  
 


router.get('/test',(req,res)=>{
res.render('profile',{title: 'test'});

})




// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400; 
          return next(err);
        } else {req.session.user = user ; 
          return res.render('profile' , { team: user.team , uemail: user.email , uname: user.username , uid: user.pokeid} )
          
          //('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>'
        //+'<br><a type="button" href="/list">Listado de Usuarios</a>')
        }
      }
    });
});
  


// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;