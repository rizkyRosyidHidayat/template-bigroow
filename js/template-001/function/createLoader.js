import createElement from "../../createElement.js";

const loaderEl = document.querySelector('#loader');
loaderEl.className = 'flex gap-4 md:gap-10 items-center py-6 md:py-12 hidden'

createElement('div', 'h-[82px] md:h-[185px] w-[82px] md:w-[185px] shrink-0 bg-gray-300 animate-pulse', loaderEl); // image
const wrapperDiv = createElement('div', 'w-full', loaderEl); // wrapper div
createElement('div', 'h-[22px] md:h-[42px] w-full shrink-0 bg-gray-300 animate-pulse', wrapperDiv); // title
createElement('div', 'h-[16px] md:h-[32px] w-1/2 shrink-0 bg-gray-300 animate-pulse mt-4 md:mt-8', wrapperDiv); // desc
