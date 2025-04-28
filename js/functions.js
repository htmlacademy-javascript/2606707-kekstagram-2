//Проверить длину строки
const checkStringLength = (string, maxLength)=>string.length <= maxLength;

checkStringLength('Красивая природ', 140);
checkStringLength('Очень длинное описание...', 20);

//Проверить строку на палиндром
const isPalindrome = (string) => {
  const normalizedString = string.replaceAll(' ', '').toLowerCase();
  let reversedString = '';
  for (let i = normalizedString.length - 1; i >= 0; i--) {
    reversedString += normalizedString[i];
  }
  return normalizedString === reversedString;
};

isPalindrome('топот');
isPalindrome('ДовОд');
isPalindrome('Кекс');
