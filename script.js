// ============================================================
// NAVIGATION — Wird transparent über dem Hero, weiß beim Scrollen
// ============================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// Hamburger-Menü für Mobile öffnen/schließen
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
    });

    // Menü automatisch schließen wenn ein Link angeklickt wird
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
        });
    });
}

// ============================================================
// HERO — Automatischer Bildwechsel alle 5 Sekunden
// ============================================================
const slides = document.querySelectorAll('.slide');

if (slides.length > 0) {
    let currentSlide = 0;

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000); // 5000 = 5 Sekunden. Ändern: z.B. 4000 = 4 Sek, 7000 = 7 Sek
}

// ============================================================
// LIGHTBOX — Öffnet ein Foto groß wenn man draufklickt
// ============================================================
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const btnClose    = document.getElementById('lightbox-close');
const btnPrev     = document.getElementById('lightbox-prev');
const btnNext     = document.getElementById('lightbox-next');

let lbImages = []; // alle Bilder der aktuellen Gruppe
let lbIndex  = 0;  // welches Bild gerade gezeigt wird

function openLightbox(images, index) {
    lbImages = images;
    lbIndex  = index;
    lightboxImg.src = images[index].src;
    lightboxImg.alt = images[index].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // verhindert Scrollen im Hintergrund
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = ''; // Bild-Speicher freigeben
}

function showImage(index) {
    lbIndex = (index + lbImages.length) % lbImages.length; // springt am Ende zurück zum Anfang
    lightboxImg.src = lbImages[lbIndex].src;
    lightboxImg.alt = lbImages[lbIndex].alt;
}

if (lightbox) {
    btnClose.addEventListener('click', closeLightbox);
    btnPrev.addEventListener('click', () => showImage(lbIndex - 1));
    btnNext.addEventListener('click', () => showImage(lbIndex + 1));

    // Klick auf dunklen Bereich außerhalb des Fotos → schließen
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox || e.target === lightboxImg) {
            if (e.target === lightbox) closeLightbox();
        }
    });

    // Tastatursteuerung: Pfeiltasten zum Navigieren, Escape zum Schließen
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   showImage(lbIndex - 1);
        if (e.key === 'ArrowRight')  showImage(lbIndex + 1);
    });

    // Touch-Wischen auf Mobile (links/rechts)
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', e => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 50) {
            if (delta < 0) showImage(lbIndex + 1); // Wischen nach links = nächstes Bild
            else           showImage(lbIndex - 1); // Wischen nach rechts = vorheriges Bild
        }
    }, { passive: true });

    // Highlight-Fotos auf der Hauptseite klickbar machen
    const highlightImgs = Array.from(document.querySelectorAll('.highlight-item img'));
    highlightImgs.forEach((img, i) => {
        img.parentElement.addEventListener('click', () => openLightbox(highlightImgs, i));
    });

    // Session-Fotos auf Session-Seiten klickbar machen
    const sessionImgs = Array.from(document.querySelectorAll('.session-photo img'));
    sessionImgs.forEach((img, i) => {
        img.parentElement.addEventListener('click', () => openLightbox(sessionImgs, i));
    });
}

// ============================================================
// HOCHFORMAT-ERKENNUNG — Portrait-Fotos spannen automatisch 2 Reihen
// ============================================================
function applyPortraitClass(img) {
    if (img.naturalHeight > img.naturalWidth) {
        img.closest('.session-photo').classList.add('session-photo--portrait');
    }
}

document.querySelectorAll('.session-photo img').forEach(img => {
    if (img.complete && img.naturalHeight > 0) {
        applyPortraitClass(img); // bereits im Cache geladen
    } else {
        img.addEventListener('load', () => applyPortraitClass(img));
    }
});

// ============================================================
// FILMSTREIFEN — Animation startet erst wenn Bilder bereit sind
// ============================================================
(function () {
    const filmstrip = document.querySelector('.filmstrip');
    if (!filmstrip) return;
    let gestartet = false;
    function starten() {
        if (gestartet) return;
        gestartet = true;
        filmstrip.classList.add('ready');
    }
    // Spätestens nach 1.5 Sekunden starten (auch wenn Bilder noch laden)
    setTimeout(starten, 1500);
    // Sofort starten wenn alle Seiten-Ressourcen geladen sind (z.B. aus Cache)
    window.addEventListener('load', starten, { once: true });
}());

// ============================================================
// SCROLL-ANIMATION — Abschnitte gleiten sanft rein beim Scrollen
// ============================================================
const animatableSelectors = [
    '.section-header',
    '.highlight-item',
    '.feed-item',
    '.gallery-card',
    '.about-container',
    '.contact-content'
];

const elementsToAnimate = document.querySelectorAll(animatableSelectors.join(', '));

const scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target); // nur einmal animieren
        }
    });
}, { threshold: 0.08 });

elementsToAnimate.forEach(el => {
    el.classList.add('fade-in');
    scrollObserver.observe(el);
});
