function createBookmarkletListItem(bookmarklet) {
    // Create a link for a bookmarklet
    function createBookmarkletLink(bookmarklet) {
        const bookmarkletLink = document.createElement('a');
        bookmarkletLink.href = bookmarklet.url;
        bookmarkletLink.textContent = bookmarklet.title;
        bookmarkletLink.title = bookmarklet.url;

        return bookmarkletLink;
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

    // Create a generic button element
    function createButton(text, className, id, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(className, id);
        button.addEventListener('click', clickHandler);
        return button;
    }


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

function getBookmarklets(callback) {
    chrome.bookmarks.search({ query: 'javascript:*' }, callback);
}

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

export function initializeBookmarkletManagerPage() {
    populateBookmarkletList();
    document.getElementById('create-bookmarklet').addEventListener('click', createBookmarklet);
}