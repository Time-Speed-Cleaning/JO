// Preloader and AOS
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        AOS.init({ once: true, offset: 50, duration: 800, easing: 'ease-out-cubic' });
    }, 600);
});

// Navbar Scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// Mobile Menu Off-Canvas
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const navLinks = document.getElementById('nav-links');
const menuOverlay = document.getElementById('menu-overlay');
const navItems = navLinks.querySelectorAll('a');

function openMenu() {
    navLinks.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeMenuFunc() {
    navLinks.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}
if (menuToggle) menuToggle.addEventListener('click', openMenu);
if (closeMenu) closeMenu.addEventListener('click', closeMenuFunc);
if (menuOverlay) menuOverlay.addEventListener('click', closeMenuFunc);
navItems.forEach(link => link.addEventListener('click', closeMenuFunc));

// Swiper Init
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(faq => faq.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// Animated Counters (Highly robust for all devices including mobile browsers)
const counters = document.querySelectorAll('.counter');
let hasAnimated = false;

const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            counter.innerText = Math.floor(progress * target) + (target === 100 ? '%' : '+');
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.innerText = target + (target === 100 ? '%' : '+');
            }
        };
        window.requestAnimationFrame(step);
    });
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            animateCounters();
            hasAnimated = true;
        }
    });
}, { threshold: 0.05 }); // Lower threshold to ensure mobile screens trigger it properly

const statsSection = document.getElementById('stats');
if(statsSection) statsObserver.observe(statsSection);

// Theme Toggle
const themeToggles = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')];
const body = document.documentElement;
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);
updateIcons(currentTheme);

function toggleTheme() {
    let theme = body.getAttribute('data-theme');
    let newTheme = theme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcons(newTheme);
}
themeToggles.forEach(btn => { if(btn) btn.addEventListener('click', toggleTheme); });

function updateIcons(theme) {
    const isDark = theme === 'dark';
    themeToggles.forEach(btn => {
        if(btn) {
            const icon = btn.querySelector('i');
            if(isDark) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); } 
            else { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
        }
    });
}

// Auto Select Service from Cards and scroll smoothly
window.selectService = function(serviceVal) {
    const selectEl = document.getElementById('service');
    if(selectEl) {
        selectEl.value = serviceVal;
    }
    const bookingSection = document.getElementById('booking');
    if(bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Booking Form Logic (Strictly Formal)
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const lang = bookingForm.getAttribute('data-lang');
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const city = document.getElementById('city').value.trim();
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const notes = document.getElementById('notes').value.trim();
        
        let message = '';
        if (lang === 'ar') {
            message = `السادة فريق TIME SPEED CLEANING المحترمين،\nأود طلب حجز خدمة بناءً على التفاصيل الآتية:\n\nالاسم/الجهة: ${name}\nرقم الهاتف: ${phone}\nالعنوان التفصيلي: ${city}\nالخدمة المطلوبة: ${service}\nالتاريخ المقترح: ${date}\nالوقت المقترح: ${time}\nملاحظات: ${notes ? notes : 'لا يوجد'}\n\nيرجى تأكيد الحجز، مع خالص التحية.`;
        } else {
            message = `Dear TIME SPEED CLEANING Team,\nI would like to request a service booking with the following details:\n\nName/Organization: ${name}\nPhone: ${phone}\nAddress: ${city}\nService: ${service}\nDate: ${date}\nTime: ${time}\nNotes: ${notes ? notes : 'None'}\n\nKindly confirm the booking. Best regards.`;
        }
        
        const whatsappNumber = "962799607579";
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    });
}
