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
      'flex items-center gap-4 md:gap-10 cursor-pointer duration-300 opacity-50',
      container,
      isReplace
    );
    listEl.addEventListener('click', () => {
      const originalUrl = window.location.href;
      const newParams = {
        category: null,
        search: null,
        name: product.name,
      };
      const updatedUrl = helper.updateUrlParams(originalUrl, newParams);
      window.location.href = updatedUrl;
    });
    listEl.id = 'list-product';

    const imageEl = helper.createElement(
      'img',
      'object-cover object-center h-[162px] md:h-[260px] w-[162px] md:w-[260px] shrink-0',
      listEl
    );
    imageEl.src = product.image;
    imageEl.alt = 'product preview';
    imageEl.id = 'image-product';

    const divEl = helper.createElement('div', '', listEl);

    const titleEl = helper.createElement(
      'h1',
      'text-[24px] md:text-[64px] font-black uppercase text-gray-400 duration-300',
      divEl
    );
    titleEl.textContent = product.name;
    titleEl.id = 'title-product';

    const subtitleEl = helper.createElement(
      'p',
      'md:text-[30px] text-gray-500 font-bold',
      divEl
    );
    subtitleEl.textContent = 'Rp ' + product.price.toLocaleString('ID-id');
    subtitleEl.id = 'price-product';

    setTimeout(() => {
      gsap.to(listEl, {
        scrollTrigger: {
          trigger: listEl,
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'play reverse play reverse',
        },
        opacity: 1,
        duration: 0.2,
        onComplete: () => titleEl.classList.add('text-primary'),
        onReverseComplete: () => titleEl.classList.remove('text-primary'),
      });
    }, 0);

    // re observe
    if (i === self.length - 1 && observer) observer.observe(listEl);
  });
}
