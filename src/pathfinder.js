import { getPageLinks, validateArticle } from './scraper.js';

export async function findPath(startTitle, endTitle, settings) {
    const {
        maxDepth = 4,
        maxPages = 4000,
        concurrentRequests = 5
    } = settings;

    const visited = new Set();
    const queue = [{
        title: startTitle,
        path: [startTitle],
        depth: 0
    }];
    
    let pagesChecked = 0;
    const updateStatus = (status) => {
        document.getElementById('searchStatus').textContent = 
            `Checked ${pagesChecked} pages... ${status}`;
    };

    while (queue.length > 0 && pagesChecked < maxPages) {
        const batch = queue.splice(0, concurrentRequests);
        const promises = batch.map(async ({ title, path, depth }) => {
            if (depth >= maxDepth) return null;
            if (visited.has(title)) return null;
            
            visited.add(title);
            pagesChecked++;
            updateStatus(`Exploring: ${title}`);

            const links = await getPageLinks(title);
            
            for (const link of links) {
                if (link === endTitle) {
                    return [...path, endTitle];
                }
                
                if (!visited.has(link)) {
                    queue.push({
                        title: link,
                        path: [...path, link],
                        depth: depth + 1
                    });
                }
            }
            return null;
        });

        const results = await Promise.all(promises);
        const foundPath = results.find(result => result !== null);
        
        if (foundPath) {
            return foundPath;
        }
    }

    return null;
}