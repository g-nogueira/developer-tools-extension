import { setupNavbar } from './common';
import { initializeBookmarkletManagerPage } from './bookmarkletManager';
import { initializeUUIDGeneratorPage } from './uuidGenerator';
import { initializeJsonFormatterPage, formatJson } from './jsonFormatter';

export function initializePages() {
    setupNavbar();
    initializeBookmarkletManagerPage();
    initializeUUIDGeneratorPage();
    initializeJsonFormatterPage();
}