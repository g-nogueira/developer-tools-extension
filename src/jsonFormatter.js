export function initializeJsonFormatterPage() {
    const formatButton = document.getElementById('format-json');
    formatButton.addEventListener('click', formatJson);
}

export function formatJson() {
    const input = document.getElementById('json-input').value;
    const output = document.getElementById('json-output');

    try {
        const formattedJson = JSON.stringify(JSON.parse(input), null, 4);
        output.textContent = formattedJson;
    } catch (e) {
        output.textContent = 'Invalid JSON';
    }
}