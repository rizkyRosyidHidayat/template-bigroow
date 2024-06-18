import data from './data.json' with { type: 'json' };
import copywriting from '../template-001/copywriting.json' with { type: 'json' };
import createProductList from './function/createProductList.js';
import createElement from '../createElement.js';
import createImgPreload from '../createImagePreload.js';

gsap.registerPlugin(ScrollTrigger);

const params = new URLSearchParams(window.location.search);
const category = params.get('category');

const state = {
  startData: 0,
  endData: 3,
  showData: 3,
  dataProduct: data,
  isLoading: false
};

if (category)
  state.dataProduct = data.filter(product => product.category.toLocaleLowerCase() === category.toLocaleLowerCase());


const setTextContent = (id, text, type) => {
  const el = document.querySelector(`#${id}`);
  if (type === 'img') el.src = text;
  else el.textContent = text;
};

setTextContent('title', copywriting.title);
setTextContent('description', copywriting.description);
createImgPreload('hero-banner-mobile', 'block md:hidden', 'w-full h-[273px] object-center object-cover mb-4', copywriting.heroBanner.small, copywriting.heroBanner.large);
createImgPreload('hero-banner-desktop', 'h-[425px]', 'object-center object-cover w-full', copywriting.heroBanner.small, copywriting.heroBanner.large);
setTextContent('category-text', copywriting.categoryText);
createImgPreload('banner', 'h-[191px] md:h-[394px]', 'object-center object-cover w-full', copywriting.banner.small, copywriting.banner.large);

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
      if (istextRight) gsap.to(textItem, { x: listWidth - textWidth, delay: .3 })
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
  ...new Set(data.map((product) => product.category)),
];
generateCategoryList(listDataCategory);

window.addEventListener('resize', () => generateCategoryList(listDataCategory));

const productListEl = document.querySelector('#product-list');
createProductList(state.dataProduct.slice(state.startData, state.endData), productListEl);

const loader = document.querySelector('#loader');

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !state.isLoading) {
      state.isLoading = true;
      state.startData = state.startData + state.showData;
      state.endData = state.endData + state.showData;
      const isLoadMore = state.startData <= data.length;
      if (isLoadMore) loader.classList.remove('hidden');
      setTimeout(() => {
        if (isLoadMore) {
          const addNewData = state.dataProduct.slice(state.startData, state.endData);
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
    rootMargin: "10% 0px 10% 0px",
  }
);

observer.observe(productListEl);
