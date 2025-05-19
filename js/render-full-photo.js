import {isEscapeKey, toggleClass} from './utils.js';

const fullPhoto = document.querySelector('.big-picture');
const fullPhotoImage = fullPhoto.querySelector('.big-picture__img img');
const fullPhotoCaption = fullPhoto.querySelector('.social__caption');
const fullPhotoLikesCount = fullPhoto.querySelector('.likes-count');
const socialComment = fullPhoto.querySelector('.social__comment');
const loadButton = fullPhoto.querySelector('.comments-loader');
const closeButton = fullPhoto.querySelector('.big-picture__cancel');
const commentFragment = document.createDocumentFragment();

let currentComments = [];

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
  return newComment;
};

//Отрисовывает комментарии внутри большой картинки
const renderComments = () => {
  const commentsContainer = fullPhoto.querySelector('.social__comments');
  const commentsCountElement = fullPhoto.querySelector('.social__comment-count');
  commentsContainer.innerHTML = '';
  commentsCountElement.innerHTML = '';

  currentComments.forEach((comment) => {
    commentFragment.appendChild(renderComment(comment));
  });

  commentsCountElement.innerHTML = `${currentComments.length} из <span class="comments-count">${currentComments.length}</span> комментариев`;
  commentsContainer.appendChild(commentFragment);
};

//Меняет данные большой картинки
const show = (photoData) => {
  const { url, likes, description } = photoData;
  fullPhotoImage.src = url;
  fullPhotoLikesCount.textContent = likes;
  fullPhotoCaption.textContent = description;
};

function onFullPhotoEscKeyDown(evt) {
  if (isEscapeKey(evt)) {
    closeFullPhoto();
  }
}

function closeFullPhoto() {
  document.removeEventListener('keydown', onFullPhotoEscKeyDown);
  toggleModal();
}

const onCloseButtonClick = () => {
  closeFullPhoto();
};

//Открывает большую картинку
const openFullPhoto = (photoData) => {
  currentComments = photoData.comments.slice();
  show(photoData);
  renderComments();
  socialComment.classList.add('hidden');
  loadButton.classList.add('hidden');
  closeButton.addEventListener('click', onCloseButtonClick);
  toggleModal();
};

export { openFullPhoto};
