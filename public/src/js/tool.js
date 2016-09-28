function filterImage(images){
  //filter gif
  var i;
  for(i=0;i<images.length;i++){
    if((/\.((?!gif).)*$/).test(images[i])){
      return images[i];
    }
  }
  return 'images/noimage.png';
}

function isMobile(){
  if ($(window).width() / $(window).height() <= 1.0) return true;
  if ($(window).width() <= 480) return true;
  return false;
}
