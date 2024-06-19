import createProductList from './function/createProductList.js';

const params = new URLSearchParams(window.location.search);
const category = params.get('category');
const search = params.get('search');

const state = {
  startData: 0,
  endData: 3,
  showData: 3,
  dataProduct: [],
  isLoading: false,
  searchValue: ''
};

const baseUrl = window.location.origin + '/js/template-001';
await fetch(baseUrl + '/data.json')
  .then((response) => response.json())
  .then((json) => (state.dataProduct = json));

function handleSearchCategory(data) {
  return data.filter(product => product.category.toLocaleLowerCase() === category.toLocaleLowerCase());
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

if (category && !search) state.dataProduct = handleSearchCategory(state.dataProduct);
if (search && !category) state.dataProduct = handleSearchText(state.dataProduct);
if (search && category) state.dataProduct = handleSearchCategory(handleSearchText(state.dataProduct));

const searchBar = document.querySelector('#search');
const searchBtn = document.querySelector('#search-btn');
if (search) searchBar.value = search
const categoryTitle = document.querySelector('#category-title');
categoryTitle.textContent = category && !search ? category : 'all product';
const productListEl = document.querySelector('#product-list');
createProductList(state.dataProduct.slice(state.startData, state.endData), productListEl);

const loader = document.querySelector('#loader');
const notFoundBar = document.querySelector('#not-found');
if (!state.dataProduct.length) notFoundBar.classList.remove('hidden');

searchBar.addEventListener('input', (el) => {
  state.searchValue = el.target.value;
});

function updateUrlParams(url, params) {
  const urlObject = new URL(url);
  const searchParams = new URLSearchParams(urlObject.search);

  Object.keys(params).forEach((key) => {
    if (params[key] !== null) searchParams.set(key, params[key]);
  });
  urlObject.search = searchParams.toString();
  return urlObject.href;
}

searchBtn.addEventListener('click', (el) => {
  const originalUrl = window.location.href;
  const newParams = { category, search: state.searchValue };

  const updatedUrl = updateUrlParams(originalUrl, newParams);
  window.location.href = updatedUrl;
});

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
    rootMargin: "100px 0px 100px 0px",
  }
);

observer.observe(productListEl);
