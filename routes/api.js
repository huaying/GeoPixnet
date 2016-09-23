var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var ne_lat = Number(req.query.ne_lat);
  var ne_lng = Number(req.query.ne_lng);
  var sw_lat = Number(req.query.sw_lat);
  var sw_lng = Number(req.query.sw_lng);
  var query = {
    location: {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: [
            [[sw_lng, sw_lat ],[ne_lng, sw_lat ],[ne_lng, ne_lat ],[sw_lng, ne_lat ],[sw_lng, sw_lat ]]
          ]
        }
      }
    }
  }
  db.collection('scrapy_items2').find(query).toArray(function(err,data){
    if (err) throw err;
    var stores = {};
    data.map(function(article){
      var key = JSON.stringify(article.location.coordinates);
      if (key in stores) stores[key].push(article);
      else stores[key] = [article];
    })
    res.send(JSON.stringify(stores));
    //res.send(JSON.stringify(data));
  });

});

module.exports = router;
