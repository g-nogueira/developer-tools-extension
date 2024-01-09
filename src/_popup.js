'use strict';

// Import necessary styles and libraries
import './popup.css';
const { v4: uuidv4 } = require('uuid');

(function () {
  // DOM elements
  const navbar = document.querySelector('.navbar');
  const generateButton = document.getElementById('generate-uuid');
  const generatedUuidElement = document.getElementById('generated-uuid');

  // Initialize the page when the DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    generateButton.addEventListener('click', uuidGenerator);
    document.getElementById('create-bookmarklet').addEventListener('click', createBookmarklet);
  });

  // Function to initialize the page
  function initializePage() {
    setupNavbar();
    populateBookmarkletList();
  }

  // Setup navigation bar event listeners
  function setupNavbar() {
    navbar.addEventListener('click', (event) => {
      if (event.target.classList.contains('nav-link')) {
        const collapseId = event.target.getAttribute('href');
        const collapseElement = document.querySelector(collapseId);

        if (!event.target.classList.contains('active')) {
          collapseAllPages();
          event.target.classList.add('active');
          collapseElement.classList.remove('collapse');
        }
      }
    });
  }

  // Collapse all pages in the navigation
  function collapseAllPages() {
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    navLinks.forEach((el) => {
      el.classList.remove('active');
      document.querySelector(el.getAttribute('href')).classList.add('collapse');
    });
  }

  // Generate a UUID and copy it to the clipboard
  function uuidGenerator() {
    generateButton.disabled = true;

    try {
      const generatedUuid = uuidv4();
      generatedUuidElement.textContent = generatedUuid;

      copyToClipboard(generatedUuid);

      alert('UUID copied to clipboard.');

    } catch (error) {
      console.error('Error generating UUID:', error);
      alert('Error generating UUID. Please try again.');
    } finally {
      generateButton.disabled = false;
    }
  }

  // Copy text to the clipboard
  function copyToClipboard(text) {
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = text;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
  }

  // Populate the list of bookmarklets
  function populateBookmarkletList() {
    getBookmarklets((bookmarklets) => {
      const bookmarkletList = document.getElementById('bookmarklet-list');
      bookmarkletList.innerHTML = '';

      bookmarklets.forEach((bookmarklet) => {
        const listItem = createBookmarkletListItem(bookmarklet);
        bookmarkletList.appendChild(listItem);
      });
    });
  }

  // Create a list item for a bookmarklet
  function createBookmarkletListItem(bookmarklet) {
    const listItem = document.createElement('li');
    const bookmarkletLink = createBookmarkletLink(bookmarklet);
    const editButton = createButton('Edit', 'button', 'edit-button', () => editBookmarklet(bookmarklet));
    const deleteButton = createButton('Delete', 'delete-button', 'button', () => deleteBookmarklet(bookmarklet));
    const buttonGroup = document.createElement("div");

    buttonGroup.className = "button-group";
    
    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);
    listItem.appendChild(bookmarkletLink);
    listItem.appendChild(buttonGroup);

    return listItem;
  }

  // Create a link for a bookmarklet
  function createBookmarkletLink(bookmarklet) {
    const bookmarkletLink = document.createElement('a');
    bookmarkletLink.href = bookmarklet.url;
    bookmarkletLink.textContent = bookmarklet.title;
    bookmarkletLink.title = bookmarklet.url;
    
    return bookmarkletLink;
  }

  // Create a button element
  function createButton(text, className, id, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(className, id);
    button.addEventListener('click', clickHandler);
    return button;
  }

  // Edit a bookmarklet
  function editBookmarklet(bookmarklet) {
    const newName = prompt('Enter a new name for the bookmarklet:', bookmarklet.title);
    const newCode = prompt('Enter the new JavaScript code:', decodeURIComponent(bookmarklet.url.split(':')[1]));

    if (newName !== null && newCode !== null) {
      const updatedUrl = `javascript:${encodeURIComponent(newCode)}`;
      chrome.bookmarks.update(bookmarklet.id, { title: newName, url: updatedUrl }, () => {
        console.log('Bookmarklet updated:', bookmarklet);
        populateBookmarkletList();
      });
    }
  }

  // Delete a bookmarklet
  function deleteBookmarklet(bookmarklet) {
    chrome.bookmarks.remove(bookmarklet.id, () => {
      console.log(`Bookmarklet with ID ${bookmarklet.id} removed`);
      populateBookmarkletList();
    });
  }

  // Get all bookmarklets with 'javascript:' scheme
  function getBookmarklets(callback) {
    chrome.bookmarks.search({ query: 'javascript:*' }, callback);
  }

  // Create a new bookmarklet
  function createBookmarklet() {
    const name = document.getElementById('bookmarklet-name').value;
    const code = document.getElementById('bookmarklet-code').value;

    if (name && code) {
      const url = `javascript:${encodeURIComponent(code)}`;
      chrome.bookmarks.create(
        {
          parentId: '1', // or the ID of a specific folder
          title: name,
          url: url,
        },
        (newBookmark) => {
          console.log('New bookmarklet created:', newBookmark);
          populateBookmarkletList();
        }
      );
    }
  }
})();
