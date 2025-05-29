
import { addPhotos } from './data.js';
import { renderThumbnails } from './render-thumbnails.js';
import { initUploadForm } from './photo-upload-form.js';


// Глобальный массив photos
const photos = [];

// Заполняем массив photos
addPhotos(photos);

// Передаём заполненный массив в renderThumbnails
renderThumbnails(photos);

// Инициализируем форму загрузки
initUploadForm();
