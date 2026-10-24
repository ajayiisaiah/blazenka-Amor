/* ==========================================================================
   INTERACTIVE NAVIGATION BETWEEN CHAPTERS
   ========================================================================== */
function goToPage(pageNumber) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-screen');
    pages.forEach(page => page.classList.remove('active-page'));

    // Update indicator dots
    const dots = document.querySelectorAll('.dot-btn');
    dots.forEach(dot => dot.classList.remove('active'));

    // Activate selected page and dot
    const targetPage = document.getElementById(`page-${pageNumber}`);
    if (targetPage) {
        targetPage.classList.add('active-page');
    }

    const activeDot = document.querySelector(`.dot-btn[data-page="${pageNumber}"]`);
    if (activeDot) {
        activeDot.classList.add('active');
    }

    // Scroll smoothly to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add click listeners to page indicator dots
document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('.dot-btn');
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const pageNum = e.target.getAttribute('data-page');
            goToPage(pageNum);
        });
    });

    initMusicControl();
    initHeartCanvas();
    initHeartBurst();
});

/* ==========================================================================
   LIGHTBOX FUNCTIONALITY
   ========================================================================== */
function openLightbox(imageSrc, captionText) {
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');

    modal.style.display = 'flex';
    modalImg.src = imageSrc;
    caption.textContent = captionText;
}

function closeLightbox() {
    document.getElementById('lightboxModal').style.display = 'none';
}

/* ==========================================================================
   MUSIC CONTROL (NO AUTOPLAY)
   ========================================================================== */
function initMusicControl() {
    const audio = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');
    const musicText = document.getElementById('musicText');

    musicBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            musicText.textContent = "Pause Music";
            musicBtn.style.background = "rgba(212, 175, 55, 0.4)";
        } else {
            audio.pause();
            musicText.textContent = "Play Music";
            musicBtn.style.background = "rgba(212, 175, 55, 0.15)";
        }
    });
}

/* ==========================================================================
   FLOATING HEARTS CANVAS ANIMATION
   ========================================================================== */
function initHeartCanvas() {
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const hearts = [];
    const heartCount = 20;

    for (let i = 0; i < heartCount; i++) {
        hearts.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 12 + 8,
            speedY: Math.random() * 0.8 + 0.3,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    function drawHeart(x, y, size, opacity) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = "#E29578";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
        ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        hearts.forEach(heart => {
            heart.y -= heart.speedY;
            if (heart.y < -20) {
                heart.y = height + 20;
                heart.x = Math.random() * width;
            }
            drawHeart(heart.x, heart.y, heart.size, heart.opacity);
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   SPECIAL HEART BURST INTERACTION
   ========================================================================== */
function initHeartBurst() {
    const heartBtn = document.getElementById('sendHeartBtn');
    const message = document.getElementById('burstMessage');

    heartBtn.addEventListener('click', (e) => {
        // Display romantic popup text
        message.textContent = "One little heart from me to you, My Queen Blazenka ❤️";

        // Create burst particles
        for (let i = 0; i < 15; i++) {
            createParticle(e.clientX, e.clientY);
        }
    });
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.textContent = '❤️';
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.fontSize = `${Math.random() * 20 + 15}px`;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    
    document.body.appendChild(particle);

    const destinationX = x + (Math.random() - 0.5) * 200;
    const destinationY = y + (Math.random() - 0.5) * 200 - 50;

    particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${destinationX - x}px, ${destinationY - y}px) scale(0.3)`, opacity: 0 }
    ], {
        duration: 1000 + Math.random() * 500,
        easing: 'cubic-bezier(0, .9, .57, 1)'
    }).onfinish = () => particle.remove();
}