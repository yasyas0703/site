document.addEventListener('DOMContentLoaded', () => {
  // === LOADING SCREEN ===
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 800);
      }, 1500);
    });
  }

  // === MENU MOBILE TOGGLE ===
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Fechar menu ao clicar em um link
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // === SCROLL ANIMATIONS ===
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observar elementos com classes de animação
  const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale, .fade-in-rotate, .fade-in-bounce, .slide-in-from-bottom, .zoom-in, .flip-in');
  animatedElements.forEach(el => observer.observe(el));

  // === FAQ - Abre/Fecha Perguntas ===
  const faqContainer = document.querySelector('#faq');
  if (faqContainer) {
    faqContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-question');
      if (!btn) return;

      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      if (!isExpanded) {
        // abrir
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');

        // Definir a altura máxima dinamicamente
        answer.style.transition = 'none'; // Remove transição temporariamente
        answer.style.maxHeight = 'none'; // Libera a altura para o conteúdo total
        const scrollHeight = answer.scrollHeight; // Obter a altura total do conteúdo
        answer.style.transition = 'max-height 0.5s ease'; // Reaplica a transição
        answer.style.maxHeight = `${scrollHeight}px`; // Define a altura final
      } else {
        // fechar
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = `${answer.scrollHeight}px`; // Garante altura atual
        requestAnimationFrame(() => {
          answer.style.maxHeight = '0'; // Diminui para 0
        });
        item.classList.remove('active');
      }
    });
  }

  // === CONTADORES ANIMADOS ===
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-alvo'), 10);
    if (isNaN(target)) {
      console.warn('Atributo data-alvo inválido ou ausente em elemento', el);
      el.textContent = '0';
      return;
    }
    const duration = 1500;
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  (function initCounters() {
    const counters = document.querySelectorAll('.contador');
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4, rootMargin: '50px' });
    counters.forEach(counter => observer.observe(counter));
  })();

  // === ANIMAÇÕES DE SEÇÃO ===
  (function initSectionAnimations() {
    const sections = document.querySelectorAll('.animate-section');
    if (!('IntersectionObserver' in window)) {
      sections.forEach(section => section.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '100px' });
    sections.forEach(section => observer.observe(section));
  })();

  // === VALIDAÇÃO DE FORMULÁRIO EM TEMPO REAL ===
  const form = document.getElementById('contactForm');
  if (form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Validação em tempo real
      input.addEventListener('blur', validateField);
      input.addEventListener('input', clearError);
      
      function validateField() {
        const value = input.value.trim();
        const fieldName = input.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldName) {
          case 'nome':
            if (!value) {
              isValid = false;
              errorMessage = 'Por favor, insira seu nome completo.';
            } else if (value.length < 2) {
              isValid = false;
              errorMessage = 'Nome deve ter pelo menos 2 caracteres.';
            }
            break;
            
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
              isValid = false;
              errorMessage = 'Por favor, insira um e-mail válido.';
            } else if (!emailRegex.test(value)) {
              isValid = false;
              errorMessage = 'Formato de e-mail inválido.';
            }
            break;
            
          case 'telefone':
            if (value && !/^[0-9]{10,11}$/.test(value.replace(/\D/g, ''))) {
              isValid = false;
              errorMessage = 'Telefone deve ter 10 ou 11 dígitos.';
            }
            break;
            
          case 'mensagem':
            if (!value) {
              isValid = false;
              errorMessage = 'Por favor, insira uma mensagem.';
            } else if (value.length < 10) {
              isValid = false;
              errorMessage = 'Mensagem deve ter pelo menos 10 caracteres.';
            }
            break;
        }
        
        if (errorElement) {
          if (isValid) {
            input.classList.remove('error');
            errorElement.hidden = true;
            errorElement.textContent = '';
          } else {
            input.classList.add('error');
            errorElement.hidden = false;
            errorElement.textContent = errorMessage;
          }
        }
        
        return isValid;
      }
      
      function clearError() {
        input.classList.remove('error');
        const errorElement = document.getElementById(`${input.name}-error`);
        if (errorElement) {
          errorElement.hidden = true;
        }
      }
    });
    
    // Envio do formulário
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validar todos os campos
      let isFormValid = true;
      inputs.forEach(input => {
        if (input.hasAttribute('required') && !validateField.call(input)) {
          isFormValid = false;
        }
      });
      
      if (!isFormValid) {
        // Scroll para o primeiro erro
        const firstError = form.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }
      
      // Coletar dados do formulário
      const formData = new FormData(form);
      const nome = formData.get('nome');
      const email = formData.get('email');
      const telefone = formData.get('telefone');
      const servico = formData.get('servico');
      const mensagem = formData.get('mensagem');
      
      // Criar mensagem para WhatsApp
      let texto = `Olá! Gostaria de solicitar informações sobre os serviços da Triar Contabilidade.\n\n`;
      texto += `*Nome:* ${nome}\n`;
      texto += `*E-mail:* ${email}\n`;
      if (telefone) texto += `*Telefone:* ${telefone}\n`;
      if (servico) texto += `*Serviço de interesse:* ${servico}\n`;
      texto += `*Mensagem:* ${mensagem}`;
      
      const url = `https://wa.me/553536361407?text=${encodeURIComponent(texto)}`;
      
      try {
        window.open(url, '_blank');
        form.reset();
        
        // Mostrar mensagem de sucesso
        showNotification('Mensagem enviada com sucesso! Você será redirecionado ao WhatsApp.', 'success');
      } catch (error) {
        console.error('Erro ao abrir o WhatsApp:', error);
        showNotification('Ocorreu um erro ao abrir o WhatsApp. Tente novamente.', 'error');
      }
    });
  }
  
  // === SISTEMA DE NOTIFICAÇÕES ===
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Botão de fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
  }

  // === Rolagem suave + foco acessível ===
  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 0;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });

      const focusable = targetElement.querySelector('input, textarea, select, button, a[href], [tabindex]:not([tabindex="-1"])');
      if (focusable) {
        focusable.focus();
      } else {
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
      }
    });
  });

  // CARROSSEL DE DEPOIMENTOS
  class DepoimentosCarrossel {
    constructor() {
      this.carrossel = document.getElementById('depoimentosCarrossel');
      this.cards = document.querySelectorAll('.depoimento-card');
      this.indicadores = document.querySelectorAll('.indicador');
      this.btnPrev = document.querySelector('.carrossel-btn.prev');
      this.btnNext = document.querySelector('.carrossel-btn.next');
      this.currentSlide = 0;
      this.totalSlides = this.cards.length;
      this.autoPlayInterval = null;
      this.autoPlayDelay = 5000; // 5 segundos

      if (this.carrossel) {
        this.init();
      }
    }

    init() {
      // Event listeners para botões
      if (this.btnPrev) {
        this.btnPrev.addEventListener('click', () => this.prevSlide());
      }
      if (this.btnNext) {
        this.btnNext.addEventListener('click', () => this.nextSlide());
      }

      // Event listeners para indicadores
      this.indicadores.forEach((indicador, index) => {
        indicador.addEventListener('click', () => this.goToSlide(index));
      });

      // Auto-play
      this.startAutoPlay();

      // Pausar auto-play ao passar o mouse
      this.carrossel.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.carrossel.addEventListener('mouseleave', () => this.startAutoPlay());

      // Navegação por teclado
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prevSlide();
        if (e.key === 'ArrowRight') this.nextSlide();
      });

      // Touch/swipe support
      this.addTouchSupport();
    }

    goToSlide(index) {
      if (index < 0 || index >= this.totalSlides) return;

      // Remove active class de todos os cards e indicadores
      this.cards.forEach(card => card.classList.remove('active'));
      this.indicadores.forEach(indicador => indicador.classList.remove('active'));

      // Adiciona active class ao card e indicador atual
      this.cards[index].classList.add('active');
      this.indicadores[index].classList.add('active');

      this.currentSlide = index;
    }

    nextSlide() {
      const nextIndex = (this.currentSlide + 1) % this.totalSlides;
      this.goToSlide(nextIndex);
    }

    prevSlide() {
      const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
      this.goToSlide(prevIndex);
    }

    startAutoPlay() {
      this.stopAutoPlay();
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, this.autoPlayDelay);
    }

    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    }

    addTouchSupport() {
      let startX = 0;
      let endX = 0;

      this.carrossel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      });

      this.carrossel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        this.handleSwipe(startX, endX);
      });
    }

    handleSwipe(startX, endX) {
      const threshold = 50;
      const diff = startX - endX;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    }
  }

  // Inicializar carrossel
  new DepoimentosCarrossel();

  // EFEITOS DE PARALLAX BASEADOS NO SCROLL
  class ParallaxController {
    constructor() {
      this.parallaxElements = document.querySelectorAll('.parallax-section');
      this.isScrolling = false;
      this.init();
    }

    init() {
      if (this.parallaxElements.length === 0) return;

      // Throttle scroll events para performance
      window.addEventListener('scroll', this.throttle(() => {
        this.updateParallax();
      }, 16)); // ~60fps

      // Initial call
      this.updateParallax();
    }

    updateParallax() {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;

      this.parallaxElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        const elementHeight = rect.height;
        
        // Calcular se o elemento está visível
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        if (isVisible) {
          // Calcular offset baseado na posição do scroll
          const scrolled = scrollTop - elementTop;
          const rate = scrolled * -0.5; // Velocidade do parallax
          
          // Aplicar transform apenas se o elemento estiver visível
          element.style.transform = `translateY(${rate}px)`;
          
          // Adicionar efeito de opacidade baseado na proximidade
          const distanceFromCenter = Math.abs(rect.top + rect.height/2 - windowHeight/2);
          const maxDistance = windowHeight;
          const opacity = Math.max(0.3, 1 - (distanceFromCenter / maxDistance));
          
          element.style.opacity = opacity;
        }
      });
    }

    throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
  }

  // Inicializar parallax controller
  new ParallaxController();

  // EFEITOS DE PARALLAX PARA ELEMENTOS ESPECÍFICOS
  function initElementParallax() {
    const elements = document.querySelectorAll('.sobre-imagem img, .contato-imagem img');
    
    elements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  // Inicializar efeitos de parallax para elementos
  initElementParallax();
});