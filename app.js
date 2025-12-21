const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
if (tg && tg.expand) tg.expand();

// Считываем ID подготовленного сообщения из URL
const urlParams = new URLSearchParams(window.location.search);
const preparedIdFromUrl = urlParams.get('message_id');

const channelUrl = "https://t.me/+7tUrZjQhP-4wMGZi";

const themes = [
  { name: "1 тема", url: "https://t.me/addtheme/K5q9kYcFSAeFO3PI" },
  { name: "2 тема", url: "https://t.me/addtheme/W2iF6QpKuv1yVYnT" },
  { name: "3 тема", url: "https://t.me/bg/lr3hGi3U-UqyDAAArcRJk5yooy0" },
  { name: "4 тема", url: "https://t.me/bg/9zHDI1iEuEoREAAASrlWw2E4vNk" },
  { name: "5 тема", url: "https://t.me/bg/xwN9xVivsEq5DQAAFft1SLmXAaU" }
];

let completedTasks = 0;
const totalTasks = 2;

const tasks = document.querySelectorAll('.task');
tasks.forEach(task => {
  task.addEventListener('click', () => {
    const type = task.dataset.task;
    const arrow = task.querySelector('.arrow');
    
    if (arrow.classList.contains('checked')) return;

    if (type === 'share') {
      // ПРОВЕРКА: Если есть ID и версия ТГ поддерживает shareMessage
      if (tg?.isVersionAtLeast?.('7.8') && preparedIdFromUrl) {
        tg.shareMessage(preparedIdFromUrl);
      } else {
        // Запасной вариант (обычный текст), если ID нет
        const text = "Зацени крутые темы для Telegram в этом боте!";
        if (navigator.share) navigator.share({ text });
        else alert("Пожалуйста, поделитесь ссылкой на бота с друзьями!");
      }
    } else if (type === 'subscribe') {
      if (tg) tg.openTelegramLink(channelUrl);
      else window.open(channelUrl, '_blank');
    }

    // Имитация зачета задания
    setTimeout(() => {
      arrow.textContent = '✔';
      arrow.classList.add('checked');
      completedTasks++;
      if (completedTasks === totalTasks) {
        document.getElementById('doneBtn').disabled = false;
      }
    }, 2000);
  });
});

// Кнопка Готово и финал
document.getElementById("doneBtn").addEventListener("click", () => {
  if (completedTasks < totalTasks) return;

  const selected = themes[Math.floor(Math.random() * themes.length)];

  document.querySelectorAll('.header, .tasks, #instructions, #doneBtn').forEach(el => el.style.display = 'none');
  const loader = document.getElementById('loader');
  loader.style.display = 'flex';

  setTimeout(() => {
    loader.style.display = 'none';
    document.getElementById("randomTheme").textContent = "Ваша тема готова!";
    document.querySelector(".theme-display").style.display = "block";
    
    document.getElementById("installBtn").onclick = () => {
      if (tg) tg.openLink(selected.url);
      else window.open(selected.url, "_blank");
    };
    startFireworks(3000);
  }, 2000);
});

// Функция фейерверка (упрощенная)
function startFireworks(duration) {
  const canvas = document.getElementById('fireworks');
  if (!canvas) return;
  canvas.style.display = 'block';
  setTimeout(() => canvas.style.display = 'none', duration);
}
