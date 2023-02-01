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

// Initialize the first swiper right away
const eagerSwiper = new Swiper('.mySwiper', swiperOptions)

new LazyLoad({
  elements_selector: '.swiper--lazy',
  unobserve_entered: true,
  callback_enter: function (swiperElement) {
    new Swiper('#' + swiperElement.id, swiperOptions)
  },
})
