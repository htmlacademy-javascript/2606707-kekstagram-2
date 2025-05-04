// Базовые константы и массив
const PHOTO_COUNT = 25;
const photos = [];

// Конфигурационные объекты
const likesConfig = {
  min: 15,
  max: 200
};

const commentsConfig = {
  min: 0,
  max: 30
};

const avatarsConfig = {
  min: 1,
  max: 6
};

// Массивы данных
const names = [
  'Алиса',
  'Геннадий',
  'Жора',
  'Иришка',
  'Димитрий',
  'Мадлен',
  'Аристарх'
];

const messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const descriptions = [
  'Закат над морем — невероятная красота!',
  'Мой котик спит на солнышке.',
  'Друзья на пикнике, отличный день!'
];

// Вспомогательные функции
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

const getRandomArrayItem = (items) => items[randomNumber(0, items.length - 1)];

// Генерация случайного текста комментария (1 или 2 предложения)
const generateMessage = () => {
  const messageCount = randomNumber(1, 2);
  if (messageCount === 1) {
    return getRandomArrayItem(messages);
  }
  const firstMessage = getRandomArrayItem(messages);
  let secondMessage = getRandomArrayItem(messages);
  while (firstMessage === secondMessage) {
    secondMessage = getRandomArrayItem(messages);
  }
  return `${firstMessage} ${secondMessage}`;
};

// Генерация уникального ID для комментариев
const usedCommentIds = new Set();

const generateUniqueCommentId = () => {
  let id = randomNumber(1, 1000);
  while (usedCommentIds.has(id)) {
    id = randomNumber(1, 1000);
  }
  usedCommentIds.add(id);
  return id;
};

// Генерация одного комментария
const addComment = () => ({
  id: generateUniqueCommentId(),
  avatar: `img/avatar-${randomNumber(avatarsConfig.min, avatarsConfig.max)}.svg`,
  message: generateMessage(),
  name: getRandomArrayItem(names)
});

// Генерация массива комментариев
const addComments = () => {
  const comments = [];
  const commentCount = randomNumber(commentsConfig.min, commentsConfig.max);
  for (let i = 0; i < commentCount; i++) {
    comments.push(addComment());
  }
  return comments;
};

// Генерация одной фотографии
const addPhoto = (index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: getRandomArrayItem(descriptions),
  likes: randomNumber(likesConfig.min, likesConfig.max),
  comments: addComments()
});

// Функция для заполнения массива photos
const addPhotos = () => {
  for (let i = 0; i < PHOTO_COUNT; i++) {
    photos.push(addPhoto(i));
  }
};

// Запускаем генерацию
addPhotos();
