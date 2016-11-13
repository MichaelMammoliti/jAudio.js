(function(){

  var t = {
    playlist: [
      {
        file: "resources/tracks/01.mp3",
        thumb: "resources/thumbs/01.jpg",
        trackName: "Dusk",
        trackArtist: "Tobu & Syndec",
        trackAlbum: "Single",
      },
      {
        file: "resources/tracks/02.mp3",
        thumb: "resources/thumbs/02.jpg",
        trackName: "Blank",
        trackArtist: "Disfigure",
        trackAlbum: "Single",
      },
      {
        file: "resources/tracks/03.mp3",
        thumb: "resources/thumbs/03.jpg",
        trackName: "Fade",
        trackArtist: "Alan Walker",
        trackAlbum: "Single",
      }
    ]
  }

  $(".jAudio").jAudio(t);

})();