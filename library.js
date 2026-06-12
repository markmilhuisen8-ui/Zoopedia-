/**
 * Zoopedia Digital Library Engine (Zoopedia Edition)
 * Manages premium drive artifacts with Lucide icons and smooth transitions.
 */

$(function() {
    let driveData = [];
    const $grid = $('#lib-grid');
    const $emptyState = $('#empty-state');

    // 1 — ASYNC LOAD
    async function fetchDrive() {
        try {
            const res = await fetch('member2_library_api.php?action=load');
            driveData = await res.json();
            renderDrive('all');
        } catch (e) {
            console.error("Local Cache Active");
            renderDrive('all');
        }
    }

    // 2 — RENDER ENGINE
    function renderDrive(filter = 'all', searchText = '') {
        $grid.fadeOut(200, function() {
            $grid.empty();
            
            let filtered = driveData;
            
            // Handle Category Filters (Supports Overlapping)
            if (filter === 'saved') {
                filtered = filtered.filter(i => i.category === 'saved');
            } else if (filter === 'image') {
                filtered = filtered.filter(i => i.type === 'image');
            } else if (filter === 'doc') {
                filtered = filtered.filter(i => i.type === 'document');
            } else if (filter === 'video') {
                filtered = filtered.filter(i => i.type === 'video');
            } else if (filter === 'audio') {
                filtered = filtered.filter(i => i.type === 'audio');
            }
            
            // Filter by search
            if (searchText) {
                filtered = filtered.filter(i => i.title.toLowerCase().includes(searchText.toLowerCase()));
            }

            if (filtered.length === 0) {
                $emptyState.fadeIn(300);
            } else {
                $emptyState.hide();
                filtered.forEach(item => {
                    const card = createFileCard(item);
                    $grid.append(card);
                });
            }
            
            $grid.fadeIn(300);
            // Re-initialize Lucide icons for new elements
            lucide.createIcons();
        });
    }

    function createFileCard(item) {
        let preview = '';
        let icon = 'file-text';
        
        if (item.type === 'image') {
            preview = `<img src="${item.url}" loading="lazy">`;
            icon = 'image';
        } else if (item.type === 'video') {
            preview = `<video src="${item.url}" muted loop></video>`;
            icon = 'film';
        } else if (item.type === 'audio') {
            preview = `<i data-lucide="music"></i>`;
            icon = 'music';
        } else if (item.category === 'saved') {
            // Premium Document Card Thumbnail
            preview = `
                <div style="width:100%; height:100%; background: linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%); display:flex; align-items:center; justify-content:center; gap:10px; flex-direction:column;">
                    <div style="width:44px; height:56px; background:white; border-radius:6px; box-shadow:0 4px 16px rgba(0,113,227,0.18); display:flex; align-items:center; justify-content:center; position:relative; border:1px solid rgba(0,113,227,0.12);">
                        <div style="position:absolute;top:0;right:0;width:12px;height:12px;border-left:12px solid transparent;border-top:12px solid #e8eeff;"></div>
                        <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#0071e3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/></svg>
                    </div>
                    <span style="font-size:9px; font-weight:700; color:#0071e3; text-transform:uppercase; letter-spacing:0.05em;">Saved Doc</span>
                </div>
            `;
            icon = 'file-text';
        } else {
            preview = `<i data-lucide="file-text"></i>`;
            icon = 'file-text';
        }

        // Format date
        const dateObj = new Date(item.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const badgeText = item.category === 'saved' ? 'SAVED' : item.type;
        const badgeClass = item.category === 'saved' ? 'badge-saved' : '';

        return `
            <div class="file-card" data-id="${item.id}" data-url="${item.url}">
                <div class="preview-area" style="height: 100%;">
                    ${preview}
                    <div class="card-actions">
                        <button class="action-btn share-btn" data-url="${item.url}" title="Share Artifact">
                            <i data-lucide="share-2"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${item.id}" title="Delete Artifact">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Share Logic
    $(document).on('click', '.share-btn', function(e) {
        e.stopPropagation();
        const url = $(this).data('url');
        const fullUrl = url.startsWith('http') ? url : window.location.origin + '/' + url;
        
        navigator.clipboard.writeText(fullUrl).then(() => {
            const $btn = $(this);
            const originalHtml = $btn.html();
            $btn.html('<i data-lucide="check" style="color: #34c759;"></i>');
            lucide.createIcons();
            
            setTimeout(() => {
                $btn.html(originalHtml);
                lucide.createIcons();
            }, 2000);
            
            // Optional: Toast or Alert
            // alert("Link copied to clipboard!");
        });
    });

    // 3 — USER INTERACTIONS
    
    // Video Hover
    $(document).on('mouseenter', '.file-card video', function() { this.play(); });
    $(document).on('mouseleave', '.file-card video', function() { this.pause(); this.currentTime = 0; });

    // Sidebar Filters
    $('.nav-item').on('click', function(e) {
        if ($(this).data('filter')) {
            e.preventDefault();
            $('.nav-item').removeClass('active');
            $(this).addClass('active');
            
            const filterLabel = $(this).find('span').text();
            $('header h1').text(filterLabel);
            
            renderDrive($(this).data('filter'), $('#lib-search').val());
        }
    });

    // Search
    $('#lib-search').on('input', function() {
        const filter = $('.nav-item.active').data('filter') || 'all';
        renderDrive(filter, $(this).val());
    });

    // Clear All Logic
    $('#clear-all-records').on('click', async function() {
        if (!confirm("Sir, are you sure you want to PURGE all artifacts from your Drive? This cannot be undone.")) return;
        
        try {
            // Delete one by one for reliability or add a bulk action
            for (let item of driveData) {
                await fetch(`member2_library_api.php?action=delete&id=${item.id}`);
            }
            driveData = [];
            renderDrive('all');
            alert("Drive cleared, Sir.");
        } catch (e) {
            alert("Partial failure during purge.");
        }
    });

    // Delete Item
    $(document).on('click', '.delete-btn', async function(e) {
        e.stopPropagation();
        const id = $(this).data('id');
        
        // Custom Zoopedia-style confirmation would be better but keeping it simple for now
        if (!confirm("Are you sure you want to delete this artifact?")) return;

        const $card = $(this).closest('.file-card');
        $card.css({
            'opacity': '0.5',
            'transform': 'scale(0.95)',
            'pointer-events': 'none'
        });

        try {
            const response = await fetch(`member2_library_api.php?action=delete&id=${id}`);
            if (response.ok) {
                $card.fadeOut(300, function() { 
                    driveData = driveData.filter(i => i.id != id);
                    $(this).remove(); 
                    if (driveData.length === 0) $emptyState.fadeIn(300);
                });
            }
        } catch (e) {
            alert("Delete failed.");
            $card.css({
                'opacity': '1',
                'transform': 'scale(1)',
                'pointer-events': 'auto'
            });
        }
    });

    // Preview Artifacts
    $(document).on('click', '.file-card', function(e) {
        if ($(e.target).closest('.action-btn').length) return;

        const id = $(this).data('id');
        const item = driveData.find(i => i.id == id);
        if (!item) return;

        $('#preview-title').text(item.title);

        if (item.type === 'image' || (item.url && item.url.match(/\.(jpg|jpeg|png|gif|webp)/i))) {
            $('#preview-content').html(`
                <div style="display:flex; align-items:center; justify-content:center; height:100%;">
                    <img src="${item.url}" style="max-width:100%; max-height:75vh; border-radius:16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15);">
                </div>`);
        } else if (item.type === 'video' || (item.url && item.url.match(/\.(mp4|webm|ogg)/i))) {
            $('#preview-content').html(`
                <div style="display:flex; align-items:center; justify-content:center; height:100%;">
                    <video src="${item.url}" controls autoplay style="max-width:100%; max-height:75vh; border-radius:16px;"></video>
                </div>`);
        } else if (item.url && item.url.match(/\.pdf$/i)) {
            // PDF Preview in Iframe
            $('#preview-content').html(`
                <div style="height: 100%; display: flex; flex-direction: column;">
                    <iframe src="${item.url}" style="width: 100%; height: 70vh; border: none; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);"></iframe>
                    <div style="margin-top: 15px; text-align: center;">
                        <a href="research_lab.html" class="btn btn-primary" style="display: inline-flex; border-radius: 12px;">Open in Advanced Research Lab →</a>
                    </div>
                </div>`);
        } else if (item.type === 'document' || item.category === 'saved') {
            // Check if it's an AI summary (usually contains HTML tags)
            const isHTML = /<[a-z][\s\S]*>/i.test(item.url);
            
            const dateObj = new Date(item.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

            const docCard = `
                <div style="max-width: 800px; margin: 40px auto; padding: 60px; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); line-height: 1.8; font-size: 17px; color: #1d1d1f;">
                    <div style="font-family: 'SF Pro Text', -apple-system, sans-serif;">
                        ${isHTML ? item.url : `<p style="white-space: pre-wrap;">${item.url}</p>`}
                    </div>
                </div>`;
            $('#preview-content').html(docCard);
        } else {
            $('#preview-content').html(`
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:16px; color:var(--zoopedia-text-secondary);">
                    <a href="${item.url}" target="_blank" style="color: var(--zoopedia-blue); font-weight: 600; font-size:16px;">Open Artifact Externally →</a>
                </div>`);
        }

        $('#doc-preview-overlay').css('display', 'flex').hide().fadeIn(300);
    });

    // Close Preview Overlay
    $('#close-preview').on('click', () => {
        $('#doc-preview-overlay').fadeOut(200);
        $('#preview-content').empty(); // Stop media
    });

    // Copy Content Logic
    $('#copy-doc-content').on('click', function() {
        const text = $('#preview-content').text();
        navigator.clipboard.writeText(text).then(() => {
            const $btn = $(this);
            const originalHtml = $btn.html();
            $btn.html('<i data-lucide="check" style="color: #34c759;"></i> <span>Copied!</span>');
            lucide.createIcons();
            setTimeout(() => {
                $btn.html(originalHtml);
                lucide.createIcons();
            }, 2000);
        });
    });

    $('#doc-preview-overlay').on('click', function(e) {
        if (e.target === this) {
            $(this).fadeOut(200);
            $('#preview-content').empty();
        }
    });

    // Modal Control
    $('#open-uploader').on('click', () => $('#uploader-overlay').css('display', 'flex').hide().fadeIn(300));
    $('#close-uploader').on('click', () => {
        $('#uploader-overlay').fadeOut(200);
        resetForm();
    });

    // Close on outside click
    $('#uploader-overlay').on('click', function(e) {
        if (e.target === this) {
            $(this).fadeOut(200);
            resetForm();
        }
    });

    function resetForm() {
        $('#add-title, #add-url, #add-file').val('');
        $('#add-type').val('image');
    }

    // MULTIPART AJAX SAVE (Supports Files & URLs)
    $('#save-block').on('click', async function() {
        const title = $('#add-title').val();
        const url = $('#add-url').val();
        const fileInput = document.getElementById('add-file');
        
        if (!title || (!url && !fileInput.files[0])) return alert("Please provide a title and a source.");

        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', $('#add-type').val());
        if (url) formData.append('url', url);
        if (fileInput.files[0]) formData.append('file', fileInput.files[0]);

        const $btn = $(this);
        const originalHtml = $btn.html();
        
        $btn.prop('disabled', true).html('<i data-lucide="loader-2" class="spin"></i> <span>Syncing...</span>');
        lucide.createIcons();

        try {
            const response = await fetch('member3_mother_api.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            
            if (result.status === 'success') {
                driveData.unshift(result.item);
                renderDrive($('.nav-item.active').data('filter') || 'all');
                
                // Show Success State
                $btn.css('background-color', '#34c759').html('<i data-lucide="check"></i> <span>Synced!</span>');
                lucide.createIcons();
                
                setTimeout(() => {
                    $('#uploader-overlay').fadeOut(300);
                    setTimeout(() => {
                        $btn.prop('disabled', false).css('background-color', '').html(originalHtml);
                        lucide.createIcons();
                        resetForm();
                    }, 500);
                }, 1000);
            } else {
                throw new Error(result.message || "Upload failed");
            }
        } catch (e) {
            console.error("Drive Error:", e);
            alert("Drive Sync Failed: " + e.message + "\n\nMake sure XAMPP MySQL is running.");
            $btn.prop('disabled', false).html(originalHtml);
            lucide.createIcons();
        }
    });

    // Initial Load
    fetchDrive();
});
