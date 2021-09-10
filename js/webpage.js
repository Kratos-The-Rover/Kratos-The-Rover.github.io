
$(document).ready(function() {
  $(window).scroll(function () {
      //if you hard code, then use console
      //.log to determine when you want the 
      //nav bar to stick.  
    if ($(window).scrollTop() > window.innerHeight) {
      $('#navbar').addClass('navbar-fixed');
      document.getElementById("toplog").style.display = "block";
    }
    else if ($(window).scrollTop() < window.innerHeight ) {
      $('#navbar').removeClass('navbar-fixed');
      document.getElementById("toplog").style.display = "none";
    }
   
  });
});
