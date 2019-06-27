var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var firebaseAdminDb = require('../connection/firebase_admin');
const RestaurantRef = firebaseAdminDb.ref('/RestaurantItem');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'index',
    errors:req.flash('errors')
  });
  console.log('index');
});



router.post('/RestaurantAJAX', function(req, res) {
  res.send('ajax done');
});

router.post('/addRestaurant', function(req, res) {
  req.checkBody("newName","內容不得為空").notEmpty();
  req.checkBody("newAdress","內容不得為空").notEmpty();
  req.checkBody("newDesc","內容不得為空").notEmpty();
  req.checkBody("newPrice","內容不得為空").notEmpty();
  var errors = req.validationErrors();
  if(errors){
    req.flash('errors',errors[0].msg);
    res.redirect('/');
  }else{
    const data = req.body;
    const restaurantRef = RestaurantRef.push();
    const key = restaurantRef.key;
    const updateTime = Math.floor(Date.now() / 1000);
    data.id = key;
    data.update_time = updateTime;
    console.log(data);
    restaurantRef.set(data).then(function(){
        res.redirect('/');
    });
  }
  
});



router.get('/getRestaurantList', function(req, res, next) {
  RestaurantRef.once('value',function(snapshot){
    res.send({
      "success":true,
      "result":snapshot,
      "length":snapshot.numChildren(),
      "message":"成功!!"
    })
  });

});

router.post('/deleteRestaurant', function(req, res){
  var id = req.body.id;
  // console.log(id);
  const restaurantRefs = RestaurantRef.push();
  RestaurantRef.child(id).remove();
  console.log(id);
  res.end();
});




module.exports = router;
