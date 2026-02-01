// ============================
// জাভাস্ক্রিপ্ট - script.js
// দীপ্ত সরকারের ব্যক্তিগত ওয়েবসাইট
// ============================

// ডকুমেন্ট রেডি হলে
document.addEventListener('DOMContentLoaded', function() {
    // লোডিং স্ক্রীন হাইড করুন
    setTimeout(function() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.style.display = 'none', 500);
        }
    }, 1000);

    // স্ক্রল এফেক্ট
    setupScrollEffects();
    
    // ফর্ম হ্যান্ডলার
    setupFormHandlers();
    
    // AI সহকারী ইনিশিয়ালাইজ
    initializeAssistant();
    
    // অ্যানিমেশন ট্রিগার
    setupAnimations();
});

// স্ক্রল এফেক্ট সেটআপ
function setupScrollEffects() {
    // স্মুথ স্ক্রলিং
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // নেভবার স্টিকি ইফেক্ট
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
    });
}

// মোবাইল মেনু টগল
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// ফর্ম হ্যান্ডলার সেটআপ
function setupFormHandlers() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // ফর্ম ডাটা কালেক্ট
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // ভ্যালিডেশন
            if (!data.name || !data.email || !data.message) {
                showAlert('দয়া করে সব ফিল্ড পূরণ করুন।', 'error');
                return;
            }
            
            // সিমুলেটেড সাবমিশন
            showAlert('আপনার মেসেজ সফলভাবে পাঠানো হয়েছে!', 'success');
            this.reset();
            
            // এখানে AJAX রিকোয়েস্ট যোগ করতে পারেন
            console.log('Form submitted:', data);
        });
    }
}

// AI সহকারী ইনিশিয়ালাইজ
function initializeAssistant() {
    // প্রি-ডিফাইনড প্রশ্ন-উত্তর
    const responses = {
        'তোমার কি কি কাজ করতে পারো': 'আমি নিম্নলিখিত কাজ করতে পারি:\n• আপনার প্রশ্নের উত্তর দিতে\n• টাস্ক ম্যানেজ করতে সাহায্য করতে\n• নোট সেভ করতে\n• দৈনিক পরিকল্পনা করতে\n• বিভিন্ন তথ্য প্রদান করতে',
        'আজকের তারিখ কি': new Date().toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        }),
        'দীপ্ত সরকার সম্পর্কে বলো': 'দীপ্ত সরকার একজন ওয়েব ডেভেলপার এবং প্রোগ্রামার। তিনি HTML, CSS, JavaScript, React, Node.js সহ বিভিন্ন টেকনোলজিতে দক্ষ। তিনি নতুন চ্যালেঞ্জ গ্রহণ করতে পছন্দ করেন এবং টেকনোলজি নিয়ে আগ্রহী।',
        'হ্যালো': 'হ্যালো! আমি আপনার AI সহকারী। কিভাবে আপনাকে সাহায্য করতে পারি?',
        'ধন্যবাদ': 'আপনাকেও ধন্যবাদ! আর কোনো সাহায্যের প্রয়োজন হলে বলবেন।',
        'তোমার নাম কি': 'আমার নাম AI সহকারী। দীপ্ত সরকার আমাকে তৈরি করেছেন।',
        'কি অবস্থা': 'আমি ভালো আছি, ধন্যবাদ! আপনারা কেমন আছেন?',
        'বিদায়': 'বিদায়! ভালো থাকবেন। আবার কথা হবে।'
    };

    // গ্লোবাল ভেরিয়েবল হিসেবে সংরক্ষণ
    window.aiResponses = responses;
}

// মেসেজ পাঠান
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // ইউজার মেসেজ যোগ
    addMessage(message, 'user');
    input.value = '';
    
    // AI রেসপন্স
    setTimeout(() => {
        const response = getAIResponse(message);
        addMessage(response, 'assistant');
    }, 1000);
}

// প্রশ্ন দ্রুত জিজ্ঞাসা
function askQuestion(question) {
    const input = document.getElementById('chatInput');
    input.value = question;
    sendMessage();
}

// AI রেসপন্স পাওয়া
function getAIResponse(message) {
    message = message.toLowerCase();
    
    // প্রি-ডিফাইনড রেসপন্স চেক
    for (const [key, response] of Object.entries(window.aiResponses)) {
        if (message.includes(key.toLowerCase())) {
            return response;
        }
    }
    
    // ডিফল্ট রেসপন্স
    const defaultResponses = [
        'আমি সেই প্রশ্নের উত্তর এখনো জানি না। আপনি অন্য কিছু জিজ্ঞাসা করুন।',
        'দুঃখিত, আমি এখনো সেই তথ্য জানি না।',
        'আমি এখনো শিখছি। অন্য কোনো প্রশ্ন করুন।',
        'দীপ্ত সরকার সম্পর্কে আরো তথ্য জানতে চান?'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// চ্যাটে মেসেজ যোগ
function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <strong>${sender === 'assistant' ? 'AI সহকারী' : 'আপনি'}:</strong> ${text}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// অ্যালার্ট শো
function showAlert(message, type = 'info') {
    // অ্যালার্ট এলিমেন্ট তৈরি
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // স্টাইলস
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(alertDiv);
    
    // অটো রিমুভ
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// অ্যানিমেশন সেটআপ
function setupAnimations() {
    // স্কিল বার অ্যানিমেশন
    const skillBars = document.querySelectorAll('.skill-level');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => bar.style.width = width, 500);
    });

    // স্ক্রল-ভিত্তিক অ্যানিমেশন
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // অ্যানিমেট করতে চাই এমন এলিমেন্টস
    document.querySelectorAll('.project-card, .feature-card').forEach(el => {
        observer.observe(el);
    });
}

// এনিমেশন স্টাইলস ইনজেক্ট
const animationStyles = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.animated {
    animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// ডেটা সেভ/লোড ফাংশন (লোকাল স্টোরেজ ব্যবহার)
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(`dipto_${key}`, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('LocalStorage error:', e);
        return false;
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(`dipto_${key}`);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('LocalStorage error:', e);
        return null;
    }
}

// সাইট থিম টগল (ডার্ক/লাইট মোড)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    saveToLocalStorage('theme', newTheme);
    
    showAlert(newTheme === 'dark' ? 'ডার্ক মোড চালু' : 'লাইট মোড চালু');
}

// থিম লোড করুন
const savedTheme = loadFromLocalStorage('theme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
}

// টেস্ট ফাংশন - সবকিছু কাজ করছে কিনা চেক
function testWebsite() {
    console.log('Website functions test:');
    console.log('1. Loading screen:', document.getElementById('loadingScreen') ? 'OK' : 'Missing');
    console.log('2. Chat input:', document.getElementById('chatInput') ? 'OK' : 'Missing');
    console.log('3. Contact form:', document.getElementById('contactForm') ? 'OK' : 'Missing');
    console.log('4. AI responses initialized:', window.aiResponses ? 'OK' : 'Missing');
    
    showAlert('ওয়েবসাইট সফলভাবে লোড হয়েছে!', 'success');
}

// পেজ লোড হলে টেস্ট রান করুন
window.addEventListener('load', testWebsite);

// লোগো লোড চেক
function checkLogo() {
    const logoImg = document.querySelector('.logo-img');
    const logoFallback = document.getElementById('logoFallback');
    
    // যদি লোগো ইমেজ লোড না হয়
    if (logoImg && !logoImg.complete) {
        logoImg.onerror = function() {
            this.style.display = 'none';
            if (logoFallback) {
                logoFallback.style.display = 'flex';
            }
        };
    }
    
    // ফুটার লোগো
    const footerLogo = document.querySelector('.footer-logo-img');
    if (footerLogo) {
        footerLogo.onerror = function() {
            this.style.display = 'none';
            const parent = this.parentElement;
            if (parent) {
                parent.innerHTML = `
                    <i class="fas fa-code" style="font-size: 3rem; color: #667eea;"></i>
                    <h3>দীপ্ত সরকার</h3>
                    <p>ওয়েব ডেভেলপার | প্রোগ্রামার</p>
                `;
            }
        };
    }
}

// পেজ লোড হলে চেক করুন
document.addEventListener('DOMContentLoaded', checkLogo);