const grid = document.getElementById('question-grid');
const menuScreen = document.getElementById('menu-screen');
const questionScreen = document.getElementById('question-screen');
const backButton = document.getElementById('back-button');
const statusArea = document.getElementById('status-area');

const questionTitle = document.getElementById('question-title');
const questionText = document.getElementById('question-text');
const questionSubtext = document.getElementById('question-subtext');
const mediaContainer = document.getElementById('media-container');
const answersContainer = document.getElementById('answers');
const factSection = document.getElementById('fact');
const factText = document.getElementById('fact-text');
const template = document.getElementById('answer-button-template');

let questions = [];
let activeQuestionIndex = null;
let audioCtx;

function playBeep() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const duration = 0.15;
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 740;
    gain.gain.value = 0.2;
    oscillator.connect(gain).connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.warn('Audio beep unavailable', err);
  }
}

async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    if (!response.ok) throw new Error('Не удалось загрузить вопросы');
    questions = await response.json();
    buildGrid();
    statusArea.textContent = `Загружено вопросов: ${questions.length}`;
  } catch (err) {
    console.error(err);
    statusArea.textContent = 'Ошибка загрузки данных. Проверьте questions.json';
  }
}

function buildGrid() {
  grid.innerHTML = '';
  const count = 100;
  for (let i = 0; i < count; i += 1) {
    const button = document.createElement('button');
    const label = i + 1;
    button.textContent = label.toString();
    button.type = 'button';
    button.setAttribute('role', 'listitem');
    button.addEventListener('click', () => openQuestion(label - 1));
    grid.appendChild(button);
  }
}

function openQuestion(index) {
  const data = questions[index];
  activeQuestionIndex = index;
  if (!data) {
    questionTitle.textContent = 'Нет данных';
    questionText.textContent = 'Добавьте вопрос в файл questions.json';
    questionSubtext.textContent = '';
    mediaContainer.innerHTML = '';
    renderAnswers([]);
    factSection.hidden = true;
  } else {
    questionTitle.textContent = data.title || 'Планета Земля';
    questionText.textContent = data.question;
    questionSubtext.textContent = data.prompt || '';
    renderMedia(data);
    renderAnswers(data.answers, data.correctIndex);
    factText.textContent = data.fact || '';
    factSection.hidden = true;
  }

  menuScreen.hidden = true;
  questionScreen.hidden = false;
  menuScreen.classList.remove('active');
  questionScreen.classList.add('active');
  statusArea.textContent = `Вопрос ${index + 1} из ${questions.length}`;
}

function renderMedia(data) {
  mediaContainer.innerHTML = '';

  const type = data.mediaType;
  const src = data.mediaSrc;

  if (!type || type === 'none' || !src) {
    const placeholder = document.createElement('div');
    placeholder.className = 'media-placeholder';
    placeholder.textContent = 'Медиа-плейсхолдер — добавьте изображение или аудио.';
    mediaContainer.appendChild(placeholder);
    return;
  }

  if (type === 'image') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = data.question || 'Изображение вопроса';
    mediaContainer.appendChild(img);
  } else if (type === 'audio') {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = src;
    audio.preload = 'metadata';
    mediaContainer.appendChild(audio);
  }
}

function renderAnswers(answers = [], correctIndex = 0) {
  answersContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();

  answers.forEach((answer, idx) => {
    const btn = template.content.firstElementChild.cloneNode(true);
    btn.textContent = answer;
    btn.dataset.index = idx;
    btn.addEventListener('click', () => handleAnswer(btn, idx === correctIndex));
    fragment.appendChild(btn);
  });

  answersContainer.appendChild(fragment);
}

function handleAnswer(button, isCorrect) {
  const buttons = Array.from(answersContainer.querySelectorAll('button'));
  if (button.disabled) return;

  if (isCorrect) {
    button.classList.add('correct');
    factSection.hidden = false;
    playBeep();
    buttons.forEach((btn) => {
      btn.disabled = true;
      if (btn !== button && !btn.classList.contains('correct')) {
        btn.classList.add('muted');
      }
    });
    statusArea.textContent = 'Верно! Прочитайте, почему это интересно.';
  } else {
    button.classList.add('incorrect');
    button.disabled = true;
    statusArea.textContent = 'Неверно, попробуйте снова.';
  }
}

function returnToMenu() {
  questionScreen.hidden = true;
  questionScreen.classList.remove('active');
  menuScreen.hidden = false;
  menuScreen.classList.add('active');
  statusArea.textContent = 'Выберите вопрос из списка.';
  factSection.hidden = true;
  activeQuestionIndex = null;
}

backButton.addEventListener('click', returnToMenu);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && questionScreen.classList.contains('active')) {
    returnToMenu();
  }
});

loadQuestions();
