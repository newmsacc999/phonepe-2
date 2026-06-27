import React from "react";

export const FacebookPixel = () => {
  fetch("/pixel.js")
    .then((res) => res.text())
    .then((script) => {
      const pixelScript = document.createElement("script");
      pixelScript.innerHTML = script;
      document.body.appendChild(pixelScript);
    })
    .catch((err) => console.error("Error loading Facebook pixel:", err));
};
