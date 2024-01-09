export function createBookmarklet() {
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
