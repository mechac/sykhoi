const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
if (tg && tg.expand) tg.expand();

const themes = [
  {
    name: "Темная тема",
    url: "https://t.me/addtheme/K5q9kYcFSAeFO3PI",
    preview: {
      header: "#0f1720",
      headerText: "#e6eef8",
      bg: "#07101a",
      body: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))",
      incoming: "rgba(255,255,255,0.06)",
      outgoing: "#2f6bff",
      text: "#e6eef8"
    }
  },
  {
    name: "Светлая тема",
    url: "https://t.me/addtheme/W2iF6QpKuv1yVYnT",
    preview: {
      header: "#f1f5f9",
      headerText: "#0b1220",
      bg: "#ffffff",
      body: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.00))",
      incoming: "#f1f5f9",
      outgoing: "#2f6bff",
      text: "#0b1220"
    }
  },
  {
    name: "Синяя тема",
    url: "https://t.me/bg/lr3hGi3U-UqyDAAArcRJk5yooy0",
    preview: {
      header: "#05233a",
      headerText: "#eaf6ff",
      bg: "#06283e",
      body: "linear-gradient(180deg, rgba(6,40,62,0.02), rgba(6,40,62,0.00))",
      incoming: "rgba(255,255,255,0.04)",
      outgoing: "#1e90ff",
      text: "#eaf6ff"
    }
  },
  {
    name: "Зелёная тема",
    url: "https://t.me/bg/9zHDI1iEuEoREAAASrlWw2E4vNk",
    preview: {
      header: "#072016",
      headerText: "#e6f8ef",
      bg: "#062217",
      body: "linear-gradient(180deg, rgba(6,34,23,0.02), rgba(6,34,23,0.00))",
      incoming: "rgba(255,255,255,0.04)",
      outgoing: "#2fbf6b",
      text: "#e6f8ef"
    }
  },
  {
    name: "Красная тема",
    url: "https://t.me/bg/xwN9xVivsEq5DQAAFft1SLmXAaU",
    preview: {
      header: "#2a0b0b",
      headerText: "#ffeef0",
      bg: "#2a0b0b",
      body: "linear-gradient(180deg, rgba(42,11,11,0.02), rgba(42,11,11,0.00))",
      incoming: "rgba(255,255,255,0.04)",
      outgoing: "#ff6b6b",
      text: "#ffeef0"
    }
  }
];

document.getElementById("doneBtn").addEventListener("click", () => {
  // Выбор темы по 2-часовому интервалу
  const index = Math.floor(Date.now() / (1000 * 60 * 60 * 2)) % themes.length;
  const selected = themes[index];
  const header = document.querySelector('.header');
  const tasks = document.querySelector('.tasks');
  const instructions = document.getElementById('instructions');
  if (header) header.style.display = 'none';
  if (tasks) tasks.style.display = 'none';
  if (instructions) instructions.style.display = 'none';

  const doneBtn = document.getElementById('doneBtn');
  if (doneBtn) doneBtn.style.display = 'none';

  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('fullscreen');
    loader.style.display = 'flex';
  }

  // Через 2 секунды скрываем GIF и показываем текст "Ваша тема"
  setTimeout(() => {
    if (loader) {
      loader.style.display = 'none';
      loader.classList.remove('fullscreen');
    }

    // Показываем общее имя вместо конкретного названия
    document.getElementById("randomTheme").textContent = "Тадаам! Ваша тема готова.";
    document.getElementById("themeMessage").textContent = "Темы обновляются каждые 2 часа.";

    // Показать карточку темы
    document.querySelector(".theme-display").style.display = "block";

    // Переводим модал в полноэкранный режим для установки темы
    const overlay = document.querySelector('.overlay');
    const modal = document.querySelector('.modal');
    if (overlay) overlay.classList.add('fullscreen');
    if (modal) modal.classList.add('fullscreen');

    const installBtn = document.getElementById("installBtn");
    installBtn.onclick = () => {
      if (tg && tg.openLink) {
        tg.openLink(selected.url);
      } else {
        window.open(selected.url, "_blank");
      }
    };

    // Запустить фейерверки на появление темы
    startFireworks(3000);
  }, 2000);
});

/* ===== Фейерверки ===== */
function startFireworks(duration = 3000) {
  const canvas = document.getElementById('fireworks');
  if (!canvas) return;
  canvas.classList.add('fireworks-active');
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');

  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  const particles = [];
  let animId;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createBurst(x, y) {
    const count = 24 + Math.floor(Math.random() * 20);
    const hue = Math.floor(rand(0, 360));
    for (let i = 0; i < count; i++) {
      const speed = rand(1, 6);
      const angle = rand(0, Math.PI * 2);
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 60 + Math.floor(rand(0, 40)),
        age: 0,
        color: `hsl(${hue + rand(-30,30)}, 80%, ${rand(50,70)}%)`
      });
    }
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);

  function loop() {
    ctx.clearRect(0,0,w,h);
    if (Math.random() < 0.08) createBurst(rand(w*0.2,w*0.8), rand(h*0.15,h*0.6));

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += 0.04; 
      p.x += p.vx;
      p.y += p.vy;
      p.age++;
      const t = p.age / p.life;
      const alpha = Math.max(1 - t, 0);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2 * (1 - t) + 0.6, 0, Math.PI*2);
      ctx.fill();
      if (p.age >= p.life) particles.splice(i,1);
    }

    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(loop);
  }

  createBurst(w*0.5, h*0.35);
  createBurst(w*0.7, h*0.45);
  animId = requestAnimationFrame(loop);


  setTimeout(() => {
    cancelAnimationFrame(animId);
    particles.length = 0;
    ctx.clearRect(0,0,w,h);
    canvas.style.display = 'none';
    canvas.classList.remove('fireworks-active');
    window.removeEventListener('resize', resize);
  }, duration);
}
