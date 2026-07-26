/* ==========================================
   LOGIK.JS — Birthday Website Logic
   ==========================================
   
   ✏️  EDIT BAGIAN INI UNTUK KUSTOMISASI:
   ========================================== */

const CONFIG = {
  nama: "Dara",                    // Ganti dengan nama pacar kamu
  tanggal: "27 Juli 2026",             // Ganti tanggal ultahnya
  nomorWA: "6285733136250",             // Ganti nomor WA kamu (format 628xxx)

  // Kuis Hubungan Kita (bisa diedit sesuka hati)
  kuis: [
    {
      tanya: "Siapa yang paling sering ngambek? 🥺",
      opsi: ["Aku (tapi boong) 🥺", "Kamu 😜", "Dua-duanya 🤪"],
      jawaban: 1 // Kamu
    },
    {
      tanya: "Apa minuman favorit aku? 🍵",
      opsi: ["Matcha", "Kopi", "Es teh"],
      jawaban: 1 // Semua yang gratisan
    },
    {
      tanya: "Tanggal berapa aku mulai intens deketinn kamu? 📅",
      opsi: ["Ga tau lupa 😅", "1 Oktober", "3 November"],
      jawaban: 2 // Setiap hari kan sayang terus
    },
    {
      tanya: "Tempat pertama kita jalan? 🚶‍♀️",
      opsi: ["Emmm apaa yaa", "Malangg", "Batuu"],
      jawaban: 2 // Di hatimu aja deh
    },
    {
      tanya: "Panggilan sayang kamu buat aku? 🤭",
      opsi: ["Bluu", "Milopp", "Semuaaa benarrr"],
      jawaban: 2 // Sayangku
    }
  ],

  // Isi surat — tulis sesuka hati kamu
  surat: `My dearest Dara... 💕

Sayang, selamat ulang tahun ya! 🤍 Di hari spesial ini, aku cuma mau bilang betapa bersyukurnya aku bisa kenal dan punya kamu di hidupku. Makasih ya udah selalu ada, selalu sabar ngadepin kelemotan aku, dan makasih udah bikin hari-hariku jauh lebih berwarna. Kamu tuh orang yang paling berarti buat aku sekarang. Semoga di umur yang baru ini, semua mimpi kamu pelan-pelan tercapai, sehat selalu, dan makin bahagia. Kurang-kurangin OVT-nya yaa, hal yang kamu takutkan ga akan terjad tenang aja, kan juga udah aku sepenuhnya milik kamu. Aku sayang banget sama kamu 💕`,

  // Pesan akhir di halaman terakhir
  pesanAkhir: `Semoga di umur yang bertambah ini, kamu makin bahagia, sehat selalu, dan semua doamu terkabul. Makasih udah jadi bagian terindah di hidupku. Btw masih ada kejutan lagi loh tapi nanti pas kita ketemu yaaa. I love you! 💕`
};

/* ==========================================
   JANGAN EDIT DI BAWAH INI (kecuali paham)
   ========================================== */

// --- DOM Elements ---
const pages = {
  cover: document.getElementById('cover'),
  greeting: document.getElementById('greeting'),
  letter: document.getElementById('letter'),
  memories: document.getElementById('memories'),
  quiz: document.getElementById('quiz'),
  relationQuiz: document.getElementById('relation-quiz'),
  reasons: document.getElementById('reasons'),
  blowCake: document.getElementById('blow-cake'),
  bouquet: document.getElementById('bouquet'),
  final: document.getElementById('final')
};

const audio = document.getElementById('bg-music');
const boomSound = new Audio('assets/audio/boom.mp3');

// --- Update dynamic content ---
document.querySelector('.greeting-date').textContent = CONFIG.tanggal;
document.querySelector('.final-msg').textContent = CONFIG.pesanAkhir;

// --- Page Navigation ---
function goTo(from, to) {
  from.classList.add('leaving');
  to.classList.add('active');

  // re-trigger animation
  const inner = to.querySelector('.page-inner');
  if (inner) {
    inner.style.animation = 'none';
    inner.offsetHeight; // force reflow
    inner.style.animation = '';
  }
  const coverInner = to.querySelector('.cover-content');
  if (coverInner) {
    coverInner.style.animation = 'none';
    coverInner.offsetHeight; // force reflow
    coverInner.style.animation = '';
  }

  setTimeout(() => {
    from.classList.remove('active');
    from.classList.remove('leaving');
  }, 550);
}

// --- Floating Hearts Particle System ---
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let hearts = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize, { passive: true });
resize();

class Heart {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height;
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20;
    this.size = Math.random() * 10 + 5;
    this.speed = Math.random() * 0.8 + 0.3;
    this.opacity = Math.random() * 0.25 + 0.05;
    this.drift = Math.random() * 0.4 - 0.2;
    this.wave = Math.random() * Math.PI * 2;
  }
  update() {
    this.y -= this.speed;
    this.wave += 0.02;
    this.x += Math.sin(this.wave) * 0.3 + this.drift;
    if (this.y < -20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#f0a0b0';
    ctx.beginPath();
    const s = this.size;
    const x = this.x, y = this.y;
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
    ctx.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.8, x, y + s);
    ctx.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.3);
    ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
    ctx.fill();
    ctx.restore();
  }
}

const isMobile = window.innerWidth <= 600;
const heartCount = isMobile ? 8 : 18;
for (let i = 0; i < heartCount; i++) hearts.push(new Heart());

let lastFrame = 0;
const frameInterval = isMobile ? 40 : 25; // ~25fps mobile, ~40fps desktop

// --- Unified Canvas Animation Loop ---
let isPageVisible = true;
document.addEventListener('visibilitychange', () => {
  isPageVisible = !document.hidden;
});

function animateCanvas(timestamp) {
  requestAnimationFrame(animateCanvas);

  // Pause rendering when tab is hidden (saves battery)
  if (!isPageVisible) return;

  if (timestamp - lastFrame < frameInterval) return;
  lastFrame = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw background hearts
  hearts.forEach(h => {
    h.update();
    h.draw();
  });

  // 2. Draw confetti (if any)
  if (confetti.length > 0) {
    confetti = confetti.filter(c => {
      c.vy += c.gravity;
      c.x += c.vx;
      c.y += c.vy;
      c.vx *= 0.98;
      c.opacity -= 0.015;

      ctx.save();
      ctx.globalAlpha = Math.max(0, c.opacity);
      ctx.fillStyle = c.color;
      ctx.beginPath();
      const s = c.size;
      ctx.moveTo(c.x, c.y + s * 0.3);
      ctx.bezierCurveTo(c.x, c.y, c.x - s * 0.5, c.y, c.x - s * 0.5, c.y + s * 0.3);
      ctx.bezierCurveTo(c.x - s * 0.5, c.y + s * 0.6, c.x, c.y + s * 0.8, c.x, c.y + s);
      ctx.bezierCurveTo(c.x, c.y + s * 0.8, c.x + s * 0.5, c.y + s * 0.6, c.x + s * 0.5, c.y + s * 0.3);
      ctx.bezierCurveTo(c.x + s * 0.5, c.y, c.x, c.y, c.x, c.y + s * 0.3);
      ctx.fill();
      ctx.restore();

      return c.opacity > 0;
    });
  }
}
animateCanvas(0);

// --- Confetti Burst ---
let confetti = [];
function burstConfetti(cx, cy, count) {
  const colors = ['#f0a0b0', '#ffd6e0', '#fff', '#ffb3c6', '#c9184a'];
  const actualCount = isMobile ? Math.floor(count * 0.6) : count;

  for (let i = 0; i < actualCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    confetti.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      gravity: 0.12
    });
  }
}

// --- STAGE 1: Cover → Greeting ---
const btnOpen = document.getElementById('btn-open');
const giftBox = document.getElementById('gift-box');

function openGift() {
  audio.play().catch(() => { });
  giftBox.classList.add('open');
  btnOpen.style.transition = 'opacity 0.6s ease';
  btnOpen.style.opacity = '0';
  btnOpen.style.pointerEvents = 'none';

  // Play boom sound exactly when the image pops out (matches 0.3s CSS transition delay)
  setTimeout(() => {
    boomSound.play().catch(() => { });
  }, 300);

  // Fade out the photo separately
  setTimeout(() => {
    const boxMessage = document.querySelector('.box-message');
    if (boxMessage) boxMessage.classList.add('fade-out');
  }, 1500);

  // Reveal floating music player
  document.getElementById('music-player').classList.remove('hidden');

  // Fountain of heart confetti bursting from the box!
  const boxX = window.innerWidth / 2;
  const boxY = window.innerHeight / 2 - 40;

  // First burst instantly as the lid opens
  burstConfetti(boxX, boxY, 25);

  // Second burst as the lid moves up
  setTimeout(() => {
    burstConfetti(boxX, boxY - 40, 20);
  }, 400);

  // Gift box scales up and fades out after text floats up
  setTimeout(() => {
    giftBox.classList.add('transitioning');
  }, 2000);

  // Transition to greeting page
  setTimeout(() => {
    goTo(pages.cover, pages.greeting);
    typeText(document.getElementById('greeting-name'), CONFIG.nama, 120, () => {
      document.getElementById('btn-next1').classList.add('show');
    });
  }, 2600);
}

btnOpen.addEventListener('click', openGift);
giftBox.addEventListener('click', openGift);

let typingTimer = null;

function typeText(el, text, speed, callback) {
  let i = 0;
  el.textContent = '';
  if (typingTimer) clearTimeout(typingTimer);
  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      typingTimer = setTimeout(type, speed);
    } else {
      typingTimer = null;
      if (callback) callback();
    }
  }
  type();
}

const letterBox = document.querySelector('.letter-box');
if (letterBox) {
  letterBox.addEventListener('click', () => {
    const letterEl = document.getElementById('typed-letter');
    const cursorEl = document.getElementById('cursor');
    const nextBtn = document.getElementById('btn-next2');
    if (letterEl && letterEl.textContent.length < CONFIG.surat.length) {
      if (typingTimer) clearTimeout(typingTimer);
      typingTimer = null;
      letterEl.textContent = CONFIG.surat;
      if (cursorEl) cursorEl.style.display = 'none';
      if (nextBtn) nextBtn.classList.add('show');
    }
  });
}

// --- STAGE 2: Greeting → Bouquet ---
document.getElementById('btn-next1').addEventListener('click', () => {
  goTo(pages.greeting, pages.bouquet);
});

// --- STAGE 7: Bouquet Letter Click → Letter ---
document.getElementById('bouquet-letter').addEventListener('click', () => {
  const letter = document.getElementById('bouquet-letter');

  // Disable multiple clicks
  letter.style.pointerEvents = 'none';

  // Add opened class to trigger CSS animation
  letter.classList.add('opened');

  // Play a quick pop animation for the whole envelope
  letter.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  letter.style.transform = 'scale(1.15)';
  setTimeout(() => { letter.style.transform = 'scale(1)'; }, 200);

  // Wait for the envelope opening animation to finish before page transition
  setTimeout(() => {
    goTo(pages.bouquet, pages.letter);
    // start typing letter
    const letterEl = document.getElementById('typed-letter');
    const cursorEl = document.getElementById('cursor');
    typeText(letterEl, CONFIG.surat, 35, () => {
      cursorEl.style.display = 'none';
      document.getElementById('btn-next2').classList.add('show');
    });
  }, 1000);
});

// --- STAGE 3: Letter → Memories ---
document.getElementById('btn-next2').addEventListener('click', () => {
  const loader = document.getElementById('loader');
  const particles = document.getElementById('particles');

  // ⚡ Preload all memory images NOW during loading screen
  // so they're already in cache when the page appears (no decode lag)
  const memorySrcs = [
    'assets/images/1000290595.jpg',
    'assets/images/1000310518.jpg',
    'assets/images/1000310619.jpg',
    'assets/images/1000317958.jpg',
    'assets/images/1000318071.jpg'
  ];
  memorySrcs.forEach(src => {
    const pre = new Image();
    pre.src = src;
  });

  if (loader) {
    // 1. Prepare loader text, solid background, and put canvas particles on top of it
    loader.querySelector('.loader-text').innerHTML = 'memuat kenangan manis... <span style="display:inline-block; animation: spinFlower 2.5s linear infinite;">🌸</span>';
    loader.classList.add('solid-bg');
    loader.style.display = 'flex';
    if (particles) particles.classList.add('on-top');

    // Force a CSS reflow
    loader.offsetHeight;

    // 2. Fade in the loader
    loader.classList.remove('fade-out');

    // 3. Wait for 2.0 seconds, transition page, and fade out loader
    setTimeout(() => {
      // Transition the page first
      goTo(pages.letter, pages.memories);

      // ⚡ Wait for page slide animation to finish (550ms) THEN reveal photos
      // This prevents doing too many things at the same time
      setTimeout(() => {
        revealMemories();
      }, 480);

      // Fade out loader after a short delay so it doesn't compete with page transition
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 300);

      // Fully hide the loader and reset its settings after fade-out transition
      setTimeout(() => {
        loader.style.display = 'none';
        loader.classList.remove('solid-bg');
        if (particles) particles.classList.remove('on-top');
        loader.querySelector('.loader-text').textContent = 'preparing something special for you...';
      }, 1100);
    }, 2000);
  } else {
    // Fallback if loader is not found
    goTo(pages.letter, pages.memories);
    setTimeout(() => revealMemories(), 480);
  }
});

// --- STAGE 4: Memories → Quiz ---
document.getElementById('btn-next3').addEventListener('click', () => {
  goTo(pages.memories, pages.quiz);
});

// --- STAGE 5: Quiz Logic ---
document.getElementById('btn-yes').addEventListener('click', (e) => {
  burstConfetti(e.clientX, e.clientY, 60);
  setTimeout(() => {
    goTo(pages.quiz, pages.reasons);
    revealReasons();
  }, 800);
});

// --- STAGE 6: Reasons I Love You ---
function revealReasons() {
  const items = document.querySelectorAll('#reasons-list li');
  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add('show');
      // show next button after last item
      if (i === items.length - 1) {
        setTimeout(() => {
          document.getElementById('btn-next4').classList.add('show');
        }, 500);
      }
    }, (i + 1) * 600);
  });
}

document.getElementById('btn-next4').addEventListener('click', () => {
  goTo(pages.reasons, pages.relationQuiz);
  startKuis();
});

// Tombol "Enggak" menghindar
const btnNo = document.getElementById('btn-no');
const quizArea = document.getElementById('quiz-area');

function dodgeButton() {
  const area = quizArea.getBoundingClientRect();
  const yesBtn = document.getElementById('btn-yes');
  const yesRect = yesBtn.getBoundingClientRect();

  const maxX = Math.max(10, area.width - btnNo.offsetWidth - 10);
  const maxY = Math.max(10, area.height - btnNo.offsetHeight - 10);

  let rx = 10, ry = 10;
  let attempts = 0;

  do {
    rx = Math.max(10, Math.random() * maxX);
    ry = Math.max(10, Math.random() * maxY);
    attempts++;
  } while (
    attempts < 12 &&
    Math.abs(rx - (yesRect.left - area.left)) < 110 &&
    Math.abs(ry - (yesRect.top - area.top)) < 55
  );

  btnNo.style.position = 'absolute';
  btnNo.style.left = rx + 'px';
  btnNo.style.top = ry + 'px';
}

btnNo.addEventListener('mouseover', dodgeButton);
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  dodgeButton();
}, { passive: false });
btnNo.addEventListener('click', (e) => {
  e.preventDefault();
  dodgeButton();
});

// --- STAGE 5.5: Relationship Quiz Logic ---
let currentKuisIndex = 0;
let kuisScore = 0;

function startKuis() {
  currentKuisIndex = 0;
  kuisScore = 0;
  document.getElementById('rq-emoji').textContent = "🤔";
  document.getElementById('rq-title').textContent = "Kuis Tentang Kita 💕";
  loadKuisQuestion();
}

function loadKuisQuestion() {
  const kuisData = CONFIG.kuis[currentKuisIndex];
  const questionEl = document.getElementById('rq-question');
  const optionsContainer = document.getElementById('rq-options');
  const progressEl = document.getElementById('rq-progress');

  // clear options
  optionsContainer.innerHTML = '';

  // set question
  questionEl.textContent = kuisData.tanya;

  // set progress
  progressEl.textContent = `Pertanyaan ${currentKuisIndex + 1} dari ${CONFIG.kuis.length}`;

  // render options
  kuisData.opsi.forEach((opsi, index) => {
    const btn = document.createElement('button');
    btn.className = 'rq-option-btn';
    btn.textContent = opsi;
    btn.addEventListener('click', () => handleKuisAnswer(btn, index));
    optionsContainer.appendChild(btn);
  });
}

function handleKuisAnswer(btn, selectedIndex) {
  const kuisData = CONFIG.kuis[currentKuisIndex];
  const allBtns = document.querySelectorAll('.rq-option-btn');

  // disable all options
  allBtns.forEach(b => b.disabled = true);

  if (selectedIndex === kuisData.jawaban) {
    btn.classList.add('correct');
    kuisScore++;
  } else {
    btn.classList.add('incorrect');
    // highlight correct answer in green
    allBtns[kuisData.jawaban].classList.add('correct');
  }

  // wait 1.5s then go to next question or show result
  setTimeout(() => {
    currentKuisIndex++;
    if (currentKuisIndex < CONFIG.kuis.length) {
      loadKuisQuestion();
    } else {
      showKuisResult();
    }
  }, 1500);
}

function showKuisResult() {
  const questionEl = document.getElementById('rq-question');
  const optionsContainer = document.getElementById('rq-options');
  const progressEl = document.getElementById('rq-progress');

  optionsContainer.innerHTML = '';
  progressEl.textContent = '';

  if (kuisScore === CONFIG.kuis.length) {
    document.getElementById('rq-emoji').textContent = "🎉🏆";
    document.getElementById('rq-title').textContent = "Skor Kamu Sempurna! 💯";
    questionEl.textContent = "Ihh inget aku makin sayang sama kamu! 🥰💕";

    // burst massive confetti
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        burstConfetti(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight * 0.3,
          50
        );
      }, i * 300);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-main';
    nextBtn.textContent = 'Next →';
    nextBtn.addEventListener('click', () => {
      goTo(pages.relationQuiz, pages.blowCake);
      resetCandle();
    });
    optionsContainer.appendChild(nextBtn);
  } else {
    document.getElementById('rq-emoji').textContent = "🥺";
    document.getElementById('rq-title').textContent = "Yah, Coba Lagi Yuk...";
    questionEl.textContent = `Skor kamu: ${kuisScore} dari ${CONFIG.kuis.length}. Ada jawaban yang kurang pas nih. Coba ulangi kuis biar dapet skor 100! 🤍`;

    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn-main';
    retryBtn.textContent = 'Ulangi Kuis 🔄';
    retryBtn.addEventListener('click', startKuis);
    optionsContainer.appendChild(retryBtn);
  }
}

// --- Loading Screen Handler ---
function dismissLoader() {
  const loader = document.getElementById('loader');
  if (!loader || loader.dataset.dismissed) return;
  loader.dataset.dismissed = 'true';

  loader.classList.add('fade-out');

  // Show Cover page (Stage 1)
  pages.cover.classList.add('active');

  // Force reflow/reset of cover-content animations
  const coverInner = pages.cover.querySelector('.cover-content');
  if (coverInner) {
    coverInner.style.animation = 'none';
    coverInner.offsetHeight; // force reflow
    coverInner.style.animation = '';
  }

  setTimeout(() => {
    loader.style.display = 'none';
  }, 800);
}

// Dismiss loader once DOM is interactive (don't wait for heavy assets like audio)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  // DOM already ready, just wait the minimum display time
  setTimeout(dismissLoader, 2500);
} else {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(dismissLoader, 2500);
  });
}

// Failsafe: always dismiss loader after 6 seconds no matter what
setTimeout(dismissLoader, 6000);

// --- Polaroid Stack Interactive Cycling ---
const cards = document.querySelectorAll('.photo-card');

// --- Lightbox / Photo Inspector Elements ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

cards.forEach(card => {
  // 1. Click on the card (excl. zoom button) to cycle the deck
  card.addEventListener('click', (e) => {
    // If the click is on the zoom button or inside it, do not cycle the deck
    if (e.target.closest('.photo-zoom-btn')) return;

    // Only cycle if this card is currently the top card AND not already animating
    if (!card.classList.contains('state-top') || card.classList.contains('swipe')) return;

    const midCard = document.querySelector('.photo-card.state-mid');
    const botCard = document.querySelector('.photo-card.state-bot');
    const hiddenCards = document.querySelectorAll('.photo-card.state-hidden');

    // ⚡ Zero out transition delays on ALL moving cards so they animate instantly
    [card, midCard, botCard, hiddenCards[0]].forEach(c => {
      if (c) c.style.transitionDelay = '0s';
    });

    // Swipe out the top card
    card.classList.add('swipe');
    card.classList.remove('state-top');

    // Shift middle to top, bottom to middle
    if (midCard) {
      midCard.classList.remove('state-mid');
      midCard.classList.add('state-top');
    }
    if (botCard) {
      botCard.classList.remove('state-bot');
      botCard.classList.add('state-mid');
    }

    // If there are hidden cards, promote the first one to bot
    if (hiddenCards.length > 0) {
      hiddenCards[0].classList.remove('state-hidden');
      hiddenCards[0].classList.add('state-bot');
    }

    // After swipe out finishes, recycle this card back into the deck
    setTimeout(() => {
      requestAnimationFrame(() => {
        card.classList.remove('swipe');
        card.style.transitionDelay = ''; // clean up inline style

        const totalCards = document.querySelectorAll('.photo-card').length;
        if (totalCards > 3) {
          card.classList.add('state-hidden');
        } else {
          card.classList.add('state-bot');
        }

        // Move to end of DOM so next query gets the right first hidden card
        card.parentNode.appendChild(card);
      });
    }, 350);
  });

  // 2. Click on the Zoom Button to Inspect the Photo
  const zoomBtn = card.querySelector('.photo-zoom-btn');
  if (zoomBtn) {
    zoomBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent card click

      const img = card.querySelector('img');
      const caption = card.querySelector('.photo-caption');

      if (img && lightbox && lightboxImg && lightboxCaption) {
        lightboxImg.src = img.src;
        lightboxCaption.innerHTML = caption ? caption.innerHTML : '';
        lightbox.style.display = 'block';
      }
    });
  }
});

// Close Lightbox on close button click
if (lightboxClose) {
  lightboxClose.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });
}

// Close Lightbox when clicking anywhere outside the image
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxClose) {
      lightbox.style.display = 'none';
    }
  });
}

// Close Lightbox on Escape key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && lightbox.style.display === 'block') {
    lightbox.style.display = 'none';
  }
});

// --- Trigger Polaroid Stagger Entrance ---
function revealMemories() {
  const cards = document.querySelectorAll('.photo-card');
  cards.forEach((card, i) => {
    // Give each card a staggered delay so they glide in one by one
    setTimeout(() => {
      card.classList.add('show');
    }, 200 + i * 280);
  });
}

// --- Floating Music Player Logic ---
const mpToggle = document.getElementById('mp-toggle');
const mpDisc = document.getElementById('mp-disc');
const mpIconPlay = document.getElementById('mp-icon-play');
const mpIconPause = document.getElementById('mp-icon-pause');

mpToggle.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(() => { });
  } else {
    audio.pause();
  }
});

// Keep music player UI strictly synced with actual audio element events
audio.addEventListener('play', () => {
  if (mpDisc) mpDisc.classList.remove('paused');
  if (mpIconPlay) mpIconPlay.classList.add('hidden');
  if (mpIconPause) mpIconPause.classList.remove('hidden');
});

audio.addEventListener('pause', () => {
  if (mpDisc) mpDisc.classList.add('paused');
  if (mpIconPlay) mpIconPlay.classList.remove('hidden');
  if (mpIconPause) mpIconPause.classList.add('hidden');
});

// --- STAGE 5.8: Virtual Blow Cake Logic ---
const flame = document.getElementById('candle-flame');
const smoke = document.getElementById('candle-smoke');
const cakeInstruction = document.getElementById('cake-instruction');
const btnNextCake = document.getElementById('btn-next-cake');
let isCandleBlown = false;

function resetCandle() {
  isCandleBlown = false;
  flame.classList.remove('extinguished');
  smoke.classList.remove('active');
  smoke.classList.add('hidden');
  cakeInstruction.innerHTML = 'Pejamkan mata, make a wish dalam hati... 🤫<br><span class="cake-hint">👇 tap/sentuh api lilin untuk meniupnya!</span>';
  btnNextCake.classList.remove('show');
}

const flameHitbox = document.getElementById('flame-hitbox');

if (flame) {
  flame.addEventListener('click', blowCandle);
  flame.addEventListener('touchstart', (e) => {
    e.preventDefault();
    blowCandle();
  }, { passive: false });
}

if (flameHitbox) {
  flameHitbox.addEventListener('click', blowCandle);
  flameHitbox.addEventListener('touchstart', (e) => {
    e.preventDefault();
    blowCandle();
  }, { passive: false });
}

function blowCandle() {
  if (isCandleBlown) return;
  isCandleBlown = true;

  // Extinguish flame
  flame.classList.add('extinguished');

  // Trigger smoke puff
  smoke.classList.remove('hidden');
  smoke.classList.add('active');

  // Visual pop / confetti
  burstConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 30);

  // Success message
  cakeInstruction.style.opacity = '0';
  setTimeout(() => {
    cakeInstruction.innerHTML = "Yeeayy! Semoga semua keinginanmu dikabulkan ya sayang... 🤍";
    cakeInstruction.style.opacity = '1';
  }, 300);

  // Reveal next button
  setTimeout(() => {
    btnNextCake.classList.add('show');
  }, 1000);
}

// Blow Cake next button click
btnNextCake.addEventListener('click', () => {
  goTo(pages.blowCake, pages.final);
  // big confetti shower on final page
  setTimeout(() => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        burstConfetti(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight * 0.3,
          40
        );
      }, i * 400);
    }
  }, 500);
});
