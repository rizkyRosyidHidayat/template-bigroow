import createElement from './createElement.js';

function loadImage() {
  let placeholders = document.querySelectorAll('.placeholder');
  for (let i = 0; i < placeholders.length; i++) {
    loadImage(placeholders[i]);
  }

  function loadImage(placeholder) {
    let imgLarge = new Image();
    imgLarge.src = placeholder.dataset.large;
    imgLarge.className = placeholder.dataset.class;
    imgLarge.onload = function () {
      imgLarge.classList.add('loaded');
    };
    placeholder.appendChild(imgLarge);
  }
}

function createImgPreload(
  id,
  classNameContainer,
  classNameImg,
  img
) {
  const container = document.querySelector('#' + id);
  container.className = `placeholder ${classNameContainer}`;
  container.dataset.large = img;
  container.dataset.class = classNameImg;

  createElement('div', 'w-full h-full animate-pulse bg-gray-300', container);

  const div = createElement('div', '', container);
  div.style.paddingBottom = '50%';
}

export default {
  loadImage,
  createImgPreload,
};
