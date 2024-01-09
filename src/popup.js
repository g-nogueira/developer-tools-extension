import './popup.css';
import { initializePage } from './initialize';
import { uuidGenerator } from './uuidGenerator';
import { createBookmarklet } from './createBookmarklet';

document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    document.getElementById('generate-uuid').addEventListener('click', uuidGenerator);
    document.getElementById('create-bookmarklet').addEventListener('click', createBookmarklet);
});