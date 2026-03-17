document.addEventListener('DOMContentLoaded', function() {
    // Initialize all Swipers with the same logo carousel config
    const swipers = document.querySelectorAll('.swiper');
    swipers.forEach(swiperEl => {
        new Swiper(swiperEl, {
            slidesPerView: 2,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            breakpoints: {
                640: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                768: {
                    slidesPerView: 4,
                    spaceBetween: 40,
                },
                1024: {
                    slidesPerView: 5,
                    spaceBetween: 50,
                },
            },
        });
    });
});
