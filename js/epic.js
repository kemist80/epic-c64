var musicData;
var index=0;
var videoId='U9Racui9jJI';
var filtered=false;
var filteredMusicData=[];

$(document).ready(function () {
  
  filtered=$('#filter').prop('checked');
  
  loadJsonData(function(){
    drawLinks();
    playMusic();
  });
  
  $('#next').click(function(){
    if (index < filteredMusicData.length){
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
  
  $('#rand').click(function(){
    index=Math.floor(Math.random() * (filteredMusicData.length ));
    playMusic();    
  });
  
  $('#filter').click(function(){
    filtered=$(this).prop('checked');
    drawLinks();
  });  
});


function loadJsonData(callback) {
  $.getJSON("epic.json", function (json) {
    musicData=json.songs;
    callback();
  });
}

function playMusic(idx){
  var iframe=$('#video-frame');
  if (typeof idx !== 'undefined'){
    index=idx;
  }
  var item=filteredMusicData[index];
  if (item.youtube){
    $('#author').html(item.author);
    $('#title').html(item.title);
    $('#position').html((index+1)+' / '+filteredMusicData.length);
    $('#hvsc').attr('href',item.hvsc);
    var temp=item.offset.split(':');
    var startSeconds=parseInt(temp[0]*60*60)+parseInt(temp[1]*60)+parseInt(temp[2]);
    var nextItem=filteredMusicData[(index+1)];
    var end='';
    if (nextItem){
      var endTemp=nextItem.offset.split(':');
      var endSeconds=parseInt(endTemp[0]*60*60)+parseInt(endTemp[1]*60)+parseInt(endTemp[2]);
      end='&end='+endSeconds;
    }
    iframe.attr('src','https://www.youtube-nocookie.com/embed/'+videoId+'?rel=0&autoplay=1&start='+startSeconds+end);
    $('#links a').removeClass('selected');
    $('#link'+index).addClass('selected');
  }
}

function drawLinks(){
  var links=$('#links');
  links.html('');
  var item,link;
  var j=0;
  filteredMusicData=[];
  for (var i=0;i<musicData.length;i++){
    item=musicData[i];    
    if (!filtered || item.favourite){
      link=$('<a id="link'+j+'" onclick="playMusic('+j+');">'+(j+1)+'. '+item.title+' - '+item.author+'</a>');
      links.append(link);
      filteredMusicData.push(item);
      j++;
    }
  }
  $('#position').html((index+1)+' / '+filteredMusicData.length);
}