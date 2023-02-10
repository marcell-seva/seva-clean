const swiperOptions = {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
    },
    autoplay: {
      delay: 8000,
    },
    cssMode: true,
    breakpoints: {
      1024: {
        cssMode: false,
      },
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
  const eagerSwiper = new Swiper('.mySwiper', swiperOptions)
  const eagerSwiperTestimony = new Swiper(
    '.mySwiperTestimony',
    swiperOptionsTestimony,
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