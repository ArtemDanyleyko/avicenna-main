import { galleryItems } from './images.js';

const galleryContainer = document.querySelector(".gallery__list");

const galleryMarkup = createGalleryMarkup(galleryItems);

galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);

function createGalleryMarkup(items) {
  const markup = items.map(({ preview, original, description }) => {
    return `
    
    <a class="gallery-image__full" href="${original}">
    <img class="gallery-image__preview" src="${preview}" alt="${description}" />
  </a> `
  });
 
  return markup.join('');

  
}

function installSimpleLightbox() {
  let lightbox  = new SimpleLightbox('.gallery__list .gallery-image__full', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  }

  installSimpleLightbox();