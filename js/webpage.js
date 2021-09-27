
$(document).ready(function() {
  $(window).scroll(function () {
      //if you hard code, then use console
      //.log to determine when you want the 
      //nav bar to stick.  
    navDisplay()
   
  });
});
const navDisplay=()=>{
  //if you hard code, then use console
  //.log to determine when you want the 
  //nav bar to stick.  
if ($(window).scrollTop() > window.innerHeight) {
  $('#navbar').addClass('navbar-fixed');
  document.getElementById("toplog").style.display = "block";
  document.getElementById("navbarlogo").style.display = "block";
}
else if ($(window).scrollTop() < window.innerHeight ) {
  $('#navbar').removeClass('navbar-fixed');
  document.getElementById("toplog").style.display = "none";
}

}
const navDisplayButton=()=>{
  console.log(($(window).scrollTop() < window.innerHeight && !document.getElementById('navbar').classList.contains('navbar-fixed')))
  if ($(window).scrollTop() < window.innerHeight && !document.getElementById('navbar').classList.contains('navbar-fixed')) {
  $('#navbar').addClass('navbar-fixed');
  document.getElementById("toplog").style.display = "block";
  document.getElementById("navbarlogo").style.display = "none";
  
}else{
  navDisplay()
}
}
var TxtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 100;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onload = function () {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};

