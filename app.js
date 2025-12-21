const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
if (tg && tg.expand) tg.expand();

// 1. Получаем динамический ID сообщения, который бот передал в URL
const urlParams = new URLSearchParams(window.location.search);
const dynamicPreparedMessageId = urlParams.get('message_id');

// Конфигурация
const channelUrl = "https://t.me/+7tUrZjQhP-4wMGZi";
const shareFallbackText = "🙈 Хочешь получить лучшую тему для тебя? Заходи в бота: https://t.me/temyroombot";

const themes = [
  {
    name: "1 тема",
    url: "https://t.me/addtheme/K5q9kYcFSAeFO3PI",
    preview: { header: "#0f1720", headerText: "#e6eef8", bg: "#07101a", body: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))", incoming: "rgba(255,255,255,0.06)", outgoing: "#2f6bff", text: "#e6eef8" }
  },
  {
    name: "2 тема",
    url: "https://t.me/addtheme/W2iF6QpKuv1yVYnT",
    preview: { header: "#f1f5f9", headerText: "#0b1220", bg: "#ffffff", body: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.00))", incoming: "#f1f5f9", outgoing: "#2f6bff", text: "#0b1220" }
  },
  {
    name: "3 тема",
    url: "https://t.me/bg/lr3hGi3U-UqyDAAArcRJk5yooy0",
    preview: { header: "#05233a", headerText: "#eaf6ff", bg: "#06283e", body: "linear-gradient(180deg, rgba(6,40,62,0.02), rgba(6,40,62,0.00))", incoming: "rgba(255,255,255,0.04)", outgoing: "#1e90ff", text: "#eaf6ff" }
  },
  {
    name: "4 тема",
    url: "https://t.me/bg/9zHDI1iEuEoREAAASrlWw2E4vNk",
    preview: { header: "#072016", headerText: "#e6f8ef", bg: "#062217", body: "linear-gradient(180deg, rgba(6,34,23,0.02), rgba(6,34,23,0.00))", incoming: "rgba(255,255,255,0.04)", outgoing: "#2fbf6b", text: "#e6f8ef" }
  },
  {
    name: "5 тема",
    url: "https://t.me/bg/xwN9xVivsEq5DQAAFft1SLmXAaU",
    preview: { header: "#2a0b0b", headerText: "#ffeef0", bg: "#2a0b0b", body: "linear-gradient(180deg, rgba(42,11,11,0.02), rgba(42,11,11,0.00))", incoming: "rgba(255,255,255,0.04)", outgoing: "#ff6b6b", text: "#ffeef0" }
  }
];

let completedTasks = 0;
const totalTasks = 2;

// Логика заданий
const tasks = document.querySelectorAll('.task');
tasks.forEach(task => {
  task.style.cursor = 'pointer';
  task.addEventListener('click', () => {
    const type = task.dataset.task;
    const arrow = task.querySelector('.arrow');
    
    if (arrow.classList.contains('checked')) return;

    if (type === 'share') {
      // Пытаемся использовать dynamicPreparedMessageId для красивого превью
      if (tg?.isVersionAtLeast?.('7.8') && dynamicPreparedMessageId) {
        tg.shareMessage(dynamicPreparedMessageId);
      } else {
        // Фолбэк если ID нет или версия ТГ старая
        if (navigator.share) {
          navigator.share({ text: shareFallbackText }).catch(console.error);
        } else {
          alert('Поделитесь ссылкой на бота с друзьями!');
        }
      }
    } else if (type === 'subscribe') {
      if (tg && tg.openTelegramLink) {
        tg.openTelegramLink(channelUrl);
      } else {
        window.open(channelUrl, '_blank');
      }
    }

    // Имитация проверки выполнения (галочка через 2 сек)
    setTimeout(() => {
      if (!arrow.classList.contains('checked')) {
        arrow.textContent = '✔';
        arrow.classList.add('checked');
        completedTasks++;
        if (completedTasks === totalTasks) {
          document.getElementById('doneBtn').disabled = false;
        }
      }
    }, 2000);
  });
});

// Кнопка "Готово"
document.getElementById("doneBtn").addEventListener("click", () => {
  if (completedTasks < totalTasks) return;

  const index = Math.floor(Date.now() / (1000 * 60 * 60 * 2)) % themes.length;
  const selected = themes[index];

  // Скрываем интерфейс заданий
  ['.header', '.tasks', '#instructions', '#doneBtn'].forEach(selector => {
    const el = document.querySelector(selector);
    if (el) el.style.display = 'none';
  });

  // Показываем лоадер
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('fullscreen');
    loader.style.display = 'flex';
  }

  // Через 2 секунды показываем тему
  setTimeout(() => {
    if (loader) {
      loader.style.display = 'none';
      loader.classList.remove('fullscreen');
    }
    document.getElementById("randomTheme").textContent = "Тадаам! Ваша тема готова.";
    document.getElementById("themeMessage").textContent = "Темы обновляются каждые 24 часа.";
    document.querySelector(".theme-display").style.display = "block";
    
    const overlay = document.querySelector('.overlay');
    const modal = document.querySelector('.modal');
    if (overlay) overlay.classList.add('fullscreen');
    if (modal) modal.classList.add('fullscreen');

    document.getElementById("installBtn").onclick = () => {
      if (tg && tg.openLink) {
        tg.openLink(selected.url);
      } else {
        window.open(selected.url, "_blank");
      }
    };

    startFireworks(3000);
  }, 2000);
});

// Фейерверки
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
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 60 + Math.floor(rand(0, 40)),
        age: 0,
        color: `hsl(${hue + rand(-30,30)}, 80%, ${rand(50,70)}%)`
      });
    }
  }

  function loop() {
    ctx.clearRect(0,0,w,h);
    if (Math.random() < 0.08) createBurst(rand(w*0.2,w*0.8), rand(h*0.15,h*0.6));
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += 0.04; p.x += p.vx; p.y += p.vy; p.age++;
      const t = p.age / p.life;
      ctx.globalAlpha = Math.max(1 - t, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2 * (1 - t) + 0.6, 0, Math.PI*2);
      ctx.fill();
      if (p.age >= p.life) particles.splice(i,1);
    }
    animId = requestAnimationFrame(loop);
  }

  animId = requestAnimationFrame(loop);
  setTimeout(() => {
    cancelAnimationFrame(animId);
    ctx.clearRect(0,0,w,h);
    canvas.style.display = 'none';
  }, duration);
}
