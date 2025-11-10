document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {

  }

  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

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

  const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale, .fade-in-rotate, .fade-in-bounce, .slide-in-from-bottom, .zoom-in, .flip-in');
  animatedElements.forEach(el => observer.observe(el));

  // ===== ANIMAÇÕES AO SCROLL (OPCIONAL) =====
  // Observador específico para cards de serviço e seção CTA.
  // Usa as mesmas opções definidas acima (observerOptions) para consistência.
  if ('IntersectionObserver' in window) {
    const serviceObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      // estado inicial (caso CSS não defina)
      if (!card.style.opacity) card.style.opacity = '0';
      if (!card.style.transform) card.style.transform = 'translateY(20px)';
      serviceObserver.observe(card);
    });

    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
      if (!ctaSection.style.opacity) ctaSection.style.opacity = '0';
      if (!ctaSection.style.transform) ctaSection.style.transform = 'translateY(20px)';
      serviceObserver.observe(ctaSection);
    }

    // ===== ANIMAÇÃO DE HOVER NOS CARDS =====
    serviceCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });

    // ===== CONTADOR DE ANIMAÇÃO (OPCIONAL) =====
    // Adiciona um delay progressivo para cada card
    serviceCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  const faqContainer = document.querySelector('#faq');
  if (faqContainer) {
    faqContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-question');
      if (!btn) return;

      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      if (!isExpanded) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');

        answer.style.transition = 'none'; 
        answer.style.maxHeight = 'none'; 
        const scrollHeight = answer.scrollHeight; 
        answer.style.transition = 'max-height 0.5s ease'; 
        answer.style.maxHeight = `${scrollHeight}px`; 
      } else {
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = `${answer.scrollHeight}px`; 
        requestAnimationFrame(() => {
          answer.style.maxHeight = '0'; 
        });
        item.classList.remove('active');
      }
    });
  }

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

  const form = document.getElementById('contactForm');
  if (form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
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
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
            let isFormValid = true;
      inputs.forEach(input => {
        if (input.hasAttribute('required') && !validateField.call(input)) {
          isFormValid = false;
        }
      });
      
      if (!isFormValid) {
        const firstError = form.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }
      
      const formData = new FormData(form);
      const nome = formData.get('nome');
      const email = formData.get('email');
      const telefone = formData.get('telefone');
      const servico = formData.get('servico');
      const mensagem = formData.get('mensagem');
      
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
        
        showNotification('Mensagem enviada com sucesso! Você será redirecionado ao WhatsApp.', 'success');
      } catch (error) {
        console.error('Erro ao abrir o WhatsApp:', error);
        showNotification('Ocorreu um erro ao abrir o WhatsApp. Tente novamente.', 'error');
      }
    });
  }
  
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
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
  }

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
      this.autoPlayDelay = 5000; 

      if (this.carrossel) {
        this.init();
      }
    }

    init() {
      if (this.btnPrev) {
        this.btnPrev.addEventListener('click', () => this.prevSlide());
      }
      if (this.btnNext) {
        this.btnNext.addEventListener('click', () => this.nextSlide());
      }

      this.indicadores.forEach((indicador, index) => {
        indicador.addEventListener('click', () => this.goToSlide(index));
      });

      this.startAutoPlay();

      this.carrossel.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.carrossel.addEventListener('mouseleave', () => this.startAutoPlay());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prevSlide();
        if (e.key === 'ArrowRight') this.nextSlide();
      });

      this.addTouchSupport();
    }

    goToSlide(index) {
      if (index < 0 || index >= this.totalSlides) return;

      this.cards.forEach(card => card.classList.remove('active'));
      this.indicadores.forEach(indicador => indicador.classList.remove('active'));

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

  new DepoimentosCarrossel();




  initElementParallax();
  // ===== Modal de Serviços (abre com os botões "Saiba mais") =====
  (function initServiceModal() {
    function buildModal() {
      const modal = document.createElement('div');
      modal.className = 'modal-servico';
      modal.style.display = 'none';
      modal.innerHTML = `
        <div class="modal-wrapper" role="dialog" aria-modal="true" aria-label="Detalhes do serviço">
          <button class="modal-close" aria-label="Fechar">&times;</button>
          <div class="modal-content">
            <h3 class="modal-title"></h3>
            <div class="modal-grid">
              <div class="modal-body"></div>
              <aside class="modal-aside"><h4>Benefícios</h4><ul class="modal-list"></ul></aside>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      return modal;
    }

    let modal = null;

    function openModal(data) {
      if (!modal) modal = buildModal();
      modal.querySelector('.modal-title').textContent = data.title || '';
      modal.querySelector('.modal-body').innerHTML = `<p>${data.description || ''}</p>`;
      const list = modal.querySelector('.modal-list');
      list.innerHTML = '';
      (data.benefits || []).forEach(b => {
        const li = document.createElement('li');
        li.textContent = b;
        list.appendChild(li);
      });
      modal.style.display = 'flex';

      function onOverlayClick(e) { if (e.target === modal) closeModal(); }
      function onKeyDown(e) { if (e.key === 'Escape') closeModal(); }

      modal.addEventListener('click', onOverlayClick);
      modal.querySelector('.modal-close').addEventListener('click', closeModal);
      document.addEventListener('keydown', onKeyDown);

      // store handlers for removal
      modal._onOverlayClick = onOverlayClick;
      modal._onKeyDown = onKeyDown;
    }

    function closeModal() {
      if (!modal) return;
      modal.style.display = 'none';
      if (modal._onOverlayClick) modal.removeEventListener('click', modal._onOverlayClick);
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) closeBtn.removeEventListener('click', closeModal);
      if (modal._onKeyDown) document.removeEventListener('keydown', modal._onKeyDown);
    }

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-service-modern');
      if (!btn) return;
      e.preventDefault();
      const card = btn.closest('.service-card-modern');
      if (!card) return;
      const title = card.querySelector('.service-title-modern')?.textContent || '';
      const description = card.querySelector('.service-description-modern')?.textContent || '';
      const benefits = Array.from(card.querySelectorAll('.benefits-list-modern li')).map(li => li.textContent.trim());
      openModal({ title, description, benefits });
    });
  })();

});