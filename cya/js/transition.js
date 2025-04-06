/**
 * Transition Effects for Website
 * Handles the click-to-enter functionality and page transitions
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const body = document.querySelector('body');
    const before = document.querySelector('.before');
    const after = document.querySelector('.after');
    
    // Set the body opacity to 1 after a small delay for initial fade in
    setTimeout(() => {
        body.style.opacity = '1';
    }, 200);
    
    // Add click event listener to the "click to enter" text
    before.addEventListener('click', function() {
        // Fade out the "before" content
        before.style.opacity = '0';
        
        // Create a subtle click sound effect
        const clickSound = new Audio();
        clickSound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg4ODg4P//////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQCkAAAAAAAAAGw5MhxzwAAAAAAAAAAAAAAAAAAAP/jOMAAAAAAAAAAAABJbmZvAAAADwAAAAMAAAGwAJCQkJCQkJCQkJCQkJCQkMDAwMDAwMDAwMDAwMDAwODg4ODg4ODg4ODg4ODg4OD//////////////////////////wAAAABMYXZjNTguMTMAAAAAAAAAAAAAABkCmQAAAAAAAAGw5NGpMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
        clickSound.volume = 0.3;
        clickSound.play();
        
        // Wait for fade out, then switch displays
        setTimeout(() => {
            before.style.display = 'none';
            after.style.display = 'block';
            
            // Fade in the "after" content with slight opacity animation
            setTimeout(() => {
                after.style.opacity = '1';
                
                // Show volume bar
                const volumeBar = document.querySelector('.volume-bar');
                if (volumeBar) {
                    volumeBar.style.opacity = '1';
                }
                
                // Initialize audio player if it exists
                if (typeof initializeAudio === 'function') {
                    initializeAudio();
                }
            }, 100);
        }, 500);
    });
    
    // Optional: Add keyboard support for enter key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && before.style.display !== 'none') {
            before.click();
        }
    });
    
    // Create notification function
    window.showNotification = function(message, duration = 2000) {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, duration);
    };
});