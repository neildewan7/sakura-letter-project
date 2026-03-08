const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter-content');
const hint = document.getElementById('envelope-hint');
const memoryGrid = document.getElementById('memory-grid');
const revealSections = document.querySelectorAll('.reveal');
const staggerGroups = document.querySelectorAll('.stagger-group');
const parallaxItems = document.querySelectorAll('[data-parallax]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let envelopeStage = 0;

const updateLetterHeight = () => {
  if (!letter) return;
  const contentHeight = Math.ceil(letter.scrollHeight + 36);
  letter.style.setProperty('--letter-open-height', `${contentHeight}px`);
};

const memoryCards = [
  {
    image: 'LDRselfie.png',
    title: 'selfie with my eepookie',
    frontCaption: 'eepy ookie',
    backText: "Although we don't get to take many pics together with long distance, this pic reminds me that you're always in my cameraroll with me :) "
  },
  {
    image: 'sakuradrawing.png',
    title: 'SD !',
    frontCaption: 'First day in SD together',
    backText: 'This reminds me of our first night in SD together and how happy I was when we got to hug and puzzle adn eat yummy Thai food.'
  },
  {
    image: 'sakuraLA.JPEG',
    title: 'HOME!',
    frontCaption: 'Tookies at home',
    backText: 'Everytime I see this pic I get sooooo happy thinking about how much fun I had this winter. Waking up on a differnt bed every morning is one of my favorite memories.'
  }
];

const createFlipCard = ({ image, title, frontCaption, backText }, index) => {
  const shell = document.createElement('article');
  shell.className = 'memory-card-shell stagger-item';

  const card = document.createElement('button');
  card.className = 'flip-card';
  card.type = 'button';
  card.setAttribute('aria-pressed', 'false');
  card.setAttribute('aria-label', `${title}. Press Enter, Space, or click to flip card.`);

  card.innerHTML = `
    <div class="flip-card__inner">
      <div class="flip-card__face flip-card__face--front">
        <div class="flip-card__image-wrap">
          <img src="${image}" alt="${title}" />
        </div>
        <div class="flip-card__content">
          <p class="flip-card__front-caption">${frontCaption}</p>
          <h4>${title}</h4>
        </div>
      </div>
      <div class="flip-card__face flip-card__face--back" aria-hidden="true">
        <div class="flip-card__back-panel">
          <p class="flip-card__back-kicker">Memory Note ${String(index + 1).padStart(2, '0')}</p>
          <p class="flip-card__back-title">${title}</p>
          <p class="flip-card__back-text">${backText}</p>
        </div>
      </div>
    </div>
  `;

  const toggleFlip = () => {
    const isFlipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
    card.setAttribute(
      'aria-label',
      isFlipped
        ? `${title}. Back note visible. Press Enter, Space, or click to show photo.`
        : `${title}. Photo visible. Press Enter, Space, or click to show note.`
    );
  };

  card.addEventListener('click', toggleFlip);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFlip();
    }
  });

  shell.append(card);
  return shell;
};

if (memoryGrid) {
  memoryCards.forEach((cardData, index) => {
    memoryGrid.append(createFlipCard(cardData, index));
  });
}

envelope?.addEventListener('click', () => {
  if (envelopeStage === 0) {
    envelopeStage = 1;
    envelope.classList.add('is-turned');
    if (hint) hint.textContent = 'Click seal to open';
    return;
  }

  if (envelopeStage === 1) {
    envelopeStage = 2;
    envelope.classList.add('is-open');
    envelope.setAttribute('aria-expanded', 'true');
    if (hint) hint.textContent = 'Letter opened';

    window.setTimeout(() => {
      updateLetterHeight();
      letter?.classList.add('is-visible');
      letter?.setAttribute('aria-hidden', 'false');
      window.setTimeout(updateLetterHeight, 250);
    }, 540);

    window.setTimeout(() => {
      letter?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 860);
  }
});

window.addEventListener('resize', () => {
  if (letter?.classList.contains('is-visible')) {
    updateLetterHeight();
  }
});

window.addEventListener('orientationchange', () => {
  if (letter?.classList.contains('is-visible')) {
    window.setTimeout(updateLetterHeight, 180);
  }
});

if (!reduceMotion) {
  document.documentElement.classList.add('motion-enabled');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
  );

  revealSections.forEach((section) => sectionObserver.observe(section));

  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const children = entry.target.querySelectorAll('.stagger-item');
        children.forEach((child, index) => {
          child.style.setProperty('--stagger-delay', `${index * 90}ms`);
          child.classList.add('is-visible');
        });
      });
    },
    { threshold: 0.25 }
  );

  staggerGroups.forEach((group) => staggerObserver.observe(group));

  const revealVisibleGroups = () => {
    staggerGroups.forEach((group) => {
      const rect = group.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) {
        const children = group.querySelectorAll('.stagger-item');
        children.forEach((child, index) => {
          child.style.setProperty('--stagger-delay', `${index * 90}ms`);
          child.classList.add('is-visible');
        });
      }
    });
  };

  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY;

    parallaxItems.forEach((item) => {
      const depth = Number(item.getAttribute('data-parallax')) || 0;
      const offset = Math.round(scrollY * depth * -0.32);
      item.style.transform = `translate3d(0, ${offset}px, 0)`;
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

  revealVisibleGroups();
  updateParallax();
} else {
  revealSections.forEach((section) => section.classList.add('is-visible'));
  document.querySelectorAll('.stagger-item').forEach((item) => item.classList.add('is-visible'));
}
