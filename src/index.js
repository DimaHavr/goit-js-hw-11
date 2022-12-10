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
  picturesApiService.clearPage();
  onClearMarkupContainer();
  getPictures(e);
});

loadMoreBtn.addEventListener('click', loadMorePictures);

function getPictures(e) {
  e.preventDefault();
  picturesApiService.query = e.currentTarget.searchQuery.value;
  searchPictures();
  picturesApiService.clearPage();
}

async function loadMorePictures() {
  try {
    const pictures = await picturesApiService.fetchImage();

    if (pictures.hits.length !== 0) {
      renderMarkupGallery(pictures.hits);
      loadMoreBtn.classList.remove('is-hidden');
    }

    if (pictures.hits.length < 40) {
      loadMoreBtn.classList.add('is-hidden');
      galleryTextEl.classList.remove('is-hidden');
      renderMarkupGallery(pictures.hits);

      Notify.success(`Hooray! We found ${pictures.totalHits} images.`);
      return;
    }
  } catch (error) {
    console.dir(error);
  }
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
      Notify.success(`Hooray! We found ${pictures.totalHits} images.`);
      renderMarkupGallery(pictures.hits);
      return;
    }
    if (pictures.hits.length !== 0) {
      renderMarkupGallery(pictures.hits);
      loadMoreBtn.classList.remove('is-hidden');
      galleryTextEl.classList.add('is-hidden');

      Notify.success(`Hooray! We found ${pictures.totalHits} images.`);
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
