// ===============================


// ===============================
// TEMA CLARO / ESCURO
// ===============================
const themeToggle = document.getElementById('theme-toggle');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
const root = document.documentElement;

function getSavedTheme() {
    try {
        return localStorage.getItem('portfolio-theme') || 'dark';
    } catch (error) {
        return 'dark';
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem('portfolio-theme', theme);
    } catch (error) {
        // Mantém o site funcionando mesmo se o navegador bloquear o localStorage.
    }
}

function updateThemeButtons(theme) {
    const isLight = theme === 'light';
    const iconClass = isLight ? 'fas fa-moon' : 'fas fa-sun';
    const actionLabel = isLight ? 'Ativar modo escuro' : 'Ativar modo claro';

    document.querySelectorAll('[data-theme-icon]').forEach(icon => {
        icon.className = iconClass;
    });

    document.querySelectorAll('.theme-toggle').forEach(button => {
        button.setAttribute('aria-label', actionLabel);
        button.setAttribute('title', actionLabel);
    });
}

function updateHackerLayerVisibility(theme) {
    const isLight = theme === 'light';
    const hackerCanvas = document.getElementById('hacker-background');
    const cyberScan = document.querySelector('.cyber-scan');
    const cyberNoise = document.querySelector('.cyber-noise');
    const spaceScene = document.getElementById('space-scene');

    // No modo claro, o efeito precisa de mais presença e contraste.
    if (hackerCanvas) {
        hackerCanvas.style.opacity = isLight ? '0.42' : '0.55';
        hackerCanvas.style.mixBlendMode = isLight ? 'multiply' : 'screen';
    }

    if (cyberScan) {
        cyberScan.style.opacity = isLight ? '0.72' : '1';
        cyberScan.style.mixBlendMode = isLight ? 'multiply' : 'screen';
    }

    if (cyberNoise) {
        cyberNoise.style.opacity = isLight ? '0.16' : '0.22';
        cyberNoise.style.mixBlendMode = isLight ? 'multiply' : 'screen';
    }

    // A cena 3D do hero é escura por natureza. No modo claro, ela fica mais discreta.
    if (spaceScene) {
        spaceScene.style.opacity = isLight ? '0.36' : '1';
    }
}

function updateNavbarStyle(scrollPosition = window.scrollY + 100) {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const isLight = root.classList.contains('light-mode');

    if (scrollPosition > 100) {
        navbar.style.background = isLight
            ? 'rgba(255, 255, 255, 0.88)'
            : 'rgba(0, 0, 0, 0.8)';
        navbar.style.backdropFilter = 'blur(14px)';
        navbar.style.boxShadow = isLight
            ? '0 14px 35px rgba(15, 23, 42, 0.08)'
            : '0 14px 35px rgba(0, 0, 0, 0.28)';
    } else {
        navbar.style.background = isLight
            ? 'linear-gradient(to right, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.62))'
            : 'linear-gradient(to right, rgba(0, 0, 0, 0.9), transparent)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = 'none';
    }
}

function applyTheme(theme) {
    const selectedTheme = theme === 'light' ? 'light' : 'dark';
    const isLight = selectedTheme === 'light';

    root.dataset.theme = selectedTheme;
    root.classList.toggle('light-mode', isLight);
    document.body.classList.toggle('light-mode', isLight);

    // Remove as classes fixas do Tailwind que prendiam o site no preto/branco.
    document.body.classList.toggle('bg-black', !isLight);
    document.body.classList.toggle('text-white', !isLight);

    updateThemeButtons(selectedTheme);
    updateHackerLayerVisibility(selectedTheme);
    updateNavbarStyle();
    saveTheme(selectedTheme);
}

function toggleTheme() {
    const currentTheme = root.dataset.theme || 'dark';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

// Aplica o tema antes das animações começarem.
applyTheme(getSavedTheme());

// ===============================
// ANIMAÇÕES DE ENTRADA
// ===============================
function initAnimations() {
    const revealElements = document.querySelectorAll('.reveal-element');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;

                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    initTiltEffect();

    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        typingElement.style.width = '0';
    }
}

// ===============================
// EFEITO TILT NOS CARDS
// ===============================
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// ===============================
// MENU MOBILE
// ===============================
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const line3 = document.getElementById('line3');
let menuOpen = false;

function toggleMobileMenu() {
    if (!mobileMenu || !line1 || !line2 || !line3) return;

    menuOpen = !menuOpen;

    if (menuOpen) {
        mobileMenu.style.transform = 'translateX(0)';
        line1.style.transform = 'rotate(45deg) translate(5px, 5px)';
        line2.style.opacity = '0';
        line3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        mobileMenu.style.transform = 'translateX(100%)';
        line1.style.transform = 'rotate(0) translate(0, 0)';
        line2.style.opacity = '1';
        line3.style.transform = 'rotate(0) translate(0, 0)';
    }
}

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
}

document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (menuOpen) toggleMobileMenu();
    });
});

// ===============================
// ROLAGEM SUAVE
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const target = document.querySelector(link.getAttribute('href'));

        if (target) {
            if (menuOpen) toggleMobileMenu();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===============================
// FUNDO HACKER ANIMADO
// ===============================
function initHackerBackground() {
    const canvas = document.getElementById('hacker-background');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let width;
    let height;
    let elements = [];
    let energyLines = [];

    const words = [
        'ACCESS_GRANTED',
        'DEPLOY',
        'FULL_STACK',
        'ROBOTICS',
        'CLOUD',
        'IoT',
        'API',
        'SERVER',
        'DATABASE',
        'SYSTEM_ON',
        'BUILD_OK',
        'AUTH',
        'ROOT',
        'NODE',
        'LARAVEL',
        'REACT',
        'PYTHON',
        'MQTT',
        'FUENTES',
        'SENAI',
        'SESI',
        'FATEC',
        'ARDUINO',
        'LEGO',
        'MONTE_ALTO',
        'ARARAQUARA',
        'EDUCACAO',
        'SEGURANCA',
        'HARDWARE',
        'AWS',
        'SHX',
        'NEW_STANDARD',
        'INSIDE_INFORMATICA',
        'ESP32'
    ];

    function resizeCanvas() {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.floor(width * pixelRatio);
        canvas.height = Math.floor(height * pixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        createElements();
        createEnergyLines();
    }

    function randomCode() {
        const hex = '0123456789ABCDEF';
        let code = '0x';

        for (let i = 0; i < 6; i++) {
            code += hex[Math.floor(Math.random() * hex.length)];
        }

        return Math.random() > 0.55
            ? words[Math.floor(Math.random() * words.length)]
            : code;
    }

    function createElements() {
        elements = [];

        const total = Math.max(30, Math.floor(width / 26));

        for (let i = 0; i < total; i++) {
            elements.push({
                x: Math.random() * width,
                y: Math.random() * height,
                text: randomCode(),
                speed: 0.18 + Math.random() * 0.75,
                size: 10 + Math.random() * 8,
                opacity: 0.05 + Math.random() * 0.18,
                delay: Math.random() * 100,
                glitch: Math.random() > 0.72
            });
        }
    }

    function createEnergyLines() {
        energyLines = [];

        const total = Math.max(5, Math.floor(width / 260));

        for (let i = 0; i < total; i++) {
            energyLines.push({
                x: Math.random() * width,
                y: Math.random() * height,
                length: 120 + Math.random() * 280,
                speed: 1.5 + Math.random() * 2.2,
                opacity: 0.08 + Math.random() * 0.18
            });
        }
    }

    function drawGrid(isLightMode) {
        const gridSize = 72;

        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = isLightMode
            ? 'rgba(30, 64, 175, 0.115)'
            : 'rgba(77, 168, 218, 0.06)';

        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        ctx.restore();
    }

    function drawConnections(isLightMode) {
        ctx.save();

        for (let i = 0; i < elements.length; i++) {
            const a = elements[i];

            for (let j = i + 1; j < elements.length; j++) {
                const b = elements[j];
                const distance = Math.hypot(a.x - b.x, a.y - b.y);

                if (distance < 155) {
                    const strength = 1 - distance / 155;
                    const alpha = isLightMode
                        ? 0.035 + strength * 0.15
                        : 0.02 + strength * 0.12;

                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = isLightMode
                        ? `rgba(30, 64, 175, ${alpha})`
                        : `rgba(34, 211, 238, ${alpha})`;
                    ctx.lineWidth = isLightMode ? 1.15 : 1;
                    ctx.stroke();
                }
            }
        }

        ctx.restore();
    }

    function drawEnergyLines(isLightMode) {
        ctx.save();

        energyLines.forEach(line => {
            line.x += line.speed;

            if (line.x > width + line.length) {
                line.x = -line.length;
                line.y = Math.random() * height;
            }

            const gradient = ctx.createLinearGradient(line.x, line.y, line.x + line.length, line.y);

            if (isLightMode) {
                gradient.addColorStop(0, 'rgba(37, 99, 235, 0)');
                gradient.addColorStop(0.45, `rgba(37, 99, 235, ${line.opacity + 0.18})`);
                gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
            } else {
                gradient.addColorStop(0, 'rgba(34, 211, 238, 0)');
                gradient.addColorStop(0.45, `rgba(34, 211, 238, ${line.opacity + 0.15})`);
                gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
            }

            ctx.strokeStyle = gradient;
            ctx.lineWidth = isLightMode ? 1.8 : 1.4;
            ctx.shadowBlur = isLightMode ? 8 : 12;
            ctx.shadowColor = isLightMode ? 'rgba(37, 99, 235, 0.45)' : 'rgba(34, 211, 238, 0.65)';
            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(line.x + line.length, line.y);
            ctx.stroke();
        });

        ctx.restore();
    }

    function drawBackgroundGlow(isLightMode) {
        const backgroundGradient = ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            width
        );

        if (isLightMode) {
            backgroundGradient.addColorStop(0, 'rgba(37, 99, 235, 0.135)');
            backgroundGradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.065)');
            backgroundGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
            backgroundGradient.addColorStop(0, 'rgba(77, 168, 218, 0.085)');
            backgroundGradient.addColorStop(0.45, 'rgba(168, 85, 247, 0.05)');
            backgroundGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        ctx.fillStyle = backgroundGradient;
        ctx.fillRect(0, 0, width, height);
    }

    function drawTextElements(isLightMode) {
        elements.forEach((element, index) => {
            element.y += element.speed;

            if (element.y > height + 40) {
                element.y = -40;
                element.x = Math.random() * width;
                element.text = randomCode();
            }

            const pulse = Math.sin(Date.now() * 0.002 + element.delay) * 0.04;

            ctx.save();
            ctx.font = `${element.size}px Orbitron, monospace`;
            ctx.globalAlpha = isLightMode
                ? Math.min(0.28, element.opacity + pulse + 0.04)
                : Math.min(0.35, element.opacity + pulse);

            if (isLightMode) {
                ctx.fillStyle = index % 3 === 0
                    ? 'rgba(30, 64, 175, 0.95)'
                    : index % 3 === 1
                        ? 'rgba(88, 28, 135, 0.88)'
                        : 'rgba(8, 145, 178, 0.92)';
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'rgba(37, 99, 235, 0.24)';
            } else {
                ctx.fillStyle = index % 3 === 0
                    ? 'rgba(34, 211, 238, 0.9)'
                    : index % 3 === 1
                        ? 'rgba(168, 85, 247, 0.82)'
                        : 'rgba(77, 168, 218, 0.86)';
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(34, 211, 238, 0.45)';
            }

            ctx.fillText(element.text, element.x, element.y);

            if (element.glitch && Math.random() > 0.982) {
                ctx.globalAlpha = isLightMode ? 0.85 : 0.6;
                ctx.fillStyle = isLightMode
                    ? 'rgba(190, 24, 93, 0.75)'
                    : 'rgba(255, 112, 166, 0.8)';
                ctx.fillText(element.text, element.x + 4, element.y - 2);
            }

            ctx.restore();
        });
    }

    function animate() {
        const isLightMode = document.body.classList.contains('light-mode');

        ctx.clearRect(0, 0, width, height);

        drawBackgroundGlow(isLightMode);
        drawGrid(isLightMode);
        drawConnections(isLightMode);
        drawEnergyLines(isLightMode);
        drawTextElements(isLightMode);

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
    animate();
}

initHackerBackground();

// ===============================
// CENA 3D DO HERO
// ===============================
function initSpaceScene() {
    const canvas = document.getElementById('space-scene');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
    });

    const starsVertices = [];

    for (let i = 0; i < 3000; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    function createNebula(color, position, size) {
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.05,
            side: THREE.DoubleSide
        });

        const nebula = new THREE.Mesh(geometry, material);
        nebula.position.copy(position);
        scene.add(nebula);
        return nebula;
    }

    const nebula1 = createNebula(0x4DA8DA, new THREE.Vector3(-10, 5, -20), 8);
    const nebula2 = createNebula(0xA855F7, new THREE.Vector3(15, -7, -25), 10);

    function animate() {
        requestAnimationFrame(animate);

        stars.rotation.x += 0.0001;
        stars.rotation.y += 0.0001;

        nebula1.rotation.y += 0.0005;
        nebula2.rotation.y += 0.0003;

        renderer.render(scene, camera);
    }

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    animate();
}

initSpaceScene();

// ===============================
// SCROLL: NAVBAR, MENU ATIVO E VOLTAR AO TOPO
// ===============================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;

    updateNavbarStyle(scrollPosition);

    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        if (scrollPosition > 500) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.pointerEvents = 'auto';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.pointerEvents = 'none';
        }
    }

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const sectionId = section.getAttribute('id');

            navLinks.forEach(link => {
                link.classList.remove('active');

                if (link.getAttribute('data-section') === sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
});

const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===============================
// FORMULÁRIO DE CONTATO
// ===============================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showCustomAlert('Por favor, preencha nome, e-mail e mensagem.');
            return;
        }

        const phoneNumber = '5516996093275';

        const whatsappMessage = `
Olá, Marcelo! Vim pelo seu portfólio.

Nome: ${name}
E-mail: ${email}

Mensagem:
${message}
        `;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(whatsappMessage)}`;

        window.open(whatsappUrl, '_blank');

        showCustomAlert(`Obrigado, ${name}! Sua mensagem foi direcionada para o WhatsApp.`);

        contactForm.reset();
    });
}
// Preloader Hacker
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');

    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('preloader-exit');

            setTimeout(() => {
                preloader.style.display = 'none';
            }, 700);
        }

        initAnimations();
    }, 5200);
});