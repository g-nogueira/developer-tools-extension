'use strict';

import './popup.css';
const { v4: uuidv4 } = require('uuid');

(function() {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  const counterStorage = {
    get: cb => {
      chrome.storage.sync.get(['count'], result => {
        cb(result.count);
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          count: value,
        },
        () => {
          cb();
        }
      );
    },
  };
  
  document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const expandIcon = document.createElement('span');
  expandIcon.classList.add('expand-icon');

  navbar.addEventListener('click', (event) => {
    if (event.target.classList.contains('nav-link')) {
      const collapseId = event.target.getAttribute('href');
      const collapseElement = document.querySelector(collapseId);
      collapseElement.classList.toggle('collapse');

      event.target.classList.toggle('active');
      expandIcon.classList.toggle('rotate');
    }
  });

  expandIcon.addEventListener('click', () => {
    navbar.querySelector('.nav-link.active').click();
  });
});

const uuidGenerator = () => {
  const generatedUuid = uuidv4();
  document.getElementById('generated-uuid').textContent = generatedUuid;
};

document.getElementById('generate-uuid').addEventListener('click', uuidGenerator);

})();
