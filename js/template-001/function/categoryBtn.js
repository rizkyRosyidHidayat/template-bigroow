gsap.registerPlugin(ScrollToPlugin);

const params = new URLSearchParams(window.location.search);
const category = params.get('category');

const state = {
  selectedIndexCategory: 0,
  dataProduct: [],
};

const baseUrl = window.location.origin + '/js/template-001';
await fetch(baseUrl + '/data.json')
  .then((response) => response.json())
  .then((json) => (state.dataProduct = json));

const defaultCategory = 'all product';
const listDataCategory = [
  defaultCategory,
  ...new Set(state.dataProduct.map((product) => product.category)),
];

if (category) {
  const selectedIndexCategory = listDataCategory.findIndex(
    (val) => val.toLocaleLowerCase() === category.toLocaleLowerCase()
  );
  state.selectedIndexCategory = selectedIndexCategory;
}

const categoryTitle = document.querySelector('#category-title');
categoryTitle.textContent = listDataCategory[state.selectedIndexCategory];

setTimeout(() => {
  if (category) {
    gsap.to(window, {
      scrollTo: categoryTitle.offsetTop - 20,
    });
  }
}, 0);

function categoryBtn(dir) {
  return document.querySelector('#category-btn-' + dir);
}

const categoryLength = listDataCategory.length;

function handleCategoryBtnDisable() {
  if (state.selectedIndexCategory === categoryLength - 1) {
    categoryBtn('right').disabled = true;
  } else categoryBtn('right').disabled = false;

  if (state.selectedIndexCategory === 0) {
    categoryBtn('left').disabled = true;
  } else categoryBtn('left').disabled = false;
}

handleCategoryBtnDisable();

function updateUrlParams(url, params) {
  const urlObject = new URL(url);
  const searchParams = new URLSearchParams(urlObject.search);

  Object.keys(params).forEach((key) => {
    if (params[key] !== null) searchParams.set(key, params[key]);
  });
  urlObject.search = searchParams.toString();
  return urlObject.href;
}

const handleCategoryBtn = (dir) => {
  if (
    state.selectedIndexCategory >= 0 &&
    state.selectedIndexCategory < categoryLength
  ) {
    if (dir === 'right') state.selectedIndexCategory++;
    else state.selectedIndexCategory--;
    const selectedCategory = listDataCategory[state.selectedIndexCategory];
    categoryTitle.textContent = selectedCategory;

    const originalUrl = window.location.href;
    let newParams = { category: '' };
    if (selectedCategory !== defaultCategory) {
      newParams = { category: selectedCategory.toLocaleLowerCase() };
    }
    const updatedUrl = updateUrlParams(originalUrl, newParams);
    window.location.href = updatedUrl;

    handleCategoryBtnDisable();
  }
};

categoryBtn('right').addEventListener('click', () =>
  handleCategoryBtn('right')
);
categoryBtn('left').addEventListener('click', () => handleCategoryBtn('left'));
