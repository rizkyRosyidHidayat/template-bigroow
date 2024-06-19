import createProductList from './function/createProductList.js';
import image from '../createImagePreload.js';

const params = new URLSearchParams(window.location.search);
const name = params.get('name');

if (!name) window.location.href = '/';

const state = {
  price: 0,
  selectedExtra: [],
  dataProduct: [],
};

const baseUrl = window.location.origin + '/js/template-001';
await fetch(baseUrl + '/data.json')
  .then((response) => response.json())
  .then((json) => (state.dataProduct = json));

const detail = state.dataProduct.find((product) => product.name === name);

if (!detail) window.location.href = '/';
else state.price = detail.price;

const setTextContent = (id, text) => {
  const el = document.querySelector(`#${id}`);
  el.textContent = text;
};
const getTotalExtra = () =>
  state.selectedExtra.reduce((a, b) => a + b.value, 0);

setTextContent('name', detail.name);
setTextContent('description', detail.description);
setTextContent('price', 'Rp ' + state.price.toLocaleString('ID-id'));

image.createImgPreload(
  'banner',
  'block md:hidden w-full h-[273px] mt-5',
  'object-center object-cover',
  detail.image
);
image.createImgPreload(
  'banner-desktop',
  'hidden md:block w-1/2 h-[425px] sticky top-6',
  'object-center object-cover',
  detail.image
);

image.loadImage();

function createExtraList(listData) {
  const extraEl = document.querySelector('#extra');

  listData.forEach((extra, index) => {
    const inputEl = document.createElement('input');
    inputEl.type = 'checkbox';
    inputEl.id = extra.name;
    inputEl.value = extra.price;
    inputEl.className =
      'appearance-none w-3 h-3 bg-gray-400 checked:bg-primary transition-all';

    const textEl = document.createElement('span');
    textEl.textContent = extra.name;
    textEl.className = 'text-sm md:text-base font-light capitalize';

    const labelEl = document.createElement('label');
    labelEl.for = extra.name;
    labelEl.className = 'flex gap-2 items-center cursor-pointer';
    labelEl.appendChild(inputEl);
    labelEl.appendChild(textEl);

    labelEl.addEventListener('click', (el) => {
      const value = parseInt(el.target.value);
      if (el.target.checked) {
        state.selectedExtra.push({
          id: index,
          value,
        });
      } else {
        state.selectedExtra = state.selectedExtra.filter(
          (val) => val.id !== index
        );
      }
      const total = detail.price + getTotalExtra();
      setTextContent('price', 'Rp ' + total.toLocaleString('ID-id'));
    });

    extraEl.appendChild(labelEl);
  });
}

createExtraList(detail.extra);

function createVariantList(listData) {
  const variantEl = document.querySelector('#variant');

  listData.forEach((variant) => {
    const inputEl = document.createElement('input');
    inputEl.type = 'radio';
    inputEl.name = 'variant';
    inputEl.id = variant.name;
    inputEl.value = variant.price;
    inputEl.className = 'hidden';
    inputEl.checked = variant.name === 'default' ? true : false;

    const textEl = document.createElement('span');
    textEl.textContent = variant.name;
    textEl.className = 'text-sm md:text-base font-light capitalize';

    const labelEl = document.createElement('label');
    labelEl.for = variant.name;
    labelEl.className =
      'border border-gray-400 px-2 md:px-4 py-1 cursor-pointer has-[:checked]:bg-primary has-[:checked]:border-primary has-[:checked]:text-white transition-all';
    labelEl.appendChild(inputEl);
    labelEl.appendChild(textEl);

    labelEl.addEventListener('click', (el) => {
      const value = parseInt(el.target.value);
      if (el.target.checked) state.price = value;
      else state.value = detail.price;
      setTextContent(
        'price',
        'Rp ' + (state.price + getTotalExtra()).toLocaleString('ID-id')
      );
    });

    variantEl.appendChild(labelEl);
  });
}

createVariantList([
  { name: 'default', price: detail.price },
  ...detail.variant,
]);

const listDataProduct = state.dataProduct.filter(
  (product) =>
    product.category === detail.category && product.name !== detail.name
);
const productListEl = document.querySelector('#product-list');
createProductList(listDataProduct.slice(0, 4), productListEl);
