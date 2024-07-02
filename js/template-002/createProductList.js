import helper from '../helper.js';

export default function createProductList(
  listData,
  container,
	lineListProduct,
  observer,
  isReplace
) {
  const isMd = window.innerWidth >= 768;
  listData.forEach((product, index, self) => {
    const grid = helper.createElement(
      'div',
      'grid grid-cols-2 gap-4',
      container
    );
    const orderRole = lineListProduct % 2;
    const orderRoleMobile = (index + 1) % 2;
    const isFirstImage = orderRole ? 'order-1' : 'order-2';
    const isFirstDetail = !orderRole ? 'order-1' : 'order-2';
    const isFirstImageMobile = orderRoleMobile ? 'order-1' : 'order-2';
    const isFirstDetailMobile = !orderRoleMobile ? 'order-1' : 'order-2';
    const imageColumn = helper.createElement(
      'div',
      `relative ${isMd ? isFirstImage : isFirstImageMobile}`,
      grid
    );
    const image = helper.createElement(
      'img',
      'h-full w-full object-cover object-center rounded-[16px] md:rounded-[24px]',
      imageColumn
    );
    image.src = product.image;
    image.alt = 'product preview';
    const detailColumn = helper.createElement(
      'div',
      isMd ? isFirstDetail : isFirstDetailMobile,
      grid
    );
    const detailCardInfo = helper.createElement(
      'div',
      'bg-gray-100 rounded-[16px] md:rounded-[24px] p-4 w-full min-h-full md:min-h-[416px] flex flex-col',
      detailColumn
    );
		detailCardInfo.addEventListener('click', () => {
      const originalUrl = window.location.href;
      const newParams = {
        category: null,
        search: null,
        name: product.name,
      };
      const updatedUrl = helper.updateUrlParams(originalUrl, newParams);
      window.location.href = updatedUrl;
    });
    const cardInfoTitle = helper.createElement(
      'h2',
      'text-primary text-lg md:text-[32px] font-bold',
      detailCardInfo
    );
    cardInfoTitle.textContent = product.name;
    const cardInfoPrice = helper.createElement(
      'h3',
      'font-medium text-sm md:text-base text-primary mt-3',
      detailCardInfo
    );
    cardInfoPrice.textContent = product.price.toLocaleString('ID-id');
    const cardInfoDesc = helper.createElement(
      'p',
      'text-[10px] md:text-xs mt-4 mb-4',
      detailCardInfo
    );
    cardInfoDesc.textContent = product.description;
    const cardInfoBtn = helper.createElement(
      'button',
      'bg-primary h-7 md:h-[50px] w-7 md:w-[50px] rounded-full mt-auto self-end rotate-[135deg]',
      detailCardInfo
    );
    cardInfoBtn.type = 'button';
    helper.createElement(
      'i',
      'icon-arrow-left text-white md:text-2xl',
      cardInfoBtn
    );

    // re observe
    if (index === self.length - 1 && observer) observer.observe(grid);
  });
}
