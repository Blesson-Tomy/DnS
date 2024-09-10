document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the hash table from chrome storage
    chrome.storage.sync.get({ downloadLinksTable: {} }, function(result) {
        const downloadLinksTable = result.downloadLinksTable;
        const linkList = document.getElementById('downloadLinks');
        
        // Iterate over the hash table and display each link
        for (const downloadId in downloadLinksTable) {
            if (downloadLinksTable.hasOwnProperty(downloadId)) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = downloadLinksTable[downloadId];
                a.textContent = `Download ${downloadId}: ${downloadLinksTable[downloadId]}`;
                a.target = "_blank";  // Open in a new tab
                li.appendChild(a);
                linkList.appendChild(li);
            }
        }
    });
});
