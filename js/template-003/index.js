import image from '../createImagePreload.js';
import helper from '../helper.js';
import createProductList from './createProductList.js';

gsap.registerPlugin(ScrollTrigger);

const state = {
  copywriting: {},
  startData: 0,
  endData: {
    desktop: 3,
    mobile: 2,
  },
  showData: {
    desktop: 3,
    mobile: 2,
  },
  isLoading: false,
  dataProduct: [],
  cardCategoryActive: -1,
  cardCategoryActiveOffsetTop: 0,
};

const params = new URLSearchParams(window.location.search);
const category = params.get('category');
const search = params.get('search');

function handleSearchCategory(data) {
  return data.filter(
    (product) =>
      product.category.toLocaleLowerCase() === category.toLocaleLowerCase()
  );
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

const baseUrl =
  'https://rizkyrosyidhidayat.github.io/template-bigroow/js/template-003';
state.copywriting = await helper.getData(baseUrl + '/copywriting.json');
state.dataProduct = await helper.getData(baseUrl + '/data.json');

helper.setTextContent('title', state.copywriting.title);
helper.setTextContent('description', state.copywriting.description);
helper.setTextContent('categoryTitle', state.copywriting.categoryTitle);

image.createImgPreload(
  'banner',
  'w-full h-[229px] md:h-[514px]',
  state.copywriting.banner,
  'rounded-[12px] md:rounded-[24px]'
);
image.loadImage();

function setLinkCategory(categoryName) {
  const originalUrl = window.location.href;
  const newParams = {
    category: categoryName,
    search: null,
  };

  const updatedUrl = helper.updateUrlParams(originalUrl, newParams);
  window.location.href = updatedUrl;
}

function setActiveCardCategory(index) {
  const cardCategoryList = document.querySelectorAll('#card-category');
  const cardCategoryIconList = document.querySelectorAll('#card-category-icon');
  const cardCategoryContentList = document.querySelectorAll(
    '#card-category-content'
  );
  state.cardCategoryActive = index === state.cardCategoryActive ? -1 : index;
  cardCategoryList.forEach((card, index) => {
    const isActive = index === state.cardCategoryActive;
    const content = cardCategoryContentList[index];
    const icon = cardCategoryIconList[index];
    if (isActive) {
      gsap.to(content, {
        height: 'auto',
      });
      gsap.to(icon, {
        rotate: 0,
      });
    } else {
      gsap.to(content, {
        height: '0px',
      });
      gsap.to(icon, {
        rotate: 45,
      });
    }
  });
}
const productListEl = document.querySelector('#product-list');

const dataGroupByCategory = state.dataProduct.reduce((acc, current) => {
  const key = current['category'];
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(current);
  return acc;
}, {});
const isMobile = window.innerWidth <= 764;

Object.keys(dataGroupByCategory)
  .filter((categoryName) =>
    category ? category === categoryName : categoryName
  )
  .forEach((categoryName, index, self) => {
    const isLast = index === self.length - 1;
    const cardCategory = helper.createElement(
      'div',
      `border border-gray-400 rounded-[16px] md:rounded-[32px] -mt-14 ${
        isLast ? 'pb-2 md:pb-6' : 'pb-14 md:pb-14'
      } gap-6 px-4 md:px-6 overflow-hidden relative bg-white`,
      productListEl
    );
    cardCategory.id = 'card-category';
    const cardCategoryWrapTitle = helper.createElement(
      'div',
      'flex items-center pt-4 pb-4 md:pb-6',
      cardCategory
    );
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
    });
    wrapperContent.id = 'card-category-content';
    const listProductByCategory = helper.createElement(
      'div',
      'grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8',
      wrapperContent
    );
    createProductList(
      dataGroupByCategory[categoryName].slice(
        0,
        isMobile ? state.showData.mobile : state.showData.desktop
      ),
      listProductByCategory
    );

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !state.isLoading) {
          state.isLoading = true;
          if (isMobile) state.startData += state.showData.mobile;
          else state.startData += state.showData.desktop;
          if (isMobile) state.endData.mobile += state.showData.mobile;
          else state.endData.desktop += state.showData.desktop;
          const isLoadMore =
            state.startData <= dataGroupByCategory[categoryName].length;
          // if (isLoadMore) loader.classList.remove('hidden');
          setTimeout(() => {
            if (isLoadMore) {
              const addNewData = dataGroupByCategory[categoryName].slice(
                state.startData,
                isMobile ? state.endData.mobile : state.endData.desktop
              );

              createProductList(addNewData, listProductByCategory, observer);
              // loader.classList.add('hidden');
              state.isLoading = false;
            }
          }, 1000);
        }
      },
      {
        root: null,
        threshold: 1.0,
        rootMargin: '200px 0px 200px 0px',
      }
    );

    observer.observe(wrapperContent);

    if (!category) {
      const loadMoreBtn = helper.createElement(
        'button',
        `w-full rounded-xl bg-primary text-white md:text-lg mt-4 md:mt-10 font-light py-2 md:py-3 px-6 ${
          isLast ? 'mb-2 md:mb-0' : 'mb-4 md:mb-6'
        }`,
        wrapperContent
      );
      loadMoreBtn.textContent = 'Load More';
      loadMoreBtn.type = 'button';
      loadMoreBtn.addEventListener('click', () =>
        setLinkCategory(categoryName)
      );
      cardCategoryWrapTitle.addEventListener('click', () =>
        setActiveCardCategory(index)
      );
    } else {
      cardCategiryIcon.addEventListener('click', () => setLinkCategory(null));
    }
  });

const headerBar = document.querySelector('header');
setTimeout(() => {
  const contentBar = document.querySelector('#content');
  let mm = gsap.matchMedia();
  mm.add('(min-width: 764px)', () => {
    gsap.to(headerBar, {
      scrollTrigger: {
        trigger: headerBar,
        pin: true,
        start: 'top top',
        end: '+=' + contentBar.offsetHeight,
        pinSpacing: false,
      },
    });
  });
}, 0);

setTimeout(() => {
  setActiveCardCategory(
    Object.keys(dataGroupByCategory).filter((categoryName) =>
      category ? category === categoryName : categoryName
    ).length - 1
  );
}, 0);
