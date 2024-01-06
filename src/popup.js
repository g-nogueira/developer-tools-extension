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

// Function to run JavaScript code in the current active tab
const runCodeInTab = (code) => {
  chrome.runtime.getBackgroundPage().then((backgroundPage) => {
    backgroundPage.runCodeInTab(code);
  });
};

// Event listener for the "Run Code" button
document.getElementById('run-code').addEventListener('click', () => {
  const codeToRun = document.getElementById('js-code-input').value;
  runCodeInTab(codeToRun);
});

// Event listener for the "Save for Later" button
document.getElementById('save-code').addEventListener('click', () => {
  const codeToSave = document.getElementById('js-code-input').value;
  // Save the code (you can use chrome.storage.local or any other storage mechanism)
  // For simplicity, let's use an array for demonstration purposes
  const storedCodes = JSON.parse(localStorage.getItem('storedCodes')) || [];
  storedCodes.push(codeToSave);
  localStorage.setItem('storedCodes', JSON.stringify(storedCodes));
  // Refresh the stored codes list
  refreshStoredCodesList();
});

// Function to refresh the list of stored codes in the content section
const refreshStoredCodesList = () => {
  const storedCodesList = document.getElementById('stored-codes-list');
  storedCodesList.innerHTML = ''; // Clear the existing list
  const storedCodes = JSON.parse(localStorage.getItem('storedCodes')) || [];
  storedCodes.forEach((code, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `Code ${index + 1}`;
    listItem.addEventListener('click', () => runCodeInTab(code));
    storedCodesList.appendChild(listItem);
  });
};

// Call refreshStoredCodesList on DOMContentLoaded to populate the list initially
document.addEventListener('DOMContentLoaded', refreshStoredCodesList);

})();
