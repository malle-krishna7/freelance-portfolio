// API Base URL
const API_BASE = '/api';

// Initialize the portfolio
document.addEventListener('DOMContentLoaded', () => {
  loadPortfolioData();
  setupMobileMenu();
  setupContactForm();
  setupProjectFilters();
  setupSmoothScrolling();
});

// Load all portfolio data from API
async function loadPortfolioData() {
  try {
    const [profile, skills, services, projects, testimonials] = await Promise.all([
      fetch(`${API_BASE}/profile`).then(r => r.json()),
      fetch(`${API_BASE}/skills`).then(r => r.json()),
      fetch(`${API_BASE}/services`).then(r => r.json()),
      fetch(`${API_BASE}/projects`).then(r => r.json()),
      fetch(`${API_BASE}/testimonials`).then(r => r.json())
    ]);

    loadProfile(profile);
    loadSkills(skills);
    loadServices(services);
    loadProjects(projects);
    loadTestimonials(testimonials);
  } catch (error) {
    console.error('Error loading portfolio data:', error);
  }
}

// Load profile information
function loadProfile(profile) {
  document.getElementById('profileName').textContent = profile.name;
  document.getElementById('profileTitle').textContent = profile.title;
  document.getElementById('profileBio').textContent = profile.bio;
  document.getElementById('aboutDescription').textContent = profile.bio;

  // Contact info
  document.getElementById('contactEmail').textContent = profile.email;
  document.getElementById('contactEmail').href = `mailto:${profile.email}`;
  document.getElementById('contactPhone').textContent = profile.phone;
  document.getElementById('contactLocation').textContent = profile.location;

  // Social links
  if (profile.social) {
    document.getElementById('githubLink').href = profile.social.github;
    document.getElementById('linkedinLink').href = profile.social.linkedin;
    document.getElementById('twitterLink').href = profile.social.twitter;
  }
}

// Load skills
function loadSkills(skillsData) {
  const container = document.getElementById('skillsContainer');
  container.innerHTML = '';

  skillsData.forEach(skillGroup => {
    const skillCard = document.createElement('div');
    skillCard.className = 'skill-category';
    skillCard.innerHTML = `
      <h3>${skillGroup.category}</h3>
      <ul>
        ${skillGroup.items.map(skill => `<li>${skill}</li>`).join('')}
      </ul>
    `;
    container.appendChild(skillCard);
  });
}

// Load services
function loadServices(servicesData) {
  const container = document.getElementById('servicesContainer');
  container.innerHTML = '';

  servicesData.forEach(service => {
    const serviceCard = document.createElement('div');
    serviceCard.className = 'service-card';
    serviceCard.innerHTML = `
      <h3>${service.title}</h3>
      <p class="service-price">${service.price}</p>
      <p>${service.description}</p>
      <ul class="service-features">
        ${service.features.map(feature => `<li>${feature}</li>`).join('')}
      </ul>
    `;
    container.appendChild(serviceCard);
  });
}

// Load projects
function loadProjects(projectsData) {
  const container = document.getElementById('projectsContainer');
  displayProjects(projectsData, container);
}

// Display projects with filter support
function displayProjects(projectsData, container) {
  container.innerHTML = '';

  projectsData.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.setAttribute('data-category', project.category);
    projectCard.innerHTML = `
      <div class="project-image">
        <span>${project.title}</span>
      </div>
      <div class="project-content">
        <span class="project-category">${project.category}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tech">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${project.link}" target="_blank">View</a>
          <a href="${project.github}" target="_blank">Code</a>
        </div>
      </div>
    `;
    container.appendChild(projectCard);
  });

  // Add animation
  const cards = container.querySelectorAll('.project-card');
  cards.forEach((card, index) => {
    card.style.animation = `slideInUp 0.5s ease ${index * 0.1}s both`;
  });
}

// Load testimonials
function loadTestimonials(testimonialsData) {
  const container = document.getElementById('testimonialsContainer');
  container.innerHTML = '';

  testimonialsData.forEach(testimonial => {
    const initials = testimonial.client.split(' ').map(n => n[0]).join('').toUpperCase();
    const testimonialCard = document.createElement('div');
    testimonialCard.className = 'testimonial-card';
    testimonialCard.innerHTML = `
      <div class="testimonial-header">
        <div class="testimonial-avatar">${initials}</div>
        <div class="testimonial-info">
          <h4>${testimonial.client}</h4>
          <p class="testimonial-company">${testimonial.company}</p>
        </div>
      </div>
      <div class="testimonial-rating">${'⭐'.repeat(testimonial.rating)}</div>
      <p class="testimonial-text">"${testimonial.message}"</p>
    `;
    container.appendChild(testimonialCard);
  });
}

// Setup project filters
function setupProjectFilters() {
  let allProjects = [];

  // Store projects data when loaded
  fetch(`${API_BASE}/projects`)
    .then(r => r.json())
    .then(projects => {
      allProjects = projects;
    });

  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter projects
      const filter = button.getAttribute('data-filter');
      const filtered = filter === 'all'
        ? allProjects
        : allProjects.filter(p => p.category === filter);

      const container = document.getElementById('projectsContainer');
      displayProjects(filtered, container);
    });
  });
}

// Setup contact form
function setupContactForm() {
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        formMessage.textContent = result.message;
        formMessage.className = 'form-message success';
        form.reset();

        setTimeout(() => {
          formMessage.className = 'form-message';
        }, 5000);
      } else {
        formMessage.textContent = result.error || 'Something went wrong!';
        formMessage.className = 'form-message error';
      }
    } catch (error) {
      console.error('Error:', error);
      formMessage.textContent = 'Error sending message. Please try again.';
      formMessage.className = 'form-message error';
    }
  });
}

// Setup mobile menu
function setupMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}

// Setup smooth scrolling
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link, .btn');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// Highlight active nav link on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop - 200) {
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
