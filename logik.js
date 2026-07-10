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
      tanya: "Apa makanan favorit aku? 🍛",
      opsi: ["Seblak Pedes 🍜", "Semua yang gratisan 😂", "Ayam Geprek 🍗"],
      jawaban: 1 // Semua yang gratisan
    },
    {
      tanya: "Tanggal berapa kita jadian? 📅",
      opsi: ["10 Oktober", "12 Desember", "Setiap hari kan sayang terus 🥰"],
      jawaban: 2 // Setiap hari kan sayang terus
    }
  ],

  // Isi surat — tulis sesuka hati kamu
  surat: `My dearest Dara... 💕

Aku cuma mau bilang, selamat ulang tahun ya! Di hari spesial ini, aku bersyukur banget bisa kenal kamu dan jadi bagian dari hidupmu.

Makasih udah selalu ada, selalu sabar, dan selalu bikin hari-hariku jadi lebih berwarna. Kamu tuh orang yang paling berarti buat aku.

Semoga di umur yang baru, semua mimpi kamu tercapai, selalu sehat, dan makin bahagia. Aku sayang kamu! 🤍`,

  // Pesan akhir di halaman terakhir
  pesanAkhir: `Semoga di umur yang baru ini, kamu makin bahagia, sehat selalu, dan semua doamu terkabul. Makasih udah jadi bagian terindah di hidupku. I love you! 💕`
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
  bouquet: document.getElementById('bouquet'),
  final: document.getElementById('final')
};

const audio = document.getElementById('bg-music');

// --- Update dynamic content ---
document.querySelector('.greeting-date').textContent = CONFIG.tanggal;
document.querySelector('.final-msg').textContent = CONFIG.pesanAkhir;

// WhatsApp link
const waLink = document.getElementById('wa-link');
const waMsg = `Makasih banyak ya sayang buat surprise-nya! Aku suka banget 🥺❤️`;
waLink.href = `https://api.whatsapp.com/send?phone=${CONFIG.nomorWA}&text=${encodeURIComponent(waMsg)}`;

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
  }, 500);
}

// --- Floating Hearts Particle System ---
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let hearts = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
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

for (let i = 0; i < 25; i++) hearts.push(new Heart());

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach(h => { h.update(); h.draw(); });
  requestAnimationFrame(animateHearts);
}
animateHearts();

// --- Confetti Burst ---
let confetti = [];
function burstConfetti(cx, cy, count) {
  const colors = ['#f0a0b0', '#ffd6e0', '#fff', '#ffb3c6', '#c9184a'];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    confetti.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      gravity: 0.12
    });
  }
  if (confetti.length === count) animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // draw hearts too
  hearts.forEach(h => { h.update(); h.draw(); });
  
  confetti = confetti.filter(c => {
    c.vy += c.gravity;
    c.x += c.vx;
    c.y += c.vy;
    c.vx *= 0.98;
    c.opacity -= 0.012;
    
    ctx.save();
    ctx.globalAlpha = Math.max(0, c.opacity);
    ctx.fillStyle = c.color;
    ctx.beginPath();
    // draw heart shape for confetti
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
  
  if (confetti.length > 0) {
    requestAnimationFrame(animateConfetti);
  }
}

// --- STAGE 1: Cover → Greeting ---
const btnOpen = document.getElementById('btn-open');
const giftBox = document.getElementById('gift-box');

function openGift() {
  audio.play().catch(() => {});
  giftBox.classList.add('open');
  btnOpen.style.transition = 'opacity 0.5s ease';
  btnOpen.style.opacity = '0';
  btnOpen.style.pointerEvents = 'none';

  setTimeout(() => {
    goTo(pages.cover, pages.greeting);
    typeText(document.getElementById('greeting-name'), CONFIG.nama, 120, () => {
      document.getElementById('btn-next1').classList.add('show');
    });
  }, 1000);
}

btnOpen.addEventListener('click', openGift);
giftBox.addEventListener('click', openGift);

// --- Typing Effect ---
function typeText(el, text, speed, callback) {
  let i = 0;
  el.textContent = '';
  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  type();
}

// --- STAGE 2: Greeting → Bouquet ---
document.getElementById('btn-next1').addEventListener('click', () => {
  goTo(pages.greeting, pages.bouquet);
});

// --- STAGE 7: Bouquet → Letter ---
document.getElementById('btn-next5').addEventListener('click', () => {
  goTo(pages.bouquet, pages.letter);
  // start typing letter
  const letterEl = document.getElementById('typed-letter');
  const cursorEl = document.getElementById('cursor');
  typeText(letterEl, CONFIG.surat, 35, () => {
    cursorEl.style.display = 'none';
    document.getElementById('btn-next2').classList.add('show');
  });
});

// --- STAGE 3: Letter → Memories ---
document.getElementById('btn-next2').addEventListener('click', () => {
  goTo(pages.letter, pages.memories);
  revealMemories();
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
  const maxX = area.width - btnNo.offsetWidth - 10;
  const maxY = area.height - btnNo.offsetHeight - 10;
  const rx = Math.max(10, Math.random() * maxX);
  const ry = Math.max(10, Math.random() * maxY);
  btnNo.style.position = 'absolute';
  btnNo.style.left = rx + 'px';
  btnNo.style.top = ry + 'px';
}

btnNo.addEventListener('mouseover', dodgeButton);
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  dodgeButton();
});
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
  document.getElementById('rq-title').textContent = "Kuis Hubungan Kita 💕";
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
    questionEl.textContent = "Luar biasa! Kamu ingat semua detail hubungan kita. Aku makin sayang sama kamu! 🥰💕";

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
    nextBtn.textContent = 'Lanjut →';
    nextBtn.addEventListener('click', () => {
      goTo(pages.relationQuiz, pages.final);
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
let isPageLoaded = false;
window.addEventListener('load', () => {
  isPageLoaded = true;
});

setTimeout(() => {
  const checkInterval = setInterval(() => {
    if (isPageLoaded || document.readyState === 'complete') {
      const loader = document.getElementById('loader');
      if (loader) {
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
        
        clearInterval(checkInterval);
        setTimeout(() => {
          loader.style.display = 'none';
        }, 800);
      }
    }
  }, 100);
}, 2500);

// --- Polaroid Stack Interactive Cycling ---
const cards = document.querySelectorAll('.photo-card');

cards.forEach(card => {
  card.addEventListener('click', () => {
    // Only cycle if this card is currently the top card AND not already animating
    if (!card.classList.contains('state-top') || card.classList.contains('swipe')) return;
    
    const midCard = document.querySelector('.photo-card.state-mid');
    const botCard = document.querySelector('.photo-card.state-bot');
    
    // Swipe out the top card
    card.classList.add('swipe');
    
    // Shift middle to top, bottom to middle
    if (midCard) {
      midCard.classList.remove('state-mid');
      midCard.classList.add('state-top');
    }
    if (botCard) {
      botCard.classList.remove('state-bot');
      botCard.classList.add('state-mid');
    }
    
    // After swipe out finishes, make this card the bottom card
    setTimeout(() => {
      card.classList.remove('state-top');
      card.classList.add('state-bot');
      card.classList.remove('swipe');
    }, 450);
  });
});

// --- Trigger Polaroid Stagger Entrance ---
function revealMemories() {
  const cards = document.querySelectorAll('.photo-card');
  cards.forEach(card => {
    card.classList.add('show');
  });
}
