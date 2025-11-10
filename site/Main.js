document.addEventListener('DOMContentLoaded', () => {
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
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        // fechar
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = answer.scrollHeight + 'px'; // garante altura atual
        requestAnimationFrame(() => {
          answer.style.maxHeight = '0';
        });
        item.classList.remove('active');
      }
    });
  }



  // === CONTADORES ===
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

  // === FORMULÁRIO DE CONTATO -> WhatsApp ===
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = {
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefone: document.getElementById('telefone').value.trim(),
        servico: document.getElementById('servico').value.trim(),
        mensagem: document.getElementById('mensagem').value.trim(),
      };

      if (!fields.nome || !fields.email || !fields.mensagem) {
        alert('Por favor, preencha os campos obrigatórios: Nome, E-mail e Mensagem.');
        return;
      }

      const texto = encodeURIComponent(
`*Novo contato pelo site*
👤 Nome: ${fields.nome}
📧 Email: ${fields.email}
📞 Telefone: ${fields.telefone || '-'}
📌 Serviço: ${fields.servico || '-'}
💬 Mensagem: ${fields.mensagem}`
      );

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;
      try {
        window.open(url, '_blank');
        form.reset();
        alert('Mensagem enviada com sucesso! Você será redirecionado ao WhatsApp.');
      } catch (error) {
        console.error('Erro ao abrir o WhatsApp:', error);
        alert('Ocorreu um erro ao abrir o WhatsApp. Tente novamente.');
      }
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
});
