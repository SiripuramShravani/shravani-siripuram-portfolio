/*==============================================
  SHRAVANI SIRIPURAM - PORTFOLIO WEBSITE
  content.md loader/parser/renderer + interactive features
==============================================*/

// ===== DOM LOADED =====
document.addEventListener('DOMContentLoaded', function () {
    // Fix URL hash on initial load - scroll to top and clear hash
    if (window.location.hash && window.location.hash !== '#home') {
        setTimeout(() => {
            window.scrollTo(0, 0);
            history.replaceState(null, null, window.location.pathname);
        }, 0);
    }

    loadAndRenderContent();
});

/*==============================================
  CONTENT LOADING
==============================================*/
async function loadAndRenderContent() {
    try {
        const res = await fetch('content.md', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load content.md: HTTP ' + res.status);
        const raw = await res.text();
        const data = parseContent(raw);
        renderAll(data);
    } catch (err) {
        console.error('Could not load content.md:', err);
        showContentLoadError();
        return;
    }

    // Interactive features - run only after content exists in the DOM
    initNavigation();
    initScrollProgress();
    initScrollAnimations();
    initCounters();
    initSkillBars();
    initTypingAnimation();
    initBackToTop();
    initExpandableCards();
    initRippleEffect();
    initLazyLoadFallback();
    logRecruiterMessage();
}

function showContentLoadError() {
    const banner = document.getElementById('content-error');
    if (banner) banner.classList.add('visible');
}

/*==============================================
  PARSER — turns content.md into structured data
==============================================*/
function parseContent(rawText) {
    const text = rawText.replace(/\r\n/g, '\n');
    const sections = splitSections(text);

    return {
        site: parseKV(sections.SITE || ''),
        hero: parseKV(sections.HERO || ''),
        achievements: parsePipeList(sections.ACHIEVEMENTS || ''),
        about: parseAbout(sections.ABOUT || ''),
        skills: parseSkills(sections.SKILLS || ''),
        experience: parseExperience(sections.EXPERIENCE || ''),
        projects: parseProjects(sections.PROJECTS || ''),
        linkedin: parseLinkedin(sections.LINKEDIN || ''),
        education: parseKV(sections.EDUCATION || ''),
        awards: parseAwards(sections.AWARDS || ''),
        contact: parseKV(sections.CONTACT || '')
    };
}

// Split text into top-level "# NAME" blocks
function splitSections(text) {
    const re = /^# (.+)$/gm;
    const matches = [...text.matchAll(re)];
    const result = {};
    for (let i = 0; i < matches.length; i++) {
        const name = matches[i][1].trim().toUpperCase();
        const start = matches[i].index + matches[i][0].length;
        const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
        result[name] = text.slice(start, end).trim();
    }
    return result;
}

// Split text into ordered "## header" blocks (used inside a section)
function splitSubsectionsOrdered(text) {
    const re = /^## (.+)$/gm;
    const matches = [...text.matchAll(re)];
    const result = [];
    for (let i = 0; i < matches.length; i++) {
        const header = matches[i][1].trim();
        const start = matches[i].index + matches[i][0].length;
        const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
        result.push({ header, body: text.slice(start, end).trim() });
    }
    return result;
}

// Parse simple "Key: value" lines into an object
function parseKV(block) {
    const obj = {};
    block.split('\n').forEach(line => {
        const m = line.match(/^([A-Za-z][A-Za-z0-9 ]*):\s?(.*)$/);
        if (m) obj[m[1].trim()] = m[2].trim();
    });
    return obj;
}

// Parse "key: value | key: value" lines into an array of objects
function parsePipeList(block) {
    return block.split('\n').filter(l => l.trim()).map(line => {
        const obj = {};
        line.split('|').forEach(part => {
            const m = part.match(/^\s*([A-Za-z][A-Za-z0-9 ]*):\s?(.*)$/);
            if (m) obj[m[1].trim().toLowerCase()] = m[2].trim();
        });
        return obj;
    });
}

function parseAbout(block) {
    const [paragraphPart, highlightsPart] = block.split(/^## Highlights\s*$/m);
    const paragraphs = (paragraphPart || '')
        .trim()
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(Boolean);
    const highlights = parsePipeList((highlightsPart || '').trim());
    return { paragraphs, highlights };
}

function parseSkills(block) {
    return splitSubsectionsOrdered(block).map(({ header, body }) => {
        const [namePart, iconPart] = header.split('|').map(s => s.trim());
        const icon = (iconPart || '').replace(/^icon:\s*/i, '').trim() || 'fa-layer-group';
        const items = body.split('\n').filter(l => l.trim()).map(line => {
            const m = line.match(/^(.+):\s*(\d+)\s*$/);
            return m ? { name: m[1].trim(), value: parseInt(m[2], 10) } : null;
        }).filter(Boolean);
        return { name: namePart, icon, items };
    });
}

function parseExperience(block) {
    return splitSubsectionsOrdered(block).map(({ header, body }) => {
        const parts = header.split('|').map(s => s.trim());
        const role = parts[0] || '';
        const company = parts[1] || '';
        const current = (parts[2] || '').toLowerCase() === 'current';

        const meta = {};
        const visible = [];
        const hidden = [];
        let pastDivider = false;

        body.split('\n').forEach(raw => {
            const line = raw.trim();
            if (!line) return;
            if (line === '---') { pastDivider = true; return; }
            if (line.startsWith('- ')) {
                (pastDivider ? hidden : visible).push(line.slice(2).trim());
                return;
            }
            const kv = line.match(/^([A-Za-z][A-Za-z0-9 ]*):\s?(.*)$/);
            if (!kv) return;
            const key = kv[1].trim();
            if (key.toLowerCase() === 'tech') {
                meta.tech = kv[2].split(',').map(t => t.trim()).filter(Boolean);
            } else {
                meta[key] = kv[2].trim();
            }
        });

        return { role, company, current, meta, visible, hidden };
    });
}

function parseProjects(block) {
    return splitSubsectionsOrdered(block).map(({ header, body }) => {
        const parts = header.split('|').map(s => s.trim());
        const title = parts[0] || '';
        const company = parts[1] || '';
        const status = (parts[2] || '').toLowerCase();

        const meta = {};
        const bullets = [];

        body.split('\n').forEach(raw => {
            const line = raw.trim();
            if (!line) return;
            if (line.startsWith('- ')) {
                bullets.push(line.slice(2).trim());
                return;
            }
            const kv = line.match(/^([A-Za-z][A-Za-z0-9 ]*):\s?(.*)$/);
            if (!kv) return;
            const key = kv[1].trim();
            if (key.toLowerCase() === 'tech') {
                meta.tech = kv[2].split(',').map(t => t.trim()).filter(Boolean);
            } else if (key.toLowerCase() === 'contributions') {
                // section label only, bullets follow
            } else {
                meta[key] = kv[2].trim();
            }
        });

        return { title, company, status, meta, bullets };
    });
}

function parseLinkedin(block) {
    return splitSubsectionsOrdered(block).map(({ header, body }) => {
        const parts = header.split('|').map(s => s.trim());
        const title = parts[0] || '';
        const badgeType = parts[1] || '';
        const badgeLabel = parts[2] || '';
        const kv = parseKV(body);
        return {
            title,
            badgeType,
            badgeLabel,
            meta: kv.Meta || '',
            excerpt: kv.Excerpt || '',
            link: kv.Link || '#'
        };
    });
}

function parseAwards(block) {
    return splitSubsectionsOrdered(block).map(({ header, body }) => {
        const parts = header.split('|').map(s => s.trim());
        const title = parts[0] || '';
        const color = parts[1] || 'cyan';
        const icon = parts[2] || 'fa-award';
        const kv = parseKV(body);
        return { title, color, icon, org: kv.Org || '', date: kv.Date || '' };
    });
}

/*==============================================
  RENDERER — turns parsed data into DOM
==============================================*/
function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function mdInline(str) {
    return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value != null && value !== '') el.textContent = value;
}

function applyDataFields(map) {
    Object.entries(map).forEach(([field, value]) => {
        if (value == null || value === '') return;
        document.querySelectorAll(`[data-field="${field}"]`).forEach(el => {
            if (field.endsWith('-href')) {
                el.setAttribute('href', value);
            } else {
                el.textContent = value;
            }
        });
    });
}

function renderAll(data) {
    renderSiteMeta(data.site);
    renderHero(data.hero);
    applyDataFields({
        'resume-href': data.site.Resume,
        'email-href': data.site.Email ? `mailto:${data.site.Email}` : '',
        'email-text': data.site.Email,
        'linkedin-href': data.site.LinkedIn,
        'github-href': data.site.GitHub,
        'location-text': data.site.Location,
        'brand-name': data.site.Name,
        'brand-title': data.site.BrandTitle,
        'response-time-text': data.contact.ResponseTime,
        'availability-text': data.contact.Availability
    });
    renderAchievements(data.achievements);
    renderAbout(data.about);
    renderSkills(data.skills);
    renderExperience(data.experience);
    renderProjects(data.projects);
    renderLinkedin(data.linkedin);
    renderEducation(data.education);
    renderAwards(data.awards);
}

function renderSiteMeta(site) {
    if (site.Name && site.BrandTitle) {
        document.title = `${site.Name} | ${site.BrandTitle}`;
    }
    const desc = document.querySelector('meta[name="description"]');
    if (desc && site.MetaDescription) desc.setAttribute('content', site.MetaDescription);
    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords && site.MetaKeywords) keywords.setAttribute('content', site.MetaKeywords);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && site.Name && site.BrandTitle) ogTitle.setAttribute('content', `${site.Name} - ${site.BrandTitle}`);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && site.MetaDescription) ogDesc.setAttribute('content', site.MetaDescription);
}

function renderHero(hero) {
    setText('hero-greeting', hero.Greeting);
    setText('hero-title', hero.Title);
    setText('hero-subtitle', hero.Subtitle);
    setText('hero-tagline', hero.Tagline);
}

function renderAchievements(list) {
    const container = document.getElementById('achievements-grid');
    if (!container) return;
    container.innerHTML = list.map(item => {
        const isAuto = item.target === 'auto';
        const idAttr = isAuto ? ' id="experience-counter"' : '';
        const target = isAuto ? '0' : (item.target || '0');
        const suffix = item.suffix || '';
        return `
        <div class="achievement-card">
            <div class="achievement-icon"><i class="fas ${escapeHtml(item.icon || 'fa-star')}"></i></div>
            <div class="achievement-number"${idAttr} data-target="${escapeHtml(target)}" data-suffix="${escapeHtml(suffix)}" data-auto="${isAuto}">0</div>
            <div class="achievement-label">${escapeHtml(item.label || '')}</div>
        </div>`;
    }).join('');
}

function renderAbout(about) {
    const paragraphsEl = document.getElementById('about-paragraphs');
    if (paragraphsEl) {
        paragraphsEl.innerHTML = about.paragraphs.map(p => `<p>${mdInline(p)}</p>`).join('');
    }
    const highlightsEl = document.getElementById('about-highlights');
    if (highlightsEl) {
        highlightsEl.innerHTML = about.highlights.map(item => `
            <div class="highlight-card">
                <i class="fas ${escapeHtml(item.icon || 'fa-star')}"></i>
                <span>${escapeHtml(item.text || '')}</span>
            </div>`).join('');
    }
}

function renderSkills(list) {
    const container = document.getElementById('skills-grid');
    if (!container) return;
    container.innerHTML = list.map(cat => `
        <div class="skill-card">
            <div class="skill-header">
                <i class="fas ${escapeHtml(cat.icon)}"></i>
                <h3>${escapeHtml(cat.name)}</h3>
            </div>
            <div class="skill-list">
                ${cat.items.map(it => `
                <div class="skill-item">
                    <span>${escapeHtml(it.name)}</span>
                    <div class="skill-bar"><div class="skill-progress" data-progress="${it.value}"></div></div>
                </div>`).join('')}
            </div>
        </div>`).join('');
}

function renderExperience(list) {
    const container = document.getElementById('experience-timeline');
    if (!container) return;
    container.innerHTML = list.map((exp, idx) => {
        const dotClass = exp.current ? 'timeline-dot current' : 'timeline-dot';
        const badge = exp.current
            ? `<span class="badge badge-current">&#x25CF; Current</span>`
            : (exp.meta.Badge ? `<span class="badge exp-duration-badge">${escapeHtml(exp.meta.Badge)}</span>` : '');
        const respId = `resp-${idx}`;
        const visibleLis = exp.visible.map(t => `<li>${mdInline(t)}</li>`).join('');
        const hiddenLis = exp.hidden.map(t => `<li class="extra-item hidden">${mdInline(t)}</li>`).join('');
        const expandBtn = exp.hidden.length
            ? `<button class="expand-btn" data-expanded="false" data-target="${respId}">View Details ▾</button>`
            : '';
        const tech = (exp.meta.tech || []).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');
        return `
        <div class="timeline-item">
            <div class="${dotClass}"></div>
            <div class="timeline-card">
                <div class="exp-header-row">
                    <div class="exp-title-block">
                        <h3 class="exp-role">${escapeHtml(exp.role)}</h3>
                        <h4 class="exp-company">${escapeHtml(exp.company)}</h4>
                    </div>
                    ${badge}
                </div>
                <div class="exp-meta-row">
                    <span class="exp-duration"><i class="fas fa-calendar-alt"></i> ${escapeHtml(exp.meta.Duration || '')}</span>
                    <span class="exp-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(exp.meta.Location || '')}</span>
                </div>
                <ul class="responsibilities" id="${respId}">${visibleLis}${hiddenLis}</ul>
                ${expandBtn}
                <div class="tech-stack">${tech}</div>
            </div>
        </div>`;
    }).join('');
}

function renderProjects(list) {
    const container = document.getElementById('projects-grid');
    if (!container) return;
    container.innerHTML = list.map(proj => {
        const badge = proj.status === 'ongoing' ? `<div class="proj-status-badge ongoing">&#x25CF; Ongoing</div>` : '';
        const tech = (proj.meta.tech || []).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');
        const bullets = proj.bullets.map(b => `<li>${mdInline(b)}</li>`).join('');
        return `
        <div class="project-card">
            ${badge}
            <div class="proj-header">
                <h3 class="proj-title">${escapeHtml(proj.title)}</h3>
                <div class="proj-meta">
                    <span class="proj-meta-item"><i class="fas fa-calendar-alt"></i> ${escapeHtml(proj.meta.Duration || '')}</span>
                    <span class="proj-meta-sep">|</span>
                    <span class="proj-meta-item"><i class="fas fa-building"></i> ${escapeHtml(proj.company)}</span>
                </div>
            </div>
            <p class="proj-description">${mdInline(proj.meta.Description || '')}</p>
            <div class="proj-contributions">
                <p class="proj-contributions-label">Key Contributions</p>
                <ul class="proj-bullets">${bullets}</ul>
            </div>
            <div class="tech-stack">${tech}</div>
        </div>`;
    }).join('');
}

function renderLinkedin(list) {
    const container = document.getElementById('linkedin-posts');
    if (!container) return;
    container.innerHTML = list.map(post => `
        <div class="linkedin-card">
            <div class="post-badge ${escapeHtml(post.badgeType)}">${escapeHtml(post.badgeLabel)}</div>
            <div class="post-content">
                <h3>${escapeHtml(post.title)}</h3>
                <p class="post-meta"><i class="fab fa-linkedin"></i> ${escapeHtml(post.meta)}</p>
                <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
            </div>
            <a href="${escapeHtml(post.link)}" class="btn-linkedin" target="_blank" rel="noopener noreferrer">View on LinkedIn</a>
        </div>`).join('');
}

function renderEducation(edu) {
    const container = document.getElementById('education-container');
    if (!container) return;
    container.innerHTML = `
        <div class="education-card">
            <div class="education-icon"><i class="fas fa-graduation-cap"></i></div>
            <h3>${escapeHtml(edu.Degree || '')}</h3>
            <h4>${escapeHtml(edu.School || '')}</h4>
            <p class="university">${escapeHtml(edu.University || '')}</p>
            <p class="duration">${escapeHtml(edu.Duration || '')}</p>
            <div class="cgpa-badge">CGPA: ${escapeHtml(edu.CGPA || '')}</div>
        </div>`;
}

function renderAwards(list) {
    const container = document.getElementById('awards-grid');
    if (!container) return;
    container.innerHTML = list.map(a => `
        <div class="award-card ${escapeHtml(a.color)}">
            <i class="fas ${escapeHtml(a.icon)}"></i>
            <h4>${escapeHtml(a.title)}</h4>
            <p>${escapeHtml(a.org)}</p>
            <span class="award-date">${escapeHtml(a.date)}</span>
        </div>`).join('');
}

/*==============================================
  INTERACTIVE FEATURES
==============================================*/

// ===== EXPANDABLE EXPERIENCE CARDS =====
function initExpandableCards() {
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const list = document.getElementById(targetId);
            if (!list) return;

            const extras = list.querySelectorAll('.extra-item');
            const isExpanded = btn.dataset.expanded === 'true';

            extras.forEach(el => {
                if (isExpanded) {
                    el.classList.add('hidden');
                } else {
                    el.classList.remove('hidden');
                }
            });

            btn.dataset.expanded = (!isExpanded).toString();
            btn.textContent = isExpanded ? 'View Details ▾' : 'Collapse ▴';
        });
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== SCROLL PROGRESS INDICATOR =====
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
        progressBar.style.width = scrolled + '%';
    });
}

// ===== SCROLL ANIMATIONS - Intersection Observer =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll(
        '.achievement-card, .skill-card, .timeline-item, .project-card, ' +
        '.linkedin-card, .education-card, .award-card, .about-container'
    );

    revealElements.forEach(element => {
        element.classList.add('reveal');
        observer.observe(element);
    });
}

// ===== COUNTER ANIMATION =====
function initCounters() {
    const counters = document.querySelectorAll('.achievement-number');
    let countersActivated = false;

    // Calculate years of experience dynamically
    const startDate = new Date('2023-08-01');
    const currentDate = new Date();
    const yearsOfExperience = (currentDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);

    const experienceCounter = document.getElementById('experience-counter');
    if (experienceCounter) {
        experienceCounter.setAttribute('data-target', yearsOfExperience.toFixed(1));
    }

    const observerOptions = { threshold: 0 };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersActivated) {
                countersActivated = true;
                animateCounters();
            }
        });
    }, observerOptions);

    const achievementsSection = document.querySelector('.achievements');
    if (achievementsSection) {
        counterObserver.observe(achievementsSection);
    }

    function animateCounters() {
        counters.forEach(counter => {
            const isAuto = counter.getAttribute('data-auto') === 'true';
            const target = parseFloat(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = (isAuto ? current.toFixed(1) : Math.floor(current)) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = (isAuto ? target.toFixed(1) : target) + suffix;
                }
            };

            updateCounter();
        });
    }
}

// ===== SKILL BARS ANIMATION =====
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observerOptions = { threshold: 0.5 };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress + '%';
                entry.target.classList.add('animated');
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// ===== TYPING ANIMATION =====
function initTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const text = typingText.textContent;
    typingText.textContent = '';
    typingText.style.opacity = '1';

    let charIndex = 0;

    function type() {
        if (charIndex < text.length) {
            typingText.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, 35); // Typing speed
        }
    }

    setTimeout(type, 1200);
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== RIPPLE EFFECT ON BUTTONS =====
function initRippleEffect() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ===== LAZY LOAD FALLBACK =====
function initLazyLoadFallback() {
    if (!('loading' in HTMLImageElement.prototype)) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
}

function logRecruiterMessage() {
    console.log('%c👋 Hello Recruiter!', 'color: #2563EB; font-size: 24px; font-weight: bold;');
    console.log('%cThanks for checking out the code!', 'color: #475569; font-size: 16px;');
    console.log('%cThis portfolio is built with vanilla HTML, CSS, and JavaScript, driven by a single content.md file.', 'color: #475569; font-size: 14px;');
}
