import createProductList from './function/createProductList.js';
import createElement from '../createElement.js';
import image from '../createImagePreload.js';

const params = new URLSearchParams(window.location.search);
const category = params.get('category');

const state = {
  startData: 0,
  endData: 3,
  showData: 3,
  dataProduct: [],
  isLoading: false,
  copywriting: {},
};
const baseUrl = 'https://rizkyrosyidhidayat.github.io/template-bigroow/js/template-001';
await fetch(baseUrl + '/data.json')
  .then((response) => response.json())
  .then((json) => (state.dataProduct = json));
await fetch(baseUrl + '/copywriting.json')
  .then((response) => response.json())
  .then((json) => (state.copywriting = json));

if (category)
  state.dataProduct = data.filter(
    (product) =>
      product.category.toLocaleLowerCase() === category.toLocaleLowerCase()
  );

const setTextContent = (id, text) => {
  const el = document.querySelector(`#${id}`);
  el.textContent = text;
};

setTextContent('title', state.copywriting.title);
setTextContent('description', state.copywriting.description);
image.createImgPreload(
  'hero-banner-mobile',
  'block md:hidden',
  'w-full h-[273px] object-center object-cover mb-4',
  state.copywriting.heroBanner
);
image.createImgPreload(
  'hero-banner-desktop',
  'h-[425px]',
  'object-center object-cover w-full',
  state.copywriting.heroBanner
);
setTextContent('category-text', state.copywriting.categoryText);
image.createImgPreload(
  'banner',
  'h-[191px] md:h-[394px]',
  'object-center object-cover w-full',
  state.copywriting.banner
);

image.loadImage();

function generateCategoryList(listData) {
  const listContainer = createElement('ul', 'divide-y divide-gray-400');
  listData.forEach((category, index) => {
    const listItem = createElement(
      'li',
      'overflow-hidden relative w-full',
      listContainer
    );
    listItem.addEventListener('click', () => {
      if (category !== 'all product') {
        window.location.href = '/template-001/search.html?category=' + category;
      } else {
        window.location.href = '/template-001/search.html';
      }
    });

    const textItem = createElement(
      'h1',
      `uppercase font-black text-[32px] md:text-[64px] text-gray-400 py-6 cursor-pointer leading-none inline-block`,
      listItem
    );
    textItem.textContent = category;

    setTimeout(() => {
      const istextRight = !((index + 1) % 2);
      const listWidth = listItem.offsetWidth;
      const textWidth = textItem.offsetWidth;
      if (istextRight) gsap.set(textItem, { x: listWidth - textWidth });
      const textCentered = gsap.to(textItem, {
        ease: 'power1',
        duration: 0.3,
        x: listWidth / 2 - textWidth / 2,
        onComplete: () => textItem.classList.add('text-primary'),
        onReverseComplete: () => textItem.classList.remove('text-primary'),
      });
      textCentered.paused(true);
      listItem.addEventListener('mouseenter', () => textCentered.play());
      listItem.addEventListener('mouseleave', () => textCentered.reverse());
    }, 0);
  });

  const categoriesEl = document.querySelector('#categories');
  categoriesEl.replaceChildren(listContainer);
}

const listDataCategory = [
  'all product',
  ...new Set(state.dataProduct.map((product) => product.category)),
];
generateCategoryList(listDataCategory);

const productListEl = document.querySelector('#product-list');
createProductList(
  state.dataProduct.slice(state.startData, state.endData),
  productListEl
);

const loader = document.querySelector('#loader');

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !state.isLoading) {
      state.isLoading = true;
      state.startData = state.startData + state.showData;
      state.endData = state.endData + state.showData;
      const isLoadMore = state.startData <= state.dataProduct.length;
      if (isLoadMore) loader.classList.remove('hidden');
      setTimeout(() => {
        if (isLoadMore) {
          const addNewData = state.dataProduct.slice(
            state.startData,
            state.endData
          );
          createProductList(addNewData, productListEl, observer);
          loader.classList.add('hidden');
          state.isLoading = false;
        }
      }, 1000);
    }
  },
  {
    root: null,
    threshold: 1.0,
    rootMargin: '100px 0px 100px 0px',
  }
);

observer.observe(productListEl);
