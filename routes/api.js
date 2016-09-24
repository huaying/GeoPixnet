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
  const query = {
        location: {
          $geoWithin: {
            $box: [[sw_lng, sw_lat],[ne_lng, ne_lat]]
          },
        }
      };
  db.collection('scrapy_items2').find(query).count(function(err, total){
    console.log(total)
    const skip = Math.floor(Math.random() * ((total-200>0)?total-200: 0));
    db.collection('scrapy_items2').find(query).skip(skip).limit(200).toArray(function(err,data){
      if (err) throw err;
      var stores = {};
      var count = 0;
      var key,i,article;
      const ReturenNum = 30;

      //if(data.length > ReturenNum) shuffle(data);
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
