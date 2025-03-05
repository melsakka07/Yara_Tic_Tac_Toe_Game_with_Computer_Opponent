export function createConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas to full window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Confetti particles
  const particles = [];
  const particleCount = 150;
  const gravity = 0.5;
  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', 
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', 
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39', 
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
  ];
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      speed: Math.random() * 3 + 2,
      velocity: Math.random() * 2 - 1,
      rotationSpeed: Math.random() * 2 - 1
    });
  }
  
  // Animation loop
  let animationFrame;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    let particlesActive = false;
    
    for (const particle of particles) {
      // Update position
      particle.y += particle.speed;
      particle.x += particle.velocity;
      
      // Update rotation
      particle.rotation += particle.rotationSpeed;
      
      // Draw particle
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation * Math.PI / 180);
      
      // Draw a colorful square or rectangle
      ctx.fillStyle = particle.color;
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      
      ctx.restore();
      
      // Check if particle is still on screen
      if (particle.y < canvas.height) {
        particlesActive = true;
      }
    }
    
    // Continue animation if particles are still active
    if (particlesActive) {
      animationFrame = requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }
  
  // Start animation
  animationFrame = requestAnimationFrame(update);
  
  // Stop animation after 5 seconds
  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 5000);
}

// Handle window resize
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
