'use strict';

import './popup.css';
const { v4: uuidv4 } = require('uuid');

(function() {
  document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');

  navbar.addEventListener('click', (event) => {
    if (event.target.classList.contains('nav-link')) {
      const collapseId = event.target.getAttribute('href');
      const collapseElement = document.querySelector(collapseId);

      if (!event.target.classList.contains("active")) {
        // Collapses all pages
        [...document.querySelectorAll(".navbar .nav-link")].forEach((el) => {
          el.classList.remove("active");
          document.querySelector(el.getAttribute('href')).classList.add("collapse");
        });

        // Show only the active page
        event.target.classList.add('active');
        collapseElement.classList.remove('collapse');
      }
    }
  });
});

const uuidGenerator = () => {
  const generatedUuid = uuidv4();
  document.getElementById('generated-uuid').textContent = generatedUuid;
};

document.getElementById('generate-uuid').addEventListener('click', uuidGenerator);

})();
