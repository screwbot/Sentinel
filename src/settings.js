export function initializeSettings() {
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsPanel = document.getElementById('settingsPanel');

    settingsToggle.addEventListener('click', () => {
        settingsPanel.classList.toggle('hidden');
    });
}

export function getSettings() {
    return {
        maxDepth: parseInt(document.getElementById('maxDepth').value, 10),
        maxPages: parseInt(document.getElementById('maxPages').value, 10),
        concurrentRequests: parseInt(document.getElementById('concurrentRequests').value, 10)
    };
}