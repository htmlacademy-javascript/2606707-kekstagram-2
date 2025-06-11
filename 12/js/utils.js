// Проверка, является ли нажатая клавиша Escape
const isEscapeKey = (evt) => evt.key === 'Escape';

// Переключение класса у элемента
const toggleClass = (element, className) => {
  element.classList.toggle(className);
};

const debounce = (callback, timeoutDelay) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export {isEscapeKey, toggleClass, debounce};
