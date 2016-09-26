var express = require('express');
var router = express.Router();

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  const db = req.db;
  const ne_lat = Number(req.query.ne_lat);
  const ne_lng = Number(req.query.ne_lng);
  const sw_lat = Number(req.query.sw_lat);
  const sw_lng = Number(req.query.sw_lng);
  const ne_lat_i = ne_lat + (sw_lat - ne_lat)*0.13;
  const ne_lng_i = ne_lng + (sw_lng - ne_lng)*0.13;
  const sw_lat_i = sw_lat - (sw_lat - ne_lat)*0.13;
  const sw_lng_i = sw_lng - (sw_lng - ne_lng)*0.13;
  const query = {
        location: {
          $geoWithin: {
            $box: [[sw_lng_i, sw_lat_i],[ne_lng_i, ne_lat_i]]
          },
        }
      };
  db.collection('scrapy_items2').find(query).count(function(err, total){
    const skip = Math.floor(Math.random() * ((total-200>0)?total-200: 0));
    db.collection('scrapy_items2').find(query).skip(skip).limit(200).toArray(function(err,data){
      if (err) throw err;
      var stores = {};
      var count = 0;
      var key,i,article;
      const ReturenNum = 30;

      shuffle(data);
      for(i=0; i<data.length; i++){
        article = data[i];
        key = JSON.stringify(article.location.coordinates);
        if (key in stores) stores[key].push(article);
        else {
          if (count++ == ReturenNum)  break;
          stores[key] = [article];
        }
      }
      res.send(JSON.stringify(stores));
    });
  });
});

module.exports = router;
