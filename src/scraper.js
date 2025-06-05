const API_ENDPOINT = 'https://en.wikipedia.org/w/api.php';

export async function getPageLinks(title, limit = 500) {
    const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        titles: title,
        prop: 'links',
        pllimit: limit,
        origin: '*'
    });

    try {
        const response = await fetch(`${API_ENDPOINT}?${params}`);
        const data = await response.json();
        const page = Object.values(data.query.pages)[0];
        
        if (!page.links) return [];
        
        return page.links
            .map(link => link.title)
            .filter(title => !title.includes(':'));
    } catch (error) {
        console.error('Error fetching page links:', error);
        return [];
    }
}

export async function validateArticle(title) {
    const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        titles: title,
        origin: '*'
    });

    try {
        const response = await fetch(`${API_ENDPOINT}?${params}`);
        const data = await response.json();
        const pages = Object.values(data.query.pages);
        return !pages[0].missing;
    } catch (error) {
        console.error('Error validating article:', error);
        return false;
    }
}

export async function searchArticles(query) {
    if (!query || query.length < 2) return [];
    
    const params = new URLSearchParams({
        action: 'opensearch',
        format: 'json',
        search: query,
        limit: 10,
        namespace: 0,
        origin: '*'
    });

    try {
        const response = await fetch(`${API_ENDPOINT}?${params}`);
        const [, titles] = await response.json();
        return titles;
    } catch (error) {
        console.error('Error searching articles:', error);
        return [];
    }
}