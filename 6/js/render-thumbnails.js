
const thumbnailsContainer = document.querySelector('.pictures');
const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');

const thumbnailsFragment = document.createDocumentFragment();

const renderThumbnail = (thumbnail) => {
  const thumbnailElement = thumbnailTemplate.cloneNode(true);

  thumbnailElement.querySelector('.picture__img').src = thumbnail.url;
  thumbnailElement.querySelector('.picture__img').alt = thumbnail.description;
  thumbnailElement.querySelector('.picture__likes').textContent = thumbnail.likes;
  thumbnailElement.querySelector('.picture__comments').textContent = thumbnail.comments.length;

  return thumbnailElement;
};

const renderThumbnails = (thumbnails) => {
  thumbnails?.forEach((thumbnail) => {
    thumbnailsFragment.appendChild(renderThumbnail(thumbnail));
  });
  thumbnailsContainer.appendChild(thumbnailsFragment);
};

export { renderThumbnails };
