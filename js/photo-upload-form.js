import { toggleClass, isEscapeKey } from './utils.js';
import { sendData } from './api.js';
import { notification } from './notifications.js';

const MAX_DESCRIPTION_LENGTH = 140;
const MAX_HASHTAGS_COUNT = 5;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

const SCALE_STEP = 25;
const SCALE_DEFAULT = 100;
const EFFECT_DEFAULT_LEVEL = 100;

const HashtagLengthLimits = {
  MIN: 2,
  MAX: 20
};

const ScaleValue = {
  MIN: 25,
  MAX: 100
};

const effects = [
  {
    name: 'none',
    options: {
      range: {
        min: 0,
        max: 100
      },
      start: 100,
      step: 1
    },
    setFilter: () => 'none'
  },
  {
    name: 'chrome',
    options: {
      range: {
        min: 0,
        max: 1
      },
      start: 1,
      step: 0.1
    },
    setFilter: (value) => `grayscale(${value})`
  },
  {
    name: 'sepia',
    options: {
      range: {
        min: 0,
        max: 1
      },
      start: 1,
      step: 0.1
    },
    setFilter: (value) => `sepia(${value})`
  },
  {
    name: 'marvin',
    options: {
      range: {
        min: 0,
        max: 100
      },
      start: 100,
      step: 1
    },
    setFilter: (value) => `invert(${value}%)`
  },
  {
    name: 'phobos',
    options: {
      range: {
        min: 0,
        max: 3
      },
      start: 3,
      step: 0.1
    },
    setFilter: (value) => `blur(${value}px)`
  },
  {
    name: 'heat',
    options: {
      range: {
        min: 1,
        max: 3
      },
      start: 3,
      step: 0.1
    },
    setFilter: (value) => `brightness(${value})`
  }
];

const uploadForm = document.querySelector('.img-upload__form');
const uploadInput = uploadForm.querySelector('.img-upload__input');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const closeButton = uploadForm.querySelector('.img-upload__cancel');
const hashtagsInput = uploadForm.querySelector('.text__hashtags');
const descriptionInput = uploadForm.querySelector('.text__description');
const submitButton = uploadForm.querySelector('.img-upload__submit');

const scaleSmaller = uploadForm.querySelector('.scale__control--smaller');
const scaleBigger = uploadForm.querySelector('.scale__control--bigger');
const scaleValue = uploadForm.querySelector('.scale__control--value');
const previewImage = uploadForm.querySelector('.img-upload__preview img');

const effectLevelContainer = uploadForm.querySelector('.img-upload__effect-level');
const effectLevelSlider = uploadForm.querySelector('.effect-level__slider');
const effectLevelValue = uploadForm.querySelector('.effect-level__value');
const effectsList = uploadForm.querySelector('.effects__list');
const effectsPreviewElements = uploadForm.querySelectorAll('.effects__preview');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'span',
  errorTextClass: 'form-error'
});

// Применяет эффект к изображению
const applyEffect = () => {
  const selectedEffectName = effectsList.querySelector('.effects__radio:checked').value;
  const effect = effects.find((eff) => eff.name === selectedEffectName);
  if (selectedEffectName === 'none') {
    previewImage.style.filter = effect.setFilter();
    effectLevelContainer.style.display = 'none';
    effectLevelValue.value = '';
  } else {
    const value = effectLevelSlider.noUiSlider.get();
    previewImage.style.filter = effect.setFilter(value);
    effectLevelContainer.style.display = 'block';
    effectLevelValue.value = parseFloat(value) % 1 === 0 ? parseInt(value, 10) : parseFloat(value).toFixed(1);
  }
};

// Сбрасывает настройки эффекта
const resetEffect = () => {
  const selectedEffectName = effectsList.querySelector('.effects__radio:checked').value;
  const effect = effects.find((eff) => eff.name === selectedEffectName);
  if (effectLevelSlider && effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.updateOptions({
      range: effect.options.range,
      start: effect.options.start,
      step: effect.options.step
    });
    applyEffect();
  }
};

// Инициализирует слайдер эффектов
const initializeSlider = () => {
  if (effectLevelSlider && !effectLevelSlider.noUiSlider) {
    noUiSlider.create(effectLevelSlider, {
      range: {
        min: 0,
        max: 100
      },
      start: EFFECT_DEFAULT_LEVEL,
      step: 1,
      connect: 'lower'
    });

    effectLevelSlider.noUiSlider.on('update', () => {
      const value = effectLevelSlider.noUiSlider.get();
      effectLevelValue.value = value;
      applyEffect();
    });
  }
};

// Обновляет масштаб изображения
const updateScale = (scale) => {
  scaleValue.value = `${scale}%`;
  previewImage.style.transform = `scale(${scale / 100})`;
};

// Изменяет масштаб изображения
const handleScaleChange = (direction) => {
  let currentScale = parseInt(scaleValue.value, 10) || SCALE_DEFAULT;
  if (direction === 'smaller') {
    currentScale = Math.max(currentScale - SCALE_STEP, ScaleValue.MIN);
  } else if (direction === 'bigger') {
    currentScale = Math.min(currentScale + SCALE_STEP, ScaleValue.MAX);
  }
  updateScale(currentScale);
};

const validateDescription = (value) => value.length <= MAX_DESCRIPTION_LENGTH;

const getDescriptionErrorMessage = () => `Длина описания не должна превышать ${MAX_DESCRIPTION_LENGTH} символов`;

pristine.addValidator(descriptionInput, validateDescription, getDescriptionErrorMessage);

const parseHashtags = (value) => value.toLowerCase().trim().split(/\s+/);

let errorMessage = '';

const getErrorMessage = () => errorMessage;

const handleHashtags = (value) => {
  errorMessage = '';
  if (!value || value.trim() === '') {
    return true;
  }

  const hashtags = parseHashtags(value);

  const rules = [
    {
      check: (item) => item.indexOf('#', 1) > 0,
      error: 'Хэш-теги разделяются пробелами'
    },
    {
      check: (item) => item[0] !== '#',
      error: 'Хэш-тег должен начинаться с #'
    },
    {
      check: (item, index, arr) => arr.indexOf(item, index + 1) !== -1,
      error: 'Хэш-теги не должны повторяться'
    },
    {
      check: (item) => item.length > HashtagLengthLimits.MAX || item.length < HashtagLengthLimits.MIN,
      error: `Хэш-тег должен быть длиной от ${HashtagLengthLimits.MIN} до ${HashtagLengthLimits.MAX} символов`
    },
    {
      check: (item) => !HASHTAG_REGEX.test(item),
      error: 'Хэш-тег содержит недопустимые символы'
    },
    {
      check: () => hashtags.length > MAX_HASHTAGS_COUNT,
      error: `Максимум ${MAX_HASHTAGS_COUNT} хэш-тегов`
    }
  ];

  return hashtags.every((hashtag, index, arr) =>
    rules.every((rule) => {
      const isInvalid = rule.check(hashtag, index, arr);
      if (isInvalid) {
        errorMessage = rule.error;
      }
      return !isInvalid;
    })
  );
};

pristine.addValidator(hashtagsInput, handleHashtags, getErrorMessage, 2, false);

// Переключает видимость формы загрузки
const toggleUploadForm = () => {
  toggleClass(uploadOverlay, 'hidden');
  toggleClass(document.body, 'modal-open');
};

// Закрывает форму загрузки
const closeUploadForm = () => {
  if (!uploadOverlay.classList.contains('hidden')) {
    toggleUploadForm();
    uploadForm.reset();
    pristine.reset();
    submitButton.disabled = true;
    uploadInput.value = '';
    previewImage.src = 'img/upload-default-image.jpg';
    updateScale(SCALE_DEFAULT);
    resetEffect();
    effectLevelContainer.style.display = 'none';
  }
};

// Обрабатывает нажатие клавиши Escape
const handleUploadFormEscKeyDown = (evt) => {
  evt.stopPropagation();
  if (
    isEscapeKey(evt) &&
    document.activeElement !== hashtagsInput &&
    document.activeElement !== descriptionInput &&
    !document.querySelector('.error')
  ) {
    closeUploadForm();
    document.removeEventListener('keydown', handleUploadFormEscKeyDown);
  }
};

// Открывает форму загрузки
const openUploadForm = () => {
  if (uploadOverlay.classList.contains('hidden')) {
    toggleUploadForm();
    document.addEventListener('keydown', handleUploadFormEscKeyDown);
    updateScale(SCALE_DEFAULT);
    resetEffect();
    effectLevelContainer.style.display = 'none';
    pristine.reset();
    submitButton.disabled = false;
  }
};

// Проверяет валидность хэштегов при вводе
const handleHashtagInput = () => {
  submitButton.disabled = !pristine.validate();
};

// Проверяет валидность описания при вводе
const handleDescriptionInput = () => {
  submitButton.disabled = !pristine.validate();
};

// Обрабатывает отправку формы
const handleUploadFormSubmit = (evt) => {
  evt.preventDefault();
  if (pristine.validate()) {
    submitButton.disabled = true;
    sendData(new FormData(uploadForm))
      .then(() => {
        notification.success();
        closeUploadForm();
      })
      .catch(() => {
        notification.error();
      })
      .finally(() => {
        submitButton.disabled = false;
      });
  }
};

// Инициализирует форму загрузки
const initializeUploadForm = () => {
  effectsList.addEventListener('change', (evt) => {
    if (evt.target.matches('.effects__radio')) {
      resetEffect();
    }
  });
  uploadInput.addEventListener('change', () => {
    if (uploadInput.files.length > 0) {
      const file = uploadInput.files[0];
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.split('.').pop();
      if (!FILE_TYPES.includes(fileExtension)) {
        notification.error('Недопустимый формат файла. Используйте JPG, JPEG или PNG.');
        uploadInput.value = '';
        return;
      }
      const url = URL.createObjectURL(file);
      previewImage.src = url;
      effectsPreviewElements.forEach((preview) => {
        preview.style.backgroundImage = `url(${url})`;
      });
      openUploadForm();
    }
  });
  hashtagsInput.addEventListener('input', handleHashtagInput);
  descriptionInput.addEventListener('input', handleDescriptionInput);
  closeButton.addEventListener('click', () => {
    closeUploadForm();
    document.removeEventListener('keydown', handleUploadFormEscKeyDown);
  });
  uploadForm.addEventListener('submit', handleUploadFormSubmit);
};

scaleSmaller.addEventListener('click', () => handleScaleChange('smaller'));
scaleBigger.addEventListener('click', () => handleScaleChange('bigger'));

export { initializeUploadForm, initializeSlider };
