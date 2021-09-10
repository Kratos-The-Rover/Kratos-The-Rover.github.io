var mini = true;
var bigscreen = true;
var hover = true;
resizenavbar();
function resizenavbar() {
  if ($(window).width() > 450) {
    bigscreen = true;
    hover = true;
    document.getElementById("close").style.visibility = "collapse";
    document.getElementById("openbtn").style.visibility = "collapse";
  }
  else {
    hover = false;
    bigscreen = false;
  }
  document.getElementById("openbtn").style.visibility = "visible";
}

window.onresize = resizenavbar;

function checkToggleSidebar(toggle)
{
  if(hover)
  {
    toggleSidebar(toggle);
  }
}


function toggleSidebar(toggle) {
  resizenavbar();
    if (toggle && (!bigscreen)) {
      console.log("opening full sidebar" + bigscreen);
      
      document.getElementById("sidenavbar").style.visibility = "visible";
      document.getElementById("close").style.visibility = "visible";
      document.getElementById("sidenavbar").style.width = "100%";
      this.mini = false;
      //document.getElementById("kratoslogo").style.marginLeft = "300px";

    }
    else if (toggle && bigscreen) {
      console.log("opening sidebar" + bigscreen);
      
      document.getElementById("sidenavbar").style.width = "350px";
      document.getElementById("kratoslogo").style.marginLeft = "300px";
      this.mini = false;

    } else if (bigscreen) {
      console.log("closing sidebar" + bigscreen);
      
      document.getElementById("sidenavbar").style.width = "5%";
      document.getElementById("kratoslogo").style.marginLeft = "0px";
      this.mini = true;

    }
    else {
      console.log("closing full sidebar" + bigscreen);
      
      document.getElementById("sidenavbar").style.width = "0px";
      //document.getElementById("main").style.marginLeft = "89px";
      this.mini = true;

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