import helper from '../helper.js';

export default function createCategoryCard(
  categoryName,
  container,
  isLast,
  callback
) {
  const cardCategory = helper.createElement(
    'div',
    `border border-gray-400 rounded-[16px] md:rounded-[32px] -mt-14 ${
      isLast ? 'pb-2 md:pb-6' : 'pb-14 md:pb-14'
    } gap-6 px-4 md:px-6 overflow-hidden relative bg-white`,
    container
  );
  cardCategory.id = 'card-category';
  const cardCategoryWrapTitle = helper.createElement(
    'div',
    'flex items-center pt-4 pb-4 md:pb-6',
    cardCategory
  );
  cardCategoryWrapTitle.addEventListener('click', callback);
  const cardCategoryTitle = helper.createElement(
    'h1',
    'text-primary text-base md:text-[40px] font-light w-full uppercase',
    cardCategoryWrapTitle
  );
  cardCategoryTitle.textContent = categoryName;
  const cardCategiryIcon = helper.createElement(
    'i',
    'icon-close text-primary text-gray-400 text-xl md:text-[40px] shrink-0 cursor-pointer rotate-45',
    cardCategoryWrapTitle
  );
  cardCategiryIcon.id = 'card-category-icon';
  const wrapperContent = helper.createElement('div', '', cardCategory);
  wrapperContent.className = 'overflow-hidden';
  gsap.set(wrapperContent, {
    height: '0px',
  })
  wrapperContent.id = 'card-category-content';
  return wrapperContent;
}
