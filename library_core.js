/**
 * Zoopedia Library Core - Shared utilities for saving artifacts
 */

async function saveToLibrary(itemData) {
    // itemData: { title, type, url }
    try {
        const formData = new FormData();
        formData.append('title', itemData.title);
        formData.append('type', itemData.type);
        formData.append('url', itemData.url);
        formData.append('category', 'saved');

        const response = await fetch('member3_mother_api.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            alert("Artifact saved to your Digital Library!");
            return true;
        } else {
            if (result.message && result.message.includes('not logged in')) {
                if (typeof openAuthModal === 'function') openAuthModal();
                else alert("Please log in to save items to your library.");
            } else {
                alert("Failed to save: " + result.message);
            }
            return false;
        }
    } catch (e) {
        console.error("Library Save Error:", e);
        alert("An unexpected error occurred while saving. Please try again later.");
        return false;
    }
}
