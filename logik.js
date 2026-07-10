/* ==========================================
   LOGIK.JS — Birthday Website Logic
   ==========================================
   
   ✏️  EDIT BAGIAN INI UNTUK KUSTOMISASI:
   ========================================== */

const CONFIG = {
  nama: "Sayangku",                    // Ganti dengan nama pacar kamu
  tanggal: "10 Juli 2026",             // Ganti tanggal ultahnya
  nomorWA: "628123456789",             // Ganti nomor WA kamu (format 628xxx)

  // Isi surat — tulis sesuka hati kamu
  surat: `Hai sayang... 💕

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
  from.classList.remove('active');
  setTimeout(() => {
    to.classList.add('active');
    // re-trigger animation
    const inner = to.querySelector('.page-inner');
    if (inner) {
      inner.style.animation = 'none';
      inner.offsetHeight; // force reflow
      inner.style.animation = '';
    }
  }, 300);
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
      document.getElementById('btn-next1').classList.remove('hidden');
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
    document.getElementById('btn-next2').classList.remove('hidden');
  });
});

// --- STAGE 3: Letter → Memories ---
document.getElementById('btn-next2').addEventListener('click', () => {
  goTo(pages.letter, pages.memories);
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
    // reveal reasons one by one
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
          document.getElementById('btn-next4').classList.remove('hidden');
        }, 500);
      }
    }, (i + 1) * 600);
  });
}

document.getElementById('btn-next4').addEventListener('click', () => {
  goTo(pages.reasons, pages.final);
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
