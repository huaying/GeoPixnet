
const IPAD_SIZE = 768;
const MapView = React.createClass({
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
      <div>
        <button className="ui circular red icon button refresh_button">
          <i className="refresh icon"></i>
        </button>
        <div id="map"></div>
      </div>
    )
  }
})
const ListView = React.createClass({
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
        <div className="card" id={"card"+(++count)} key={"card"+count} onMouseEnter={this.cardEnter.bind(this, count)} onMouseLeave={this.cardLeave.bind(this, count)}>
            <a href={article.url} target="_blank">
            <div className="ui card-image-cropped image" style={imageStyle}>
              <div className="ui yellow ribbon label">
                {count}
              </div>
            </div>
            </a>
            <div className="content">
              <a href={article.url} target="_blank">
                <h5>{article.title}</h5>
                <div className="small text description">{article.desc}...</div>
              </a>
            </div>

        </div>
      )
    }
    return (
      <div id="list">
        <div className="ten wide column">
          <div className="ui two stackable cards">
            {stores}
          </div>
        </div>
        <Footer />
      </div>

    )
  }
})
const Footer = React.createClass({
  render: function(){
    return (
      <div className="ui vertical footer segment">
        <div className="ui center aligned container">
          <div className = "ui divider"></div>
            <a href="http://huaying.github.io/" target="_blank"><i className="big child icon"></i></a>
            <a href="https://www.facebook.com/HuayingTsai" target="_blank"><i className="big facebook f icon"></i></a>
            <a href="https://github.com/huaying" target="_blank"><i className="big github icon"></i></a>
            <a href="https://www.linkedin.com/in/huayingtsai" target="_blank"><i className="big linkedin icon"></i></a>
            <div className = "ui divider"></div>
            <div className="content">
              <b>地圖美食 - GeoPixnet</b><br/>
              <b>Copyright © 2016 Huaying. All Rights Reserved</b>
            </div>
        </div>
      </div>
    )
  }
})

const MainMenu = React.createClass({
  render: function(){
    return (
      <div className="ui inverted blue fixed main menu">
        <div className="left menu">
          <div className="item">
            <b>
            <i className="map outline icon"></i>
            <i className="food icon"></i>
            地圖美食 - GeoPixnet</b>
            </div>
        </div>
        <div className="right menu">
          <div className="item">
          <a href="mailto:royal3501@gmail.com" target="_blank"><b>Feedback</b></a>
          </div>
        </div>
      </div>
    )
  }
})
const Container = React.createClass({
    getInitialState: function(){
      return {data: []};
    },
    handleDataUpdate: function(data){
      this.setState({data:data})
    },
    render: function(){
      return (
        <div id="container">
          <MainMenu />
          <ListView data={this.state.data}/>
          <MapView onDataUpdate={this.handleDataUpdate}/>
        </div>
      )
    }
})
ReactDOM.render(
  <Container />,
  document.getElementById('container')
);
