import helper from '../../helper.js';

export default function createProductList(
  listData,
  container,
  observer,
  isReplace
) {
  listData.forEach((product, i, self) => {
    const listEl = helper.createElement(
      'li',
      'flex gap-4 md:gap-10 items-center cursor-pointer duration-300 group',
      container,
      isReplace
    );
    listEl.addEventListener('click', () => {
      const originalUrl = window.location.href;
      const newParams = {
        category: null,
        search: null,
        name: product.name
      };

      const updatedUrl = helper.updateUrlParams(originalUrl, newParams);
      window.location.href = updatedUrl;
    });

    const imageEl = helper.createElement(
      'img',
      'object-cover object-center h-[82px] md:h-[185px] w-[82px] md:w-[185px] shrink-0',
      listEl
    );
    imageEl.src = product.image;
    imageEl.alt = 'product preview';

    const divEl = helper.createElement('div', '', listEl);

    const titleEl = helper.createElement(
      'h1',
      'text-xl md:text-4xl font-bold uppercase group-hover:text-primary duration-300',
      divEl
    );
    titleEl.textContent = product.name;

    const subtitleEl = helper.createElement(
      'p',
      'md:text-2xl text-gray-500 font-bold md:mt-2',
      divEl
    );
    subtitleEl.textContent = 'Rp ' + product.price.toLocaleString('ID-id');

    // re observe
    if (i === self.length - 1 && observer) observer.observe(listEl);
  });
}
