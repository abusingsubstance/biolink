/**
 * Audio Player for Website
 * Handles background music, visualizer, and audio controls
 */

// Define audio tracks
const audioTracks = [
    {
        title: "track one",
        url: "https://files.catbox.moe/vyd1p9.mp3" // Replace with your actual audio URL
    },
    {
        title: "track two", 
        url: "hhttps://files.catbox.moe/0le224.mp3" // Replace with your actual audio URL
    },
    {
        title: "track three",
        url: "https://files.catbox.moe/vylyub.mp3" // Replace with your actual audio URL
    }
];

// Global audio variables
let audioPlayer;
let audioContext;
let audioSource;
let analyzer;
let currentTrackIndex = 0;
let isPlaying = false;
let visualizerInterval;
let volumeLevel = 0.7; // Default volume (0.0 to 1.0)

// Initialize audio functionality
function initializeAudio() {
    // Create audio element if it doesn't exist
    if (!audioPlayer) {
        audioPlayer = new Audio();
        audioPlayer.volume = volumeLevel;
        audioPlayer.addEventListener('ended', () => {
            changeAudio(1); // Go to next track when current one ends
        });
    }
    
    // Initialize Web Audio API for visualizer
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioSource = audioContext.createMediaElementSource(audioPlayer);
        analyzer = audioContext.createAnalyser();
        
        // Connect audio nodes
        audioSource.connect(analyzer);
        analyzer.connect(audioContext.destination);
        
        // Configure analyzer
        analyzer.fftSize = 256;
    } catch (error) {
        console.warn('Web Audio API not supported in this browser. Visualizer disabled.');
    }
    
    // Set initial track display
    updateTrackDisplay();
    
    // Add click event to visualizer for play/pause
    const visualizer = document.querySelector('.visualizer');
    if (visualizer) {
        visualizer.addEventListener('click', togglePlayPause);
    }
    
    // Setup volume control
    setupVolumeControl();
    
    // Start playing the first track
    playAudio();
    
    // Start visualizer animation
    startVisualizer();
}

// Play current audio track
function playAudio() {
    if (!audioPlayer) return;
    
    const track = audioTracks[currentTrackIndex];
    
    // Only change source if it's different from current one
    if (audioPlayer.src !== track.url) {
        audioPlayer.src = track.url;
    }
    
    // Play and update state
    const playPromise = audioPlayer.play();
    
    // Handle play promise (required for some browsers)
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            updateTrackDisplay();
        }).catch(error => {
            console.error('Playback failed:', error);
            showNotification('Autoplay blocked. Click to play.');
            isPlaying = false;
        });
    }
}

// Toggle play/pause
function togglePlayPause() {
    if (!audioPlayer) return;
    
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        audioPlayer.play();
        isPlaying = true;
    }
    
    updateTrackDisplay();
}

// Change to next/previous track
function changeAudio(direction = 1) {
    if (!audioPlayer) return;
    
    // Update current track index with wraparound
    currentTrackIndex = (currentTrackIndex + direction + audioTracks.length) % audioTracks.length;
    
    // Show notification
    showNotification(`Now playing: ${audioTracks[currentTrackIndex].title}`);
    
    // Save current playing state
    const wasPlaying = isPlaying;
    
    // Set new track and play if previously playing
    audioPlayer.src = audioTracks[currentTrackIndex].url;
    updateTrackDisplay();
    
    if (wasPlaying) {
        playAudio();
    }
}

// Update the track display text
function updateTrackDisplay() {
    const trackDisplay = document.querySelector('.currently-playing');
    if (trackDisplay) {
        const track = audioTracks[currentTrackIndex];
        trackDisplay.textContent = track.title;
        
        // Add paused indicator if needed
        if (!isPlaying) {
            trackDisplay.textContent += ' (paused)';
        }
    }
}

// Start audio visualizer
function startVisualizer() {
    if (!analyzer) return;
    
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const progress = document.querySelector('.progress');
    
    // Clear any existing interval
    if (visualizerInterval) {
        clearInterval(visualizerInterval);
    }
    
    // Update visualizer periodically
    visualizerInterval = setInterval(() => {
        if (!isPlaying || !audioPlayer) return;
        
        // Get frequency data
        analyzer.getByteFrequencyData(dataArray);
        
        // Calculate average level for simple visualization
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        
        // Update progress element width based on frequency average
        if (progress) {
            // Map average value (0-255) to a reasonable percentage (5-100)
            const level = 5 + (average / 255) * 95;
            progress.style.width = `${level}%`;
        }
        
        // Update player progress
        updateProgress();
    }, 50);
}

// Update audio progress
function updateProgress() {
    if (!audioPlayer) return;
    
    const progress = document.querySelector('.progress');
    if (progress && audioPlayer.duration) {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.style.width = `${percentage}%`;
    }
}

// Set up volume control
function setupVolumeControl() {
    const volumeBar = document.querySelector('.volume-bar');
    const volumeProgress = document.querySelector('.volume-progress');
    
    if (!volumeBar || !volumeProgress) return;
    
    // Set initial volume display
    updateVolumeDisplay();
    
    // Make volume bar clickable to change volume
    volumeBar.addEventListener('click', function(e) {
        const rect = volumeBar.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const volumePercentage = clickPosition / rect.width;
        
        // Set volume (0 to 1)
        volumeLevel = Math.max(0, Math.min(1, volumePercentage));
        
        if (audioPlayer) {
            audioPlayer.volume = volumeLevel;
        }
        
        updateVolumeDisplay();
        showNotification(`Volume: ${Math.round(volumeLevel * 100)}%`);
    });
    
    // Show volume bar on hover/touch
    document.addEventListener('mousemove', function() {
        volumeBar.style.opacity = '1';
        
        // Hide after a delay
        clearTimeout(window.volumeTimeout);
        window.volumeTimeout = setTimeout(() => {
            volumeBar.style.opacity = '0.3';
        }, 2000);
    });
}

// Update volume display
function updateVolumeDisplay() {
    const volumeProgress = document.querySelector('.volume-progress');
    if (volumeProgress) {
        volumeProgress.style.width = `${volumeLevel * 100}%`;
    }
}

// Export functions to global scope for HTML event handlers
window.changeAudio = changeAudio;
window.togglePlayPause = togglePlayPause;
window.initializeAudio = initializeAudio;

let audio = document.getElementById('audio');

function changeAudio() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

function playAudio() {
    audio.play();
}

function pauseAudio() {
    audio.pause();
}

let currentlyPlaying = document.querySelector('.currently-playing');

function updateCurrentlyPlaying() {
    currentlyPlaying.textContent = 'Currently playing: ' + audio.src;
}

// Call the function when the audio starts playing
audio.addEventListener('play', updateCurrentlyPlaying);

let waveform = document.getElementById('waveform');
let wavesurfer = WaveSurfer.create({
    container: waveform,
    waveColor: 'white',
    progressColor: 'white'
});

wavesurfer.load(audio.src);

// Update the waveform when the audio starts playing
audio.addEventListener('play', function() {
    wavesurfer.play();
});

// Update the waveform when the audio is paused
audio.addEventListener('pause', function() {
    wavesurfer.pause();
});