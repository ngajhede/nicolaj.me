async function loadComponent(url, elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    element.innerHTML = data;
  } catch (error) {
    console.error(`Failed to load ${url}:`, error);
    element.innerHTML = `<p style="color: #666;">Content failed to load.</p>`;
  }
}

let animationsPaused = false;

function captureFirstFrames() {
  const gifBanner = document.getElementById("gif-banner");
  if (!gifBanner) return Promise.resolve();

  const gifs = gifBanner.querySelectorAll("img");
  const promises = [];
  
  gifs.forEach((gif) => {
    if (!gif.dataset.gifSrc) {
      gif.dataset.gifSrc = gif.src;
    }
    
    const promise = new Promise((resolve) => {
      if (gif.complete) {
        captureFrame(gif);
        resolve();
      } else {
        gif.addEventListener("load", () => {
          captureFrame(gif);
          resolve();
        });
      }
    });
    promises.push(promise);
  });

  return Promise.all(promises);
}

function captureFrame(gif) {
  if (gif.dataset.staticSrc) return;
  
  const canvas = document.createElement("canvas");
  canvas.width = gif.naturalWidth;
  canvas.height = gif.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(gif, 0, 0);
  gif.dataset.staticSrc = canvas.toDataURL();
}

function applyAnimationsState() {
  const gifBanner = document.getElementById("gif-banner");
  const toggleButton = document.getElementById("toggle-animations");
  
  if (!gifBanner || !toggleButton) return;

  const gifs = gifBanner.querySelectorAll("img");

  gifs.forEach((gif) => {
    if (animationsPaused) {
      gif.src = gif.dataset.staticSrc || gif.dataset.gifSrc;
    } else {
      gif.src = gif.dataset.gifSrc;
    }
  });

  toggleButton.textContent = animationsPaused ? "Play animations" : "Pause animations";
  toggleButton.setAttribute("aria-label", animationsPaused ? "Play GIF animations" : "Pause GIF animations");
}

function toggleAnimations() {
  const gifBanner = document.getElementById("gif-banner");
  const toggleButton = document.getElementById("toggle-animations");
  
  if (!gifBanner || !toggleButton) return;

  const gifs = gifBanner.querySelectorAll("img");
  animationsPaused = !animationsPaused;
  localStorage.setItem("animationsPaused", animationsPaused);

  gifs.forEach((gif) => {
    if (animationsPaused) {
      gif.src = gif.dataset.staticSrc || gif.dataset.gifSrc;
    } else {
      gif.src = gif.dataset.gifSrc;
    }
  });

  toggleButton.textContent = animationsPaused ? "Play animations" : "Pause animations";
  toggleButton.setAttribute("aria-label", animationsPaused ? "Play GIF animations" : "Pause GIF animations");
}

document.addEventListener("DOMContentLoaded", async function () {
  await Promise.all([
    loadComponent("/navigation.htm", "navigation"),
    loadComponent("/footer.htm", "footer"),
    loadComponent("/back.htm", "back"),
  ]);

  const savedState = localStorage.getItem("animationsPaused");
  if (savedState === "true") {
    animationsPaused = true;
  }

  await captureFirstFrames();

  const toggleButton = document.getElementById("toggle-animations");
  if (toggleButton) {
    toggleButton.addEventListener("click", toggleAnimations);
  }

  applyAnimationsState();
});
