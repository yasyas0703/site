/* ===================================================================
   BLOG.JS - FUNCIONALIDADES DO BLOG TRIAR
   ================================================================ */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== ELEMENTOS DO DOM =====
  const searchInput = document.getElementById('blogSearch');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');
  const noResults = document.getElementById('noResults');
  const blogGrid = document.getElementById('blogGrid');

  // ===== VARIÁVEIS DE CONTROLE =====
  let currentCategory = 'todos';
  let currentSearchTerm = '';

  // ===== FUNÇÃO DE FILTRO =====
  function filterPosts() {
    let visibleCount = 0;

    blogCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
      const description = card.querySelector('.blog-card-description').textContent.toLowerCase();
      
      // Verifica se corresponde à categoria
      const matchesCategory = currentCategory === 'todos' || category === currentCategory;
      
      // Verifica se corresponde ao termo de busca
      const matchesSearch = currentSearchTerm === '' || 
                           title.includes(currentSearchTerm) || 
                           description.includes(currentSearchTerm);

      // Mostra ou esconde o card
      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Mostra mensagem se não houver resultados
    if (visibleCount === 0) {
      noResults.style.display = 'block';
      blogGrid.style.marginBottom = '0';
    } else {
      noResults.style.display = 'none';
      blogGrid.style.marginBottom = '80px';
    }
  }

  // ===== BUSCA POR TEXTO =====
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      currentSearchTerm = e.target.value.toLowerCase().trim();
      filterPosts();
    });
  }

  // ===== FILTROS POR CATEGORIA =====
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove classe 'active' de todos os botões
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Adiciona classe 'active' ao botão clicado
      this.classList.add('active');
      
      // Atualiza a categoria atual
      currentCategory = this.getAttribute('data-category');
      
      // Filtra os posts
      filterPosts();
      
      // Scroll suave para o grid
      blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ===== ANIMAÇÃO DE ENTRADA DOS CARDS =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Aplica a animação inicial
  blogCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // ===== COMPARTILHAMENTO SOCIAL =====
  // Função para compartilhar em redes sociais (se estiver na página do post)
  const shareButtons = document.querySelectorAll('.share-btn');
  
  shareButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const pageUrl = encodeURIComponent(window.location.href);
      const pageTitle = encodeURIComponent(document.title);
      
      if (this.classList.contains('facebook')) {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`, '_blank', 'width=600,height=400');
      } 
      else if (this.classList.contains('twitter')) {
        window.open(`https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`, '_blank', 'width=600,height=400');
      } 
      else if (this.classList.contains('linkedin')) {
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`, '_blank', 'width=600,height=400');
      } 
      else if (this.classList.contains('whatsapp')) {
        window.open(`https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`, '_blank');
      }
    });
  });

  // ===== ANIMAÇÃO DO HERO (SOMENTE NA PÁGINA DO BLOG) =====
  const blogHero = document.querySelector('.blog-hero');
  const isOnBlogPage = document.querySelector('.blog-main'); // Verifica se está na página do blog
  
  if (blogHero && isOnBlogPage) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const heroContent = document.querySelector('.blog-hero-content');
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / 500);
      }
    });
  }

  // ===== SMOOTH SCROLL PARA ÂNCORAS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== HIGHLIGHT DO MENU ATIVO =====
  const currentPage = window.location.pathname.split('/').pop();
  const menuLinks = document.querySelectorAll('.menu a');
  
  menuLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.style.color = '#0099cc';
      link.style.fontWeight = '700';
    }
  });

  // ===== LOG DE INICIALIZAÇÃO =====
  console.log('Blog Triar carregado com sucesso!');
  console.log(`Total de artigos: ${blogCards.length}`);
  console.log(`Total de categorias: ${filterButtons.length - 1}`); // -1 para excluir "Todos"
  
});

// ===== FUNÇÃO PARA COPIAR LINK DO ARTIGO =====
function copyArticleLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    // Você pode adicionar uma notificação toast aqui
    alert('Link copiado para a área de transferência!');
  }).catch(err => {
    console.error('Erro ao copiar link:', err);
  });
}

// ===== LOADING DE IMAGENS =====
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('loading' in HTMLImageElement.prototype) {
    // O navegador suporta lazy loading nativo
    images.forEach(img => {
      img.src = img.src;
    });
  } else {
    // Fallback para navegadores que não suportam lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
});