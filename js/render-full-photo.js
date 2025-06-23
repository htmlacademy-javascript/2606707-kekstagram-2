import { isEscapeKey, toggleClass } from './utils.js';

const COMMENTS_PER_PAGE = 5;

const fullPhoto = document.querySelector('.big-picture');
const fullPhotoImage = fullPhoto.querySelector('.big-picture__img img');
const fullPhotoCaption = fullPhoto.querySelector('.social__caption');
const fullPhotoLikesCount = fullPhoto.querySelector('.likes-count');
const socialCommentShownCount = fullPhoto.querySelector('.social__comment-shown-count'); // Новый селектор
const socialCommentTotalCount = fullPhoto.querySelector('.social__comment-total-count'); // Новый селектор
const loadButton = fullPhoto.querySelector('.comments-loader');
const closeButton = fullPhoto.querySelector('.big-picture__cancel');
const commentsContainer = fullPhoto.querySelector('.social__comments');
const commentFragment = document.createDocumentFragment();

let currentComments = [];
let visibleComments = COMMENTS_PER_PAGE;

// Переключает видимость большой картинки
const toggleModal = () => {
  toggleClass(fullPhoto, 'hidden');
  toggleClass(document.body, 'modal-open');
};

// Создает один комментарий
const renderComment = ({ avatar, name, message }) => {
  const newComment = document.createElement('li');
  newComment.classList.add('social__comment');

  const avatarImg = document.createElement('img');
  avatarImg.classList.add('social__picture');
  avatarImg.src = avatar;
  avatarImg.alt = name;
  avatarImg.width = 35;
  avatarImg.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = message;

  newComment.appendChild(avatarImg);
  newComment.appendChild(text);

  return newComment;
};

// Отрисовывает комментарии
const renderComments = () => {
  while (commentsContainer.firstChild) {
    commentsContainer.removeChild(commentsContainer.firstChild); // Очищаем контейнер
  }

  visibleComments = Math.min(visibleComments, currentComments.length);

  // Рендерит комментарии
  for (let i = 0; i < visibleComments; i++) {
    commentFragment.appendChild(renderComment(currentComments[i]));
  }
  commentsContainer.appendChild(commentFragment);

  // Обновляет счётчики
  socialCommentShownCount.textContent = String(visibleComments);
  socialCommentTotalCount.textContent = String(currentComments.length);

  // Управляет видимостью кнопки "Загрузить ещё"
  loadButton.classList.toggle('hidden', visibleComments >= currentComments.length);
};

// Меняет данные большой картинки
const show = ({ url, likes, description }) => {
  fullPhotoImage.src = url;
  fullPhotoImage.alt = description || '';
  fullPhotoLikesCount.textContent = String(likes);
  fullPhotoCaption.textContent = description || '';
};

const handleLoadButtonClick = () => {
  visibleComments += COMMENTS_PER_PAGE;
  renderComments();
};

function onFullPhotoEscKeyDown(evt) {
  if (isEscapeKey(evt)) {
    closeFullPhoto();
  }
}

function closeFullPhoto() {
  document.removeEventListener('keydown', onFullPhotoEscKeyDown);
  visibleComments = COMMENTS_PER_PAGE;
  currentComments = [];
  toggleModal();
}

const handleCloseButtonClick = () => {
  closeFullPhoto();
};

// Открывает большую картинку
const openFullPhoto = (photoData) => {
  currentComments = Array.isArray(photoData.comments) ? photoData.comments.slice() : [];
  visibleComments = COMMENTS_PER_PAGE;
  show(photoData);
  renderComments();
  document.addEventListener('keydown', onFullPhotoEscKeyDown);
  toggleModal();
};

closeButton.addEventListener('click', handleCloseButtonClick);
loadButton.addEventListener('click', handleLoadButtonClick);

export { openFullPhoto };
