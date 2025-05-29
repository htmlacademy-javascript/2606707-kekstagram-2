import { toggleClass, isEscapeKey } from './utils.js';

const MAX_DESCRIPTION_LENGTH = 140;
const MAX_HASHTAGS_COUNT = 5;

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
const hashtagsInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');
const submitButton = document.querySelector('.img-upload__submit');

const scaleSmaller = uploadForm.querySelector('.scale__control--smaller');
const scaleBigger = uploadForm.querySelector('.scale__control--bigger');
const scaleValue = uploadForm.querySelector('.scale__control--value');
const previewImage = uploadForm.querySelector('.img-upload__preview img');

const effectLevelContainer = uploadForm.querySelector('.img-upload__effect-level');
const effectLevelSlider = uploadForm.querySelector('.effect-level__slider');
const effectLevelValue = uploadForm.querySelector('.effect-level__value');
const effectsList = uploadForm.querySelector('.effects__list');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'span',
  errorTextClass: 'form-error'
});

// Применение эффекта
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
    effectLevelValue.value = value;
  }
};

// Сброс эффекта
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

// Инициализация слайдера noUiSlider
const initSlider = () => {
  if (effectLevelSlider) {
    noUiSlider.create(effectLevelSlider, {
      range: {
        min: 0,
        max: 100 },
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

// Управление масштабом
const updateScale = (scale) => {
  scaleValue.value = `${scale}%`;
  previewImage.style.transform = `scale(${scale / 100})`;
};

const onScaleChange = (direction) => {
  let currentScale = parseInt(scaleValue.value, 10) || SCALE_DEFAULT;
  if (direction === 'smaller') {
    currentScale = Math.max(currentScale - SCALE_STEP, ScaleValue.MIN);
  } else if (direction === 'bigger') {
    currentScale = Math.min(currentScale + SCALE_STEP, ScaleValue.MAX);
  }
  updateScale(currentScale);
};

// Валидация описания
const validateDescription = (value) => value.length <= MAX_DESCRIPTION_LENGTH;

const getDescriptionErrorMessage = () => `Длина описания не должна превышать ${MAX_DESCRIPTION_LENGTH} символов`;

pristine.addValidator(descriptionInput, validateDescription, getDescriptionErrorMessage);

// Валидация хэштегов
const parseHashtags = (value) => value.toLowerCase().trim().split(/\s+/);

let errorMessage = '';

const error = () => errorMessage;

const hashtagsHandler = (value) => {
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
      check: (item) => !/^#[a-zа-яё0-9]{1,19}$/i.test(item),
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

pristine.addValidator(hashtagsInput, hashtagsHandler, error, 2, false);

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
    submitButton.disabled = true;
    updateScale(SCALE_DEFAULT);
    resetEffect();
    effectLevelContainer.style.display = 'none';
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
    updateScale(SCALE_DEFAULT);
    initSlider();
    resetEffect();
    effectLevelContainer.style.display = 'none';
  }
};

// Управление состоянием кнопки отправки
const onHashtagInput = () => {
  submitButton.disabled = !pristine.validate();
};

const onDescriptionInput = () => {
  submitButton.disabled = !pristine.validate();
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
  effectsList.addEventListener('change', (evt) => {
    if (evt.target.matches('.effects__radio')) {
      resetEffect();
    }
  });
  uploadInput.addEventListener('change', () => {
    if (uploadInput.files.length > 0) {
      openUploadForm();
    }
  });
  hashtagsInput.addEventListener('input', onHashtagInput);
  descriptionInput.addEventListener('input', onDescriptionInput);
  closeButton.addEventListener('click', () => {
    closeUploadForm();
    document.removeEventListener('keydown', onUploadFormEscKeyDown);
  });
  uploadForm.addEventListener('submit', onUploadFormSubmit);
};

initUploadForm();

scaleSmaller.addEventListener('click', () => onScaleChange('smaller'));
scaleBigger.addEventListener('click', () => onScaleChange('bigger'));

export { initUploadForm };
