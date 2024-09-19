// Initialize the hash table (Object) for storing download links
let downloadLinksTable = {};

// Function to inject a custom modal popup into the active tab
function showAlertInActiveTab(downloadId, downloadUrl) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: showCustomModal, // Function to execute
            args: [downloadId, downloadUrl] // Pass the download ID and URL to the function
        });
    });
}

// Function that will be injected into the page to create a custom modal popup
function showCustomModal(downloadId, downloadUrl) {
    // Remove any existing modal if already present
    const existingModal = document.getElementById('download-duplicate-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create the modal container
    const modal = document.createElement('div');
    modal.id = 'download-duplicate-modal';
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';

    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    modalContent.style.textAlign = 'center';

    // Add the extension name
    const header = document.createElement('h2');
    header.textContent = 'Extension';
    modalContent.appendChild(header);

    // Add the message
    const message = document.createElement('p');
    message.textContent = `Duplicate download detected for URL: ${downloadUrl}`;
    modalContent.appendChild(message);

    // Add "Cancel Download" button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel Download';
    cancelButton.style.marginRight = '10px';
    cancelButton.onclick = function() {
        // Call the Chrome API to cancel the download
        chrome.runtime.sendMessage({ action: 'cancelDownload', downloadId: downloadId });
        modal.remove(); // Remove modal after cancelling the download
    };
    modalContent.appendChild(cancelButton);

    // Add "Continue Download" button
    const continueButton = document.createElement('button');
    continueButton.textContent = 'Continue Download';
    continueButton.onclick = function() {
        // Call the Chrome API to resume the download
        chrome.runtime.sendMessage({ action: 'continueDownload', downloadId: downloadId });
        modal.remove(); // Remove modal after resuming the download
    };
    modalContent.appendChild(continueButton);

    // Append the modal content to the modal container
    modal.appendChild(modalContent);

    // Append the modal to the body
    document.body.appendChild(modal);
}

// Listen for download creation events
chrome.downloads.onCreated.addListener(function (downloadItem) {
    const downloadId = downloadItem.id;
    const downloadUrl = downloadItem.url;

    // Check if the download URL already exists in the hash table
    chrome.storage.sync.get({ downloadLinksTable: {} }, function (result) {
        let downloadLinksTable = result.downloadLinksTable;

        if (Object.values(downloadLinksTable).includes(downloadUrl)) {
            // If the download URL is already in the hash table, pause the download and show the custom modal
            chrome.downloads.pause(downloadId, function() {
                if (chrome.runtime.lastError) {
                    console.log("Failed to pause download:", chrome.runtime.lastError);
                } else {
                    console.log('Download paused for duplicate URL:', downloadUrl);
                    showAlertInActiveTab(downloadId, downloadUrl); // Show custom modal after pausing
                }
            });
        } else {
            // Add a flag in storage to indicate that the URL needs to be added after completion
            chrome.storage.sync.get({ pendingDownloads: {} }, function (result) {
                let pendingDownloads = result.pendingDownloads || {};
                pendingDownloads[downloadId] = downloadUrl;

                chrome.storage.sync.set({ pendingDownloads: pendingDownloads }, function () {
                    console.log('Pending download link stored:', downloadUrl);
                });
            });
        }
    });
});

// Listen for download changes to track completion and cancellation
chrome.downloads.onChanged.addListener(function (downloadDelta) {
    const downloadId = downloadDelta.id;

    if (downloadDelta.state) {
        if (downloadDelta.state.current === "complete") {
            // Handle completed downloads
            chrome.storage.sync.get({ pendingDownloads: {} }, function (result) {
                let pendingDownloads = result.pendingDownloads || {};
                const downloadUrl = pendingDownloads[downloadId];

                if (downloadUrl) {
                    // Remove the entry from pendingDownloads and add to downloadLinksTable
                    delete pendingDownloads[downloadId];
                    chrome.storage.sync.set({ pendingDownloads: pendingDownloads }, function () {
                        console.log('Pending download link removed:', downloadUrl);
                    });

                    chrome.storage.sync.get({ downloadLinksTable: {} }, function (result) {
                        let downloadLinksTable = result.downloadLinksTable || {};
                        downloadLinksTable[downloadId] = downloadUrl;

                        chrome.storage.sync.set({ downloadLinksTable: downloadLinksTable }, function () {
                            console.log('Download link added to table:', downloadUrl);
                        });
                    });
                }
            });
        } else if (downloadDelta.state.current === "interrupted") {
            // Handle canceled or interrupted downloads
            chrome.storage.sync.get({ pendingDownloads: {} }, function (result) {
                let pendingDownloads = result.pendingDownloads || {};
                const downloadUrl = pendingDownloads[downloadId];

                if (downloadUrl) {
                    // Remove the entry from pendingDownloads if the download is interrupted
                    delete pendingDownloads[downloadId];
                    chrome.storage.sync.set({ pendingDownloads: pendingDownloads }, function () {
                        console.log('Pending download link removed due to interruption:', downloadUrl);
                    });
                }
            });
        }
    }
});


// Listen for messages from the content script to handle download actions
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'cancelDownload') {
        chrome.downloads.cancel(message.downloadId, function() {
            console.log('Download canceled:', message.downloadId);
        });
    } else if (message.action === 'continueDownload') {
        chrome.downloads.resume(message.downloadId, function() {
            console.log('Download resumed:', message.downloadId);
        });
    }
});