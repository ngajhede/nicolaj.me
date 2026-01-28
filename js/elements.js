document.addEventListener("DOMContentLoaded", function () {
  fetch("/navigation.htm")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navigation").innerHTML = data;
    });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("/footer.htm")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("/back.htm")
    .then((response) => response.text())
    .then((data) => {
      const backElement = document.getElementById("back");
      if (backElement) {
        backElement.innerHTML = data;
      }
    });
});
