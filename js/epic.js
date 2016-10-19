var musicData;
var index=0;
var videoId='U9Racui9jJI';

$(document).ready(function () {
  
  loadJsonData(function(){
    drawLinks();
    playMusic();
  });
  
  $('#next').click(function(){
    if (index < 207){
      index++;
      playMusic();
    }
  });
  
  $('#prev').click(function(){
    if (index > 0){
      index--;
      playMusic();
    }
  });
});


function loadJsonData(callback) {
  $.getJSON("epic.json", function (json) {
    musicData=json.favourites;
    callback();
  });
}

function playMusic(idx){
  var iframe=$('#video-frame');
  if (typeof idx !== 'undefined'){
    index=idx;
  }
  var item=musicData[index];
  if (item.youtube){
    $('#author').html(item.author);
    $('#title').html(item.title);
    $('#position').html((index+1)+' / 209');
    var temp=item.offset.split(':');
    var startSeconds=parseInt(temp[0]*60*60)+parseInt(temp[1]*60)+parseInt(temp[2]);
    var nextItem=musicData[(index+1)];
    var end='';
    if (nextItem){
      var endTemp=nextItem.offset.split(':');
      var endSeconds=parseInt(endTemp[0]*60*60)+parseInt(endTemp[1]*60)+parseInt(endTemp[2]);
      end='&end='+endSeconds;
    }
    iframe.attr('src','https://www.youtube-nocookie.com/embed/'+videoId+'?rel=0&autoplay=1&start='+startSeconds+end);
  }
}

function drawLinks(){
  var links=$('#links');
  links.html('');
  var item,link;
  for (var i=0;i<musicData.length;i++){
    item=musicData[i];
    link=$('<a style="display: block; text-align: left; cursor: pointer" onclick="playMusic('+i+');">'+(i+1)+'. '+item.title+' - '+item.author+'</a>');
    links.append(link);
  }
  
}