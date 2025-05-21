import {isEscapeKey, toggleClass} from './utils.js';

const COMMENTS_PER_PAGE = 5;

const fullPhoto = document.querySelector('.big-picture');
const fullPhotoImage = fullPhoto.querySelector('.big-picture__img img');
const fullPhotoCaption = fullPhoto.querySelector('.social__caption');
const fullPhotoLikesCount = fullPhoto.querySelector('.likes-count');
const socialComment = fullPhoto.querySelector('.social__comment');
const loadButton = fullPhoto.querySelector('.comments-loader');
const closeButton = fullPhoto.querySelector('.big-picture__cancel');
const fullPhotoCommentsCount = fullPhoto.querySelector('.social__comment-count');
const commentFragment = document.createDocumentFragment();

let currentComments = [];
let visibleComments = COMMENTS_PER_PAGE;

//Переключает видимость большой картинки
const toggleModal = () => {
  toggleClass(fullPhoto, 'hidden');
  toggleClass(document.body, 'modal-open');
};

//Создает один комментарий
const renderComment = (comment) => {
  const newComment = socialComment.cloneNode(true);
  const avatar = newComment.querySelector('.social__picture');
  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  newComment.querySelector('.social__text').textContent = comment.message;
  newComment.classList.remove('hidden');
  return newComment;
};

//Отрисовывает комментарии внутри большой картинки
const renderComments = () => {
  const commentsContainer = fullPhoto.querySelector('.social__comments');
  commentsContainer.innerHTML = '';
  fullPhotoCommentsCount.innerHTML = '';

  // Ограничивает количество отображаемых комментариев
  visibleComments = Math.min(visibleComments, currentComments.length);
  for (let i = 0; i < visibleComments; i++) {
    commentFragment.appendChild(renderComment(currentComments[i]));
  }

  // Обновляет счётчик
  fullPhotoCommentsCount.innerHTML = `${visibleComments} из <span class="comments-count">${currentComments.length}</span> комментариев`;
  commentsContainer.appendChild(commentFragment);

  // Управляет видимостью кнопки "Загрузить ещё"
  if (currentComments.length <= COMMENTS_PER_PAGE || visibleComments >= currentComments.length) {
    loadButton.classList.add('hidden');
  } else {
    loadButton.classList.remove('hidden');
  }
};

//Меняет данные большой картинки
const show = (photoData) => {
  const { url, likes, description } = photoData;
  fullPhotoImage.src = url;
  fullPhotoLikesCount.textContent = likes;
  fullPhotoCaption.textContent = description;
};

const onLoadButtonClick = () => {
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
  toggleModal();
}

const onCloseButtonClick = () => {
  closeFullPhoto();
};

//Открывает большую картинку
const openFullPhoto = (photoData) => {
  currentComments = photoData.comments.slice();
  visibleComments = COMMENTS_PER_PAGE;
  show(photoData);
  renderComments();
  fullPhotoCommentsCount.classList.remove('hidden');
  document.addEventListener('keydown', onFullPhotoEscKeyDown);
  toggleModal();
};

closeButton.addEventListener('click', onCloseButtonClick);
loadButton.addEventListener('click', onLoadButtonClick);

export { openFullPhoto};
