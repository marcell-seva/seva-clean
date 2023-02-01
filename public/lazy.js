const swiperOptions = {
  loop: true,
  pagination: {
    el: '.swiper-pagination',
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  on: {
    // LazyLoad swiper images after swiper initialization
    afterInit: (swiper) => {
      new LazyLoad({
        container: swiper.el,
        cancel_on_exit: false,
      })
    },
  },
}

const swiperOptionsProduct = {
  pagination: {
    el: '.swiper-pagination',
  },
  navigation: {
    nextEl: '.image-swiper-button-next-car-list',
    prevEl: '.image-swiper-button-prev-car-list',
  },
  slidesPerGroup: 2,
  cssMode: true,
  slidesPerView: 3,
  spaceBetween: 140,
  breakpoints: {
    1024: {
      slidesPerGroup: 3,
      slidesPerView: 4,
      spaceBetween: 240,
    },
    480: {
      slidesPerGroup: 3,
      slidesPerView: 4,
      spaceBetween: 120,
    },
  },
}

// Initialize the first swiper right away
const eagerSwiper = new Swiper('.mySwiper', swiperOptions)
const eagerSwiperProduct = new Swiper('.mySwiperProduct', swiperOptionsProduct)

new LazyLoad({
  elements_selector: '.swiper--lazy',
  unobserve_entered: true,
  callback_enter: function (swiperElement) {
    new Swiper('#' + swiperElement.id, swiperOptions)
  },
})
