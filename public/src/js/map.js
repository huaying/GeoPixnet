
var Map = {
   map: null
  ,infowindow: null
  ,markers: []
  ,init: function(map_id,lat,lng,zoom){
    this.map = new google.maps.Map(document.getElementById(map_id), {
      center: {lat: lat, lng:lng},
      zoom: zoom,
      disableDefaultUI: true,
      mapTypeControl: false,
      zoomControl: true,
      streetViewControl:true
    });
    this.map.addListener('click',this.resetSelectMarker.bind(this));
  }
  ,addEventOnce:function(event_name, callback){
    google.maps.event.addListenerOnce(this.map,event_name, callback);
  }

  //Marker Handler
  ,resetSelectMarker: function(){
    $('.card').removeClass("focus");

    if (this.infowindow) this.infowindow.close();
  }
  ,showMarkers: function() {
    this.setMapOnAll(this.map);
  }
  ,clearMarkers: function() {
    this.setMapOnAll(null);
  }
  ,deleteMarkers: function(){
    this.clearMarkers();
    this.markers = [];
  }
  ,addMarker: function(lat,lng,number,article) {
    var marker = new MarkerWithLabel({
        position: new google.maps.LatLng(lat, lng),
        map: this.map,
        raiseOnDrag: true,
        labelContent: String(number),
        labelAnchor: new google.maps.Point(10, 10),
        labelClass: "map-labels", // the CSS class for the label
        labelInBackground: false,
        icon: this.pinSymbol()
    });

    marker.addListener('click',function(){
      var offset = 0;
      this.resetSelectMarker();
      if (isMobile()){
        offset = $(window).height() * 0.4;
      }else{
        this.createInfoBox(article);
        this.infowindow.open(this.map,marker);
      }

      $('html, body').animate({
          scrollTop: $("#card"+number).offset().top - 60 - offset
      }, 250);
      $("#card"+number).addClass("focus");
    }.bind(this));
    this.markers.push(marker);
  }
  //////////////////////////////////////

  ,setMapOnAll: function(map) {
    for (var i = 0; i < this.markers.length; i++) {
      if(map === null) google.maps.event.clearInstanceListeners(this.markers[i]);
      this.markers[i].setMap(map);
    }
  }
  ,pinSymbol: function(color) {
    if(!color) color ="#2185D0";
      return {
          path: 'M -10 -10 L 10 -10 L 10 10 L 3 10 L 0 14  L -3 10 L -10 10 Z',
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#D4D4D5',
          strokeWeight: 1,
      };
  }
  ,createInfoBox: function(article){
    this.infowindow = new InfoBox({
      boxStyle: {
              background: "#FFF"
              ,width:"150px"
            },
      pixelOffset: new google.maps.Size(-75, 13),
      content: ['<div class="ui card">',
                    '<div class="card-image-cropped image" style="background-image:url('+filterImage(article.images)+');">',
                    '</div>',
                    '<div class="content">',
                      '<h5>'+article.title+'</h5>',
                    '</div>',
                  '</div>'
        ].join(""),
      closeBoxURL: "",
    });
  }

  ,highlightMarker: function(index){
    this.markers[index].setIcon(this.pinSymbol("#FBBD08"));
    this.markers[index].setZIndex(1000);
  }
  ,deHighlightMarker: function(index){
    this.markers[index].setIcon(this.pinSymbol());
    this.markers[index].setZIndex(1);
  }

};
