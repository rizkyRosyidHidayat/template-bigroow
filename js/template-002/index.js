import image from '../createImagePreload.js';
import helper from '../helper.js';
import createProductList from './createProductList.js';

const state = {
  copywriting: {},
  startData: 0,
  endData: 2,
  showData: 2,
  dataProduct: [],
  lineListProduct: 1,
  isLoading: false,
  searchValue: '',
  selectedCategory: 'all product',
};

const params = new URLSearchParams(window.location.search);
const category = params.get('category');
const search = params.get('search');

const baseUrl =
  'https://rizkyrosyidhidayat.github.io/template-bigroow/js/template-002';
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

helper.setTextContent('title', state.copywriting.title);
helper.setTextContent('description', state.copywriting.description);
helper.setTextContent('card-info-title', state.copywriting.cardInfo.title);
helper.setTextContent(
  'card-info-description',
  state.copywriting.cardInfo.description
);

const cardInfoEl = document.querySelector('#card-info');
image.createImgPreload(
  'banner-image',
  'hidden md:block mt-12 w-[552px] max-w-full h-[311px]',
  state.copywriting.heroBanner,
  'rounded-[24px]'
);
image.createImgPreload(
  'banner-image-mobile',
  'block md:hidden mt-4 w-full h-[265px]',
  state.copywriting.heroBanner,
  'rounded-[12px]'
);

image.createImgPreload(
  'banner-image-small',
  'hidden md:block w-[266px] h-[282px] rounded-[24px] shrink-0',
  state.copywriting.heroBannerSmall,
  'rounded-[12px]'
);
image.createImgPreload(
  'banner-image-small-mobile',
  `w-full h-[${cardInfoEl.clientHeight}px]`,
  state.copywriting.heroBannerSmall,
  'rounded-[12px]'
);

image.loadImage();

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

const searchNav = document.querySelector('#search-nav');
searchNav.addEventListener('click', () => {
  gsap.to(window, { scrollTo: searchBar.offsetTop - 48 });
});

function createCategoryList(data) {
  const categoryWrapper = document.querySelector('#category-list');
  const list = helper.createElement(
    'ul',
    'flex justify-center flex-wrap items-center gap-6 md:gap-12 font-title',
    categoryWrapper
  );
  data.forEach((categoryName) => {
    const item = document.createElement('li');
    if (
      categoryName === category ||
      (!category && categoryName === 'all product')
    )
      item.className =
        'text-primary font-bold text-3xl md:text-[48px] capitalize cursor-pointer';
    else
      item.className =
        'text-gray-400 font-bold text-xl md:text-[36px] capitalize cursor-pointer hover:text-[48px] hover:text-primary duration-200';
    item.textContent = categoryName;
    item.addEventListener('click', () => {
      const originalUrl = window.location.href;
      const newParams = {
        category: categoryName !== 'all product' ? categoryName : null,
        search: null,
      };

      const updatedUrl = helper.updateUrlParams(originalUrl, newParams);
      window.location.href = updatedUrl;
    });
    list.appendChild(item);
  });

  setTimeout(() => {
    if (category || search) {
      gsap.to(window, {
        scrollTo: categoryWrapper.offsetTop - 24,
      });
    }
  }, 0);
}

const dataListCategory = await helper.getData(baseUrl + '/data.json');
const listDataCategory = [
  'all product',
  ...new Set(dataListCategory.map((product) => product.category)),
];
createCategoryList(listDataCategory);

const productListEl = document.querySelector('#product-list');
productListEl.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
const notfoundBar = document.querySelector('#not-found');
notfoundBar.classList.add('hidden');
if (state.dataProduct.length)
  createProductList(
    state.dataProduct.slice(state.startData, state.endData),
    productListEl,
    state.lineListProduct
  );
else notfoundBar.classList.remove('hidden');

const loader = document.querySelector('#loader');

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !state.isLoading) {
      state.isLoading = true;
      state.startData = state.startData + state.showData;
      state.endData = state.endData + state.showData;
      state.lineListProduct = state.lineListProduct + 1;
      const isLoadMore = state.startData <= state.dataProduct.length;
      if (isLoadMore) loader.classList.remove('hidden');
      setTimeout(() => {
        if (isLoadMore) {
          const addNewData = state.dataProduct.slice(
            state.startData,
            state.endData
          );

          createProductList(
            addNewData,
            productListEl,
            state.lineListProduct,
            observer
          );
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
