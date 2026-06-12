/**
 * Zoopedia Prime — Wildlife Vault Control Center
 * Handles Notion-style media management via AJAX.
 */

$(function() {
    let vaultItems = [];
    const $grid = $('#main-grid');

    // 1 — INITIALIZE & LOAD DATA
    async function initVault() {
        try {
            // Fetch existing data via AJAX
            const response = await fetch('vault_service.php?action=load');
            vaultItems = await response.json();
            renderVault('all');
        } catch (e) {
            console.warn("Vault empty or service offline. Loading demo data.");
            loadDemoData();
        }
    }

    function loadDemoData() {
        vaultItems = [
            { id: 1, type: 'image', title: 'Savanna Sunset', url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e', date: '2026-04-12' },
            { id: 2, type: 'video', title: 'Leopard Hunt Pattern', url: 'https://www.w3schools.com/html/mov_bbb.mp4', date: '2026-04-14' },
            { id: 3, type: 'audio', title: 'Amazon Night Ambience', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', date: '2026-04-15' },
            { id: 4, type: 'doc', title: 'Alpha Wolf Hierarchy Notes', url: '#', date: '2026-04-16' }
        ];
        renderVault('all');
    }

    // 2 — RENDER GRID
    function renderVault(filter = 'all') {
        $grid.fadeOut(200, function() {
            $grid.empty();
            
            const filtered = filter === 'all' ? vaultItems : vaultItems.filter(i => i.type === filter);
            
            if (filtered.length === 0) {
                $grid.append('<div class="text-center w-100 opacity-30 py-5"><h3>The workspace is quiet...</h3><p>Add your first artifact to the vault.</p></div>');
            }

            filtered.forEach(item => {
                const card = createCard(item);
                $grid.append(card);
            });
            
            $grid.fadeIn(300);
        });
    }

    function createCard(item) {
        const icons = {
            image: '<i class="fas fa-image"></i>',
            video: '<i class="fas fa-play"></i>',
            audio: '<i class="fas fa-waveform"></i>',
            doc: '<i class="fas fa-file-text"></i>'
        };

        let preview = '';
        if (item.type === 'image') preview = `<img src="${item.url}" alt="${item.title}">`;
        else if (item.type === 'video') preview = `<video src="${item.url}" muted loop></video>`;
        else if (item.type === 'audio') preview = `<div class="p-3 w-100"><i class="fas fa-music fa-3x opacity-20"></i></div>`;
        else preview = `<div class="p-3 w-100 text-start small opacity-50">DOCUMENT PREVIEW...</div>`;

        return `
            <div class="vault-card" data-id="${item.id}">
                <div class="card-preview">
                    ${preview}
                    <div class="card-type-icon">${icons[item.type]}</div>
                </div>
                <div class="card-info">
                    <div class="card-title">${item.title}</div>
                    <div class="card-meta">
                        <span>${item.type.toUpperCase()}</span>
                        <span>${item.date}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 3 — EVENT HANDLERS
    
    // Video Hover Play
    $(document).on('mouseenter', '.vault-card video', function() { this.play(); });
    $(document).on('mouseleave', '.vault-card video', function() { this.pause(); this.currentTime = 0; });

    // Sidebar Filters
    $('.nav-item-vault').on('click', function(e) {
        if ($(this).data('filter')) {
            e.preventDefault();
            $('.nav-item-vault').removeClass('active');
            $(this).addClass('active');
            renderVault($(this).data('filter'));
        }
    });

    // Modal Control
    $('#btn-open-modal').on('click', () => $('#add-modal').css('display', 'flex').hide().fadeIn(300));
    $('#btn-close-modal').on('click', () => $('#add-modal').fadeOut(200));

    // AJAX Save
    $('#btn-save-item').on('click', async function() {
        const newItem = {
            id: Date.now(),
            title: $('#vault-title').val(),
            type: $('#vault-type').val(),
            url: $('#vault-url').val(),
            date: new Date().toISOString().split('T')[0]
        };

        if (!newItem.title || !newItem.url) return alert("Please fill all fields");

        $(this).html('<i class="fas fa-spinner fa-spin me-2"></i>Syncing...');

        try {
            await fetch('vault_service.php?action=save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            
            vaultItems.unshift(newItem);
            renderVault('all');
            $('#add-modal').fadeOut(200);
            
            // Clear inputs
            $('#vault-title, #vault-url').val('');
        } catch (e) {
            console.error("Save failed, but updating UI locally.");
            vaultItems.unshift(newItem);
            renderVault('all');
            $('#add-modal').fadeOut(200);
        } finally {
            $(this).html('Sync to Vault');
        }
    });

    initVault();
});
