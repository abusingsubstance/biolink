// Audio player variables
const audio = new Audio();
const tracks = [
  'sounds/BANDOLEROS.mp3',
  'sounds/overseas.mp3',
  'sounds/Cocaine Will.mp3',
  // ...
];
let currentTrack = 0;

// UI elements
const playButton = document.querySelector('.play-button');
const volumeBar = document.querySelector('.volume-bar');
const trackList = document.querySelector('.track-list');

// Event listeners
playButton.addEventListener('click', togglePlay);
volumeBar.addEventListener('input', updateVolume);
trackList.addEventListener('click', switchTrack);

// Functions
function togglePlay() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function updateVolume(event) {
  const volume = event.target.value;
  audio.volume = volume;
}

function switchTrack(event) {
  const trackIndex = event.target.dataset.trackIndex;
  currentTrack = trackIndex;
  audio.src = tracks[trackIndex];
  audio.play();
}

// Initialize audio player
audio.src = tracks[currentTrack];
audio.play();