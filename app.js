// Telegram Themes App - Полностью рабочий код
// ============================================

// Глобальные переменные
let tg = null;
let isTelegramWebApp = false;
let currentTheme = null;
let tasksCompleted = 0;
const TOTAL_TASKS = 2;

// Константы (ИЗМЕНИТЕ ЭТИ ССЫЛКИ НА СВОИ!)
const SHARE_MSG = `🎨 Получите бесплатные темы для Telegram!\n\nКаждые 2 часа новая эксклюзивная тема.`;
const PAGE_URL = 'https://mechac.github.io/sykhoi/index.html'; // Ваш URL
const CHANNEL_URL = 'https://t.me/your_channel'; // Ваш канал Telegram

// Список тем (ДОБАВЬТЕ СВОИ ТЕМЫ)
const themes = [
  {
    name: "Темная космическая",
    url: "https://t.me/addtheme/your_theme_1",
    preview: {
      header: "#0f1720",
      headerText: "#e6eef8",
      bg: "#07101a",
      incoming: "rgba(255,255,255,0.06)",
      outgoing: "#2f6bff",
      text: "#e6eef8"
    }
  },
  {
    name: "Светлая минималистичная",
    url: "https://t.me/addtheme/your_theme_2",
    preview: {
      header: "#f1f5f9",
      headerText: "#0b1220",
      bg: "#ffffff",
      incoming: "#f1f5f9",
      outgoing: "#2f6bff",
      text: "#0b1220"
    }
  },
  {
    name: "Синий океан",
    url: "https://t.me/addtheme/your_theme_3",
    preview: {
      header: "#05233a",
      headerText: "#eaf6ff",
      bg: "#06283e",
      incoming: "rgba(255,255,255,0.04)",
      outgoing: "#1e90ff",
      text: "#eaf6ff"
    }
  },
  {
    name: "Зеленый лес",
    url: "https://t.me/addtheme/your_theme_4",
    preview: {
      header: "#072016",
      headerText: "#e6f8ef",
      bg: "#062217",
      incoming: "rgba(255,255,255,0.04)",
      outgoing: "#2fbf6b",
      text: "#e6f8ef"
    }
  },
  {
    name: "Красный закат",
    url: "https://t.me/addtheme/your_theme_5",
    preview: {
      header: "#2a0b0b",
      headerText: "#ffeef0",
      bg: "#2a0b0b",
      incoming: "rgba(255,255,255,0.04)",
      outgoing: "#ff6b6b",
      text: "#ffeef0"
    }
  }
];

// ============================================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Инициализация приложения...');
  
  initTelegramWebApp();
  setupTaskHandlers();
  setupDoneButton();
  setupCloseButton();
  
  console.log('✅ Приложение готово');
});

// Инициализация Telegram Web App
function initTelegramWebApp() {
  try {
    if (window.Telegram && window.Telegram.WebApp) {
      tg = window.Telegram.WebApp;
      isTelegramWebApp = true;
      
      console.log(`📱 Telegram Web App v${tg.version} обнаружен`);
      
      // Инициализация
      tg.ready();
      
      // Расширяем на весь экран
      if (!tg.isExpanded && typeof tg.expand === 'function') {
        setTimeout(() => {
          tg.expand();
          console.log('✅ Web App расширен');
        }, 300);
      }
      
      return true;
    }
    
    console.log('📱 Запущено в браузере');
    return false;
    
  } catch (error) {
    console.error('❌ Ошибка инициализации:', error);
    return false;
  }
}

// ============================================
// ОБРАБОТКА ЗАДАЧ
// ============================================

function setupTaskHandlers() {
  // Задача 1: Поделиться с друзьями
  const task1 = document.getElementById('task1');
  if (task1) {
    task1.addEventListener('click', function() {
      console.log('📤 Задача 1: Поделиться с друзьями');
      
      if (isTelegramWebApp && typeof tg.shareMessage === 'function') {
        // Нативный метод Telegram 7.0+
        performNativeShare();
      } else {
        // Fallback для браузера
        performBrowserShare();
      }
      
      markTaskAsDone(task1);
      updateProgress();
    });
  }
  
  // Задача 2: Подписаться на канал
  const task2 = document.getElementById('task2');
  if (task2) {
    task2.addEventListener('click', function() {
      console.log('🤖 Задача 2: Подписаться на канал');
      
      // Открываем канал
      if (tg && tg.openLink) {
        tg.openLink(CHANNEL_URL);
      } else {
        window.open(CHANNEL_URL, '_blank');
      }
      
      markTaskAsDone(task2);
      updateProgress();
    });
  }
}

// Нативный шаринг в Telegram
function performNativeShare() {
  try {
    const shareText = `${SHARE_MSG}\n\n${PAGE_URL}`;
    
    if (tg && typeof tg.shareMessage === 'function') {
      tg.shareMessage({ text: shareText });
      showNotification('Открыт интерфейс отправки сообщений!');
      return true;
    }
  } catch (error) {
    console.error('❌ Ошибка при нативном шаринге:', error);
  }
  
  return performBrowserShare();
}

// Шаринг в браузере
function performBrowserShare() {
  const shareText = encodeURIComponent(SHARE_MSG);
  const shareUrl = encodeURIComponent(PAGE_URL);
  const telegramShareUrl = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
  
  window.open(telegramShareUrl, '_blank');
  showNotification('Открыта страница отправки в Telegram');
  return true;
}

// Отметка задачи как выполненной
function markTaskAsDone(taskElement) {
  if (taskElement) {
    const arrow = taskElement.querySelector('.arrow');
    if (arrow) {
      arrow.textContent = '✔️';
      arrow.classList.add('checked');
    }
    taskElement.style.opacity = '0.7';
    tasksCompleted++;
  }
}

// Обновление прогресса
function updateProgress() {
  const doneBtn = document.getElementById('doneBtn');
  if (doneBtn && tasksCompleted >= TOTAL_TASKS) {
    doneBtn.disabled = false;
    doneBtn.style.opacity = '1';
    doneBtn.style.cursor = 'pointer';
    showNotification('Все задачи выполнены! Нажмите "Готово"');
  }
}

// ============================================
// КНОПКА "ГОТОВО"
// ============================================

function setupDoneButton() {
  const doneBtn = document.getElementById('doneBtn');
  if (!doneBtn) return;
  
  doneBtn.addEventListener('click', function() {
    if (tasksCompleted < TOTAL_TASKS) {
      showNotification('Выполните все задачи сначала!', 'warning');
      return;
    }
    
    console.log('🎲 Открываем кейс с темой...');
    
    // Выбираем тему по времени (каждые 2 часа новая)
    const hours = Math.floor(Date.now() / (1000 * 60 * 60 * 2));
    const themeIndex = hours % themes.length;
    currentTheme = themes[themeIndex];
    
    console.log(`🎨 Выбрана тема: ${currentTheme.name}`);
    
    // Показываем лоадер
    showLoader();
    
    // Через 2 секунды показываем результат
    setTimeout(() => {
      hideLoader();
      showThemeResult();
      startFireworks();
    }, 2000);
  });
}

// Показать лоадер
function showLoader() {
  const loader = document.getElementById('loader');
  const tasks = document.querySelector('.tasks');
  const instructions = document.querySelector('.subtitle');
  const header = document.querySelector('.header');
  const doneBtn = document.getElementById('doneBtn');
  const warning = document.querySelector('.warning-banner');
  
  if (loader) loader.style.display = 'block';
  if (tasks) tasks.style.display = 'none';
  if (instructions) instructions.style.display = 'none';
  if (header) header.style.display = 'none';
  if (doneBtn) doneBtn.style.display = 'none';
  if (warning) warning.style.display = 'none';
  
  // Добавляем класс fullscreen
  loader.classList.add('fullscreen');
}

// Скрыть лоадер
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
    loader.classList.remove('fullscreen');
  }
}

// Показать результат
function showThemeResult() {
  const themeDisplay = document.querySelector('.theme-display');
  const overlay = document.querySelector('.overlay');
  const modal = document.querySelector('.modal');
  
  if (themeDisplay) {
    themeDisplay.style.display = 'block';
    
    // Устанавливаем название темы
    const themeTitle = document.getElementById('randomTheme');
    if (themeTitle && currentTheme) {
      themeTitle.textContent = `🎉 ${currentTheme.name}`;
    }
    
    // Устанавливаем сообщение
    const themeMsg = document.getElementById('themeMessage');
    if (themeMsg) {
      themeMsg.textContent = 'Темы обновляются каждые 2 часа';
    }
  }
  
  // Переходим в полноэкранный режим
  if (overlay) overlay.classList.add('fullscreen');
  if (modal) modal.classList.add('fullscreen');
  
  // Настраиваем кнопку установки темы
  const installBtn = document.getElementById('installBtn');
  if (installBtn && currentTheme) {
    installBtn.onclick = function() {
      console.log(`🔗 Установка темы: ${currentTheme.name}`);
      if (tg && tg.openLink) {
        tg.openLink(currentTheme.url);
      } else {
        window.open(currentTheme.url, '_blank');
      }
      showNotification('Тема открывается для установки...');
    };
  }
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

// Фейерверки
function startFireworks(duration = 3000) {
  const canvas = document.getElementById('fireworks');
  if (!canvas) return;
  
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

  // Первые взрывы
  createBurst(w*0.5, h*0.35);
  createBurst(w*0.7, h*0.45);
  animId = requestAnimationFrame(loop);

  // Останавливаем через duration
  setTimeout(() => {
    cancelAnimationFrame(animId);
    particles.length = 0;
    ctx.clearRect(0,0,w,h);
    canvas.style.display = 'none';
    window.removeEventListener('resize', resize);
  }, duration);
}

// Уведомления
function showNotification(message, type = 'info') {
  if (window.App && window.App.showNotification) {
    window.App.showNotification(message, type);
  } else {
    console.log(`📢 ${message}`);
  }
}

// Кнопка закрытия
function setupCloseButton() {
  const closeBtn = document.querySelector('.close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.close();
      } else if (window.history.length > 1) {
        window.history.back();
      } else {
        document.querySelector('.overlay').style.display = 'none';
      }
    });
  }
}
