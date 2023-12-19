export const updateAssetURLs = () => {
  const elements = document.querySelectorAll("[data-dynamicURL]");
  elements.forEach((el) => {
    const dynamicURL = el.getAttribute("data-dynamicURL");
    let newUrl = require(`../svg/${dynamicURL}`);

    el.src = newUrl;
  });
};
