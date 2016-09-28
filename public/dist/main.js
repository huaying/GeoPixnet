
const IPAD_SIZE = 768;
const MapView = React.createClass({displayName: "MapView",
  mapUpdate: function(){
    Map.resetSelectMarker();
    const cookies = {
      lat: Map.map.getCenter().lat(),
      lng: Map.map.getCenter().lng(),
      zoom:Map.map.getZoom()
    };
    Cookies.set('map_info',cookies);
    this.retrieveData();
    $('html, body').animate({
        scrollTop: $("#container").offset().top - 50
    }, 250);
  },
  retrieveData: function(){
    const that = this;
    const bounds = Map.map.getBounds();

    $('.refresh_button').off('click',this.retrieveData).addClass('loading');
    $.ajax({
      url: "./api/",
      dataType: "json",
      data: {
        ne_lat: bounds.getNorthEast().lat(),
        ne_lng: bounds.getNorthEast().lng(),
        sw_lat: bounds.getSouthWest().lat(),
        sw_lng: bounds.getSouthWest().lng()
      },
      success: function(data){
        var lat,lng,coordinates_s,coordinates,id=0;
        that.props.onDataUpdate(data);
        Map.deleteMarkers()

        for(coordinates_s in data){
          coordinates = JSON.parse(coordinates_s);
          lat = coordinates[1];
          lng = coordinates[0];
          Map.addMarker(lat,lng,++id, data[coordinates_s][0]);
        }
      },
      complete: function(){
        $('.refresh_button').on('click',this.retrieveData).removeClass('loading');
      }
    });
  },
  componentDidMount: function(){
    var lat = 25.0468165,lng=121.507962, zoom=16; //Taipei;
    const that = this;
    const map_info = Cookies.getJSON('map_info');

    if(!$.isEmptyObject(map_info)){
      lat = map_info.lat;
      lng = map_info.lng;
      zoom = map_info.zoom;
    }
    Map.init("map",lat,lng,zoom);
    Map.addEventOnce('bounds_changed', this.mapUpdate);
    $('.refresh_button').on('click',this.mapUpdate)
  },
  render:function(){
    return (
      React.createElement("div", null, 
        React.createElement("button", {className: "ui circular red icon button refresh_button"}, 
          React.createElement("i", {className: "refresh icon"})
        ), 
        React.createElement("div", {id: "map"})
      )
    )
  }
})
const ListView = React.createClass({displayName: "ListView",
  cardEnter:function(number){
      Map.highlightMarker(number-1);
  },
  cardLeave:function(number){
      Map.deHighlightMarker(number-1);
  },
  render:function(){
    var data = this.props.data;
    var stores = [];
    var store, article, coordinates;
    var count = 0;
    var imageStyle = "";
    for(coordinates in this.props.data){
      store = data[coordinates];
      article = store[0];
      imageStyle = {
        backgroundImage: 'url('+filterImage(article.images)+')'
      }
      stores.push(
        React.createElement("div", {className: "card", id: "card"+(++count), key: "card"+count, onMouseEnter: this.cardEnter.bind(this, count), onMouseLeave: this.cardLeave.bind(this, count)}, 
            React.createElement("a", {href: article.url, target: "_blank"}, 
            React.createElement("div", {className: "ui card-image-cropped image", style: imageStyle}, 
              React.createElement("div", {className: "ui yellow ribbon label"}, 
                count
              )
            )
            ), 
            React.createElement("div", {className: "content"}, 
              React.createElement("a", {href: article.url, target: "_blank"}, 
                React.createElement("h5", null, article.title), 
                React.createElement("div", {className: "small text description"}, article.desc, "...")
              )
            )

        )
      )
    }
    return (
      React.createElement("div", {id: "list"}, 
        React.createElement("div", {className: "ten wide column"}, 
          React.createElement("div", {className: "ui two stackable cards"}, 
            stores
          )
        ), 
        React.createElement(Footer, null)
      )

    )
  }
})
const Footer = React.createClass({displayName: "Footer",
  render: function(){
    return (
      React.createElement("div", {className: "ui vertical footer segment"}, 
        React.createElement("div", {className: "ui center aligned container"}, 
          React.createElement("div", {className: "ui divider"}), 
            React.createElement("a", {href: "http://huaying.github.io/", target: "_blank"}, React.createElement("i", {className: "big child icon"})), 
            React.createElement("a", {href: "https://www.facebook.com/HuayingTsai", target: "_blank"}, React.createElement("i", {className: "big facebook f icon"})), 
            React.createElement("a", {href: "https://github.com/huaying", target: "_blank"}, React.createElement("i", {className: "big github icon"})), 
            React.createElement("a", {href: "https://www.linkedin.com/in/huayingtsai", target: "_blank"}, React.createElement("i", {className: "big linkedin icon"})), 
            React.createElement("div", {className: "ui divider"}), 
            React.createElement("div", {className: "content"}, 
              React.createElement("b", null, "地圖美食 - GeoPixnet"), React.createElement("br", null), 
              React.createElement("b", null, "Copyright © 2016 Huaying. All Rights Reserved")
            )
        )
      )
    )
  }
})

const MainMenu = React.createClass({displayName: "MainMenu",
  render: function(){
    return (
      React.createElement("div", {className: "ui inverted blue fixed main menu"}, 
        React.createElement("div", {className: "left menu"}, 
          React.createElement("div", {className: "item"}, 
            React.createElement("b", null, 
            React.createElement("i", {className: "map outline icon"}), 
            React.createElement("i", {className: "food icon"}), 
            "地圖美食 - GeoPixnet")
            )
        ), 
        React.createElement("div", {className: "right menu"}, 
          React.createElement("div", {className: "item"}, 
          React.createElement("a", {href: "mailto:royal3501@gmail.com", target: "_blank"}, React.createElement("b", null, "Feedback"))
          )
        )
      )
    )
  }
})
const Container = React.createClass({displayName: "Container",
    getInitialState: function(){
      return {data: []};
    },
    handleDataUpdate: function(data){
      this.setState({data:data})
    },
    render: function(){
      return (
        React.createElement("div", {id: "container"}, 
          React.createElement(MainMenu, null), 
          React.createElement(ListView, {data: this.state.data}), 
          React.createElement(MapView, {onDataUpdate: this.handleDataUpdate})
        )
      )
    }
})
ReactDOM.render(
  React.createElement(Container, null),
  document.getElementById('container')
);
