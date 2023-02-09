

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
      spaceBetween: 260,
      cssMode: false,
    },
    480: {
      slidesPerGroup: 3,
      slidesPerView: 4,
      spaceBetween: 140,
      cssMode: false,
    },
  },
}

const swiperOptionsTestimony = {
  pagination: {
    el: '.swiper-pagination',
  },
  navigation: {
    nextEl: '.image-swiper-button-next-testimony',
    prevEl: '.image-swiper-button-prev-testimony',
  },
  cssMode: true,
  slidesPerGroup: 1,
  slidesPerView: 2,
  spaceBetween: 270,
  breakpoints: {
    1024: {
      slidesPerGroup: 2,
      slidesPerView: 3,
      spaceBetween: 80,
      cssMode: false,
    },
    480: {
      slidesPerGroup: 1,
      slidesPerView: 2,
      spaceBetween: 160,
      cssMode: false,
    },
  },
}

const swiperOptionsRecommendation = {
  pagination: {
    el: '.swiper-pagination',
  },
  navigation: {
    nextEl: '.image-swiper-button-next-recommendation',
    prevEl: '.image-swiper-button-prev-recommendation',
  },
  slidesPerGroup: 2,
  cssMode: true,
  slidesPerView: 3,
  spaceBetween: 140,
  breakpoints: {
    1024: {
      slidesPerGroup: 3,
      slidesPerView: 4,
      spaceBetween: 160,
      cssMode: false,
    },
    480: {
      slidesPerGroup: 3,
      slidesPerView: 4,
      spaceBetween: 140,
      cssMode: false,
    },
  },
}

const swiperOptionsArticle = {
  pagination: {
    el: '.swiper-pagination',
  },
  navigation: {
    nextEl: '.image-swiper-button-next-article',
    prevEl: '.image-swiper-button-prev-article',
  },
  cssMode: true,
  slidesPerGroup: 3,
  slidesPerView: 4,
  spaceBetween: 10,
  breakpoints: {
    1024: {
      slidesPerGroup: 3,
      slidesPerView: 4,
      spaceBetween: 10,
      cssMode: false,
    },
  },
}

const swiperOptionsCarofTheMonth = {
  pagination: {
    el: '.swiper-pagination',
  },
  navigation: {
    nextEl: '.image-swiper-button-next-car-month',
    prevEl: '.image-swiper-button-prev-car-month',
  },
  cssMode: true,
  slidesPerGroup: 2,
  slidesPerView: 3,
  spaceBetween: 10,
  breakpoints: {
    1024: {
      slidesPerGroup: 3,
      slidesPerView: 4,
      spaceBetween: 10,
      cssMode: false,
    },
  },
}

// Initialize the first swiper right away
const eagerSwiperProduct = new Swiper('.mySwiperProduct', swiperOptionsProduct)
const eagerSwiperTestimony = new Swiper(
  '.mySwiperTestimony',
  swiperOptionsTestimony,
)
const eagerSwiperRecommendation = new Swiper(
  '.mySwiperRecommendation',
  swiperOptionsRecommendation,
)
const eagerSwiperArticle = new Swiper('.mySwiperArticle', swiperOptionsArticle)
const eagerSwiperCarofTheMonth = new Swiper(
  '.mySwiperCarofTheMonth',
  swiperOptionsCarofTheMonth,
)

new LazyLoad({
  elements_selector: '.swiper--lazy',
  unobserve_entered: true,
  callback_enter: function (swiperElement) {
    new Swiper('#' + swiperElement.id, swiperOptions)
  },
})
