// ============================================
// Telegram Themes App - Полностью рабочий код
// ============================================

// Глобальные переменные
let tg = null;
let isTelegramWebApp = false;
let currentTheme = null;

// Константы
const SHARE_MSG = `🙈 Хочешь получить бесплатные подарки?\n\nПолучай каждые 24 часа в бесплатной рулетке!`;
const PAGE_URL = 'https://mechac.github.io/sykhoi/index.html';
const CHANNEL_URL = 'https://t.me/+7tUrZjQhP-4wMGZi';

// Список тем
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

// ============================================
// ИНИЦИАЛИЗАЦИЯ TELEGRAM WEB APP
// ============================================

function initTelegramWebApp() {
  console.log('🚀 Инициализация Telegram Web App...');
  
  try {
    if (window.Telegram && window.Telegram.WebApp) {
      tg = window.Telegram.WebApp;
      isTelegramWebApp = true;
      
      // Проверяем версию
      console.log(`✅ Telegram Web App v${tg.version} обнаружен`);
      console.log(`📱 Платформа: ${tg.platform}`);
      console.log(`🔧 Поддержка shareMessage: ${typeof tg.shareMessage === 'function' ? 'ДА' : 'НЕТ'}`);
      
      // Инициализация Web App
      tg.ready();
      
      // Расширяем на весь экран
      if (!tg.isExpanded && typeof tg.expand === 'function') {
        setTimeout(() => {
          tg.expand();
          console.log('📱 Web App расширен');
        }, 300);
      }
      
      // Обновляем информацию о версии
      updateVersionInfo();
      
      return true;
    } else {
      console.log('⚠️ Telegram Web App не найден, используем fallback режим');
      createFallbackTelegram();
      return false;
    }
  } catch (error) {
    console.error('❌ Ошибка инициализации Telegram Web App:', error);
    createFallbackTelegram();
    return false;
  }
}

function createFallbackTelegram() {
  tg = {
    version: '0.0',
    platform: 'browser',
    isExpanded: true,
    ready: function() { console.log('Fallback Web App ready'); },
    expand: function() { 
      console.log('Fallback Web App expanded');
      document.body.classList.add('webapp-expanded');
    },
    openLink: function(url) { 
      window.open(url, '_blank'); 
    },
    shareMessage: function(params) {
      // Fallback для шаринга
      const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(PAGE_URL)}&text=${encodeURIComponent(SHARE_MSG)}`;
      window.open(telegramShareUrl, '_blank');
      return true;
    },
    close: function() {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        document.querySelector('.overlay').style.display = 'none';
      }
    }
  };
}

function updateVersionInfo() {
  const versionInfo = document.querySelector('.version-info');
  if (versionInfo && tg) {
    const hasShare = typeof tg.shareMessage === 'function';
    versionInfo.innerHTML = `Telegram Web App v${tg.version} | shareMessage: ${hasShare ? '✓' : '✗'}`;
    versionInfo.style.color = hasShare ? '#2fbf6b' : '#ff595a';
  }
}

// ============================================
// ОБРАБОТКА ЗАДАЧ
// ============================================

function setupTaskHandlers() {
  const task1 = document.getElementById('task1');
  const task2 = document.getElementById('task2');
  const progress1 = document.getElementById('progress1');
  const progress2 = document.getElementById('progress2');
  
  // Задача 1: Отправить друзьям
  if (task1) {
    task1.addEventListener('click', function() {
      console.log('🔄 Выполнение задачи 1: Отправить друзьям');
      
      // Проверяем поддержку shareMessage
      if (isTelegramWebApp && typeof tg.shareMessage === 'function') {
        // Нативный метод Telegram 7.0+
        performNativeShare();
      } else {
        // Fallback метод
        showSharePopup();
      }
      
      // Отмечаем задачу как выполненную
      markTaskAsDone(task1, progress1);
      updateProgress();
    });
  }
  
  // Задача 2: Подписаться на канал
  if (task2) {
    task2.addEventListener('click', function() {
      console.log('🔄 Выполнение задачи 2: Подписаться на канал');
      
      // Открываем канал
      if (tg && tg.openLink) {
        tg.openLink(CHANNEL_URL);
      } else {
        window.open(CHANNEL_URL, '_blank');
      }
      
      // Отмечаем задачу как выполненную
      markTaskAsDone(task2, progress2);
      updateProgress();
    });
  }
}

function markTaskAsDone(taskElement, progressElement) {
  if (taskElement && taskElement.querySelector('.arrow')) {
    taskElement.querySelector('.arrow').textContent = '✔️';
    taskElement.querySelector('.arrow').style.color = '#2fbf6b';
    taskElement.style.opacity = '0.7';
  }
  
  if (progressElement) {
    progressElement.classList.remove('active');
    progressElement.classList.add('completed');
  }
  
  // Увеличиваем счетчик выполненных задач
  window.App.tasksCompleted = (window.App.tasksCompleted || 0) + 1;
}

function updateProgress() {
  const completed = window.App.tasksCompleted || 0;
  const total = window.App.totalTasks || 2;
  
  console.log(`📊 Прогресс: ${completed}/${total} задач выполнено`);
  
  // Активируем кнопку "Готово" если выполнены все задачи
  const doneBtn = document.getElementById('doneBtn');
  if (doneBtn && completed >= total) {
    doneBtn.disabled = false;
    doneBtn.style.opacity = '1';
    doneBtn.style.cursor = 'pointer';
    console.log('✅ Кнопка "Готово" активирована');
  }
}

// ============================================
ШАРИНГ СООБЩЕНИЙ
// ============================================

function performNativeShare() {
  console.log('📤 Использование нативного shareMessage API');
  
  try {
    const shareText = `${SHARE_MSG}\n\n${PAGE_URL}`;
    
    if (tg && typeof tg.shareMessage === 'function') {
      tg.shareMessage({ text: shareText });
      showNotification('Открыт нативный интерфейс Telegram!', 'success');
      console.log('✅ Нативный shareMessage вызван успешно');
      return true;
    } else {
      console.warn('⚠️ tg.shareMessage не доступен, используем fallback');
      showSharePopup();
      return false;
    }
  } catch (error) {
    console.error('❌ Ошибка при нативном шаринге:', error);
    showSharePopup();
    return false;
  }
}

function showSharePopup() {
  console.log('🔄 Показ fallback попапа для шаринга');
  
  const sharePopup = document.getElementById('sharePopup');
  if (sharePopup) {
    sharePopup.style.display = 'flex';
  }
  
  // Обновляем глобальную функцию
  window.App.performNativeShare = function() {
    if (tg && typeof tg.shareMessage === 'function') {
      performNativeShare();
    } else {
      const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(PAGE_URL)}&text=${encodeURIComponent(SHARE_MSG)}`;
      window.open(telegramShareUrl, '_blank');
      showNotification('Открыта страница шаринга Telegram', 'info');
    }
    sharePopup.style.display = 'none';
  };
}

// ============================================
// ОБРАБОТКА КНОПКИ "ГОТОВО"
// ============================================

function setupDoneButton() {
  const doneBtn = document.getElementById('doneBtn');
  
  if (!doneBtn) return;
  
  // Изначально деактивируем кнопку
  doneBtn.disabled = true;
  doneBtn.style.opacity = '0.5';
  doneBtn.style.cursor = 'not-allowed';
  
  doneBtn.addEventListener('click', function() {
    // Проверяем, выполнены ли все задачи
    if ((window.App.tasksCompleted || 0) < (window.App.totalTasks || 2)) {
      showNotification('Выполните все задачи сначала!', 'warning');
      return;
    }
    
    console.log('🎲 Открываем кейс...');
    
    // Выбираем случайную тему
    const themeIndex = Math.floor(Math.random() * themes.length);
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

function showLoader() {
  const loader = document.getElementById('loader');
  const tasks = document.querySelector('.tasks');
  const instructions = document.getElementById('instructions');
  const header = document.querySelector('.header');
  const doneBtn = document.getElementById('doneBtn');
  
  if (loader) loader.style.display = 'block';
  if (tasks) tasks.style.display = 'none';
  if (instructions) instructions.style.display = 'none';
  if (header) header.style.display = 'none';
  if (doneBtn) doneBtn.style.display = 'none';
}

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
}

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
  }
  
  // Переходим в полноэкранный режим
  if (overlay) overlay.classList.add('fullscreen');
  if (modal) modal.classList.add('fullscreen');
  
  // Настраиваем кнопку установки темы
  const installBtn = document.getElementById('installBtn');
  if (installBtn && currentTheme) {
    installBtn.onclick = function() {
      console.log(`🔗 Установка темы: ${currentTheme.url}`);
      if (tg && tg.openLink) {
        tg.openLink(currentTheme.url);
      } else {
        window.open(currentTheme.url, '_blank');
      }
    };
  }
}

// ============================================
// ФЕЙЕРВЕРКИ
// ============================================

function startFireworks(duration = 3000) {
  const canvas = document.getElementById('fireworks');
  if (!canvas) return;
  
  console.log('🎆 Запускаем фейерверки...');
  
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

  function
