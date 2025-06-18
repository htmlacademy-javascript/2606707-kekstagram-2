import { isEscapeKey } from './utils.js';

const MILLISECONDS_PER_SECOND = 1000;
const DEFAULT_TIMEOUT = 5;

// Отображает уведомление
const showMessage = (templateSelector, config = {}) => {
  const template = document.querySelector(templateSelector);
  if (!template) {
    return;
  }
  const message = template.content.cloneNode(true).children[0];
  if (!message) {
    return;
  }
  if (config.message && templateSelector === '#data-error') {
    const titleElement = message.querySelector('.data-error__title');
    if (titleElement) {
      titleElement.textContent = config.message;
    }
  }
  document.body.appendChild(message);
  document.body.classList.add('notification-open');

  // Закрывает уведомление
  const close = () => {
    message?.remove();
    document.body.classList.remove('notification-open');
    document.removeEventListener('keydown', onKeydown);
  };

  // Обрабатывает нажатие клавиши
  function onKeydown(evt) {
    if (isEscapeKey(evt)) {
      close();
    }
  }

  document.addEventListener('keydown', onKeydown);
  message.addEventListener('click', (evt) => {
    if (evt.target === message || evt.target.matches(config.buttonSelector)) {
      close();
    }
  });
  setTimeout(() => {
    close();
  }, (config.timeout || DEFAULT_TIMEOUT) * MILLISECONDS_PER_SECOND);
  return message;
};

// Объект с методами для разных типов уведомлений
const notification = {
  dataError: (config = {}) => {
    showMessage('#data-error', { ...config, buttonSelector: '.data-error__title' });
  },
  error: (config = {}) => {
    showMessage('#error', { ...config, buttonSelector: '.error__button' });
  },
  success: (config = {}) => {
    showMessage('#success', { ...config, buttonSelector: '.success__button' });
  },
};

export { notification };
