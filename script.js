const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter-content');
const revealItems = document.querySelectorAll('.reveal');
const musicToggle = document.getElementById('music-toggle');
const backgroundMusic = document.getElementById('bg-music');
const flipCards = document.querySelectorAll('.flip-card');
const parallaxItems = document.querySelectorAll('[data-parallax]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let isEnvelopeOpen = false;

envelope?.addEventListener('click', () => {
  if (isEnvelopeOpen) return;

  isEnvelopeOpen = true;
  envelope.classList.add('is-open');
  envelope.setAttribute('aria-expanded', 'true');
  letter?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('letter-open');

  setTimeout(() => {
    letter?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 520);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.18, rootMargin: '0px 0px -7% 0px' }
);

revealItems.forEach((item) => revealObserver.observe(item));

flipCards.forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      card.classList.toggle('is-flipped');
    }
  });
});

musicToggle?.addEventListener('click', async () => {
  if (!backgroundMusic) return;

  try {
    if (backgroundMusic.paused) {
      await backgroundMusic.play();
      musicToggle.classList.add('is-playing');
      musicToggle.innerHTML = '<span>♫</span> Music on';
      musicToggle.setAttribute('aria-pressed', 'true');
    } else {
      backgroundMusic.pause();
      musicToggle.classList.remove('is-playing');
      musicToggle.innerHTML = '<span>♫</span> Music';
      musicToggle.setAttribute('aria-pressed', 'false');
    }
  } catch (_error) {
    musicToggle.innerHTML = '<span>♫</span> Add your track';
  }
});

if (!reduceMotion) {
  let ticking = false;

  const updateParallax = () => {
    const scrollTop = window.scrollY;

    parallaxItems.forEach((item) => {
      const speed = Number(item.getAttribute('data-parallax')) || 0;
      const offset = Math.round(scrollTop * speed * -0.2);
      item.style.setProperty('--parallax-offset', `${offset}px`);
    });

    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateParallax();
}
