import createElement from '../../createElement.js';

export default function createProductList(listData, container, observer, isReplace) {
  listData.forEach((product, i, self) => {
    const listEl = createElement(
      'li',
      'flex gap-4 md:gap-10 items-center cursor-pointer duration-300',
      container,
      isReplace
    );
    listEl.addEventListener(
      'click',
      () =>
        (window.location.href =
          '/template-001/detail.html?name=' + product.name)
    );

    const imageEl = createElement('img', 'object-cover object-center h-[82px] md:h-[185px] w-[82px] md:w-[185px] shrink-0', listEl);
    imageEl.src = product.image || '../assets/img/salmon-grill-preview.png';
    imageEl.alt = 'product preview';

    const divEl = createElement('div', '', listEl);

    const titleEl = createElement('h1', 'text-2xl md:text-4xl font-bold uppercase', divEl);
    titleEl.textContent = product.name;

    const subtitleEl = createElement('p', 'md:text-2xl text-gray-500 font-bold md:mt-2', divEl);
    subtitleEl.textContent = 'Rp ' + product.price.toLocaleString('ID-id');

    // re observe
    if(i === (self.length - 1) && observer) observer.observe(listEl);
  });
}
