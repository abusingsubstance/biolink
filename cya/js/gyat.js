/**
 * Additional effects for website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add subtle animation to particles
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        // Add random movement to each particle
        const randomX = Math.random() * 10 - 5;
        const randomY = Math.random() * 10 - 5;
        
        particle.style.animation = `floating ${15 + index * 2}s infinite linear`;
        particle.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Easter egg - konami code
    let konamiSequence = [];
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        konamiSequence.push(e.key);
        
        // Only keep the most recent inputs (length of konami code)
        if (konamiSequence.length > konamiCode.length) {
            konamiSequence.shift();
        }
        
        // Check if the sequence matches
        if (konamiSequence.join(',') === konamiCode.join(',')) {
            activateEasterEgg();
            konamiSequence = [];
        }
    });
    
    function activateEasterEgg() {
        // Create a special effect when konami code is entered
        document.body.style.transition = 'all 0.5s';
        document.body.style.background = 'linear-gradient(45deg, #ff00e1, #00a3ff)';
        
        setTimeout(() => {
            document.body.style.background = '#000';
            showNotification('🎮 Konami code activated!');
        }, 1000);
    }
});