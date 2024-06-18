import copywriting from '../copywriting.json' with { type: 'json' };
import createElement from '../../createElement.js';

const headerBar = document.querySelector('header');
headerBar.className = 'py-3 md:py-5 bg-[#f0f0f0]';


const containerEl = createElement('div', 'container', headerBar);
const contentEl = createElement('div', 'flex justify-between items-center', containerEl);

if (copywriting.logo.type === 'text') {
    const logoEl = createElement('a', 'font-bold md:text-2xl', contentEl);
    logoEl.href = '/template-001/';
    logoEl.textContent = copywriting.logo.value;
}

const isSearchPage = window.location.pathname.includes('search');

const searchBtn = createElement('button', 'bg-primary h-7 md:h-10 w-7 md:w-10 rounded-full', contentEl);
searchBtn.type = 'button';
searchBtn.addEventListener('click', () => window.location.href = '/template-001/search.html');
if (isSearchPage) searchBtn.classList.add('hidden')
createElement('i', 'icon-search text-white md:text-xl', searchBtn);
