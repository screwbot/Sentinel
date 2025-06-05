import { findPath } from './pathfinder.js';
import { validateArticle, searchArticles } from './scraper.js';
import { getSettings } from './settings.js';

export function initializeUI() {
    const searchButton = document.getElementById('searchButton');
    const startInput = document.getElementById('startArticle');
    const endInput = document.getElementById('endArticle');
    const resultsContainer = document.getElementById('results');
    const loadingContainer = document.getElementById('loading');

    setupAutocomplete(startInput);
    setupAutocomplete(endInput);

    searchButton.addEventListener('click', async () => {
        const startTitle = startInput.value.trim();
        const endTitle = endInput.value.trim();

        if (!startTitle || !endTitle) {
            alert('Please enter both starting and target articles');
            return;
        }

        loadingContainer.classList.remove('hidden');
        resultsContainer.innerHTML = '';

        try {
            const [startValid, endValid] = await Promise.all([
                validateArticle(startTitle),
                validateArticle(endTitle)
            ]);

            if (!startValid || !endValid) {
                throw new Error('One or both articles do not exist');
            }

            const settings = getSettings();
            const path = await findPath(startTitle, endTitle, settings);
            
            loadingContainer.classList.add('hidden');
            
            if (path) {
                displayPath(path);
            } else {
                resultsContainer.innerHTML = `
                    <div class="path-item">
                        No path found between articles within the specified constraints
                    </div>
                `;
            }
        } catch (error) {
            loadingContainer.classList.add('hidden');
            resultsContainer.innerHTML = `
                <div class="path-item">
                    Error: ${error.message}
                </div>
            `;
        }
    });
}

function setupAutocomplete(input) {
    let debounceTimer;
    let suggestionsBox = document.createElement('div');
    suggestionsBox.className = 'suggestions-box hidden';
    input.parentNode.appendChild(suggestionsBox);

    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const query = input.value.trim();
            const suggestions = await searchArticles(query);
            
            if (suggestions.length > 0) {
                suggestionsBox.innerHTML = suggestions
                    .map(title => `<div class="suggestion">${title}</div>`)
                    .join('');
                suggestionsBox.classList.remove('hidden');
            } else {
                suggestionsBox.classList.add('hidden');
            }
        }, 300);
    });

    suggestionsBox.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion')) {
            input.value = e.target.textContent;
            suggestionsBox.classList.add('hidden');
        }
    });

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.classList.add('hidden');
        }
    });
}

function displayPath(path) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    path.forEach(title => {
        const pathItem = document.createElement('div');
        pathItem.className = 'path-item';
        pathItem.innerHTML = `
            <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(title)}" 
               target="_blank" rel="noopener noreferrer">
                ${title}
            </a>
        `;
        resultsContainer.appendChild(pathItem);
    });
}