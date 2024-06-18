import createElement from "./createElement.js";

window.onload = function () {
  var placeholders = document.querySelectorAll('.placeholder');
  for (var i = 0; i < placeholders.length; i++) {
    loadImage(placeholders[i]);
  }

  function loadImage(placeholder) {
    var small = placeholder.children[0];
    var img = new Image();
    img.src = small.src;
    img.onload = function () {
      small.classList.add('loaded');
    };

    var imgLarge = new Image();
    imgLarge.src = placeholder.dataset.large;
    imgLarge.className = placeholder.dataset.class;
    imgLarge.onload = function () {
      imgLarge.classList.add('loaded');
    };
    placeholder.appendChild(imgLarge);
  }
};

export default function createImgPreload(id, classNameContainer, classNameImg, imgSmall, imgLarge) {
    const container = document.querySelector('#'+id);
    container.className = `placeholder ${classNameContainer}`;
    container.dataset.large = imgLarge;
    container.dataset.class = classNameImg;

    const imageSmall = createElement('img', 'img-small', container);
    imageSmall.src = imgSmall;

    const div = createElement('div', '', container);
    div.style.paddingBottom = '50%';
}
