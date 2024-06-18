import createElement from '../../createElement.js';
gsap.registerPlugin(ScrollToPlugin);

const backTopBtn = createElement(
  'button',
  'bg-primary h-[40px] md:h-[56px] w-[40px] md:w-[56px] rounded-full fixed right-4 md:right-8 bottom-4 md:bottom-8 appearance-none',
  document.body
);
backTopBtn.id = 'back-to-top';
backTopBtn.type = 'button';

createElement('i', 'icon-arrow-left text-white text-xl md:text-2xl', backTopBtn);

backTopBtn.addEventListener('click', () => gsap.to(window, { scrollTo: 0 }));
gsap.set(backTopBtn, { y: 200 });

gsap.to(backTopBtn, {
  y: 0,
  rotate: 90,
  opacity: .5,
  scrollTrigger: {
    trigger: document.body,
    start: 'top -20%',
    end: 'top -20%',
    toggleActions: 'play none reverse none',
  },
});

const hoverAnimate = gsap.to(backTopBtn, { opacity: 1, duration: .2 })
hoverAnimate.paused(true);
backTopBtn.addEventListener('mouseenter', () => hoverAnimate.play());
backTopBtn.addEventListener('mouseleave', () => hoverAnimate.reverse());