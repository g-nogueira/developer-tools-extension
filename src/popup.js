'use strict';

import './popup.css';
const { v4: uuidv4 } = require('uuid');

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const generateButton = document.getElementById('generate-uuid');
    const generatedUuidElement = document.getElementById('generated-uuid');

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

    const uuidGenerator = () => {
      // Disable the button while generating
      generateButton.disabled = true;

      try {
        const generatedUuid = uuidv4();
        generatedUuidElement.textContent = generatedUuid;

        // Create a temporary textarea to facilitate copying to clipboard
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = generatedUuid;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);

        // Display a confirmation message
        alert('UUID copied to clipboard.');

      } catch (error) {
        console.error('Error generating UUID:', error);
        // Display an error message if UUID generation fails
        alert('Error generating UUID. Please try again.');
      } finally {
        // Re-enable the button
        generateButton.disabled = false;
      }
    };

    generateButton.addEventListener('click', uuidGenerator);
  });

  // Function to get all bookmarks with 'javascript:' scheme
  function getBookmarklets(callback) {
    chrome.bookmarks.search({ query: "javascript:*" }, (results) => {
      callback(results);
    });
  }

  /********* BOOKMARKLETS MANAGER *********/

  // Call this function to populate the list of bookmarklets
  function populateBookmarkletList() {
    getBookmarklets((bookmarklets) => {
      const bookmarkletList = document.getElementById("bookmarklet-list");
      bookmarkletList.innerHTML = ""; // Clear the existing list before populating

      bookmarklets.forEach((bookmarklet) => {
        const listItem = document.createElement("li");
        const bookmarkletLink = document.createElement("a");
        bookmarkletLink.href = bookmarklet.url;
        bookmarkletLink.textContent = bookmarklet.title;

        // Add buttons for editing and deleting bookmarklets
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("button");
        editButton.addEventListener("click", () => {
          // Implement a function to edit the bookmarklet
          editBookmarklet(bookmarklet);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button button";
        deleteButton.addEventListener("click", () => {
          // Implement a function to delete the bookmarklet
          deleteBookmarklet(bookmarklet);
        });

        listItem.appendChild(bookmarkletLink);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        bookmarkletList.appendChild(listItem);
      });
    });
  }

  function editBookmarklet(bookmarklet) {
    const newName = prompt("Enter a new name for the bookmarklet:", bookmarklet.title);
    const newCode = prompt("Enter the new JavaScript code:", decodeURIComponent(bookmarklet.url.split(":")[1]));

    if (newName !== null && newCode !== null) {
      // Update the bookmarklet with the new name and code
      const updatedUrl = `javascript:${encodeURIComponent(newCode)}`;
      chrome.bookmarks.update(bookmarklet.id, { title: newName, url: updatedUrl }, (updatedBookmark) => {
        console.log("Bookmarklet updated: ", updatedBookmark);
        // Refresh the list after updating
        populateBookmarkletList();
      });
    }
  }

  function deleteBookmarklet(bookmarklet) {
    chrome.bookmarks.remove(bookmarklet.id, () => {
      console.log(`Bookmarklet with ID ${bookmarklet.id} removed`);
      // Refresh the list after deleting
      populateBookmarkletList();
    });
  }

  // Call populateBookmarkletList when the page loads
  document.addEventListener("DOMContentLoaded", populateBookmarkletList);

  // Add event listeners for Create, Update, Delete buttons in your popup.js
  document.getElementById("create-bookmarklet").addEventListener("click", () => {
    // Get user input (name and JavaScript code) from input elements
    const name = document.getElementById("bookmarklet-name").value;
    const code = document.getElementById("bookmarklet-code").value;
    createBookmarklet(name, code);
  });

  // When you create a bookmarklet, save its ID along with a unique identifier (e.g., title or code)
  function createBookmarklet(name, code) {
    const url = `javascript:${encodeURIComponent(code)}`;
    chrome.bookmarks.create(
      {
        parentId: "1", // or the ID of a specific folder
        title: name,
        url: url,
      },
      function (newBookmark) {
        console.log("New bookmarklet created: ", newBookmark);
        // Refresh the list after creating
        populateBookmarkletList();
      }
    );
  }

})();
