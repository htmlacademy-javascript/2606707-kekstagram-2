// Проверка, является ли нажатая клавиша Escape
const isEscapeKey = (evt) => evt.key === 'Escape';

// Переключение класса у элемента
const toggleClass = (element, className) => {
  element.classList.toggle(className);
};

export {isEscapeKey, toggleClass };
