const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter-content');
const revealItems = document.querySelectorAll('.reveal');
const musicToggle = document.getElementById('music-toggle');
const backgroundMusic = document.getElementById('bg-music');

let isEnvelopeOpen = false;

envelope?.addEventListener('click', () => {
  if (!isEnvelopeOpen) {
    isEnvelopeOpen = true;
    envelope.classList.add('is-open');
    envelope.setAttribute('aria-expanded', 'true');
    letter?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('letter-open');

    setTimeout(() => {
      letter?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 460);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px'
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

musicToggle?.addEventListener('click', async () => {
  const isPaused = backgroundMusic?.paused;

  if (!backgroundMusic) return;

  try {
    if (isPaused) {
      await backgroundMusic.play();
      musicToggle.classList.add('is-playing');
      musicToggle.textContent = '♫ Music on';
      musicToggle.setAttribute('aria-pressed', 'true');
    } else {
      backgroundMusic.pause();
      musicToggle.classList.remove('is-playing');
      musicToggle.textContent = '♫ Music';
      musicToggle.setAttribute('aria-pressed', 'false');
    }
  } catch (error) {
    musicToggle.textContent = '♫ Add your track';
  }
});
