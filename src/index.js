import './sass/index.scss';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PicturesApiService } from './js/get-pictures-api';
import { createMarkup } from './js/templates/gallery-markup';

const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const galleryTextEl = document.querySelector('.gallery-text-item');
const loadMoreBtn = document.querySelector('.load-more');

const picturesApiService = new PicturesApiService();

searchForm.addEventListener('submit', e => {
  loadMoreBtn.classList.remove('is-hidden');
  picturesApiService.clearPage();

  onClearMarkupContainer();
  getPictures(e);
});

loadMoreBtn.addEventListener('click', searchPictures);

function getPictures(e) {
  e.preventDefault();
  picturesApiService.query = e.currentTarget.searchQuery.value;
  searchPictures();
  picturesApiService.clearPage();
}

async function searchPictures() {
  loadMoreBtn.classList.add('is-hidden');

  try {
    const pictures = await picturesApiService.fetchImage();

    if (pictures.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (pictures.hits.length < 40) {
      loadMoreBtn.classList.add('is-hidden');
      galleryTextEl.classList.remove('is-hidden');
      Notify.success(`Hooray! We found ${pictures.totalHits} images.`);
      renderMarkupGallery(pictures.hits);
      return;
    }
    if (pictures.hits.length !== 0) {
      Notify.success(`Hooray! We found ${pictures.totalHits} images.`);
      renderMarkupGallery(pictures.hits);
      loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    console.dir(error);
  }
}

function renderMarkupGallery(pictures) {
  const renderMarkupPictures = pictures.map(createMarkup).join('');
  galleryContainer.insertAdjacentHTML('beforeend', renderMarkupPictures);
  onSimpleLightbox();
}

function onClearMarkupContainer() {
  galleryContainer.innerHTML = '';
}

function onSimpleLightbox() {
  let gallery = new SimpleLightbox('.gallery a');
  gallery.refresh();
}
