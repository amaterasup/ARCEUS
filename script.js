// ===== Ganti tanggal & jam LKMM di sini (waktu WIB) =====
const hariH = new Date("Sep 22, 2026 12:00:00");
// Tambahkan ?open di akhir URL (index.html?open) untuk melewati hitung mundur saat mengedit.

const hitung_mundur = document.querySelector(".hitung-mundur");

async function getNow() {
    try {
        const response = await fetch("https://www.timeapi.io/api/timezone/zone?timeZone=Asia%2FJakarta");
        const data = await response.json();
        // currentLocalTime tanpa offset -> tambahkan +07:00 agar dibaca sebagai WIB
        return new Date(data.currentLocalTime.split(".")[0] + "+07:00");
    } catch (error) {
        console.error("Gagal mengambil waktu dari API, memakai jam perangkat:", error);
        return new Date();
    }
}

async function start() {
    if (new URLSearchParams(location.search).has("open")) return buka();
    const now = await getNow();
    const offset = now - new Date();   // selisih jam server dengan jam perangkat
    function update() {
        const jangka = hariH - (new Date(Date.now() + offset));
        if (jangka <= 0) {
            clearInterval(timer);
            return buka();
        }
        const hari = Math.floor(jangka / 86400000);
        const jam = Math.floor((jangka % 86400000) / 3600000);
        const menit = Math.floor((jangka % 3600000) / 60000);
        const detik = Math.floor((jangka % 60000) / 1000);
        hitung_mundur.innerHTML = "Wait Uda &amp; Uni<br>" + [hari, jam, menit, detik].map(cek).join(" : ");
    }
    const timer = setInterval(update, 1000);
    update();
}

function cek(angka) {
    return angka < 10 ? "0" + angka : angka;
}

function buka() {
    hitung_mundur.style.display = "none";
    document.querySelector(".supp").style.display = "block";
}
start();

// ===== Lightbox =====
const allImages = document.querySelectorAll(".gallery img, .memory img, .mentor-card img, .hero-photo");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeButton = document.getElementById("close");

allImages.forEach(image => {
    image.addEventListener("click", () => {
        lightboxImage.src = image.src;
        lightbox.classList.add("active");
    });
});
closeButton.addEventListener("click", () => lightbox.classList.remove("active"));
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) lightbox.classList.remove("active");
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape") lightbox.classList.remove("active");
});

// ===== Animasi muncul (timeline & kenangan) =====
function revealOnScroll(selector, threshold, onShow) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                onShow(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold });
    document.querySelectorAll(selector).forEach(el => observer.observe(el));
}
revealOnScroll(".timeline-item", 0.15, el => el.classList.add("show"));
document.querySelectorAll(".memory").forEach(m => (m.style.opacity = "0"));
revealOnScroll(".memory", 0.1, el => (el.style.animation = "fadeUp 0.8s ease forwards"));

// ===== Partikel emas saat klik =====
document.addEventListener("click", event => {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.textContent = Math.random() > 0.5 ? "✦" : "•";
        particle.style.left = event.clientX + (Math.random() * 50 - 25) + "px";
        particle.style.top = event.clientY + (Math.random() * 30 - 15) + "px";
        particle.style.color = Math.random() > 0.5 ? "#e8b84a" : "#f3d98b";
        particle.style.animationDuration = (2 + Math.random() * 2) + "s";
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 4000);
    }
});

// ===== Parallax foto hero =====
window.addEventListener("scroll", () => {
    const heroGallery = document.querySelector(".hero-gallery");
    if (heroGallery && window.scrollY < window.innerHeight) {
        heroGallery.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    }
});