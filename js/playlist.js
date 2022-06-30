//const player = videojs("player");

const player = videojs(document.querySelector('video'), {
    inactivityTimeout: 0
});

var currentItem = 0

//Table rows draggable
var fixHelperModified = function(e, tr) {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function(index) {
        $(this).width($originals.eq(index).width())
    });
    return $helper;
},
    updateIndex = function(e, ui) {
        console.log("drag-e",e);
        console.log("drag-ui",ui);

        $('td.index', ui.item.parent()).each(function (i) {
            $(this).html(i+1);
        });
    };

//Table rows re-order
$("#playlist-tbl tbody").sortable({
    helper: fixHelperModified,
    stop: updateIndex
}).disableSelection();

$("tbody").sortable({
    distance: 5,
    delay: 100,
    opacity: 0.6,
    cursor: 'move',
    update: function() {}
});

//Default playlist array. ToDo: Get the playlist from API
var playlist = [
    {
        sources: [{
          src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
          type: 'video/mp4'
        }],
        poster: "",
        title : "Test video 1"
    },
    {
        sources: [{
          src: 'http://media.w3.org/2010/05/bunny/movie.mp4',
          type: 'video/mp4'
        }],
        poster: "",
        title : "Test video 2"
    }
]



const init = function(){
    updateTableRows();
    player.playlist(playlist);
}

const updateTableRows = function() {
    //Clear the table content to update
    $('#tbl-body').empty()

    var tableRows = '';

    //Iterate table rows
    playlist.map((pl,i)=>{
        var title = pl.title;
        var src = pl.sources[0].src
        var currentItemStyle = '';

        if(currentItem == i) {
            currentItemStyle = 'currently-playing'
        }

        tableRows += '<tr class='+currentItemStyle+'><td>'+pl.title+'</td>'
        +'<td>'
        +'<i class="fa fa-play-circle action" onClick=\'playVideo("'+i+'")\' />'
        +'<i class="fa fa-trash action" onClick=\'deleteVideo('+i+')\' />'
        +'</td></tr>';
    })


    //Update table content
    $('#tbl-body').append(tableRows)
}

const deleteVideo = function(id) {

    $('#confirm').modal({
        backdrop: 'static',
        keyboard: false
    })
    .on('click', '#delete', function(e) {
        playlist.splice(id, 1);
        updateTableRows();
      });
    $("#cancel").on('click',function(e){
        $('#confirm').modal.model('hide');
    });
}

const getVideoType = function(url) {
    if(url.endsWith(".mp4")){
        content_type = "video/mp4";
    }else if(url.endsWith(".m3u8")){
        content_type = "application/x-mpegURL";
    }else if(url.endsWith(".mpd")){
        content_type = "application/dash+xml"
    }else{
        alert("Unsupported format");
    }

    return content_type
}

const playVideo = function(id) {
    player.playlist.currentItem(parseInt(id));
}



$('#save').click(function(){
    //Close Add Videos Modal
    $('#playlistVideoAdd').modal('toggle');

    //Append data to playlist array
    var url = $('#video_url').val();
    var name = $('#video_name').val()
    playlist.push({
        sources: [
          {
            src: url,
            type: getVideoType(url)
          }
        ],
        poster: "",
        title : name
      })

    //Update table rows
    updateTableRows();
    player.playlist(playlist);

})

$(document).ready(function(){
    //Initialize with playlist data and generate the table
    init();

    player.playlist.autoadvance(0);

    player.on('play', function () {
        currentItem = player.playlist.currentItem()
    });

    setInterval(() => updateTableRows(), 5000)
})