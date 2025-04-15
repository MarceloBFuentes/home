// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1000);
    
    // Inicializar animações após o preloader
    initAnimations();
});

// Inicializar animações
function initAnimations() {
    // Revelar elementos quando visíveis
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
    
    // Inicializar efeito de tilt nos cards
    initTiltEffect();
    
    // Inicializar o efeito de digitação
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        typingElement.style.width = '0';
    }
}

// Efeito de Tilt nos Cards
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

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            // Fechar menu mobile se estiver aberto
            if (menuOpen) toggleMobileMenu();

            // Rolagem suave para a seção
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start' // Garante que a seção fique visível no topo
            });
        }
    });
});

// Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const line3 = document.getElementById('line3');
let menuOpen = false;

function toggleMobileMenu() {
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

menuToggle.addEventListener('click', toggleMobileMenu);

// Fechar menu ao clicar em um link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (menuOpen) toggleMobileMenu();
    });
});

// Particles.js Configuration
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: ['#4DA8DA', '#A855F7', '#22D3EE'] },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { 
            enable: true, 
            distance: 150, 
            color: '#4DA8DA', 
            opacity: 0.3, 
            width: 1 
        },
        move: { 
            enable: true, 
            speed: 2, 
            direction: 'none', 
            random: false, 
            straight: false, 
            out_mode: 'out', 
            bounce: false 
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { 
            onhover: { enable: true, mode: 'repulse' }, 
            onclick: { enable: true, mode: 'push' },
            resize: true 
        },
        modes: { 
            repulse: { distance: 100, duration: 0.4 }, 
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});

// 3D Space Scene
function initSpaceScene() {
    const canvas = document.getElementById('space-scene');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Estrelas
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
    
    // Nebulosas coloridas
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
    
    // Animação
    function animate() {
        requestAnimationFrame(animate);
        
        stars.rotation.x += 0.0001;
        stars.rotation.y += 0.0001;
        
        nebula1.rotation.y += 0.0005;
        nebula2.rotation.y += 0.0003;
        
        renderer.render(scene, camera);
    }
    
    // Redimensionar
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    window.addEventListener('resize', handleResize);
    
    animate();
}

// Inicializar cena 3D
initSpaceScene();

// Navbar ativa com base na seção visível
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;
    
    // Mudar a opacidade do navbar ao rolar
    const navbar = document.getElementById('navbar');
    if (scrollPosition > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'linear-gradient(to right, rgba(0, 0, 0, 0.9), transparent)';
    }
    
    // Mostrar/ocultar botão de voltar ao topo
    const backToTopButton = document.getElementById('back-to-top');
    if (scrollPosition > 500) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.pointerEvents = 'auto';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.pointerEvents = 'none';
    }
    
    // Atualizar link ativo no menu
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

// Botão de voltar ao topo
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Formulário de contato
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulação de envio bem-sucedido
        const name = document.getElementById('name').value;

        // Exibir alerta personalizado
        showCustomAlert(`Obrigado, ${name}! Sua mensagem foi enviada com sucesso.`);
        
        contactForm.reset();
    });
}

// Função para exibir alerta personalizado
function showCustomAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    alertBox.textContent = message;

    document.body.appendChild(alertBox);

    // Remover o alerta após 3 segundos
    setTimeout(() => {
        alertBox.style.opacity = '0';
        setTimeout(() => alertBox.remove(), 500);
    }, 3000);
}