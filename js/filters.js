
import { applyDebounce } from './utils.js';

const MAX_RANDOM_COUNT = 10;
const RENDER_DELAY = 500;

const FilterNames = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed'
};

const filterFunctions = {
  showDefault: (photos) => photos.slice(),
  showRandom: (photos) => {
    const shuffled = photos.slice();
    const results = [];
    while (results.length < Math.min(MAX_RANDOM_COUNT, shuffled.length)) {
      const index = Math.floor(Math.random() * shuffled.length);
      results.push(shuffled.splice(index, 1)[0]);
    }
    return results;
  },
  showDiscussed: (photos) => photos.slice().sort((a, b) => b.comments.length - a.comments.length)
};

const filtersSectionElement = document.querySelector('.img-filters');
const filtersContainerElement = filtersSectionElement.querySelector('.img-filters__form');
let activeFilterElement = filtersContainerElement.querySelector('.img-filters__button--active');

let posts = [];

// Очищает отрисованные миниатюры
const clearThumbnails = () => {
  document.querySelectorAll('.picture').forEach((el) => el.remove());
};

// Применяет выбранный фильтр и отрисовывает фотографии
const useFilter = (filterName, renderThumbnailsFunction) => {
  let sortFunction = filterFunctions.showDefault;

  switch (filterName) {
    case FilterNames.RANDOM:
      sortFunction = filterFunctions.showRandom;
      break;
    case FilterNames.DISCUSSED:
      sortFunction = filterFunctions.showDiscussed;
      break;
  }

  clearThumbnails();
  renderThumbnailsFunction(sortFunction(posts));
};

// Обрабатывает клик по кнопкам фильтров
const handleFiltersContainerClick = (evt, renderThumbnailsFunction) => {
  const targetFilterElement = evt.target.closest('.img-filters__button');

  if (targetFilterElement && targetFilterElement !== activeFilterElement) {
    activeFilterElement.classList.remove('img-filters__button--active');
    targetFilterElement.classList.add('img-filters__button--active');
    activeFilterElement = targetFilterElement;

    useFilter(targetFilterElement.id, renderThumbnailsFunction);
  }
};

// Инициализирует фильтры и установливает обработчики
const initializeFilters = (data, renderThumbnailsFunction) => {
  posts = data;
  const renderThumbnailsDebounced = applyDebounce(renderThumbnailsFunction, RENDER_DELAY);
  filtersContainerElement.addEventListener('click', (evt) => handleFiltersContainerClick (evt, renderThumbnailsDebounced));
  renderThumbnailsFunction(data);
};

export { initializeFilters };
