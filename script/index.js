// !!BAN!! of making.
// 🚫 Do NOT open your old Spotify project
// 🚫 Do NOT compare files
// 🚫 Do NOT judge similarity

//Making, nav-menu open close

const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".nav-menu");
const closebtn = document.querySelector(".close");

hamburger.addEventListener("click", () => {
  menu.classList.add("open");
});

closebtn.addEventListener("click", () => {
  menu.classList.remove("open");
});

//making, playlist main-content, Song-lists

let allSongs = null;
let flatSongs = [];

fetch("./data/song.json").then((res) => {
  //there we, fetching data from song.json which holds all songs
  res.json().then((data) => {
    allSongs = data;
    flatSongs = data.flatMap((section) => section.songs);
    renderSongList(data);
  });
});

function renderSongList(sections) {
  const songs = document.querySelector(".songs");
  sections.forEach((sectionData) => {
    const songList = document.createElement("div");
    songList.classList.add("song-list");
    songList.innerHTML = `<h1>${sectionData.Title}</h1>
        <div class="arrow left-arrow">
                  <i class="fa-solid fa-chevron-left"></i>
                </div>
                 <div class="song-card-container"></div>
                 <div class="arrow right-arrow">
                  <i class="fa-solid fa-chevron-right"></i>
                </div>`;
    const cardContainer = songList.querySelector(".song-card-container");
    sectionData.songs.forEach((song) => {
      cardContainer.innerHTML += `
                     <div class="song-card" data-id="${song.id}">
                     <img
                      src="${song.cover}"
                      alt="songs"
                    />
                    <div class="song-info">
                      <h2>${song.title}</h2>
                      <p>${song.artist}</p>
                    </div>
                    <div class="song-play">
                      <i class="fa-solid fa-play"></i>
                    </div>
                    </div>`;
    });

    songs.appendChild(songList);
    scrollArrow(songList);
    resetUI(songList);
  });
}

//made arrows function to call anywhere to run.
function scrollArrow(playlist) {
  if (!playlist) return;
  const cardContainer = playlist.querySelector(".song-card-container");
  const [leftArrow, rightArrow] = playlist.querySelectorAll(".arrow");
  leftArrow.style.display = "none";
  let scrollAmount = 0;
  leftArrow.addEventListener("click", () => {
    scrollAmount -= 300;
    cardContainer.scrollTo({ left: scrollAmount, behavior: "smooth" });
  });
  rightArrow.addEventListener("click", () => {
    scrollAmount += 300;
    cardContainer.scrollTo({ left: scrollAmount, behavior: "smooth" });
  });

  //at movement of scroll, at cardContainer, visible the left scrollBtn, if scrollEvent are is making >0 to left

  cardContainer.addEventListener("scroll", () => {
    leftArrow.style.display = cardContainer.scrollLeft > 0 ? "flex" : "none";
    //if, cardContainer scrollLeft + clientWidth = visible area, bigger than, scrollWidth means, scroll se if biggere hua to, display should none yato flex
    rightArrow.style.display =
      cardContainer.scrollLeft + cardContainer.clientWidth >=
      cardContainer.scrollWidth - 5
        ? "none"
        : "flex";
  });

  //if, scrollWidth = scrollKrneKaArea, if smaller than, clientWidth = visible Area to see. so rightArrow should none or flex
  rightArrow.style.display =
    cardContainer.scrollWidth <= cardContainer.clientWidth ? "none" : "flex";
}

//now making song system..

let audio = new Audio(); //making, audio object
let currentSongIndex = null; //currentSongIndex = currentPlayingSong index holder., will use later at, controls buttons.
let currentSong = null; //it will use, it for holding, single song id's
let CurrentPlaylist = null; //it holds, playlist ID, like, playlist which holds many songs, their id, "english" - "liked" - "hindi"
let CurrentPlaylistSongNo = null; //it is use for, taking current playlist, > currentSong id.
let isfinished = false; //to balance, playlistSongs, after playlist finished.
let playlistState = {
  index: 0,
  songs: null,
}; //we create, object which contains index and song variable which can be use for, playlist songs., and for call anywhere down.

//use for, observer and run, single song playing
document.addEventListener("click", (e) => {
  if (e.target.closest(".playlist-play" || ".song-playlist-card")) return; //this handling is using because of, we gave same class to both, song-playlist-card too, for scalablity, that we style.css on same class not multiple class, thats why we gave same class, so we have to take some responsibility too, thats why return here, (this is for avoiding playlist song and play single songs).

  const playbtn = e.target.closest(".song-play");
  if (!playbtn) return;
  const songCard = e.target.closest(".song-card");
  const songId = songCard.dataset.id;
  CurrentPlaylist = null; //we need, to give null it, coz if someone play playlist, before single song, so it should risky to, handle both.
  playSong(songCard, songId);
});

function playSong(card, songId) {
  if (currentSong == songId) {
    //if, same song, is playing, then toggle.
    songToggle(card, true);
    return;
  }
  currentSongIndex = flatSongs.findIndex((s) => s.id === Number(songId)); //we taking, index by method, and that currentSongIndex should work on single song and for controllers.

  currentSong = songId; //we put the songId to that currentSong, so if someone click again on same, song so then it toggle, not play again.
  const song = findSong(songId); //find song by, card id, which contains song.id
  audio.src = song.audio;
  audio.play();
  resetUI(true);
  cardToggle(card, true);
  updateUI(song);
}

let playerBtn = document.querySelector("#play i");

function songToggle(card, isCard = false) {
  if (!audio.src) return;

  if (audio.paused) {
    audio.play();
    playerBtn.className = "fa-solid fa-pause";
    if (isCard) {
      cardToggle(card, true);
    }
  } else {
    audio.pause();
    if (isCard) {
      cardToggle(card, false);
    }
    playerBtn.className = "fa-solid fa-play";
  }
}

audio.addEventListener("pause", () => {
  playerBtn.classList.replace("fa-pause", "fa-play");
});

audio.addEventListener("play", () => {
  playerBtn.classList.replace("fa-play", "fa-pause");
  if (currentSong && !CurrentPlaylist) {
    const card = findCard(currentSong);
    cardToggle(card, true);
  }
  if (CurrentPlaylist) {
    const playlistCard = findCard(CurrentPlaylist);
    cardToggle(playlistCard, true);
  }
});

function findSong(songId) {
  const song = flatSongs.find((song) => song.id == songId);
  if (song) return song; //there we find, song by, flatsongs which contains, array of all song, with object-object, and then we return, that song
}

function cardToggle(card, value) {
  if (!card) return;

  const isPlaylist = card.classList.contains("song-playlist-card");
  const icon = isPlaylist //if, playlist exist so do, .playlist-play i, - else .song-play
    ? card.querySelector(".playlist-play i")
    : card.querySelector(".song-play i");
  icon.className = value ? "fa-solid fa-pause" : "fa-solid fa-play";
}

function resetUI(statement) {
  document.querySelectorAll(".song-play i").forEach((song) => {
    song.className = "fa-solid fa-play";
  });
  if (statement) {
    document.querySelector("#play i").className = "fa-solid fa-play";
  }
}

function updateUI(CurrentSong) {
  //this function, takes, a song object, which is currently playing. then update ui by that song objects/key/values
  const player = document.querySelector(".player");
  const musicImg = player.querySelector(".music img");
  const musicName = player.querySelector(".music-info h2");
  const artistName = player.querySelector(".music-info p");
  const imgIcon = player.querySelector(".img-icon img");
  const playerBtn = player.querySelector("#play i");

  musicImg.src = CurrentSong.cover;
  musicImg.style.opacity = "1";
  musicName.textContent = CurrentSong.title;
  artistName.textContent = CurrentSong.artist;
  imgIcon.src = CurrentSong.cover;
  imgIcon.classList.add("active");
  playerBtn.className = "fa-solid fa-pause";
}

//now making progress buttons working.

let shuffleBtn = document.querySelector("#shuffle");
let backwardBtn = document.querySelector("#backward");
let forwardbtn = document.querySelector("#upward");
let repeatBtn = document.querySelector("#repeat");
let isShuffle = false;
let isRepeat = false;

// Making function, use for specific Audio.

function playAudio(song) {
  audio.src = song.audio;
  audio.load();
  updateUI(song);
  audio.play();
}

//repeat logic
repeatBtn.addEventListener("click", (e) => {
  if (!currentSong && !CurrentPlaylist) return;
  isRepeat = !isRepeat;
  repeatBtn.classList.add("active");
  if (isRepeat == false) {
    repeatBtn.classList.remove("active");
  }
});

function findCard(id) {
  return document.querySelector(`.song-card[data-id="${id}"]`); //this find, card by card, data-id="${id}", we use same classes at, song-card and song-playlist-card, so it will work for both
}

function shuffleFrom(list, currentSongId) {
  if (!list || list.length === 0) return null;
  if (list.length === 1) return list[0]; //if list, array = contains only, 1 item, so return that index item. else continue.

  let song, index;
  do {
    index = Math.floor(Math.random() * list.length);
    song = list[index];
  } while (song.id === currentSongId);
  CurrentPlaylistSongNo = song.id; //giving, playlist "song" index holding, var to that index, so it shouldnot Repeat same song
  currentSongIndex = index; //giving, single-holding, to that index ~ ~ ~ ~
  return song; //return given, list of array, random song. song = list[index] = random song
}

shuffleBtn.addEventListener("click", () => {
  if (!currentSong && !CurrentPlaylist) return;
  isShuffle = !isShuffle;
  shuffleBtn.classList.add("active");
  if (isShuffle == false) {
    shuffleBtn.classList.remove("active");
  }
});

audio.addEventListener("ended", () => {
  if (!currentSong && !CurrentPlaylist) return;
  if (!CurrentPlaylist && isShuffle && !isRepeat) {
    const song = shuffleFrom(flatSongs, currentSong);
    const card = findCard(song.id);
    playSong(card, song.id);
  }

  if (CurrentPlaylist && isShuffle && !isRepeat) {
    const playlistSongs = playlistState.songs;
    const song = shuffleFrom(playlistSongs, CurrentPlaylistSongNo);
    const index = playlistSongs.findIndex((s) => s.id === song.id);
    playlistState.index = index;
    playAudio(song);
  }

  if (!isShuffle && !isRepeat && !CurrentPlaylist) {
    audio.load();
    resetUI(true);
  }
  if (isRepeat && !CurrentPlaylist) {
    const card = findCard(currentSong);
    playSong(card, currentSong);
  }
});

backwardBtn.addEventListener("click", () => {
  if (!currentSong && !CurrentPlaylist) return;

  if (currentSong && !CurrentPlaylist) {
    const song = backwardButton(flatSongs, currentSongIndex);
    //currentSongIndex will update, at every, playSong(card, song.id); "we" did currentSongIndex = flatSongs.findIndex((s) => s.id === Number(song.id));
    const card = findCard(song.id);
    playSong(card, song.id);
  }

  if (CurrentPlaylist && !isfinished) {
    const song = backwardButton(playlistState.songs, playlistState.index);
    const index = playlistState.songs.findIndex((s) => s.id === song.id);
    playlistState.index = index;
    playAudio(song);
  }
});

function backwardButton(list, songIndex) {
  songIndex = (songIndex - 1 + list.length) % list.length;
  return list[songIndex];
}

forwardbtn.addEventListener("click", () => {
  if (!currentSong && !CurrentPlaylist) return;
  if (currentSong && !CurrentPlaylist) {
    const song = forwardButton(flatSongs, currentSongIndex);
    //similar, currentSongIndex update at every, playsong(card, song.id);
    const card = findCard(song.id);
    playSong(card, song.id);
  }

  if (CurrentPlaylist && !isfinished) {
    const song = forwardButton(playlistState.songs, playlistState.index);
    const index = playlistState.songs.findIndex((s) => s.id === song.id);
    playlistState.index = index;
    playAudio(song);
  }
});

function forwardButton(list, songIndex) {
  songIndex = (songIndex + 1) % list.length;
  return list[songIndex];
}

//now making progress bar

let bar = document.querySelector("#progressbar");
const current = document.querySelector(".start-time");
const left = document.querySelector(".end-time");

function formatTime(sec) {
  if (!sec) return "00:00";
  const seconds = Math.floor(sec % 60);
  const min = Math.floor(sec / 60);
  return `${min}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function progressBar() {
  if (!audio.duration) return;
  const duration = (audio.currentTime / audio.duration) * 100;
  bar.value = duration;
  bar.style.setProperty("--progress", `${duration}%`);
  current.textContent = formatTime(audio.currentTime);
  requestAnimationFrame(progressBar);
}

audio.addEventListener("loadedmetadata", () => {
  requestAnimationFrame(progressBar);
  left.textContent = formatTime(audio.duration);
});

audio.addEventListener("play", () => {
  progressBar();
});

bar.addEventListener("input", function () {
  audio.currentTime = (this.value / 100) * audio.duration;
}); //if someone, input on seekbar, so it should change seconds of song by that, eg: someone do 40% on seekbar, so 40 / 100 = 0.4, then 0.4 * audio.duration = 0.4 * 200 = 80 seconds. currentTime = 80 seconds.

//now creating, volume bar.

let volumeIcon = document.querySelector(".volume i");
let volumeInput = document.querySelector("#volumeBar");

audio.volume = volumeInput.value / 100; //instant, volume change
changeVolumeIcon();
function volumeControl() {
  const currentVolume = volumeInput.value; //we instant changed the volume, then we do this, for making UI change
  volumeInput.style.setProperty("--volume", `${currentVolume}%`);
  changeVolumeIcon();
}

volumeInput.addEventListener("input", () => {
  audio.volume = volumeInput.value / 100; //if someone, input on volume bar, so it should change volume by that, eg: someone do 40% on volume bar, so 40 / 100 = 0.4, then audio.volume = 0.4
  volumeControl(); //and icon should update
});

function changeVolumeIcon() {
  audio.volume == 0
    ? (volumeIcon.className = "fa-solid fa-volume-xmark")
    : audio.volume <= 0.7
      ? (volumeIcon.className = "fa-solid fa-volume-low")
      : (volumeIcon.className = "fa-solid fa-volume-high");
}

volumeIcon.addEventListener("click", () => {
  if (audio.volume == 0) {
    audio.volume = 0.7;
    volumeInput.value = 70;
  } else {
    audio.volume = 0;
    volumeInput.value = 0;
  }
  volumeControl();
});

//now making playlist

let allPlaylists = null;
fetch("./data/playlist.json").then((res) => {
  res.json().then((data) => {
    allPlaylists = data;
    renderPlaylist(data);
  });
});

function renderPlaylist(data) {
  const playListContainer = document.querySelector(".song-playlists");

  const PlayList = document.createElement("div");
  PlayList.classList.add("song-list", "song-playlist");
  PlayList.innerHTML = `<h1>Playlist</h1> <div class="arrow left-arrow">
    <i class="fa-solid fa-chevron-left"></i>
      </div> <div class="song-card-container song-playlist-card-container"></div><div class="arrow right-arrow">
      <i class="fa-solid fa-chevron-right"></i>
      </div>`;

  const CardContainer = PlayList.querySelector(".song-card-container");
  data.forEach((card) => {
    const Card = document.createElement("div");
    Card.classList.add("song-card", "song-playlist-card");
    Card.dataset.id = card.id;
    Card.innerHTML = `
                    <img
                      src="${card.cover}"
                      alt="Chad"
                    />
                    <div class="song-info song-playlist-info">
                      <h2>${card.name}</h2>
                    </div>
                    <div class="song-play playlist-play">
                      <i class="fa-solid fa-play"></i>
                    </div>
                  `;
    CardContainer.appendChild(Card);
  });

  playListContainer.appendChild(PlayList);
  scrollArrow(PlayList);
  allPlaylistRender(data);
}

function allPlaylistRender(data) {
  const showPlaylist = document.querySelector(".playlist-container");
  showPlaylist.innerHTML = "";

  const playlist = document.createElement("div");
  playlist.classList.add("playlists", "all-playlists");
  playlist.innerHTML = `<div class="playlist-title">
              <h1>All Playlists</h1>
            </div>
            <div class="playlist-card-container"></div>
            <div class="useful-info">Click On Playlists To Play your Playlist</div>`;
  const playlistCardContainer = playlist.querySelector(
    ".playlist-card-container",
  );
  data.forEach((card) => {
    const playlistCard = document.createElement("div");
    playlistCard.classList.add("playlist-card", "playlist-active");
    playlistCard.dataset.id = card.id;
    playlistCard.innerHTML = `<img
                  src="${card.cover}"
                  alt="playlist-card-img"
                />
                  <div class="playlist-info playlist-active-info">
                  <h2>${card.name}</h2>
                </div>`;

    playlistCardContainer.appendChild(playlistCard);
  });

  showPlaylist.appendChild(playlist);

  if (!CurrentPlaylist) {
    const usefulInfo = document.querySelector(".useful-info");
    usefulInfo.classList.toggle("active");
  }
}

let playlistCard = null; //to get playlistCard.
document.addEventListener("click", (e) => {
  if (e.target.closest(".all-playlists")) {
    const playlistId = e.target.closest(".playlist-card").dataset.id;
    const card = findCard(playlistId);
    playlistCard = card;
    currentSong = null;
    resetUI();
    currentSongIndex = null;
    changePlaylist(card, playlistId, true);
  }
});

let playlistToggle = document.querySelector(".responsive-playlist"); //this is using for, small screen playlists

document.addEventListener("click", (e) => {
  if (e.target.closest(".song-playlist-card")) {
    const playlistId = e.target.closest(".song-playlist-card").dataset.id;
    const card = findCard(playlistId);
    playlistCard = card;
    //now adding, some active class, to making responsive
    const responsiveCard = document.querySelector(".playlist-container");
    responsiveCard.classList.add("active");
    playlistToggle.classList.add("active");
    currentSong = null;
    resetUI();
    currentSongIndex = null;
    changePlaylist(card, playlistId, true);
  }
});

function changePlaylist(card, currentPlaylist, shouldPlay = false) {
  if (CurrentPlaylist == currentPlaylist) {
    handleSongs(card, true);
    return;
  }
  CurrentPlaylist = currentPlaylist;
  let playlist = findPlaylist(currentPlaylist);
  let playlistCard = findPlaylistsongs(playlist);
  renderPlaylistSongs(playlist, playlistCard);
  if (shouldPlay) {
    playlistSongPlay(card, playlistCard);
  }
  resetPlaylist();
}

let isPlaying = false;

function playlistSongPlay(card, playlistSongs) {
  playlistState.songs = playlistSongs;
  playlistState.index = 0;
  let icon = card.querySelector(".playlist-play i");

  function nextSong() {
    let index = playlistState.index;
    const songs = playlistState.songs;
    if (index >= songs.length) {
      //that is for, repeat Playlist
      if (isRepeat) {
        playlistState.index = 0;
        nextSong();
        return;
      }
      isPlaying = false;
      isfinished = true;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      if (icon) icon.classList.replace("fa-pause", "fa-play");
      return;
    }
    if (CurrentPlaylist == null) return;
    const song = songs[index];
    CurrentPlaylistSongNo = song.id;

    audio.src = song.audio;

    audio.load();
    updateUI(song);
    audio.play().then(() => {
      if (icon) icon.classList.replace("fa-play", "fa-pause");
    });
    audio.onended = () => {
      if (isShuffle && !isRepeat) return;
      if (isRepeat && isShuffle) {
        nextSong();
        return;
      }
      playlistState.index++;
      nextSong();
    };
  }

  isPlaying = true;
  nextSong();
}

//Shuffle, returns song object not index, so it will work on specific function, not all shuffling, this is best way to use shuffle to, take a song object/array not their index and find, card play that index find song this is good only at single code, not playlist.

const playbtn = document.querySelector("#play");
playbtn.addEventListener("click", () => {
  const card = findCard(currentSong);
  songToggle(card, false);
  if (CurrentPlaylist && isfinished) {
    playlistState.index = 0;
    isfinished = false;
    playlistSongPlay(playlistCard, playlistState.songs);
    return;
  }
  if (CurrentPlaylist) {
    handleSongs(playlistCard, false);
  }
});

function handleSongs(card, isCard = false) {
  if (!audio.src && !CurrentPlaylist) return;

  const playBtn = document.querySelector("#play i");

  if (!isPlaying) {
    audio.play();
    isPlaying = true;
    playBtn.className = "fa-solid fa-pause";
    if (isCard) {
      cardToggle(card, true);
    }
  } else {
    audio.pause();
    isPlaying = false;
    playBtn.className = "fa-solid fa-play";
    if (isCard) {
      cardToggle(card, false);
    }
  }
}

function findPlaylist(playlistId) {
  const playlist = allPlaylists.find((playlist) => playlist.id === playlistId);
  return playlist;
}

function findPlaylistsongs(playlist) {
  const playlistSongs = [];

  playlist.songs.forEach((songId) => {
    //do on every single playlist song array item inside it. like songs = [3,2,1,4] so first do for 3 find and took it inside, song, then 2 find then took it inside song then push it into, created null array playlistSongs, on every iteration.
    const song = flatSongs.find((s) => s.id === songId);
    if (song) {
      playlistSongs.push(song);
    }
  });

  return playlistSongs;
}

function resetPlaylist() {
  const playlistCards = document.querySelectorAll(".song-playlist-card");

  playlistCards.forEach((card) => {
    cardToggle(card, false);
  }); //find every card, and remove active, from it.
}

function renderPlaylistSongs(currentPlaylist, playlistCard) {
  const showPlaylist = document.querySelector(".playlist-container");
  showPlaylist.innerHTML = "";
  const playlist = document.createElement("div");
  playlist.classList.add("playlists");
  playlist.innerHTML = `<div class="playlist-title">
              <h1>${currentPlaylist.name}</h1>
              <div class="close-playlist"><i id="close-playlist" class="fa-solid fa-xmark"></i> </div>
            </div>
            <div class="playlist-card-container"></div>
            `;
  const playlistCardContainer = playlist.querySelector(
    ".playlist-card-container",
  );
  playlistCard.forEach((allSongs) => {
    const songCard = document.createElement("div");
    songCard.classList.add("playlist-card");
    songCard.dataset.id = allSongs.id;
    songCard.innerHTML = `<img
                  src="${allSongs.cover}"
                  alt="playlist-card-img"
                />
                  <div class="playlist-info">
                  <h2>${allSongs.title}</h2>
                  <p>${allSongs.artist}</p>
                </div>`;
    playlistCardContainer.appendChild(songCard);
  });

  showPlaylist.appendChild(playlist);
}

//now making, playlist responsive system. with playlist song click option.
document.addEventListener("click", (e) => {
  if (e.target.closest(".all-playlists")) return; //return when playlist not contains songs.

  if (e.target.closest(".playlists")) {
    let activePlaylist;
    if (e.target.closest("#close-playlist")) {
      activePlaylist = e.target.closest(".playlist-container");
      activePlaylist.classList.remove("active");
      return;
    }
    const card = e.target.closest(".playlist-card");
    if (!card) return;
    const playlistId = card.dataset.id;
    // const playlistCard = findCard(CurrentPlaylist);
    const song = playlistState.songs.find(
      (song) => song.id === Number(playlistId),
    );
    const index = playlistState.songs.findIndex((s) => s.id === song.id);
    playlistState.index = index;
    CurrentPlaylistSongNo = song.id;
    playAudio(song);
    togglePlaylistActive(activePlaylist);
    cardToggle(playlistCard, false);
  }
});

playlistToggle.addEventListener("click", () => {
  const playlist = document.querySelector(".playlist-container");
  togglePlaylistActive(playlist);
});

function togglePlaylistActive(playlist) {
  playlist.classList.toggle("active");
};