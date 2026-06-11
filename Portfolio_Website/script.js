window.addEventListener("scroll", function () {
  var nav = document.querySelector("nav");
  if (window.scrollY > 10) {
    nav.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
  } else {
    nav.style.boxShadow = "none";
  }
});

var navLinks = document.querySelectorAll("nav ul li a");
navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.forEach(function (l) {
      l.style.color = "#ccc";
    });
    this.style.color = "#4fc3f7";
  });
});

var form = document.getElementById("contactForm");
var successMsg = document.getElementById("successMsg");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var message = document.getElementById("message").value.trim();

  if (name === "" || email === "" || message === "") {
    alert("Please fill in all fields!");
    return;
  }
  
  successMsg.style.display = "block";
  form.reset();
  setTimeout(function () {
    successMsg.style.display = "none";
  }, 4000);
});

var downloadBtn = document.getElementById("downloadBtn");
if (downloadBtn) {
  downloadBtn.addEventListener("click", function () {
    console.log("Resume download clicked. Make sure resume.pdf is in the same folder!");
  });
}
