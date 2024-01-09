import { copyToClipboard } from './common';
import { v4 as uuidv4 } from 'uuid';

// Load UUID history from storage and populate the list
function loadUUIDHistory() {
    const uuidHistoryList = document.getElementById('uuid-history-list');

    chrome.storage.local.get('uuidHistory', (result) => {
        const history = result.uuidHistory || [];

        uuidHistoryList.innerHTML = '';

        history.forEach((entry) => {
            const dateHourHeader = document.createElement('h3');
            dateHourHeader.textContent = `Date: ${entry.dateHour}`;
            uuidHistoryList.appendChild(dateHourHeader);

            entry.uuids.forEach((uuid) => {
                const listItem = document.createElement('li');
                const copyButton = document.createElement('button');
                copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                copyButton.classList.add('copy-button');
                copyButton.addEventListener('click', () => copyToClipboard(uuid));

                listItem.textContent = uuid;
                listItem.appendChild(copyButton);

                uuidHistoryList.appendChild(listItem);
            });
        });
    });
}

// Save generated UUIDs to storage
function saveUUIDHistory(newUuids) {
    return new Promise((resolve) => {
        chrome.storage.local.get('uuidHistory', (result) => {
            let history = result.uuidHistory || [];
            const currentDateTime = new Date();
            const currentDateHour = `${currentDateTime.toISOString().split('T')[0]} ${currentDateTime.getHours()}:00`;

            // Find if an entry for the current hour already exists
            let currentHourEntry = history.find(entry => entry.dateHour === currentDateHour);

            if (currentHourEntry) {
                // Append new UUIDs to the current hour's entry
                currentHourEntry.uuids.push(...newUuids);
            } else {
                // Create a new entry for the current hour
                history.unshift({ dateHour: currentDateHour, uuids: newUuids });
            }

            // Ensure history does not exceed 100 UUIDs
            let count = 0;
            history = history.filter(entry => {
                count += entry.uuids.length;
                return count <= 100;
            });

            chrome.storage.local.set({ uuidHistory: history }, () => {
                resolve(); // Resolve the promise after saving
            });
        });
    });
}

// UUID Generator
async function uuidGenerator() {
    const numUuidsInput = document.getElementById('num-uuids');
    const notification = document.getElementById('uuid-notification');

    try {
        const numUuids = parseInt(numUuidsInput.value, 10);
        const generatedUuids = [];

        // Generate UUIDs
        for (let i = 0; i < numUuids; i++) {
            const generatedUuid = uuidv4();
            generatedUuids.push(generatedUuid);
        }

        // Save generated UUIDs to storage and wait for completion
        await saveUUIDHistory(generatedUuids);

        // Load and display UUID history
        loadUUIDHistory();

        // Display success message
        notification.textContent = `${numUuids} UUID(s) generated and added to history.`;
        notification.classList.add('visible');

        // Hide the message after 4 seconds
        setTimeout(() => {
            notification.classList.remove('visible');
        }, 4000);
    } catch (error) {
        console.error('Error generating UUIDs:', error);
        notification.textContent = 'Error generating UUIDs. Please try again.';
        notification.classList.add('visible');

        // Hide the message after 4 seconds
        setTimeout(() => {
            notification.classList.remove('visible');
        }, 4000);
    }
}


// Initialize UUID Generator
export function initializeUUIDGeneratorPage() {
    const generateButton = document.getElementById('generate-uuid');
    generateButton.addEventListener('click', uuidGenerator);

    // Load and display UUID history when the popup is opened
    loadUUIDHistory();
}
