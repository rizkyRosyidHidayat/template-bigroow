import createProductList from './function/createProductList.js';
import image from '../createImagePreload.js';
import helper from '../helper.js';

const params = new URLSearchParams(window.location.search);
const category = params.get('category');
const search = params.get('search');

const state = {
  startData: 0,
  endData: 3,
  showData: 3,
  dataProduct: [],
  isLoading: false,
  copywriting: {},
  searchValue: '',
  selectedCategory: 'all product',
};
const baseUrl = 'https://rizkyrosyidhidayat.github.io/template-bigroow/js/template-001';
state.copywriting = await helper.getData(baseUrl + '/copywriting.json');
state.dataProduct = await helper.getData(baseUrl + '/data.json');

function handleSearchCategory(data) {
  return data.filter(
    (product) =>
      product.category.toLocaleLowerCase() === category.toLocaleLowerCase()
  );
}

function handleSearchText(data) {
  return data.filter((product) =>
    product.name
      .replaceAll('-', ' ')
      .toLowerCase()
      .split(' ')
      .includes(search.toLowerCase())
  );
}

if (category && !search)
  state.dataProduct = handleSearchCategory(state.dataProduct);
if (search && !category)
  state.dataProduct = handleSearchText(state.dataProduct);
if (search && category)
  state.dataProduct = handleSearchCategory(handleSearchText(state.dataProduct));

const searchBar = document.querySelector('#search');
const searchBtn = document.querySelector('#search-btn');
if (search) searchBar.value = search;
searchBar.addEventListener('input', (el) => {
  state.searchValue = el.target.value;
});

searchBtn.addEventListener('click', (el) => {
  const originalUrl = window.location.href;
  const newParams = { category, search: state.searchValue || null };

  const updatedUrl = helper.updateUrlParams(originalUrl, newParams);
  window.location.href = updatedUrl;
});

helper.setTextContent('title', state.copywriting.title);
helper.setTextContent('description', state.copywriting.description);
image.createImgPreload(
  'hero-banner-mobile',
  'block md:hidden w-full h-[273px] mb-4',
  state.copywriting.heroBanner,
);
image.createImgPreload(
  'hero-banner-desktop',
  'h-[425px] w-full',
  state.copywriting.heroBanner
);
helper.setTextContent('category-text', state.copywriting.categoryText);

image.loadImage();

function generateCategoryList(listData) {
  const listContainer = helper.createElement('ul', 'divide-y divide-gray-400');
  listData.forEach((categoryName, index) => {
    const listItem = helper.createElement(
      'li',
      'overflow-hidden relative w-full',
      listContainer
    );
    listItem.addEventListener('click', () => {
      const originalUrl = window.location.href;
      const newParams = {
        category: categoryName !== 'all product' ? categoryName : null,
        search: null,
      };

      const updatedUrl = helper.updateUrlParams(originalUrl, newParams);
      window.location.href = updatedUrl;
    });

    const textItem = helper.createElement(
      'h1',
      `uppercase font-black text-[32px] md:text-[64px] text-gray-400 py-8 cursor-pointer leading-none inline-block`,
      listItem
    );
    textItem.textContent = categoryName;

    setTimeout(() => {
      const istextRight = !((index + 1) % 2);
      const listWidth = listItem.offsetWidth;
      const textWidth = textItem.offsetWidth;
      if (istextRight) gsap.set(textItem, { x: listWidth - textWidth });
      if (
        categoryName === category ||
        (!category && categoryName === 'all product')
      ) {
        gsap.set(textItem, {
          ease: 'power1',
          duration: 0.3,
          x: listWidth / 2 - textWidth / 2,
          onComplete: () => textItem.classList.add('text-primary'),
        });
      } else {
        gsap.to(textItem, {
          ease: 'power1',
          duration: 0.3,
          x: listWidth / 2 - textWidth / 2,
          scrollTrigger: {
            trigger: textItem,
            toggleActions: 'play reverse play reverse',
            start: 'top center',
            end: 'bottom center',
          },
          onComplete: () => textItem.classList.add('text-primary'),
          onReverseComplete: () => textItem.classList.remove('text-primary'),
        });
      }
    }, 0);
  });

  const categoriesEl = document.querySelector('#categories');
  categoriesEl.replaceChildren(listContainer);

  setTimeout(() => {
    if (category || search) {
      gsap.to(window, {
        scrollTo: categoriesEl.offsetTop,
      });
    }
  }, 0);
}
const dataProductCategory = await helper.getData(baseUrl + '/data.json');
const listDataCategory = [
  'all product',
  ...new Set(dataProductCategory.map((product) => product.category)),
];
generateCategoryList(listDataCategory);

const productListEl = document.querySelector('#product-list');
const notfoundBar = document.querySelector('#not-found');
notfoundBar.classList.add('hidden');
if (state.dataProduct.length)
  createProductList(
    state.dataProduct.slice(state.startData, state.endData),
    productListEl
  );
else notfoundBar.classList.remove('hidden');

const searchNav = document.querySelector('#search-nav');
searchNav.addEventListener('click', () => {
  gsap.to(window, { scrollTo: searchBar.offsetTop - 48 });
});

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
    rootMargin: '200px 0px 200px 0px',
  }
);

observer.observe(productListEl);
