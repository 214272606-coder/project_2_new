// Hash-based routing
function getSectionFromHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#/')) {
        return hash.substring(2);
    }
    return 'home';
}

function navigateToSection(sectionId) {
    const navLinks = document.querySelectorAll('.nav-item a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    
    const activeLink = document.querySelector('[data-section="' + sectionId + '"]');
    if (activeLink) activeLink.classList.add('active');
    
    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle hash changes
window.addEventListener('hashchange', function() {
    const sectionId = getSectionFromHash();
    navigateToSection(sectionId);
});

// Initial load
window.addEventListener('DOMContentLoaded', function() {
    const initialSection = getSectionFromHash();
    navigateToSection(initialSection);
});

// Navigation click handler
const navLinks = document.querySelectorAll('.nav-item a');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-section');
        
        // Update hash
        window.location.hash = '#/' + targetId;
    });
});

// Navigate function for cards - also update hash
function navigateTo(sectionId) {
    window.location.hash = '#/' + sectionId;
}

// Render streets
function renderStreets() {
    const grid = document.getElementById('streets-grid');
    if (!grid) return;
    
    let html = '';
    streets.forEach(street => {
        html += `
            <div class="card">
                <div class="card-header">
                    <h3>${street.name}</h3>
                    <span class="number">${street.id}</span>
                </div>
                <div class="card-body">
                    <p>地址：${street.address}</p>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// Render circles with images - 每个界别的卡片下显示对应的活动照片
function renderCircles() {
    const grid = document.getElementById('circles-grid');
    const tabs = document.getElementById('circles-tabs');
    if (!grid || !tabs) return;
    
    // Render tabs
    let tabsHtml = '<button class="category-tab active" data-filter="all">全部</button>';
    circles.forEach(circle => {
        tabsHtml += `<button class="category-tab" data-filter="circle${circle.id}">${circle.name}</button>`;
    });
    tabs.innerHTML = tabsHtml;
    
    // Render cards with images
    let html = '';
    circles.forEach(circle => {
        const images = circleImages[circle.folder] || [];
        
        // 生成轮播HTML
        let carouselHtml = '';
        if (images.length > 0) {
            carouselHtml = `
                <div class="circle-carousel" data-circle="${circle.id}">
                    <div class="carousel-track">
                        ${images.map((img, idx) => `
                            <div class="carousel-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                                <img src="${img}" alt="${circle.name}" loading="lazy" onerror="this.parentElement.style.display='none'">
                            </div>
                        `).join('')}
                    </div>
                    ${images.length > 1 ? `
                        <button class="carousel-btn prev" onclick="moveCarousel(${circle.id}, -1)">&#10094;</button>
                        <button class="carousel-btn next" onclick="moveCarousel(${circle.id}, 1)">&#10095;</button>
                        <div class="carousel-dots">
                            ${images.map((_, idx) => `
                                <span class="carousel-dot ${idx === 0 ? 'active' : ''}" onclick="goToSlide(${circle.id}, ${idx})"></span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        html += `
            <div class="card" data-category="circle${circle.id}">
                <div class="card-header">
                    <h3>${circle.name}</h3>
                    <span class="number">${circle.id}</span>
                </div>
                <div class="card-body">
                    <p>${circle.desc}</p>
                </div>
                ${carouselHtml}
            </div>
        `;
    });
    grid.innerHTML = html;
    
    // Add tab click handlers
    const categoryTabs = document.querySelectorAll('.category-tab');
    const circlesCards = document.querySelectorAll('#circles-grid .card');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            circlesCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Carousel functions
function moveCarousel(circleId, direction) {
    const carousel = document.querySelector(`.circle-carousel[data-circle="${circleId}"]`);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    let currentIndex = 0;
    
    slides.forEach((slide, idx) => {
        if (slide.classList.contains('active')) {
            currentIndex = idx;
            slide.classList.remove('active');
        }
    });
    
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = slides.length - 1;
    if (newIndex >= slides.length) newIndex = 0;
    
    slides[newIndex].classList.add('active');
    
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === newIndex);
    });
}

function goToSlide(circleId, index) {
    const carousel = document.querySelector(`.circle-carousel[data-circle="${circleId}"]`);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === index);
    });
    
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
    });
}

// Render practice gallery - 协商民主实践中心照片
function renderPracticeGallery() {
    const gallery = document.getElementById('practice-gallery');
    if (!gallery) return;
    
    let html = '';
    
    practiceImages.forEach(imgPath => {
        // 从文件路径中提取描述作为标题
        const fileName = imgPath.split('/').pop().replace('.webp', '');
        html += `
            <div class="gallery-item">
                <img src="${imgPath}" alt="协商民主实践活动" loading="lazy" onerror="this.style.display='none'">
                <div class="gallery-caption">${fileName}</div>
            </div>
        `;
    });
    
    gallery.innerHTML = html;
}

// Render platform gallery - 委员工作室展示
function renderPlatformGallery() {
    const gallery = document.getElementById('platform-gallery');
    if (!gallery) return;
    
    let html = '';
    
    studios.forEach(studio => {
        if (studio.image) {
            const fileName = studio.image.split('/').pop().replace('.webp', '');
            html += `
                <div class="gallery-item">
                    <img src="${studio.image}" alt="${studio.name}" loading="lazy" onerror="this.style.display='none'">
                    <div class="gallery-caption">
                        <strong>${studio.name}</strong>
                        <span>负责人：${studio.leader}</span>
                    </div>
                </div>
            `;
        }
    });
    
    gallery.innerHTML = html;
}

// Render platform table
function renderPlatformTable() {
    const tableBody = document.getElementById('platform-table');
    if (!tableBody) return;
    
    let html = '';
    studios.forEach(studio => {
        html += `
            <tr>
                <td>${studio.id}</td>
                <td>${studio.name}</td>
                <td>${studio.leader}</td>
                <td>${studio.address}</td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

// Render stars grid
function renderStars() {
    const grid = document.getElementById('stars-grid');
    if (!grid) return;
    
    let html = '';
    studios.slice(0, 25).forEach((studio, index) => {
        html += `
            <div class="card">
                <div class="card-header">
                    <h3>${studio.name}</h3>
                    <span class="number">${index + 1}</span>
                </div>
                <div class="card-body">
                    <p><span class="label">负责人：</span>${studio.leader}</p>
                    <p><span class="label">地址：</span>${studio.address}</p>
                    <span class="star-badge five-star" style="margin-top:10px;">★★★★★ 五星级</span>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// Render streets plan table - 街道民生议事堂计划
function renderStreetsPlan() {
    const tableBody = document.getElementById('streets-plan-table');
    if (!tableBody) return;
    
    const data = streetsPlanData;
    let html = '';
    let counter = 0;
    let currentDept = '';
    
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const dept = row[1] || '';
        const topic = row[2] || '';
        const time = row[3] || '';
        
        if (dept && dept.trim() !== '') {
            currentDept = dept;
            counter++;
            html += `
                <tr>
                    <td>${counter}</td>
                    <td>${currentDept}</td>
                    <td>${topic}</td>
                    <td>${time}</td>
                </tr>
            `;
        } else if (topic) {
            // 同一部门的第二个议题
            html += `
                <tr>
                    <td></td>
                    <td></td>
                    <td>${topic}</td>
                    <td>${time}</td>
                </tr>
            `;
        }
    }
    tableBody.innerHTML = html;
}

// Render circles plan table - 界别履职计划
function renderCirclesPlan() {
    const tableBody = document.getElementById('circles-plan-table');
    if (!tableBody) return;
    
    const data = circlesPlanData;
    let html = '';
    let counter = 0;
    let currentCircle = '';
    
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const circle = row[1] || '';
        const activity = row[2] || '';
        const type = row[3] || '';
        const time = row[4] || '';
        
        if (circle && circle.trim() !== '') {
            currentCircle = circle;
            counter++;
            html += `
                <tr>
                    <td>${counter}</td>
                    <td>${currentCircle}</td>
                    <td>${activity}</td>
                    <td>${type}</td>
                    <td>${time}</td>
                </tr>
            `;
        } else if (activity) {
            // 同一界别的第二个活动
            html += `
                <tr>
                    <td></td>
                    <td></td>
                    <td>${activity}</td>
                    <td>${type}</td>
                    <td>${time}</td>
                </tr>
            `;
        }
    }
    tableBody.innerHTML = html;
}

// Plan tabs functionality
function initPlanTabs() {
    const planTabs = document.querySelectorAll('.plan-tab');
    const planContents = document.querySelectorAll('.plan-content');
    
    planTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            planTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            planContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === filter + '-plan') {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Scroll to top button
const scrollTop = document.getElementById('scrollTop');
if (scrollTop) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });

    scrollTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderStreets();
    renderCircles();
    renderPracticeGallery();
    renderPlatformGallery();
    renderPlatformTable();
    renderStars();
    renderStreetsPlan();
    renderCirclesPlan();
    initPlanTabs();
});
