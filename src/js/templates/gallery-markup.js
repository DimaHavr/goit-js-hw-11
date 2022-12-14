const createGalleryMarkup = pictures => {
  const {
    downloads,
    comments,
    views,
    likes,
    tags,
    largeImageURL,
    webformatURL,
  } = pictures;
  return `
   <li class='photo-card'>
    <a href=${largeImageURL}>
   <img class='gallery-img' src=${webformatURL} alt=${tags} loading='lazy' />
    </a>
    <div class='info'>
      <p class='info-item'>
        <b>Likes</b>
        ${likes}
      </p>
      <p class='info-item'>
        <b>Views</b>
        ${views}
      </p>
      <p class='info-item'>
        <b>Comments</b>
        ${comments}
      </p>
      <p class='info-item'>
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </li>`;
};
export { createGalleryMarkup };
