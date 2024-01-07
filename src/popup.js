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

// Event listener for the "Add Bookmarklet" button
document.getElementById("add-bookmarklet").addEventListener("click", () => {
  const code = document.getElementById("js-code-input").value;
  const title = "My Bookmarklet"; // You can customize this title
  createBookmarklet(title, `javascript:${encodeURIComponent(code)}`);
});

function createBookmarklet(title, code) {
  chrome.bookmarks.create({
      parentId: "1", // or the ID of a specific folder
      title: title,
      url: code,
    },
    function (newBookmark) {
      console.log("New bookmarklet created: ", newBookmark);
      saveBookmarkletId(newBookmark.id);
    }
  );
}

function saveBookmarkletId(bookmarkletId) {
  const bookmarkletIds = JSON.parse(localStorage.getItem("bookmarkletIds")) || [];

  bookmarkletIds.push(bookmarkletId);
  localStorage.setItem("bookmarkletIds", JSON.stringify(bookmarkletIds));
}


// Event listener for the "Clear All Bookmarklets" button
document.getElementById("clear-bookmarklets").addEventListener("click", () => {
  const bookmarkletIds = JSON.parse(localStorage.getItem("bookmarkletIds")) || [];

  bookmarkletIds.forEach((bookmarkletId) => {
    chrome.bookmarks.remove(bookmarkletId, () => {
      console.log(`Bookmarklet with ID ${bookmarkletId} removed`);
    });
  });

  localStorage.setItem("bookmarkletIds", JSON.stringify([])); // Clear the stored IDs
});


document.getElementById("save-code").addEventListener("click", () => {
  const codeToSave = document.getElementById("js-code-input").value;
  saveCodeForLater(codeToSave);
  refreshStoredCodesList();
});

function saveCodeForLater(code) {
  // Retrieve the existing saved codes from local storage
  const storedCodes = JSON.parse(localStorage.getItem("storedCodes")) || [];
  // Add the new code to the array
  storedCodes.push(code);
  // Save the updated array back to local storage
  localStorage.setItem("storedCodes", JSON.stringify(storedCodes));
}


// Function to refresh the list of stored codes in the content section
function refreshStoredCodesList() {
  const storedCodesList = document.getElementById("stored-codes-list");
  storedCodesList.innerHTML = ""; // Clear the existing list
  const storedCodes = JSON.parse(localStorage.getItem("storedCodes")) || [];

  storedCodes.forEach((code, index) => {
    const listItem = document.createElement("li");
    const codeText = document.createTextNode(
      `Code ${index + 1}: ${code.substring(0, 50)}...`
    ); // Preview of the code
    listItem.appendChild(codeText);

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";

    // Add a button to create a bookmarklet from this code
    const addButton = document.createElement("button");
    addButton.innerHTML = '<i class="fas fa-plus"></i> Add as Bookmarklet';    
    addButton.textContent = "Add as Bookmarklet";
    addButton.className = "button"; // Apply 'button' class for styling
    addButton.onclick = function () {
      createBookmarklet(
        `Bookmarklet ${index + 1}`,
        `javascript:${encodeURIComponent(code)}`
      );
    };

    // Inside your loop in the refreshStoredCodesList function
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button button"; // Apply both 'delete-button' and 'button' classes
    deleteButton.onclick = function () {
      deleteSavedCode(index);
    };
    
    buttonGroup.appendChild(addButton);
    buttonGroup.appendChild(deleteButton);
    listItem.appendChild(buttonGroup);

    storedCodesList.appendChild(listItem);
  });
}

function deleteSavedCode(index) {
  const storedCodes = JSON.parse(localStorage.getItem("storedCodes")) || [];
  storedCodes.splice(index, 1); // Remove the code at the specified index
  localStorage.setItem("storedCodes", JSON.stringify(storedCodes));
  refreshStoredCodesList(); // Refresh the list display
}
// Call refreshStoredCodesList on DOMContentLoaded to populate the list initially
document.addEventListener('DOMContentLoaded', refreshStoredCodesList);

})();
