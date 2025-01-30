document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.backgroundColor = 'rgba(45, 45, 45, 0.9)';
    } else {
        nav.style.backgroundColor = '#2d2d2d';
    }
});

AOS.init({
    duration: 800,
    once: true,
    offset: 200
});

const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

document.querySelectorAll('.showcase-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.showcase-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.showcase-item').forEach(item => item.classList.remove('active'));
        
        button.classList.add('active');
        
        const target = button.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
    });
});

const stats = document.querySelectorAll('.stat-number');
const statsSection = document.querySelector('.stats-section');
let animated = false;

function animateStats() {
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.round(current);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        };

        updateCount();
    });
}

const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
        animateStats();
        animated = true;
    }
});

statsObserver.observe(statsSection);

document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

async function fetchDownloadCount() {
    try {
        const response = await fetch('https://api.github.com/repos/VulcanoSoftware/VulcanoClient/releases');
        const data = await response.json();
        
        let totalDownloads = 0;
        data.forEach(release => {
            release.assets.forEach(asset => {
                totalDownloads += asset.download_count;
            });
        });

        const downloadStat = document.querySelector('.stat-number[data-target="0"]');
        downloadStat.setAttribute('data-target', totalDownloads);
        
        animated = false;
        if (isInViewport(statsSection)) {
            animateStats();
            animated = true;
        }
    } catch (error) {
        console.error('Fout bij ophalen van download statistieken:', error);
    }
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

let huidigjaar = new Date().getFullYear();
let foottext = document.getElementById('footercopy');
foottext.innerHTML = `&copy; ${huidigjaar} VulcanoClient. Alle rechten voorbehouden.`;

fetchDownloadCount();

setInterval(fetchDownloadCount, 300000);
