import helper from './helper.js';

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
      imgLarge.classList.add('object-cover');
      imgLarge.classList.add('object-center');
    };
    placeholder.appendChild(imgLarge);
  }
}

function createImgPreload(
  id,
  classNameContainer,
  img,
  classNameImg,
) {
  const container = document.querySelector('#' + id);
  container.className = `placeholder ${classNameContainer}`;
  container.dataset.large = img;
  if (!!classNameImg) container.dataset.class = classNameImg;

  helper.createElement('div', 'w-full h-full animate-pulse', container);

  const div = helper.createElement('div', '', container);
  div.style.paddingBottom = '50%';
}

export default {
  loadImage,
  createImgPreload,
};
