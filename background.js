// Initialize the hash table (Object) for storing download links
let downloadLinksTable = {};

// Function to inject a simple alert-like popup into the active tab
function showAlertInActiveTab(downloadUrl) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: showAlertModal, // Function to execute
            args: [downloadUrl] // Pass the download URL to the function
        });
    });
}

// Function that will be injected into the page to create a simple alert popup
function showAlertModal(downloadUrl) {
    // Create the alert popup HTML structure
    alert(`Duplicate download detected for URL: ${downloadUrl}`);
}

// Listen for download events
chrome.downloads.onCreated.addListener(function (downloadItem) {
    const downloadId = downloadItem.id;
    const downloadUrl = downloadItem.url;

    // Check if the download URL already exists in the hash table
    chrome.storage.sync.get({ downloadLinksTable: {} }, function (result) {
        downloadLinksTable = result.downloadLinksTable;

        if (Object.values(downloadLinksTable).includes(downloadUrl)) {
            // If the download URL is already in the hash table, pause the download and show the alert popup
            chrome.downloads.pause(downloadId, function() {
                if (chrome.runtime.lastError) {
                    console.log("Failed to pause download:", chrome.runtime.lastError);
                } else {
                    console.log('Download paused for duplicate URL:', downloadUrl);
                    showAlertInActiveTab(downloadUrl); // Show alert after pausing
                }
            });
        } else {
            // Otherwise, add the download link to the hash table and store it
            downloadLinksTable[downloadId] = downloadUrl;

            chrome.storage.sync.set({ downloadLinksTable: downloadLinksTable }, function () {
                console.log('Download link saved:', downloadUrl);
            });
        }
    });
});
