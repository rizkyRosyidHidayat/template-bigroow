import helper from '../helper.js';

export default function createProductList(data, container, observer) {
  data.forEach((product, index, self) => {
    const column = helper.createElement('div', '', container);
    const imageProduct = helper.createElement(
      'img',
      'object-center object-cover w-full h-[153px] md:h-[303px] rounded-[12px] md:rounded-[24px]',
      column
    );
    imageProduct.alt = 'product preview';
    imageProduct.src = product.image;
    const titleProduct = helper.createElement(
      'h1',
      'text-base md:text-[32px] md:leading-normal uppercase font-bold text-black mt-3 md:mt-6',
      column
    );
    titleProduct.textContent = product.name;
    const priceProduct = helper.createElement('p', 'text-base md:text-[32px] md:mt-4', column);
    priceProduct.textContent = product.price.toLocaleString('ID-id');
    // re observe
    if (index === self.length - 1 && observer) observer.observe(column);
  });
}
