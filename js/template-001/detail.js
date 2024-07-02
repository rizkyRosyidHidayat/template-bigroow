import image from '../createImagePreload.js';
import helper from '../helper.js';

const params = new URLSearchParams(window.location.search);
const name = params.get('name');
const category = params.get('category');
const search = params.get('search');

const closeBtn = document.querySelector('#close-btn');
closeBtn.addEventListener('click', () => {
  const originalUrl = window.location.href;
  const newParams = {
    category,
    search,
    name: null,
  };

  const updatedUrl = helper.updateUrlParams(originalUrl, newParams);
  window.location.href = updatedUrl;
});

const detailPage = document.querySelector('#detail-page');
const mainPage = document.querySelector('#main-page');
const footer = document.querySelector('footer');

if (!name) {
  mainPage.classList.remove('hidden');
  detailPage.classList.add('hidden');
  footer.classList.add('mb-[100px]');
} else {
  mainPage.classList.add('hidden');
  detailPage.classList.remove('hidden');
  footer.classList.remove('mb-[100px]');
}

if (name) {
  const state = {
    price: 0,
    selectedExtra: [],
    dataProduct: [],
  };

  state.dataProduct = await helper.getDataProduct();

  const detail = state.dataProduct.find((product) => product.name === name);

  if (detail) {
    state.price = detail.price;

    const getTotalExtra = () =>
      state.selectedExtra.reduce((a, b) => a + b.value, 0);

    helper.setTextContent('name', detail.name);
    helper.setTextContent('description-detail', detail.description);
    helper.setTextContent('price', 'Rp ' + state.price.toLocaleString('ID-id'));

    image.createImgPreload(
      'image-detail-mobile',
      'block md:hidden w-full h-[273px] mt-5',
      detail.image
    );
    image.createImgPreload(
      'image-detail',
      'hidden md:block w-1/2 h-[425px]',
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
          helper.setTextContent('price', 'Rp ' + total.toLocaleString('ID-id'));
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
          helper.setTextContent(
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
  }
}
