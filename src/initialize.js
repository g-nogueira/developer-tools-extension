import { setupNavbar } from './common';
import { initializeBookmarkletManagerPage } from './bookmarkletManager';
import { initializeUUIDGeneratorPage } from './uuidGenerator';

export function initializePages() {
    setupNavbar();
    initializeBookmarkletManagerPage();
    initializeUUIDGeneratorPage();
}
