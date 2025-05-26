import { toggleClass, isEscapeKey } from './utils.js';

const MAX_DESCRIPTION_LENGTH = 140;
const MAX_HASHTAGS_COUNT = 5;

const HashtagLengthLimits = {
  MIN: 2,
  MAX: 20
};

const uploadForm = document.querySelector('.img-upload__form');
const uploadInput = uploadForm.querySelector('.img-upload__input');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const closeButton = uploadForm.querySelector('.img-upload__cancel');
const hashtagsInput = uploadForm.querySelector('.text__hashtags');
const descriptionInput = uploadForm.querySelector('.text__description');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper',
});

// Валидация описания
const validateDescription = (value) => value.length <= MAX_DESCRIPTION_LENGTH;

const getDescriptionErrorMessage = () => `Длина описания не должна превышать ${MAX_DESCRIPTION_LENGTH} символов`;

pristine.addValidator(descriptionInput, validateDescription, getDescriptionErrorMessage);

// Валидация хэштегов
const parseHashtags = (value) => value.toLowerCase().trim().split(/\s+/);

const validateHashtags = (value) => {
  if (!value) {
    return true;
  }

  const hashtags = parseHashtags(value);
  const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

  // Проверка количества хэштегов
  if (hashtags.length > MAX_HASHTAGS_COUNT) {
    return false;
  }

  // Проверка уникальности хэштегов
  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size !== hashtags.length) {
    return false;
  }

  // Проверка формата каждого хэштега
  return hashtags.every((hashtag) => hashtag !== '#' && hashtagRegex.test(hashtag));
};

const getHashtagsErrorMessage = () => {
  const hashtags = parseHashtags(hashtagsInput.value);

  if (hashtags.length > MAX_HASHTAGS_COUNT) {
    return `Нельзя указывать больше ${MAX_HASHTAGS_COUNT} хэштегов`;
  }
  if (new Set(hashtags).size !== hashtags.length) {
    return 'Один и тот же хэштег не может быть использован дважды';
  }
  if (hashtags.some((hashtag) => hashtag === '#')) {
    return 'Хэштег не может состоять только из решётки';
  }
  return `Хэштег должен начинаться с #, содержать только буквы и цифры, длина от ${HashtagLengthLimits.MIN} до ${HashtagLengthLimits.MAX} символов`;
};

pristine.addValidator(hashtagsInput, validateHashtags, getHashtagsErrorMessage);

// Переключение видимости формы
const toggleUploadForm = () => {
  toggleClass(uploadOverlay, 'hidden');
  toggleClass(document.body, 'modal-open');
};

// Закрытие формы
const closeUploadForm = () => {
  if (!uploadOverlay.classList.contains('hidden')) {
    toggleUploadForm();
    uploadForm.reset();
    pristine.reset();
  }
};

// Обработчик клавиши Escape
const onUploadFormEscKeyDown = (evt) => {
  if (isEscapeKey(evt) && document.activeElement !== hashtagsInput && document.activeElement !== descriptionInput) {
    closeUploadForm();
    document.removeEventListener('keydown', onUploadFormEscKeyDown);
  }
};

// Открытие формы
const openUploadForm = () => {
  if (uploadOverlay.classList.contains('hidden')) {
    toggleUploadForm();
    document.addEventListener('keydown', onUploadFormEscKeyDown);
  }
};

// Обработчик отправки формы
const onUploadFormSubmit = (evt) => {
  evt.preventDefault();
  if (pristine.validate()) {
    uploadForm.submit();
  }
};

// Инициализация формы
const initUploadForm = () => {
  uploadInput.addEventListener('change', () => {
    if (uploadInput.files.length > 0) {
      openUploadForm();
    }
  });

  closeButton.addEventListener('click', () => {
    closeUploadForm();
    document.removeEventListener('keydown', onUploadFormEscKeyDown);
  });

  uploadForm.addEventListener('submit', onUploadFormSubmit);
};

export { initUploadForm };
