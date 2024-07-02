import image from '../createImagePreload.js';

image.createImgPreload(
  'banner-image',
  'hidden md:block mt-12 w-[552px] max-w-full h-[311px] rounded-[24px]',
  'object-center object-cover',
  '../assets/img/cofee-machine.jpg'
);
image.createImgPreload(
  'banner-image-mobile',
  'block md:hidden mt-4 w-full h-[265px] rounded-[12px] overflow-hidden',
  'object-center object-cover',
  '../assets/img/cofee-machine.jpg'
);

image.createImgPreload(
  'banner-image-small',
  'hidden md:block w-[266px] h-[282px] rounded-[24px] shrink-0',
  'object-center object-cover',
  '../assets/img/cofee-shop.jpg'
);
image.createImgPreload(
  'banner-image-small-mobile',
  'block md:hidden w-full h-full rounded-[12px]',
  'object-center object-cover h-full',
  '../assets/img/cofee-shop.jpg'
);

image.loadImage();
