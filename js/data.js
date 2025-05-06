import { getRandomInteger, getRandomArrayItem, createCustomLengthArray } from './utils.js';

// Базовые константы
const PHOTO_COUNT = 25;

// Конфигурационные объекты
const LikesConfig = {
  MIN: 15,
  MAX: 200
};

const CommentsConfig = {
  MIN: 0,
  MAX: 30
};

const CommentIdsConfig = {
  MIN: 1,
  MAX: 200
};

const AvatarsConfig = {
  MIN: 1,
  MAX: 6
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
  'Друзья на пикнике, отличный день!',
  'Солнечное утро в горах',
  'Прекрасный завтрак с видом на море',
  'Мой день рождения!',
  'На пляже с друзьями',
  'Горный пейзаж'
];

// Генерация случайного текста комментария (1 или 2 предложения)
const generateMessage = () => {
  const messageCount = getRandomInteger(1, 2);
  if (messageCount === 1) {
    return getRandomArrayItem(messages);
  }
  const firstMessage = getRandomArrayItem(messages);
  let secondMessage = getRandomArrayItem(messages);
  while (firstMessage === secondMessage) {
    secondMessage = getRandomArrayItem(messages);
  }
  return `${firstMessage}\n${secondMessage}`;
};

// Генерация одного комментария
const createComment = () => ({
  id: getRandomInteger(CommentIdsConfig.MIN, CommentIdsConfig.MAX),
  avatar: `img/avatar-${getRandomInteger(AvatarsConfig.MIN, AvatarsConfig.MAX)}.svg`,
  message: generateMessage(),
  name: getRandomArrayItem(names)
});

// Генерация объекта фотографии
const createPhoto = (index) => ({
  id: index,
  url: `photos/${index}.jpg`,
  description: getRandomArrayItem(descriptions),
  likes: getRandomInteger(LikesConfig.MIN, LikesConfig.MAX),
  comments: createCustomLengthArray(
    getRandomInteger(CommentsConfig.MIN, CommentsConfig.MAX),
    createComment
  )
});

// Функция для заполнения массива photos
const addPhotos = (photos) => {
  createCustomLengthArray(PHOTO_COUNT, (index) => photos.push(createPhoto(index)));
};

// Экспортируем функцию addPhotos
export { addPhotos };
