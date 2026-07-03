/* ====================================================================
   MANAL JASMINE — BIRTHDAY EXPERIENCE — script.js
   Organized into small independent modules. Search for the ALL-CAPS
   section headers to jump around quickly.
   ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 900, once: true, offset: 60 });

  initLoader();
  initAmbientBackground();
  initCursorGlow();
  initVineProgress();
  initMusic();
  initLanding();
  initHeroReveal();
  initCake();
  initReasonsGrid();
  initLoveNotes();
  initWishWall();
  initCountdown();
  initGift();
  initFinaleFireworks();
});

/* =====================================================================
   LOADER — shows briefly, then fades to reveal the landing gate
   ===================================================================== */
function initLoader(){
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 1200);
  });
  // Fallback in case 'load' already fired or is slow on a flaky connection
  setTimeout(() => loader.classList.add('hide'), 3200);
}

/* =====================================================================
   AMBIENT BACKGROUND — twinkling stars, drifting petals, fireflies,
   soft bokeh circles. One canvas, lightweight, capped particle count.
   ===================================================================== */
function initAmbientBackground(){
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize(){
    const newW = window.innerWidth;
    const newH = document.body.scrollHeight;
    // On mobile, scrolling triggers resize because address bar hides.
    // We only want to rebuild the canvas if width changes or height increases significantly.
    if (w === newW && h && (newH - h < 150)) return;
    
    w = canvas.width = newW;
    h = canvas.height = newH;
  }
  resize();
  window.addEventListener('resize', resize);
  // Recheck height after content/images settle
  window.addEventListener('load', () => setTimeout(resize, 500));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 700;
  const STAR_COUNT = isMobile ? 40 : 80;
  const PETAL_COUNT = isMobile ? 10 : 18;
  const FIREFLY_COUNT = isMobile ? 8 : 14;
  const BOKEH_COUNT = 6;

  const rand = (a,b) => a + Math.random()*(b-a);

  const stars = Array.from({length:STAR_COUNT}, () => ({
    x: rand(0,w), y: rand(0,h), r: rand(0.6,1.8),
    phase: rand(0, Math.PI*2), speed: rand(0.01,0.03)
  }));

  const petalColors = ['rgba(247,201,216,0.85)','rgba(203,179,230,0.8)','rgba(229,182,168,0.85)'];
  const petals = Array.from({length:PETAL_COUNT}, () => spawnPetal());
  function spawnPetal(){
    return {
      x: rand(0,w), y: rand(-h,0), size: rand(6,12),
      speedY: rand(0.3,0.8), drift: rand(-0.6,0.6), angle: rand(0,360),
      spin: rand(-1,1), color: petalColors[Math.floor(Math.random()*petalColors.length)]
    };
  }

  const fireflies = Array.from({length:FIREFLY_COUNT}, () => ({
    x: rand(0,w), y: rand(0,h), baseX:0, baseY:0,
    t: rand(0,Math.PI*2), speed: rand(0.005,0.015), r: rand(1.5,2.5)
  }));
  fireflies.forEach(f => { f.baseX = f.x; f.baseY = f.y; });

  const bokeh = Array.from({length:BOKEH_COUNT}, () => ({
    x: rand(0,w), y: rand(0,h), r: rand(60,140), drift: rand(-0.08,0.08), opacity: rand(0.03,0.07)
  }));

  function draw(){
    ctx.clearRect(0,0,w,h);

    // bokeh
    bokeh.forEach(b => {
      b.y += b.drift;
      if (b.y < -b.r) b.y = h + b.r;
      if (b.y > h + b.r) b.y = -b.r;
      const g = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
      g.addColorStop(0, `rgba(255,236,210,${b.opacity})`);
      g.addColorStop(1, 'rgba(255,236,210,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill();
    });

    // stars
    stars.forEach(s => {
      s.phase += s.speed;
      const tw = (Math.sin(s.phase) + 1) / 2;
      ctx.fillStyle = `rgba(255,255,255,${0.25 + tw*0.5})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    });

    // petals
    petals.forEach(p => {
      p.y += p.speedY; p.x += Math.sin(p.y*0.01)*p.drift; p.angle += p.spin;
      if (p.y > h + 20) Object.assign(p, spawnPetal(), {y:-20});
      ctx.save();
      ctx.translate(p.x,p.y); ctx.rotate(p.angle*Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0,0,p.size*0.6,p.size,0,0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    });

    // fireflies
    fireflies.forEach(f => {
      f.t += f.speed;
      f.x = f.baseX + Math.sin(f.t*2)*40;
      f.y = f.baseY + Math.cos(f.t*1.6)*30;
      const glow = (Math.sin(f.t*3)+1)/2;
      ctx.fillStyle = `rgba(242,200,121,${0.3 + glow*0.6})`;
      ctx.shadowColor = '#F2C879'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (!reduceMotion) requestAnimationFrame(draw);
  }
  draw();
}

/* =====================================================================
   CURSOR GLOW — a small warm light trailing the pointer (desktop only)
   ===================================================================== */
function initCursorGlow(){
  if (!window.matchMedia('(hover:hover)').matches) return;
  const glow = document.getElementById('cursor-glow');
  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* =====================================================================
   VINE PROGRESS — the line on the right blooms downward as you scroll
   ===================================================================== */
function initVineProgress(){
  const fill = document.getElementById('vine-fill');
  function update(){
    const max = document.body.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    fill.setAttribute('y2', pct.toFixed(2));
  }
  window.addEventListener('scroll', update);
  window.addEventListener('resize', update);
  update();
}

/* =====================================================================
   MUSIC — a gentle generative piano-style loop via Web Audio API, so
   the page has music immediately with no external file needed.
   To use your own track instead: drop an mp3 at assets/music/song.mp3
   and uncomment the <audio> block below this function.
   ===================================================================== */
function initMusic(){
  const btn = document.getElementById('music-toggle');
  let ctxAudio, playing = false, schedulerId;

  // Soft pentatonic-ish chord tones for a calm, music-box birthday feel
  const notes = [392.00, 440.00, 523.25, 587.33, 659.25, 698.46, 783.99]; // G major-ish scale
  let step = 0;

  function startEngine(){
    if (!ctxAudio) ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctxAudio.createGain();
    master.gain.value = 0.05;
    master.connect(ctxAudio.destination);
    btn._master = master;

    function playNote(freq, time, dur=1.6){
      const osc = ctxAudio.createOscillator();
      const gain = ctxAudio.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.6, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
      osc.connect(gain); gain.connect(master);
      osc.start(time); osc.stop(time + dur + 0.1);
    }

    function scheduleLoop(){
      const now = ctxAudio.currentTime;
      const pattern = [0,2,4,2,1,3,5,3];
      pattern.forEach((idx, i) => {
        playNote(notes[idx % notes.length], now + i*0.9, 1.5);
      });
      // gentle low pad underneath
      playNote(notes[0]/2, now, 7.2);
      schedulerId = setTimeout(scheduleLoop, pattern.length * 900);
    }
    scheduleLoop();
  }

  btn.addEventListener('click', async () => {
    if (!playing){
      if (ctxAudio && ctxAudio.state === 'suspended') await ctxAudio.resume();
      if (!ctxAudio) startEngine();
      playing = true;
      btn.classList.remove('muted');
    } else {
      playing = false;
      btn.classList.add('muted');
      if (ctxAudio) await ctxAudio.suspend();
    }
  });

  // start muted by default — browsers block autoplay with sound anyway,
  // this just keeps the icon state honest until she taps to begin.
  btn.classList.add('muted');
}

/* =====================================================================
   LANDING — the gate: confetti + hearts + fireworks burst, then reveal
   ===================================================================== */
function initLanding(){
  const openBtn = document.getElementById('open-surprise');
  const landing = document.getElementById('landing');
  const main = document.getElementById('main-content');
  const burstLayer = document.getElementById('landing-burst');

  // Typed.js for the tagline beneath her name — a soft typewriter reveal
  if (window.Typed){
    new Typed('.tagline', {
      strings: ['A day made beautiful because you were born.'],
      typeSpeed: 35,
      showCursor: false
    });
  }

  openBtn.addEventListener('click', () => {
    // try to start music automatically on this first real interaction
    document.getElementById('music-toggle').click();

    confetti({ particleCount: 140, spread: 90, origin:{y:0.6}, colors:['#F2C879','#E5B6A8','#CBB3E6','#F7C9D8'] });
    spawnHearts(burstLayer, 18);
    setTimeout(() => confetti({ particleCount: 80, spread: 120, startVelocity:35, origin:{y:0.4} }), 300);

    setTimeout(() => {
      landing.style.transition = 'opacity .8s ease, transform .8s ease';
      landing.style.opacity = '0';
      landing.style.transform = 'scale(1.02)';
      setTimeout(() => {
        landing.style.display = 'none';
        main.hidden = false;
        document.getElementById('hero').scrollIntoView({ behavior:'smooth' });
      }, 750);
    }, 900);
  });
}

function spawnHearts(layer, count){
  for (let i=0;i<count;i++){
    const h = document.createElement('div');
    h.textContent = '❤️';
    h.style.position = 'absolute';
    h.style.left = (Math.random()*100) + '%';
    h.style.bottom = '0';
    h.style.fontSize = (16 + Math.random()*18) + 'px';
    h.style.opacity = '0.9';
    h.style.transition = `transform ${3+Math.random()*2}s ease-out, opacity ${3+Math.random()*2}s ease-out`;
    layer.appendChild(h);
    requestAnimationFrame(() => {
      h.style.transform = `translateY(-${60+Math.random()*30}vh) translateX(${(Math.random()-0.5)*120}px) rotate(${(Math.random()-0.5)*60}deg)`;
      h.style.opacity = '0';
    });
    setTimeout(() => h.remove(), 5500);
  }
}

/* =====================================================================
   HERO REVEAL — each line of the hero fades up in sequence on scroll
   ===================================================================== */
function initHeroReveal(){
  const lines = document.querySelectorAll('#hero-lines p');
  const hero = document.getElementById('hero');
  let played = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !played){
        played = true;
        lines.forEach((line, i) => {
          setTimeout(() => {
            line.style.transition = 'opacity .8s ease, transform .8s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
          }, i * 500);
        });
      }
    });
  }, { threshold: 0.4 });
  observer.observe(hero);
}

/* =====================================================================
   CAKE — blow the candles (button, or actually blow into your mic!)
   ===================================================================== */
function initCake(){
  const btn = document.getElementById('blow-btn');
  const cake = document.querySelector('.cake');
  const wishText = document.getElementById('wish-text');
  const smokeWrap = document.getElementById('smoke-wrap');
  let blown = false;

  function blowOut(){
    if (blown) return;
    blown = true;
    cake.classList.add('blown');
    for (let i=0;i<10;i++){
      const puff = document.createElement('div');
      puff.className = 'smoke-puff';
      puff.style.left = (90 + Math.random()*40) + 'px';
      puff.style.animationDelay = (i*0.08) + 's';
      smokeWrap.appendChild(puff);
      setTimeout(() => puff.remove(), 2200);
    }
    confetti({ particleCount: 100, spread: 80, origin:{y:0.7}, colors:['#F2C879','#E5B6A8','#F7C9D8'] });
    wishText.classList.add('show');
    btn.textContent = '🎉 Wish Made!';
    btn.disabled = true;
  }

  btn.addEventListener('click', blowOut);

  // Bonus: try real microphone "blowing" detection. Falls back silently
  // if the user denies permission — the button always works regardless.
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    const tryMic = () => {
      navigator.mediaDevices.getUserMedia({ audio:true }).then(stream => {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const source = ac.createMediaStreamSource(stream);
        const analyser = ac.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        function check(){
          if (blown){ stream.getTracks().forEach(t=>t.stop()); return; }
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a,b)=>a+b,0) / data.length;
          if (avg > 55) blowOut();
          requestAnimationFrame(check);
        }
        check();
      }).catch(() => {/* mic denied — button still works */});
    };
    btn.addEventListener('mouseenter', tryMic, { once:true });
    btn.addEventListener('touchstart', tryMic, { once:true });
  }
}

/* =====================================================================
   REASONS GRID — 12 gently floating cards, populated from data so the
   float animation delay/duration stays nicely randomized
   ===================================================================== */
function initReasonsGrid(){
  const grid = document.getElementById('reasons-grid');
  const reasons = [
    '🌸 Your beautiful smile','🌸 Your kindness','🌸 Your caring heart',
    '🌸 Your positivity','🌸 Your laughter','🌸 Your strength',
    '🌸 Your honesty','🌸 Your beautiful soul','🌸 Your intelligence',
    '🌸 Your patience','🌸 Your compassion',"🌸 Simply because you're you"
  ];
  reasons.forEach((text, i) => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.textContent = text;
    card.style.animationDelay = (i * 0.3) + 's';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String((i % 4) * 100));
    grid.appendChild(card);
  });
}

/* =====================================================================
   FLOATING LOVE NOTES — ambient notes drifting up every few seconds
   ===================================================================== */
function initLoveNotes(){
  const layer = document.getElementById('love-notes-layer');
  const notes = [
    'You are amazing.','You deserve endless happiness.','Never stop smiling.',
    'Stay blessed.','Happy Birthday ❤️','So proud of you.',
    'You are special.',"You're one of a kind."
  ];
  function spawn(){
    const note = document.createElement('div');
    note.className = 'love-note';
    note.textContent = notes[Math.floor(Math.random()*notes.length)];
    note.style.left = (5 + Math.random()*80) + '%';
    note.style.top = (20 + Math.random()*60) + '%';
    layer.appendChild(note);
    setTimeout(() => note.remove(), 7200);
  }
  setInterval(spawn, 4500);
  setTimeout(spawn, 1500);
}

/* =====================================================================
   WISH WALL — visitor types a wish, it floats across the screen
   (front-end only — nothing is stored or sent anywhere)
   ===================================================================== */
function initWishWall(){
  const form = document.getElementById('wish-form');
  const input = document.getElementById('wish-input');
  const layer = document.getElementById('love-notes-layer');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const note = document.createElement('div');
    note.className = 'love-note';
    note.textContent = '🌸 ' + text;
    note.style.left = (10 + Math.random()*60) + '%';
    note.style.top = '70%';
    layer.appendChild(note);
    confetti({ particleCount: 40, spread: 60, origin:{y:0.8} });
    setTimeout(() => note.remove(), 7200);
    input.value = '';
  });
}

/* =====================================================================
   COUNTDOWN — to her next birthday. Assumes "today" is the day this
   page is opened on her birthday; counts forward exactly one year.
   Adjust the target date manually below if you're sending this ahead
   of time and know her real birth date.
   ===================================================================== */
function initCountdown(){
  const target = new Date();
  target.setFullYear(target.getFullYear() + 1);
  target.setHours(0,0,0,0);

  const els = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-min'),
    s: document.getElementById('cd-sec'),
  };

  function tick(){
    const diff = Math.max(0, target - new Date());
    const day = Math.floor(diff / 86400000);
    const hr = Math.floor((diff % 86400000) / 3600000);
    const min = Math.floor((diff % 3600000) / 60000);
    const sec = Math.floor((diff % 60000) / 1000);
    els.d.textContent = day;
    els.h.textContent = String(hr).padStart(2,'0');
    els.m.textContent = String(min).padStart(2,'0');
    els.s.textContent = String(sec).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}

/* =====================================================================
   GIFT BOX — opens with ribbon untying, sparkles, and the message
   ===================================================================== */
function initGift(){
  const btn = document.getElementById('open-gift-btn');
  const gift = document.getElementById('gift');
  const giftText = document.getElementById('gift-text');
  let opened = false;

  btn.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    gift.classList.add('open');
    confetti({ particleCount: 120, spread: 100, origin:{y:0.6}, colors:['#F2C879','#E5B6A8','#CBB3E6'] });
    giftText.classList.add('show');
    btn.textContent = '🎁 Opened!';
    btn.disabled = true;
  });
}

/* =====================================================================
   FINALE FIREWORKS — lightweight canvas particle fireworks, triggered
   once the finale section scrolls into view
   ===================================================================== */
function initFinaleFireworks(){
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('finale');
  let running = false;
  let particles = [];

  function resize(){
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function launchFirework(){
    const x = Math.random() * canvas.width;
    const y = canvas.height * (0.2 + Math.random()*0.3);
    const colors = ['#F2C879','#E5B6A8','#F7C9D8','#CBB3E6','#fff'];
    const color = colors[Math.floor(Math.random()*colors.length)];
    const count = 36;
    for (let i=0;i<count;i++){
      const angle = (Math.PI*2*i)/count;
      const speed = 1.5 + Math.random()*2.2;
      particles.push({
        x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed,
        life: 1, color
      });
    }
  }

  function loop(){
    if (!running) return;
    ctx.fillStyle = 'rgba(27,19,48,0.18)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.life -= 0.012;
      ctx.globalAlpha = Math.max(p.life,0);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y,2.4,0,Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter(p => p.life > 0);
    requestAnimationFrame(loop);
  }

  let launchTimer;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !running){
        running = true;
        loop();
        launchFirework();
        launchTimer = setInterval(launchFirework, 700);
        confetti({ particleCount: 160, spread: 160, origin:{y:0.6} });
      } else if (!entry.isIntersecting && running){
        running = false;
        clearInterval(launchTimer);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(section);
}
