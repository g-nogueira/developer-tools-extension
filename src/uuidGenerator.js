import { copyToClipboard } from './common';
import { v4 as uuidv4 } from 'uuid';

function uuidGenerator() {
    const generateButton = document.getElementById('generate-uuid');
    const generatedUuidElement = document.getElementById('generated-uuid');

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

export function initializeUUIDGeneratorPage() {
    document.getElementById('generate-uuid').addEventListener('click', uuidGenerator);
}