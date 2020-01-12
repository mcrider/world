import $ from 'jquery';

const initialize = () => {
  // Handle subnav items
  let scrollPos = 0;
  $('header .menu-toggle-container').click((e) => {
    e.stopPropagation();
    $('body').toggleClass('menu-open')
    $('header').toggleClass('active');

    if($('header').hasClass('active')) {
      setTimeout(() => {
        // Get scroll position
        scrollPos = $(window).scrollTop();

        // Prevent body scrolling
        $('body').addClass('no-scroll');
      }, 500);
    } else {
      // Reset scroll position on close
      $(window).scrollTop(scrollPos);

      // Allow body scrolling
      $('body').removeClass('no-scroll');
    }
  });
};

export default initialize;
