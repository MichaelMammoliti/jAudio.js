// - Controls

var play  = document.querySelector("#play"),
    prev  = document.querySelector("#prev"),
    next  = document.querySelector("#next"),
    stop  = document.querySelector("#stop"),

// - Time
    elapsedTime   = document.querySelector("#elapsedtime"),
    totalTime     = document.querySelector("#totaltime"),
    progressBar   = document.querySelector("#progressbar"),
    audioControls = document.querySelector("#controls"),

// - UI elements
    audio       = document.querySelector("#mytrack"),
    tracks      = document.querySelector("#tracks"),
    artwork     = document.querySelector("#artwork"),
    background  = document.querySelector("#background"),

// - Interval
    timer,

// - Volume
    volume = audio.volume = 0.4,

// - Theme
    colorTheme        = "green",
    colorThemeDefault = "azure",

// - Project root
    projectDir      = "http://michaelmammoliti.com/_projects/audioJS/",

// - Project folders
    tracksDir       = projectDir + "songs/",
    artworksFolder  = projectDir + "artworks/",
    iconsFolder     = projectDir + "icons/" + colorTheme + "/",

// - Tracks
    defaultTrack    = 1,
    currentTrack    = defaultTrack,
    playlist        = [],

// - Audio
    duration,
    audioState      = "pause",

// - Auto
    autoPlay        = true,
    autoRepeat      = true;

// - Audio Controls
  function playAudio()
  {

    var src = tracksDir + addZero(defaultTrack, 2) + ".mp3",
        icon = iconsFolder + "pause.png";

    // Autoload track
    if(audio.getAttribute("src") === ""){ audio.src = src; }

    audio.play(); // Play
    audioState = "play";
    changeBackgroundImage(play, icon);

    // Update the time
    timer = setInterval( updateTime, 100 );

  }


// - Control's functions
  function pauseAudio()
  {

    var icon = projectDir + "icons/" + colorThemeDefault + "/play.png";

    audio.pause();
    audioState = "pause";

    changeBackgroundImage(play, icon);

    clearInterval(timer);
  }

  function stopAudio()
  {
    audio.currentTime = 0;
    clearInterval(timer);
  }


// - Update DOM elements

  // Activate the track
  function updateActiveTrack(num)
  {
    tracks.children[num-1].classList.add("active");
  }

  // Chamge audio tag song
  function changeSong(num)
  {

    currentTrack  = parseInt(num);

    var artworkSrc,
        src         = tracksDir + addZero(currentTrack, 2) + ".mp3";

    // Delete CSS classes to all tracks
    for(var i = 0; i < playlist.length; i++) { tracks.children[i].removeAttribute("class"); }

    artworkSrc    = artworksFolder + addZero(currentTrack, 2) + ".jpg";
    audio.src     = src;
    artwork.src   = artworkSrc;

    updateActiveTrack(currentTrack);
    changeBackgroundImage(artwork, artworkSrc);
    changeBackgroundImage(document.body, artworkSrc);

    if(audioState === "play") { playAudio(); }
  }


// - TIME
  function getAudioSeconds(string)
  {
    var seconds = string % 60;
        seconds = addZero( Math.floor(seconds), 2 );

    if(seconds < 60) { return seconds; } else { return "00"; }
  }

  function getAudioMinutes(string)
  {
    var minutes = string / 60;
        minutes = addZero( Math.floor(minutes), 2 );

    if(minutes < 60) { return minutes; } else { return "00"; }
  }

// - FIX ZERO - Nice functions i made, i think sharing will it helps

  // Add howManyZero to from the begin
  function addZero(word, howManyZero)
  {
    var word = String(word);

    while(word.length < howManyZero) { word = "0" + word; }

    return word;
  }

  // - Remove howManyZero from the begin
  function removeZero(word, howManyZero)
  {
    var word  = String(word),
        i     = 0;

    while(i < howManyZero)
    {
      if(word[0] === "0") { word = word.substr(1, word.length); } else { break; }

      i++;
    }

    return word;
  }

// - Manage DOM Nodes
  function insertDOMElement(parent, htmlString)
  {
    parent.insertAdjacentHTML("beforeend", htmlString);
  }

  function createTrackItem(trackNum, trackTitle, trackArtist, trackImage)
  {
    var div = "";

    div += "<artwork style='background-image: url(\"" + trackImage + "\")'></artwork>";
    div += "<span>" + trackNum + ". " + trackArtist + " - " + trackTitle + "</span>";

    return div;
  }

  function populateTrack()
  {
    var children, trackName, trackArtist, trackartwork, obj;

    for(var i = 0; i < tracks.children.length; i++)
    {

      children      = tracks.children[i],
      trackName     = children.getAttribute("trackname"),
      trackArtist   = children.getAttribute("trackartist"),
      trackartwork  = children.getAttribute("trackartwork"),
      obj           = {
        title: trackName,
        artist: trackArtist,
        artwork: trackartwork
      };

      playlist.push(obj);

      insertDOMElement(
        children,
        createTrackItem(
          addZero((i+1) ,2),
          playlist[i].title,
          playlist[i].artist,
          artworksFolder + playlist[i].artwork
        )
      );

      children.removeAttribute("trackname");
      children.removeAttribute("trackartist");
      children.removeAttribute("trackartwork");

      children.setAttribute("tracknum", i+1);
    }
  }

// - DOM Animation / Styles / Updates
  function changeBackgroundImage(element, image)
  {
    element.style.backgroundImage = "url('" + image + "')";
  }

  function updateProgressBarPosition()
  {
    var percentage  = (audio.currentTime * 100 / duration) + "%",
        children    = progressBar.children[0];

    children.style.width = percentage;
  }

  function updateTime()
  {
    var audioTime = getAudioMinutes(audio.currentTime) + ":" + getAudioSeconds(audio.currentTime);

    updateProgressBarPosition();
    elapsedTime.innerHTML = audioTime;

    if(audio.ended)
    {

      if(currentTrack === (playlist.length))
      {
        currentTrack = defaultTrack;
        changeSong(currentTrack);
      }
        else
        {
          currentTrack = currentTrack + 1;
          changeSong(currentTrack);
        }

      if(autoRepeat) { playAudio(); }

    }
  }

// - POPULATE HTML
  populateTrack();

// - EVENTS
  window.onload = function() { changeSong(defaultTrack); };

  audio.addEventListener(
    'loadedmetadata',
    function()
    {
      var time = getAudioMinutes(duration) + ":" + getAudioSeconds(duration);

      duration            = audio.duration;
      totalTime.innerHTML = time;

    }
  );

  play.addEventListener(
    "click",
    function()
    {
      if(audioState === "pause")
      {
        playAudio();
        updateActiveTrack( currentTrack );
      }
        else if(audioState === "play") { pauseAudio(); }
    }
  );

  stop.addEventListener(
    "click",
    function()
    {
      stopAudio();
      pauseAudio();
      updateTime();
    }
  );

  prev.addEventListener(
    "click",
    function()
    {
      if(currentTrack > 1)
      {
        stopAudio();
        changeSong(currentTrack - 1);
      }
        else if(currentTrack === 1)
        {
          stopAudio();
          changeSong(currentTrack);
        }
    }
  );

  next.addEventListener(
    "click",
    function()
    {
      if(currentTrack < playlist.length)
      {
        stopAudio();
        updateTime();
        changeSong(currentTrack + 1);
        console.log(currentTrack);
      }
        else
        {
          currentTrack = 1;
          changeSong(currentTrack);
        }
    }
  );

  progressBar.addEventListener(
    "click",
    function(e)
    {
      var mouseX,
          percentage,
          newTime;

      if(e.offsetX){ mouseX = e.offsetX; }
      if(mouseX == undefined && e.layerX) { mouseX = e.layerX; }

      percentage  = mouseX / progressBar.offsetWidth;
      newTime     = audio.duration * percentage;

      audio.currentTime = newTime;

      updateProgressBarPosition();
    }
  );

  // - Add events to all tracks
    for(var i = 0; i < playlist.length; i++)
    {

      tracks.children[i].addEventListener(
        "click",
        function()
        {
          var btn       = this,
              trackNum  = parseInt(btn.getAttribute("tracknum"));

          if(btn.classList[0] !== "active")
          {
            tracks.children[1].removeAttribute("class");
            btn.classList.add("active");

            changeSong(trackNum);
          }
        }
      );

    }

  // - Add events to all audioControls
    for(var i = 0; i < audioControls.children.length; i++)
    {

      audioControls.children[i].addEventListener(
        "mousedown",
        function()
        {
          var btn   = this,
              icon  = iconsFolder + btn.id + ".png";

          changeBackgroundImage( btn, icon );

          if(btn.classList[0] !== "shadow")
          {
            for(var x = 0; x < audioControls.children.length; x++)
            {
              audioControls.children[x].classList.remove("shadow");
            }
          }
        }
      );

      audioControls.children[i].addEventListener(
        "mouseup",
        function()
        {
          var btn   = this,
              icon  = projectDir + "icons/" + colorThemeDefault + "/" + btn.id + ".png";

          changeBackgroundImage( btn, icon );
        }
      );

    }
