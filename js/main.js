import { renderThumbnails } from './render-thumbnails.js';
import { initUploadForm } from './photo-upload-form.js';
import { getData } from './api.js';
import { notification } from './notifications.js';
import { initFilters } from './filters.js';

let photos = [];

const onSuccess = (data) => {
  photos = data.slice();
  renderThumbnails(photos);
  document.querySelector('.img-filters')?.classList.remove('img-filters--inactive');
  initFilters(photos, renderThumbnails);
};

const onFail = () => {
  notification.dataError({ message: 'Ошибка загрузки фотографий.' });
};

getData()
  .then(onSuccess)
  .catch(onFail);

initUploadForm();
