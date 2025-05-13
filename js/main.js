
import { addPhotos } from './data.js';
import { renderThumbnails } from './render-thumbnails.js';

// Глобальный массив photos
const photos = [];

// Заполняем массив photos
addPhotos(photos);

// Передаём заполненный массив в renderThumbnails
renderThumbnails(photos);
